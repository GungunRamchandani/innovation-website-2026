import CompassNavbar from "./components/CompassNavbar/CompassNavbar";
import Sponsors from "./pages/sponsors";
import Initiative from "./pages/initiative";
import Team from "./pages/team";
import Timeline from "./pages/timeline";
import Homepage from "./pages/homepage";
import Speakers1 from "./pages/speakers";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <CompassNavbar />

      <Routes>
        {/* Homepage */}
        <Route path="/" element={<Homepage />} />

        {/* Other Pages */}
        <Route path="/sponsors" element={<Sponsors />} />
        <Route path="/initiative" element={<Initiative />} />
        <Route path="/teams" element={<Team />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/speakers" element={<Speakers1 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
