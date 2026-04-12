import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/index";
import AdminPanel from "./Admin/AdminPanel";
import Legal from "./pages/legal";
import Baby from "./pages/BabyPro";
import "./App.css";
import Background from "./components/Background";
import PageRenderer from "./pages/PageRenderer";
import Contacto from "./pages/Contact";

function App() {
  return (
    <Router>
       <Background />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/admin" element={<AdminPanel />} /> 
      <Route path="/legal" element={<Legal />} /> 
      <Route path="/baby" element={<Baby />} /> 
      <Route path="/contacto" element={<Contacto />} /> 
       <Route path="/:slug" element={<PageRenderer />} />
    </Routes>
    </Router>
  );
}

export default App;