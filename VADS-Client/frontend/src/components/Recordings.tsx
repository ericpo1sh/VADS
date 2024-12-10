import React, { useEffect, useState } from "react";

export const Recordings: React.FC = () => {
  const [recordings, setRecordings] = useState<{ name: string, path: string }[]>([]);
  const [hoveredVideo, setHoveredVideo] = useState<number | null>(null);
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
    <div style={{ display: "flex", flexDirection: "column", backgroundColor: "#D9D9D9", width: "44.65%", height: "95%", borderRadius: "20px 0px 0px 20px", margin: "7px 0px 7px 12px", alignContent: "center", justifyContent: "space-around", alignItems: "center" }}>
      {recordings.length === 0 ? (
        <p style={{
          fontSize: "18px",
          fontWeight: 600,
          color: "#555",
          marginTop: "20px",
          textAlign: "center",
          fontFamily: "Roboto Mono",
        }}>
          Your recordings will appear here. Start recording!
        </p>
      ) : (
        <div style={{
          display: "grid",
          gridAutoFlow: "column",
          gridAutoColumns: "min-content",
          width: "91%",
          height: "90%",
          overflowX: "scroll",
          overflowY: "hidden",
          gap: "30px",
          padding: "10px",
          marginTop: '25px'
        }}>
          {recordings.map((recording, index) => (
            <div key={index} style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              width: "auto",
              height: "auto",
            }}>
              {/* Video Element */}
              <video
                src={`http://localhost:3001${recording.path}`}
                style={{ width: "240px", height: "140px", objectFit: "cover", borderRadius: "10px", border: "2px solid #ccc", boxShadow: '4px 4px 8px 4px rgba(0, 0, 0, 0.1)' }}
                controls={hoveredVideo === index}
                onContextMenu={(e) => handleRightClick(e, recording.name)}
                onMouseEnter={() => setHoveredVideo(index)}
                onMouseLeave={() => setHoveredVideo(null)}
              />
              {/* Play Button Overlay */}
              {hoveredVideo !== index && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -100%)',
                  pointerEvents: 'none',
                }}>
                  <img
                    src="https://img.icons8.com/ios-glyphs/100/ffffff/play--v1.png"
                    alt="Play Button"
                    style={{ width: "50px", height: "50px", opacity: 0.8 }}
                  />
                </div>
              )}
              {/* Video Title */}
              <p style={{
                textAlign: "center",
                marginTop: "10px",
                fontFamily: "Roboto Mono",
                fontSize: "20px",
                color: "#333",
                fontWeight: 600
              }}>
                {recording.name}
              </p>
            </div>
          ))}
        </div>
      )}
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
