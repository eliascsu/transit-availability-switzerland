import LandingPage from "./pages/LandingPage";
import ContentPage from "./pages/ContentPage";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import '@picocss/pico';
import AttributionsPage from "./pages/AttributionsPage";
import "./App.css";
import { MathJaxContext } from "better-react-mathjax";

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
  const config = {
    loader: { load: ["input/asciimath"] }
  };

  return (
    <MathJaxContext config={config}>
      <BrowserRouter>
        <Routes>
          <Route path="/oldpage" element={<LandingPage/>}/>
          <Route path="/" element={<ContentPage/>}/>
          <Route path="/attributions" element={<AttributionsPage/>}/>
          <Route path="*" element={<ContentPage/>}/>
        </Routes>
      </BrowserRouter>
    </MathJaxContext>
  );
}

export default App;
