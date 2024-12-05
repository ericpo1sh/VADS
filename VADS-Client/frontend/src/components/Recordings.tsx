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
      <h2>RECORDINGS</h2>
      <div style={{ overflowY: "scroll", width: "100%", height: "80%" }}>
        {recordings.map((recording, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <a href={recording.path} target="_blank" rel="noopener noreferrer">
              {recording.name}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
