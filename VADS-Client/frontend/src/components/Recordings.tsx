import React, { useEffect, useState } from "react";

export const Recordings: React.FC = () => {
  const [recordings, setRecordings] = useState<{ name: string, path: string }[]>([]);

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const response = await fetch('http://localhost:3001/recordings');
        const data = await response.json();
        setRecordings(data);
      } catch (error) {
        console.error('Failed to fetch recordings', error);
      }
    };

    fetchRecordings();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", backgroundColor: "#D9D9D9", width: "44.65%", height: "92%", borderRadius: "20px 0px 0px 20px", margin: "7px 0px 7px 12px", alignContent: "center", justifyContent: "space-around", alignItems: "center" }}>
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(2, 1fr)",
        width: "98%", 
        height: "80%", 
        overflowY: "scroll",
      }}>
        {recordings.map((recording, index) => (
          <div key={index} style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center",
            justifyContent: "center",
            position: "relative", 
            width: "100%", 
            height: "auto" 
          }}>
            <video
              src={`http://localhost:3001${recording.path}`}
              style={{ width: "220px", height: "120px", objectFit: "cover", borderRadius: "10px", border: "2px solid #ccc" }}
              controls
              muted
              onMouseOver={e => (e.currentTarget.play())}
              onMouseOut={e => (e.currentTarget.pause())}
            />
            <p style={{ 
              textAlign: "center", 
              marginTop: "10px",
              fontFamily: "Roboto Mono", 
              fontSize: "16px", 
              color: "#333",
              fontWeight: 600
            }}>
              {recording.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
