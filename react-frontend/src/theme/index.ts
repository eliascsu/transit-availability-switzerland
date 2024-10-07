import { PaletteMode, createTheme } from "@mui/material/styles";

declare module "@mui/material/styles/createPalette" {
  interface ColorVariations {
    main?: string;
    selected?: string;
    hover?: string;
    hoverSelected?: string;
    disabled?: string;
    modified?: string;
  }

  interface Palette {
    modified?: string;
    status: {
      new: ColorVariations;
      annotated: ColorVariations;
      reviewed: ColorVariations;
      approved: ColorVariations;
      released: ColorVariations;
      rejected: ColorVariations;
    }
  }

  interface PaletteOptions {
    modified?: string;
    status: {
      new: ColorVariations;
      annotated: ColorVariations;
      reviewed: ColorVariations;
      approved: ColorVariations;
      released: ColorVariations;
      rejected: ColorVariations;
    }
  }
};

export default (mode: PaletteMode) => createTheme({
  palette: {
    mode,
    primary: {
      main: "#172B3F",
    },
    secondary: {
      main: "#FF9100",
    },
    text: {
      primary: "rgba(51, 51, 51, 0.87)",
      secondary: "rgba(51, 51, 51, 0.60)",
      disabled: "rgba(51, 51, 51, 0.38)",
    },
    background: {
      default: "#ffffff",
      paper: "#ececec",
    },
    divider: "rgba(0, 0, 0, 0.12)",
    modified: "#ffff99",
    action: {
      selected: "#c7e1f4",
    },
    status: {
      new: {
        main: "hsl(25, 100%, 57%)",
        selected: "#f9b9b9",
        hover: "#f7a1a1",
        hoverSelected: "#f7a1a1",
      },
      annotated: {
        main: "hsl(177, 100%, 57%)",
        selected: "hsl(177, 100%, 54%)",
        hover: "hsl(177, 100%, 50%)",
        hoverSelected: "hsl(177, 100%, 50%)",
      },
      reviewed: {
        main: "hsl(199, 100%, 57%)",
        selected: "hsl(199, 100%, 54%)",
        hover: "hsl(199, 100%, 50%)",
        hoverSelected: "hsl(199, 100%, 50%)",
      },
      approved: {
        main: "hsl(54, 100%, 57%)",
        selected: "hsl(54, 100%, 54%)",
        hover: "hsl(54, 100%, 50%)",
        hoverSelected: "hsl(54, 100%, 50%)",
      },
      released: {
        main: "hsl(137, 100%, 42%)",
        selected: "hsl(137, 100%, 40%)",
        hover: "hsl(137, 100%, 38%)",
        hoverSelected: "hsl(137, 100%, 38%)",
      },
      rejected: {
        main: "#f44336",
        selected: "#f43325",
        hover: "#f21c0d",
        hoverSelected: "#f21c0d",
      },
    },
  },
  typography: {
    fontFamily: "Hind, Verdana, sans-serif",
    fontSize: 16,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontFamily: "Roboto, Verdana, sans-serif",
      fontWeight: 300,
    },
    h2: {
      fontFamily: "Roboto, Verdana, sans-serif",
      fontWeight: 300,
    },
    h3: {
      fontFamily: "Roboto, Verdana, sans-serif",
      fontWeight: 300,
    },
    h4: {
      fontFamily: "Roboto, Verdana, sans-serif",
      fontWeight: 300,
    },
    h5: {
      fontFamily: "Roboto, Verdana, sans-serif",
      fontWeight: 300,
    },
    h6: {
      fontFamily: "Roboto, Verdana, sans-serif",
      fontWeight: 300,
    },
  },
});
