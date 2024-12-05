import React, { useEffect, useRef, useState } from 'react';
import liveStreamError from '../assets/liveStreamError.png';
import Hls from 'hls.js';

export const VideoContainer: React.FC = () => {
  const videoContainerRef = useRef<HTMLVideoElement>(null);
  const [isLiveStreamActive, setIsLiveStreamActive] = useState(false);

  useEffect(() => {
    if (videoContainerRef.current) {
      const video = videoContainerRef.current;
      if (Hls.isSupported()) {
        const hls = new Hls({
          // liveSyncDurationCount: 0.2,
          // maxLiveSyncPlaybackRate: 1.5,
          // lowLatencyMode: true,
        });
        hls.loadSource('http://10.8.202.84:8888/stream/index.m3u8');
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video
            .play()
            .then(() => {
              setIsLiveStreamActive(true);
            })
            .catch(() => setIsLiveStreamActive(false));
        });
        hls.on(Hls.Events.ERROR, () => setIsLiveStreamActive(false));

        return () => {
          hls.destroy();
        };
      } else {
        setIsLiveStreamActive(false);
      }
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
        />
      
    </div>
  );
};
