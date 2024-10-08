import { PaletteMode, createTheme } from "@mui/material/styles";

export default (mode: PaletteMode) => createTheme({
  palette: {
    mode,
    primary: {
      main: "#172B3F",
    },
    secondary: {
      main: "#FFD700",
    },
    text: {
      primary: mode === "light" ? "rgba(51, 51, 51, 0.87)" : "rgba(255, 255, 255, 1)",
      secondary: mode === "light" ? "rgba(51, 51, 51, 0.60)" : "rgba(255, 255, 255, 0.60)",
      disabled: mode === "light" ? "rgba(51, 51, 51, 0.38)" : "rgba(255, 255, 255, 0.38)",
    },
    background: {
      default: mode === "light" ? "#faebd7" : "#172B3F",
      paper: "#ececec",
    },
    divider: "rgba(0, 0, 0, 0.12)",
  },
  typography: {
    fontFamily: "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: 16,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontFamily: "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      fontWeight: 300,
    },
    h2: {
      fontFamily: "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      fontWeight: 300,
    },
    h3: {
      fontFamily: "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      fontWeight: 300,
    },
    h4: {
      fontFamily: "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      fontWeight: 300,
    },
    h5: {
      fontFamily: "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      fontWeight: 300,
    },
    h6: {
      fontFamily: "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      fontWeight: 300,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          border: mode === "light" ? "1px solid #000" : "1px solid #fff",
        },
      },
    },
  },
});
