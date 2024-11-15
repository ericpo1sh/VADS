import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick'

const videos = [
  { title: "newyork.mp4", thumbnail: "https://thumb.photo-ac.com/c2/c20d86223c5d9241e151b1753aca6f0c_t.jpeg" },
  { title: "tulsa.mp4", thumbnail: "https://assets.cntraveller.in/photos/60ba1173f27d46df614fbf79/16:9/w_1280,c_limit/Mumbai-aerial-photo-drone-photo.jpg" },
  { title: "detroit.mp4", thumbnail: "https://preview.redd.it/prompt-drone-shot-photograph-of-new-york-city-skyline-v0-s2cmx57230gb1.png?width=640&crop=smart&auto=webp&s=d36ceff7f0c50c27dfdf8fa71db5b46ac00cfa1f" },
  { title: "compton.mp4", thumbnail: "https://media.architecturaldigest.com/photos/58ed269b84fd473f52b80e9c/16:9/w_1280,c_limit/Ehang_184_Dubai.jpg" },
];

export const Recordings: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", backgroundColor: "#D9D9D9", width: "44.65%", height: "92%", borderRadius: "20px 0px 0px 20px", margin: "7px 0px 7px 12px", alignContent: "center", justifyContent: "space-around", alignItems: "center" }}>
      <Slider {...settings}>
      {videos.map((video, index) => (
          <div key={index} style={{ textAlign: "center", margin: "0 10px" }}>
            <img
              src={video.thumbnail}
              alt={video.title}
              style={{
                width: "50%",
                height: "50%",
                borderRadius: "10px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            />
            <p style={{ fontWeight: "bold", marginTop: "10px" }}>{video.title}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
};
