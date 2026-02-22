import { Routes, Route, useLocation } from "react-router-dom";
import CompassNavbar from "./components/CompassNavbar/CompassNavbar";
import Events from "./pages/Events";
import Homepage from "./pages/homepage";
import Initiative from "./pages/initiative";
import Speakers1 from "./pages/speakers";
import Sponsors from "./pages/sponsors";
import Team from "./pages/team";
import Timeline from "./pages/timeline";
import Header from "./components/header-footer/Header";
import Footer from "./components/header-footer/Footer";

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="app-layout">
      <Header />

      <main className="app-content">
        {!isHomePage && <CompassNavbar />}

        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="/initiative" element={<Initiative />} />
          <Route path="/teams" element={<Team />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/speakers" element={<Speakers1 />} />
          <Route path="/events/*" element={<Events />} />
          <Route path="/aboutus" element={<Events />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;