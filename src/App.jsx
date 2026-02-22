import { Route, Routes } from "react-router-dom";
import CompassNavbar from "./components/CompassNavbar/CompassNavbar";
import Aboutus from "./pages/aboutus";
import Homepage from "./pages/homepage";
import Initiative from "./pages/initiative";
import Speakers1 from "./pages/speakers";
import Sponsors from "./pages/sponsors";
import Team from "./pages/team";
import Timeline from "./pages/timeline";

import { useLocation } from "react-router-dom";

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
        <Route path="/aboutus" element={<Aboutus />} />

        <Route path="/speakers" element={<Speakers1 />} />


      </Routes>
    </>
  );
}

export default App;