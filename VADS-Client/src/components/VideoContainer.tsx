import React, { useEffect, useRef } from 'react';
import JSMpeg from '@cycjimmy/jsmpeg-player';

export const VideoContainer: React.FC = () => {
  const videoContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (videoContainerRef.current) {
      new JSMpeg.Player('rtsp://10.8.202.147:8554/stream', {
        canvas: videoContainerRef.current,
        autoplay: true,
        audio: false,
        loop: true,
      });
    }
  }, []);

  return (
    <div className="flex">
      <canvas
        ref={videoContainerRef}
        style={{
          border: '4px solid white',
          width: '1504px',
          height: '800px',
          objectFit: 'cover',
        }}
      />
    </div>
  );
};
