import React from "react";
import { useTranslation } from "react-i18next";

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
import LanguageContext from "../context/languageContext";

import Page from "./page";
import { ExpandLess, ExpandMore, Inbox } from "@mui/icons-material";
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

export default function ContentPage() {
  const { t } = useTranslation();

  const { mode, toggleColorMode } = React.useContext(ColorModeContext);

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const { current, change, available } = React.useContext(LanguageContext);

  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

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
          {t("your-browser-does-not-support-the-video-tag")}
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
          <Typography variant="h1">{t("transit-availability-in-switzerland")}</Typography>
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
      {/* Language */}
      <Box
        sx={{
          position: "absolute",
          top: "2rem",
          right: "2rem",
          color: "white",
          zIndex: 1,
        }}
      >
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <Inbox />
        </ListItemIcon>
        <ListItemText primary={current} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {
              available.map((language) => (
                <ListItemButton sx={{ pl: 4 }} onClick={() => change(language)}>
                  <ListItemText primary={language} />
                </ListItemButton>
              ))
            }
          </List>
        </Collapse>
      </Box>

      {/* Components */}
      <Page height="100vh">
        <PopulationHeatmap />
      </Page>
      <Page height="100vh">
        <PtMap />
      </Page>
      <Page height="40vh">
        <CustomDesc />
      </Page>
      <Page height="100vh">
        <MapWrapper />
      </Page>
    </Box>
  );
}
