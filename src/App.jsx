import { BrowserRouter, Route, Routes } from "react-router-dom";
import CompassNavbar from "./components/CompassNavbar/CompassNavbar";
import Aboutus from "./pages/aboutus";
import Initiative from "./pages/initiative";
import Sponsors from "./pages/sponsors";
import Team from "./pages/team";
import Timeline from "./pages/timeline";

function App() {
  return (
    <BrowserRouter>

      {/* Common Navbar */}
      <CompassNavbar />

      {/* Routing only */}
      <Routes>

        <Route path="/sponsors" element={<Sponsors />} />
        <Route path="/initiative" element={<Initiative />} />
        <Route path="/teams" element={<Team />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/aboutus" element={<Aboutus />} />


      </Routes>

    </BrowserRouter>
  );
}

export default App;