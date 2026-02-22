import { BrowserRouter, Route, Routes } from "react-router-dom";
import CompassNavbar from "./components/CompassNavbar/CompassNavbar";
import Events from "./pages/Events";
import Homepage from "./pages/homepage";
import Initiative from "./pages/initiative";
import Speakers1 from "./pages/speakers";
import Sponsors from "./pages/sponsors";
import Team from "./pages/team";
import Timeline from "./pages/timeline";
<<<<<<< HEAD
=======
import Homepage from "./pages/homepage";
import Speakers1 from "./pages/speakers";

import { Routes, Route, useLocation } from "react-router-dom";
>>>>>>> 20519ffb408e2a265a7c1f494686398f9b8608a8

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
<<<<<<< HEAD
        <Route path="/events/*" element={<Events />} />
=======

>>>>>>> 20519ffb408e2a265a7c1f494686398f9b8608a8
      </Routes>
    </>
  );
}

export default App;