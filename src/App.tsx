import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/index";
import AdminPanel from "./Admin/AdminPanel"

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/admin" element={<AdminPanel />} /> 
    </Routes>
    </Router>
  );
}

export default App;