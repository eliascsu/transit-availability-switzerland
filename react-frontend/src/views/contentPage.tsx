import React from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Zuerich from "../zuerich.mp4";

import CustomDesc from "../components/CustomDesc";
import MapWrapper from "../components/MapWrapper";
import PopulationHeatmap from "../components/heatmap/heatmap";
import PtMap from "../components/PtMap";

import DarkModeTwoTone from "@mui/icons-material/DarkModeTwoTone";
import LightModeTwoTone from "@mui/icons-material/LightModeTwoTone";

import ColorModeContext from "../context/colorModeContext";

import Page from "./page";

export default function ContentPage() {
  const { mode, toggleColorMode } = React.useContext(ColorModeContext);

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
    <Box>
      {/* Video section */}
      <Box
        sx={{
          height: "100vh", // Full viewport height for video
          position: "relative", // This makes the child elements (video and text) positioned relative to this box
          overflow: "hidden",
        }}
      >
        {/* Video */}
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
          Your browser does not support the video tag.
        </video>

        {/* Overlay Text */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
            textAlign: "center",
            zIndex: 1,
          }}
        >
          <Typography variant="h1">Transit availability in Switzerland</Typography>
        </Box>
        {/* Toggle dark/light mode */}
        <Box
          sx={{
            position: "absolute",
            bottom: "2rem",
            left: "2rem",
            color: "white",
            zIndex: 1,
          }}
        >
          {mode === "dark" ? (
            <LightModeTwoTone onClick={toggleColorMode} />
          ) : (
            <DarkModeTwoTone onClick={toggleColorMode} />
          )}
        </Box>
      </Box>

      {/* Heatmap */}
      <Page height="100vh">
        <PopulationHeatmap />
      </Page>
      <Page height="100vh">
        <PtMap />
      </Page>
      <Page height="60vh">
        <CustomDesc />
      </Page>
      <Page height="100vh">
        <MapWrapper />
      </Page>
    </Box>
  );
}
