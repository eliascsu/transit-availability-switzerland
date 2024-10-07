import React from "react";

import { StrictMode } from "react";

import { createRoot } from "react-dom/client";
import App from "./App";
import { ColorModeProvider } from "./context/colorModeContext";

import "./i18n";

const appDiv = document.getElementById("root")!;

const root = createRoot(appDiv);
root.render(
  <StrictMode>
    <ColorModeProvider>
        <App />
    </ColorModeProvider>
  </StrictMode>,
);
