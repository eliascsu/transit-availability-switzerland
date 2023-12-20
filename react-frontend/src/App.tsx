import LandingPage from "./pages/LandingPage";
import ContentPage from "./pages/ContentPage";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import '@picocss/pico';
import AttributionsPage from "./pages/AttributionsPage";
import "./App.css";

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
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/content" element={<ContentPage/>}/>
        <Route path="/attributions" element={<AttributionsPage/>}/>
        <Route path="*" element={<LandingPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
