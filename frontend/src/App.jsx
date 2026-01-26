import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MRU from "./pages/MRU";
import MRUA from "./pages/MRUA";
import MCU from "./pages/MCU";
import MCUA from "./pages/MCUA";

// 👉 IMPORT NUEVO
import LumiAssistant from "./components/LumiAssistant";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mru" element={<MRU />} />
        <Route path="/mrua" element={<MRUA />} />
        <Route path="/mcu" element={<MCU />} />
        <Route path="/mcua" element={<MCUA />} />
      </Routes>

      {/* 👉 LUMI ASISTENTE SIEMPRE PRESENTE */}
      <LumiAssistant />
    </BrowserRouter>
  );
}
