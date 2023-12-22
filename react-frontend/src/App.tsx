import LandingPage from "./pages/LandingPage";
import ContentPage from "./pages/ContentPage";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import '@picocss/pico';
import AttributionsPage from "./pages/AttributionsPage";
import "./App.css";
import { MathJaxContext } from "better-react-mathjax";
import { createContext, useEffect, useState } from "react";

type ThemeContextType = [string, () => void];

export const ThemeContext = createContext<ThemeContextType>(["", () => {}]);

function reveal() {
  var reveals = document.querySelectorAll(".reveal");

  for (var i = 0; i < reveals.length; i++) {
    var windowHeight = window.innerHeight;
    var elementTop = reveals[i].getBoundingClientRect().top;
    var elementVisible = 150;

    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add("active");
    } else {
      reveals[i].classList.remove("active");
    }
  }
}

window.addEventListener("scroll", reveal);

function App() {

  let mediaQueryObj = window.matchMedia('(prefers-color-scheme: dark)');
  let isDarkMode = mediaQueryObj.matches;

  const [theme, setTheme] = useState(isDarkMode ? "dark" : "light");

  const config = {
    loader: { load: ["input/asciimath"] }
  };

  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };

  return (
    <MathJaxContext config={config}>
      <ThemeContext.Provider value={[theme, toggleTheme]}>
        <div id={theme}>
          <BrowserRouter>
            <Routes>
              <Route path="/oldpage" element={<LandingPage/>}/>
              <Route path="/" element={<ContentPage/>}/>
              <Route path="/attributions" element={<AttributionsPage/>}/>
              <Route path="*" element={<ContentPage/>}/>
            </Routes>
          </BrowserRouter>
        </div>
      </ThemeContext.Provider>
    </MathJaxContext>
  );
}

export default App;
