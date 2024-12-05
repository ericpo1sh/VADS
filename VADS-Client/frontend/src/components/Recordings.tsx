import React, { useEffect, useState } from "react";

export const Recordings: React.FC = () => {
  const [recordings, setRecordings] = useState<{ name: string, path: string }[]>([]);
  const [contextMenu, setContextMenu] = useState<{ visible: boolean, x: number, y: number, filename: string | null }>({
    visible: false,
    x: 0,
    y: 0,
    filename: null,
  });

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

    const handleClickOutside = () => {
      setContextMenu({ visible: false, x: 0, y: 0, filename: null });
    };

    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const deleteRecording = async (filename: string) => {
    try {
      await fetch(`http://localhost:3001/recordings/${filename}`, {
        method: 'DELETE',
      });
      alert('Recording deleted successfully');
      setRecordings(prevRecordings => prevRecordings.filter(recording => recording.name !== filename));
      setContextMenu({ visible: false, x: 0, y: 0, filename: null });
    } catch (error) {
      console.error('Failed to delete recording', error);
      alert('Failed to delete recording');
    }
  };

  const handleRightClick = (event: React.MouseEvent, filename: string) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      x: event.pageX,
      y: event.pageY,
      filename: filename,
    });
  };

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
              onContextMenu={(e) => handleRightClick(e, recording.name)}
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
      {contextMenu.visible && (
        <div style={{
          position: "absolute",
          top: contextMenu.y,
          left: contextMenu.x,
          backgroundColor: "#FFF",
          border: "1px solid #CCC",
          borderRadius: "5px",
          padding: "10px",
          zIndex: 1000,
        }}>
          <button
            onClick={() => contextMenu.filename && deleteRecording(contextMenu.filename)}
            style={{
              backgroundColor: "#444444",
              color: "#FFF",
              border: "none",
              borderRadius: "5px",
              padding: "5px 10px",
              cursor: "pointer",
              fontFamily: "Roboto Mono",
              fontWeight: 700,
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};
