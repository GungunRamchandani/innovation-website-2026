import CompassNavbar from "./components/CompassNavbar/CompassNavbar";
import Sponsors from "./pages/sponsors";
import Initiative from "./pages/initiative";
import Team from "./pages/team";
import Timeline from "./pages/timeline";
import Homepage from "./pages/homepage";
import Speakers1 from "./pages/speakers";

import { Routes, Route, useLocation } from "react-router-dom";

function App() {

  const location = useLocation();

  const isHomePage = location.pathname === "/";

  return (
    <>
      {!isHomePage && <CompassNavbar />}

      <Routes>

        <Route path="/" element={<Homepage />} />

        <Route path="/sponsors" element={<Sponsors />} />
        <Route path="/initiative" element={<Initiative />} />
        <Route path="/teams" element={<Team />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/speakers" element={<Speakers1 />} />
        <Route path="/aboutus" element={<Speakers1 />} />

      </Routes>
    </>
  );
}

export default App;