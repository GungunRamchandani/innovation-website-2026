import CompassNavbar from "./components/CompassNavbar/CompassNavbar";
import Sponsors from "./pages/sponsors";
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
        <Route path="/teams" element={<Team />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;