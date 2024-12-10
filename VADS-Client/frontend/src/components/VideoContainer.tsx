import React, { useEffect, useRef, useState } from 'react';
import liveStreamError from '../assets/liveStreamError.png';
import Hls from 'hls.js';

export const VideoContainer: React.FC = () => {
  const videoContainerRef = useRef<HTMLVideoElement>(null);
  const [isLiveStreamActive, setIsLiveStreamActive] = useState(false);

  const checkLiveStream = () => {
    if (Hls.isSupported() && videoContainerRef.current) {
      const video = videoContainerRef.current;
      const hls = new Hls({
        liveSyncDurationCount: 0.2,
        lowLatencyMode: true,
      });

      hls.loadSource('http://108.253.217.48:8888/stream/index.m3u8');
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video
          .play()
          .then(() => setIsLiveStreamActive(true))
          .catch(() => setIsLiveStreamActive(false));
      });

      hls.on(Hls.Events.ERROR, () => {
        setIsLiveStreamActive(false);
        hls.destroy();
      });

      return () => {
        hls.destroy();
      };
    } else {
      setIsLiveStreamActive(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(checkLiveStream, 5000);
    checkLiveStream();

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex">
      {isLiveStreamActive ? (
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
        />
      ) : (
        <img
          src={liveStreamError}
          alt="Stream Not Available"
          style={{
            border: '4px solid white',
            width: '1504px',
            height: '800px',
            objectFit: 'cover',
          }}
        />
      )}
    </div>
  );
};
