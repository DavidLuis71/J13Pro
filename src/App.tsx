import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/index";
import AdminPanel from "./Admin/AdminPanel";
import Legal from "./pages/legal";
import "./App.css";
import Background from "./components/Background";
import PageRenderer from "./pages/PageRenderer";
import Contacto from "./pages/Contact";
import Direction from "./pages/Direction";
import Galery from "./pages/Galery"
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sponsors from "./pages/Sponsors"
import ProtectedRoute from "./ProtectedRoute";
import LoginAdmin from "./Admin/Login-admin";

function App() {
  return (
    <Router>
       <Background />
          <Header />
    <Routes>
      <Route path="/" element={<Index />} />
        {/* LOGIN */}
  <Route path="/login-admin" element={<LoginAdmin />} />
       <Route
    path="/admin"
    element={
      <ProtectedRoute>
        <AdminPanel />
      </ProtectedRoute>
    }
  />
      <Route path="/legal" element={<Legal />} /> 
      <Route path="/contacto" element={<Contacto />} /> 
      <Route path="/direction" element={<Direction/>}/>
      <Route path="/sponsors" element={<Sponsors/>}/>
        <Route path="/galery" element={<Galery/>}/>
       <Route path="/:slug" element={<PageRenderer />} />
    </Routes>
     <Footer />
    </Router>
  );
}

export default App;