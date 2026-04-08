import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/index";
import AdminPanel from "./Admin/AdminPanel";
import Legal from "./pages/legal";
import Baby from "./pages/BabyPro";
import "./App.css";
import Background from "./components/Background";

function App() {
  return (
    <Router>
       <Background />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/admin" element={<AdminPanel />} /> 
      <Route path="/legal" element={<Legal />} /> 
      <Route path="/baby" element={<Baby />} /> 
    </Routes>
    </Router>
  );
}

export default App;