import React from "react";
import { useTranslation } from "react-i18next";

import Zuerich from "../zuerich.mp4";

const SplashVideo: React.FC = () => {
  const { t } = useTranslation();
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play();
        } else {
          videoRef.current?.pause();
        }
      },
      {
        threshold: 0.5,
      },
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  return (
    <video
      ref={videoRef}
      muted
      loop
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        position: "absolute",
        top: 0,
        left: 0,
      }}
      onContextMenu={(event) => event.preventDefault()}
    >
      <source src={Zuerich} type="video/mp4" />
      {t("your-browser-does-not-support-the-video-tag")}
    </video>
  );
};

export default SplashVideo;
