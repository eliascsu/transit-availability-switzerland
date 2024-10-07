import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Zuerich from "../zuerich.mp4";
import PopulationHeatmap from "../components/Heatmap";
import PtMap from "../components/PtMap";

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
            top: "50%", // Center the text vertically
            left: "50%", // Center the text horizontally
            transform: "translate(-50%, -50%)", // Offset to truly center the text
            color: "white", // Text color to contrast the video
            textAlign: "center",
            zIndex: 1, // Ensure it appears above the video
          }}
        >
          <Typography variant="h1">Transit availability in Switzerland</Typography>
        </Box>
      </Box>

      {/* Heatmap */}
      <Box
        sx={{
          height: "100vh", // Full viewport height for the next section
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "antiquewhite",
        }}
      >
        <PopulationHeatmap />
      </Box>
      <Box
        sx={{
          height: "100vh", // Full viewport height for the next section
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "antiquewhite",
        }}
      >
        <PtMap />
      </Box>
    </Box>
  );
}
