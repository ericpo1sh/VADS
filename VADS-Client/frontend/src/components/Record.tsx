import React, { useState, useEffect } from 'react';

export const Record: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isRecording) {
      timer = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      if (timer) {
        clearInterval(timer);
      }
      setTime(0); // Reset timer when recording stops
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      await fetch('http://localhost:3001/start-recording', {
        method: 'POST',
      });
      setIsRecording(true);
      alert('Recording started');
    } catch (error) {
      alert('Failed to start recording');
    }
  };

  const stopRecording = async () => {
    try {
      await fetch('http://localhost:3001/stop-recording', {
        method: 'POST',
      });
      setIsRecording(false);
      alert('Recording stopped');
    } catch (error) {
      alert('Failed to stop recording');
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <div style={{ display: "flex", flexDirection: 'column', backgroundColor: '#D9D9D9', width: '12%', height: '95%', margin: '7px 0px 7px 19px', borderRadius: '20px', justifyContent: 'space-around', alignContent: 'center', alignItems: 'center' }}>
      <button
        onClick={startRecording}
        style={{
          width: '75%',
          border: `solid ${isRecording ? '2px' : '4px'} #098800`,
          borderRadius: '10px',
          height: '30%',
          backgroundColor: '#d9d9d9',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 25,
          cursor: 'pointer'
        }}
      >
        <p style={{ fontSize: '30px', fontFamily: 'Roboto Mono', fontWeight: 700 }}>START</p>
      </button>
      <button
        onClick={stopRecording}
        style={{
          width: '75%',
          border: `solid ${isRecording ? '4px' : '2px'} #F00`,
          borderRadius: '10px',
          height: '30%',
          backgroundColor: '#d9d9d9',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 15,
          cursor: 'pointer'
        }}
      >
        <p style={{ fontSize: '30px', fontFamily: 'Roboto Mono', fontWeight: 700 }}>STOP</p>
      </button>
      <p className='recording-time' style={{ color: '#F00', fontSize: '24px', fontFamily: 'Roboto Mono', marginTop: '10px', fontWeight: 600 }}>
        {formatTime(time)}
      </p>
    </div>
  );
};
