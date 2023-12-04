import LandingPage from "./pages/LandingPage";
import ContentPage from "./pages/ContentPage";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import '@picocss/pico';
import "./App.css"
import AttributionsPage from "./pages/AttributionsPage";

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
