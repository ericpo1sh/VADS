import React from 'react';
import '@fontsource/roboto-mono';

export const Gauges: React.FC = () => {
  return (
    <div style={{ border: '4px white solid', width: '380px', height: '665px', marginTop: '-10px' }}>
      <div id="gauge-1" style={{ width: '80%', border: '#098800 2px solid', height: '120px', borderRadius: '30px', marginTop: '20px', backgroundColor: '#323232', fontFamily: 'Roboto Mono', textAlign: 'center', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', marginLeft: '35px' }}>
        <p style={{ fontWeight: '200', fontSize: '30px', margin: '10px 0 0 0' }}>COORDINATES</p>
        <hr style={{ border: '#098800 1px solid', width: '100%' }} />
        <p style={{ fontWeight: '200', fontSize: '20px', margin: '0 0 10px 0' }}>36.15626, -95.99477</p>
      </div>
      <div id='guage-grid' style={{ display: 'grid', width: '90%', gridTemplateColumns: 'repeat(2, 1fr)', marginLeft: '40px' }}>
        <div id="gauge-2" style={{ width: '70%', border: '#8414D9 2px solid', height: '100px', borderRadius: '30px', marginTop: '20px', backgroundColor: '#323232', fontFamily: 'Roboto Mono', textAlign: 'center', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
          <p style={{ fontWeight: '200', fontSize: '30px', margin: '10px 0 0 0' }}>SPEED</p>
          <hr style={{ border: '#8414D9 1px solid', width: '100%' }} />
          <p style={{ fontWeight: '200', fontSize: '20px', margin: '0 0 10px 0' }}>43mph</p>
        </div>
        <div id="gauge-3" style={{ width: '70%', border: '#00A1F1 2px solid', height: '100px', borderRadius: '30px', marginTop: '20px', backgroundColor: '#323232', fontFamily: 'Roboto Mono', textAlign: 'center', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
          <p style={{ fontWeight: '200', fontSize: '30px', margin: '10px 0 0 0' }}>ALT</p>
          <hr style={{ border: '#00A1F1 1px solid', width: '100%' }} />
          <p style={{ fontWeight: '200', fontSize: '20px', margin: '0 0 10px 0' }}>1320ft</p>
        </div>
        <div id="gauge-4" style={{ width: '70%', border: '#B75300 2px solid', height: '100px', borderRadius: '30px', marginTop: '20px', backgroundColor: '#323232', fontFamily: 'Roboto Mono', textAlign: 'center', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
          <p style={{ fontWeight: '200', fontSize: '30px', margin: '10px 0 0 0' }}>PITCH</p>
          <hr style={{ border: '#B75300 1px solid', width: '100%' }} />
          <p style={{ fontWeight: '200', fontSize: '20px', margin: '0 0 10px 0' }}>-90d</p>
        </div>
        <div id="gauge-5" style={{ width: '70%', border: '#0042E8 2px solid', height: '100px', borderRadius: '30px', marginTop: '20px', backgroundColor: '#323232', fontFamily: 'Roboto Mono', textAlign: 'center', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
          <p style={{ fontWeight: '200', fontSize: '30px', margin: '10px 0 0 0' }}>YAW</p>
          <hr style={{ border: '#0042E8 1px solid', width: '100%' }} />
          <p style={{ fontWeight: '200', fontSize: '20px', margin: '0 0 10px 0' }}>30d</p>
        </div>
        <div id="gauge-6" style={{ width: '70%', border: '#FFEE07 2px solid', height: '100px', borderRadius: '30px', marginTop: '20px', backgroundColor: '#323232', fontFamily: 'Roboto Mono', textAlign: 'center', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
          <p style={{ fontWeight: '200', fontSize: '30px', margin: '10px 0 0 0' }}>SVOLT</p>
          <hr style={{ border: '#FFEE07 1px solid', width: '100%' }} />
          <p style={{ fontWeight: '200', fontSize: '20px', margin: '0 0 10px 0' }}>14.8V</p>
        </div>
        <div id="gauge-7" style={{ width: '70%', border: '#CBFF48 2px solid', height: '100px', borderRadius: '30px', marginTop: '20px', backgroundColor: '#323232', fontFamily: 'Roboto Mono', textAlign: 'center', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
          <p style={{ fontWeight: '200', fontSize: '30px', margin: '10px 0 0 0' }}>BATT</p>
          <hr style={{ border: '#CBFF48 1px solid', width: '100%' }} />
          <p style={{ fontWeight: '200', fontSize: '20px', margin: '0 0 10px 0' }}>49%</p>
        </div>
        <div id="gauge-8" style={{ width: '70%', border: '#AAF0D1 2px solid', height: '100px', borderRadius: '30px', marginTop: '20px', backgroundColor: '#323232', fontFamily: 'Roboto Mono', textAlign: 'center', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
          <p style={{ fontWeight: '200', fontSize: '30px', margin: '10px 0 0 0' }}>OTEMP</p>
          <hr style={{ border: '#AAF0D1 1px solid', width: '100%' }} />
          <p style={{ fontWeight: '200', fontSize: '20px', margin: '0 0 10px 0' }}>56℉</p>
        </div>
        <div id="gauge-9" style={{ width: '70%', border: '#FF0000 2px solid', height: '100px', borderRadius: '30px', marginTop: '20px', backgroundColor: '#323232', fontFamily: 'Roboto Mono', textAlign: 'center', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
          <p style={{ fontWeight: '200', fontSize: '30px', margin: '10px 0 0 0' }}>STEMP</p>
          <hr style={{ border: '#FF0000 1px solid', width: '100%' }} />
          <p style={{ fontWeight: '200', fontSize: '20px', margin: '0 0 10px 0' }}>110℉</p>
        </div>
      </div>
    </div>
  );
};
