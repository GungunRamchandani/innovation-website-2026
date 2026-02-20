import CompassNavbar from "./components/CompassNavbar/CompassNavbar";
import Sponsors from "./pages/sponsors";
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
        <Route path="/speaker" element={<Speakers1 />} />


      </Routes>

    </BrowserRouter>
  );
}

export default App;