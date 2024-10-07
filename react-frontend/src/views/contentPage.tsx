import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Zuerich from "../zuerich.mp4";
import PopulationHeatmap from "../components/Heatmap";
import PtMap from "../components/PtMap";

import Page from "./page";
import MapWrapper from "../components/MapWrapper";
import CheckBoxes from "../components/Checkboxes";

export default function ContentPage() {
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
      </Box>

      {/* Heatmap */}
      <Page>
        <PopulationHeatmap />
      </Page>
      <Page>
        <PtMap />
      </Page>
      <Page>
        <MapWrapper />
        <CheckBoxes />
      </Page>
    </Box>
  );
}
