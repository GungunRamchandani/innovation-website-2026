import CompassNavbar from "./components/CompassNavbar/CompassNavbar";
import Sponsors from "./pages/sponsors";
import Initiative from "./pages/initiative";
import Team from "./pages/team";
import Speakers1 from "./pages/speakers";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
        <Route path="/speakers" element={<Speakers1 />} />


      </Routes>

    </BrowserRouter>
  );
}

export default App;