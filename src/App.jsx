import CompassNavbar from "./components/CompassNavbar/CompassNavbar";
import Sponsors from "./pages/sponsors";
import Initiative from "./pages/initiative";
import Team from "./pages/team";
import Timeline from "./pages/timeline";
import Homepage from "./pages/homepage";
import Speakers1 from "./pages/speakers";
import Header from "./components/header-footer/Header";
import Footer from "./components/header-footer/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Header />

        <main className="app-content">
          {/* Floating Compass Navbar */}
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
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;