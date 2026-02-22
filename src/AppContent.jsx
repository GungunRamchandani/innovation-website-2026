// AppContent.jsx

import { Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/homepage";
import Sponsors from "./pages/sponsors";
// import Events from "./pages/Events";
import Team from "./pages/team";
// import About from "./pages/About";

function AppContent({ phase, setPhase }) {

  return (
    <div style={{ position: "relative", zIndex: 2 }}>
      <Routes>
        <Route
          path="/"
          element={<Home phase={phase} setPhase={setPhase} />}
        />
        <Route path="/sponsors" element={<Sponsors />} />
        <Route path="/teams" element={<Team />} />
      </Routes>
    </div>
  );
}

export default AppContent;