import { BrowserRouter, Route, Routes } from "react-router-dom";
import CompassNavbar from "./components/CompassNavbar/CompassNavbar";
import Aboutus from "./pages/aboutus";
import Homepage from "./pages/homepage";
import Initiative from "./pages/initiative";
import Speakers1 from "./pages/speakers";
import Sponsors from "./pages/sponsors";
import Team from "./pages/team";
import Timeline from "./pages/timeline";

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
        <Route path="/aboutus" element={<Aboutus />} />

        <Route path="/speakers" element={<Speakers1 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
