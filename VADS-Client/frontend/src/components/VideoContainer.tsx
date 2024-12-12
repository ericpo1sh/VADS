import React, { useEffect, useRef } from 'react';
import liveStreamError from '../assets/liveStreamError.png';
import Hls from 'hls.js';

export const VideoContainer: React.FC = () => {
  const videoContainerRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (Hls.isSupported() && videoContainerRef.current) {
      const video = videoContainerRef.current;
      const hls = new Hls({
        liveSyncDurationCount: 0.2,
        lowLatencyMode: true,
      });

      hls.loadSource('http://192.168.94.143:8888/stream/index.m3u8');
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().then(() => {
          video.playbackRate = 5;
        }).catch((err) => {
          console.error('Error playing video:', err);
        });
      });

      hls.on(Hls.Events.ERROR, () => {
        hls.destroy();
      });

      return () => {
        hls.destroy();
      };
    }
  }, []);

  return (
    <div className="flex">
      <video
        ref={videoContainerRef}
        controls
        muted
        style={{
          border: '4px solid white',
          width: '1504px',
          height: '800px',
          objectFit: 'cover',
        }}
        onError={(e) => {
          const imgElement = e.currentTarget.nextSibling as HTMLImageElement;
          if (imgElement) {
            imgElement.style.display = 'block';
          }
          e.currentTarget.style.display = 'none';
        }}
      />
      <img
        src={liveStreamError}
        alt="Stream Not Available"
        style={{
          display: 'none', 
          border: '4px solid white',
          width: '1504px',
          height: '800px',
          objectFit: 'cover',
        }}
      />
    </div>
  );
};
