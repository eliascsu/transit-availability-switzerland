import React from "react";

import GlobalStyles from "@mui/material/GlobalStyles";
import { Interpolation, Theme } from "@mui/material/styles";

export const globalFonts = [
  <GlobalStyles
    key="Roboto-Light"
    styles={{
      "@font-face": {
        fontFamily: "Roboto",
        src: "url('assets/Roboto-Light.ttf')",
        fontWeight: 300,
        fontDisplay: "block",
      },
    }}
  />,
  <GlobalStyles
    key="Hind-Light"
    styles={{
      "@font-face": {
        fontFamily: "Hind",
        src: "url('assets/Hind-Light.ttf')",
        fontWeight: 300,
        fontDisplay: "block",
      },
    }}
  />,
  <GlobalStyles
    key="Hind-Regular"
    styles={{
      "@font-face": {
        fontFamily: "Hind",
        src: "url('assets/Hind-Regular.ttf')",
        fontWeight: 400,
        fontDisplay: "block",
      },
    }}
  />,
  <GlobalStyles
    key="Hind-Medium"
    styles={{
      "@font-face": {
        fontFamily: "Hind",
        src: "url('assets/Hind-Medium.ttf')",
        fontWeight: 500,
        fontDisplay: "block",
      },
    }}
  />,
  <GlobalStyles
    key="Hind-Bold"
    styles={{
      "@font-face": {
        fontFamily: "Hind",
        src: "url('assets/Hind-Bold.ttf')",
        fontWeight: 700,
        fontDisplay: "block",
      },
    }}
  />,
];

export default function (theme: Theme): Interpolation<Theme> {
  const globalStlyes: Interpolation<Theme> = {
    html: {
      height: "100%",
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
      userSelect: "none",
    },
    body: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100%",
      margin: 0,
    },
    "#app": {
      display: "flex",
      flexDirection: "column",
      flex: "1 0 0px",
    },
  };

  return globalStlyes;
}
