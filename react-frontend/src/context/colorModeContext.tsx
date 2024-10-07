import React from "react";

import { PaletteMode } from "@mui/material/styles";

export type ColorModeContextType = {
  mode: PaletteMode;

  toggleColorMode: () => void;
};

const ColorModeContext = React.createContext<ColorModeContextType>({
  mode: "light",

  toggleColorMode: () => { },
});

type ColorModeProviderProps = {
  children: React.ReactNode;
};

export const ColorModeProvider: React.FC<ColorModeProviderProps> = ({
  children,
}) => {
  const didCancel = React.useRef(false);
  React.useEffect(() => () => { didCancel.current = true; }, []);

  const [mode, setMode] = React.useState<"light" | "dark">(() => {
    const storedColorMode = localStorage.getItem("colorMode");
    if (storedColorMode === "light" || storedColorMode === "dark") {
      return storedColorMode;
    }

    const { matches } = window.matchMedia("(prefers-color-scheme: dark)");
    const userPreference = matches ? "dark" : "light";
    return userPreference;
  });

  const toggleColorMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light";
      localStorage.setItem("colorMode", newMode);
      return newMode;
    });
  };

  return (
    <ColorModeContext.Provider
      value={{
        mode,
        toggleColorMode,
      }}>
      {children}
    </ColorModeContext.Provider>
  );
};

export default ColorModeContext;
