import React, { useEffect, useState } from 'react';
import '@fontsource/roboto-mono';

interface FlightData {
  coordinates: string;
  speed: string;
  altitude: string;
  pitch: string;
  yaw: string;
  voltage: string;
  battery: string;
  temperature: string;
  surfaceTemp: string;
}

export const Gauges: React.FC = () => {
  const [flightData, setFlightData] = useState<FlightData | null>(null);

  useEffect(() => {
    const fetchFlightData = async () => {
      try {
        const response = await fetch('http://localhost:3030/api/flight-data');
        const data = await response.json();
        setFlightData({
          coordinates: `${data.lat}, ${data.lng}`,
          speed: `${data.velocity} mph`,
          altitude: `${data.alt} ft`,
          pitch: `${data.pitch}°`,
          yaw: `${data.yaw}°`,
          voltage: `${data.voltage} V`,
          battery: `${data.battery}%`,
          temperature: `${data.temperature}°C`,
          surfaceTemp: `${data.surfaceTemp}°C`,
        });
      } catch (error) {
        console.error('Error fetching flight data:', error);
      }
    };

    const intervalId = setInterval(fetchFlightData, 1000); // Poll every second
    return () => clearInterval(intervalId); // Clean up on component unmount
  }, []);
  return (
    <div style={{ border: '4px white solid', width: '400px', height: '665px', marginTop: '-7px' }}>
      <div id="gauge-1" style={{ width: '80%', border: '#098800 2px solid', height: '120px', borderRadius: '30px', marginTop: '20px', backgroundColor: '#323232', fontFamily: 'Roboto Mono', textAlign: 'center', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', marginLeft: '40px' }}>
        <p style={{ fontWeight: '200', fontSize: '30px', margin: '10px 0 0 0' }}>COORDINATES</p>
        <hr style={{ border: '#098800 1px solid', width: '100%' }} />
        <p style={{ fontWeight: '200', fontSize: '20px', margin: '0 0 10px 0' }}>{flightData ? flightData.coordinates : 'N/A'}</p>
      </div>
      <div id='guage-grid' style={{ display: 'grid', width: '90%', gridTemplateColumns: 'repeat(2, 1fr)', marginLeft: '45px' }}>
        <div id="gauge-2" style={{ width: '70%', border: '#8414D9 2px solid', height: '100px', borderRadius: '30px', marginTop: '20px', backgroundColor: '#323232', fontFamily: 'Roboto Mono', textAlign: 'center', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
          <p style={{ fontWeight: '200', fontSize: '30px', margin: '10px 0 0 0' }}>SPEED</p>
          <hr style={{ border: '#8414D9 1px solid', width: '100%' }} />
          <p style={{ fontWeight: '200', fontSize: '20px', margin: '0 0 10px 0' }}>{flightData ? flightData.speed : 'N/A'}</p>
        </div>
        <div id="gauge-3" style={{ width: '70%', border: '#00A1F1 2px solid', height: '100px', borderRadius: '30px', marginTop: '20px', backgroundColor: '#323232', fontFamily: 'Roboto Mono', textAlign: 'center', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
          <p style={{ fontWeight: '200', fontSize: '30px', margin: '10px 0 0 0' }}>ALT</p>
          <hr style={{ border: '#00A1F1 1px solid', width: '100%' }} />
          <p style={{ fontWeight: '200', fontSize: '20px', margin: '0 0 10px 0' }}>{flightData ? flightData.altitude : 'N/A'}</p>
        </div>
        <div id="gauge-4" style={{ width: '70%', border: '#B75300 2px solid', height: '100px', borderRadius: '30px', marginTop: '20px', backgroundColor: '#323232', fontFamily: 'Roboto Mono', textAlign: 'center', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
          <p style={{ fontWeight: '200', fontSize: '30px', margin: '10px 0 0 0' }}>PITCH</p>
          <hr style={{ border: '#B75300 1px solid', width: '100%' }} />
          <p style={{ fontWeight: '200', fontSize: '20px', margin: '0 0 10px 0' }}>{flightData ? flightData.pitch : 'N/A'}</p>
        </div>
        <div id="gauge-5" style={{ width: '70%', border: '#0042E8 2px solid', height: '100px', borderRadius: '30px', marginTop: '20px', backgroundColor: '#323232', fontFamily: 'Roboto Mono', textAlign: 'center', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
          <p style={{ fontWeight: '200', fontSize: '30px', margin: '10px 0 0 0' }}>YAW</p>
          <hr style={{ border: '#0042E8 1px solid', width: '100%' }} />
          <p style={{ fontWeight: '200', fontSize: '20px', margin: '0 0 10px 0' }}>{flightData ? flightData.yaw : 'N/A'}</p>
        </div>
        <div id="gauge-6" style={{ width: '70%', border: '#FFEE07 2px solid', height: '100px', borderRadius: '30px', marginTop: '20px', backgroundColor: '#323232', fontFamily: 'Roboto Mono', textAlign: 'center', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
          <p style={{ fontWeight: '200', fontSize: '30px', margin: '10px 0 0 0' }}>SVOLT</p>
          <hr style={{ border: '#FFEE07 1px solid', width: '100%' }} />
          <p style={{ fontWeight: '200', fontSize: '20px', margin: '0 0 10px 0' }}>{flightData ? flightData.voltage : 'N/A'}</p>
        </div>
        <div id="gauge-7" style={{ width: '70%', border: '#CBFF48 2px solid', height: '100px', borderRadius: '30px', marginTop: '20px', backgroundColor: '#323232', fontFamily: 'Roboto Mono', textAlign: 'center', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
          <p style={{ fontWeight: '200', fontSize: '30px', margin: '10px 0 0 0' }}>BATT</p>
          <hr style={{ border: '#CBFF48 1px solid', width: '100%' }} />
          <p style={{ fontWeight: '200', fontSize: '20px', margin: '0 0 10px 0' }}>{flightData ? flightData.battery : 'N/A'}</p>
        </div>
        <div id="gauge-8" style={{ width: '70%', border: '#AAF0D1 2px solid', height: '100px', borderRadius: '30px', marginTop: '20px', backgroundColor: '#323232', fontFamily: 'Roboto Mono', textAlign: 'center', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
          <p style={{ fontWeight: '200', fontSize: '30px', margin: '10px 0 0 0' }}>OTEMP</p>
          <hr style={{ border: '#AAF0D1 1px solid', width: '100%' }} />
          <p style={{ fontWeight: '200', fontSize: '20px', margin: '0 0 10px 0' }}>{flightData ? flightData.temperature : 'N/A'}</p>
        </div>
        <div id="gauge-9" style={{ width: '70%', border: '#FF0000 2px solid', height: '100px', borderRadius: '30px', marginTop: '20px', backgroundColor: '#323232', fontFamily: 'Roboto Mono', textAlign: 'center', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
          <p style={{ fontWeight: '200', fontSize: '30px', margin: '10px 0 0 0' }}>STEMP</p>
          <hr style={{ border: '#FF0000 1px solid', width: '100%' }} />
          <p style={{ fontWeight: '200', fontSize: '20px', margin: '0 0 10px 0' }}>{flightData ? flightData.surfaceTemp : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};
