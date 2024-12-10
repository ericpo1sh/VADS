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
    width: '400px',
    height: '315px',
    outline: '5px solid white'
  };

  const [center, setCenter] = useState({ lat: 136.15615459163338, lng: -95.99481697903099 });

  useEffect(() => {
    const fetchFlightData = async () => {
      try {
        const response = await fetch('http://localhost:3030/api/flight-data');
        if (!response.ok) {
          throw new Error(`Error fetching flight data: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.latitude && data.longitude) {
          setCenter({
            lat: Number(data.latitude),
            lng: Number(data.longitude)
          });
        } else {
          console.error('Coordinates not found in API response');
        }
      } catch (error) {
        console.error('Error fetching flight data:', error);
      }
    };

    const intervalId = setInterval(fetchFlightData, 100); // Polling every second

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

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
    <div style={{ position: 'relative', marginBottom: '10px', borderLeft: '4px solid white', borderTop: '4px solid white' }}>
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
