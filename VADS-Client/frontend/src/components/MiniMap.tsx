import React, { useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { mapOptions } from '../../mapOptions.ts';

interface MiniMapProps {
  liveLatitude?: number;
  liveLongitude?: number;
}

export const MiniMap: React.FC<MiniMapProps> = ({ liveLatitude, liveLongitude }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '',
  });

  const containerStyle = {
    width: '380.5px',
    height: '100%',
  };

  const [center, setCenter] = useState({ lat: 36.15615459163338, lng: -95.99481697903099 });

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (liveLatitude !== undefined && liveLongitude !== undefined) {
      // Poll for live data every second
      intervalId = setInterval(() => {
        setCenter({ lat: liveLatitude, lng: liveLongitude });
      }, 1000);
    } else if (navigator.geolocation) {
      // Fallback to geolocation data if live data is not provided
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter({ lat: latitude, lng: longitude });
        },
        (error) => console.error('Error getting location:', error),
        { enableHighAccuracy: true, maximumAge: 0 }
      );
    }

    // Cleanup interval on component unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [liveLatitude, liveLongitude]);

  return (
    <div style={{ position: 'relative', height: '270px', marginBottom: '10px', marginLeft: '0px', borderLeft: '4px solid white', borderTop: '4px solid white' }}>
      {isLoaded ? (
        <>
          <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={16} options={mapOptions}/>
          <div style={{ position: 'absolute', top: '50%', left: '50%', width: '20px', height: '20px', backgroundColor: '#4285F4', borderRadius: '50%', transform: 'translate(-50%, -50%)', border: '2px solid white' }}/>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};
