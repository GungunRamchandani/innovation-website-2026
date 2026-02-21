import CompassNavbar from "./components/CompassNavbar/CompassNavbar";
import Sponsors from "./pages/sponsors";
import Speakers1 from "./pages/speakers";
import Team from "./pages/team";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>

      {/* Common Navbar */}
      <CompassNavbar />

      {/* Routing only */}
      <Routes>

        <Route path="/sponsors" element={<Sponsors />} />
        <Route path="/speaker" element={<Speakers1 />} />
        <Route path="/teams" element={<Team />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;