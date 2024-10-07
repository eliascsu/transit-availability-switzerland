import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";

import ColorModeContext, {
  ColorModeProvider,
} from "./context/colorModeContext";

import { MapProvider } from "./context/mapContext";

import createMuiTheme from "./theme";

import ContentPage from "./views/contentPage";

import createGlobalStyles, { globalFonts } from "./app.styles";

const App: React.FC = () => {
  const { mode } = React.useContext(ColorModeContext);

  const cache = React.useMemo(
    () =>
      createCache({
        key: "css",
        stylisPlugins: [],
      }),
    [],
  );

  const theme = React.useMemo(() => createMuiTheme(mode), [mode]);

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <MapProvider>
          <CssBaseline />
          {globalFonts.map((font) => font)}
          <GlobalStyles styles={createGlobalStyles} />

          <BrowserRouter>
            <Routes>
              <Route path="/" Component={ContentPage} />
            </Routes>
          </BrowserRouter>
        </MapProvider>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default App;
