import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import CompassNavbar from "./components/CompassNavbar/CompassNavbar";
import Events from "./pages/Events";
import Homepage from "./pages/homepage";
import Initiative from "./pages/initiative";
import Overview from "./pages/Overview"; // You will create this file
import Speakers1 from "./pages/speakers";
import Sponsors from "./pages/sponsors";

import Footer from "./components/header-footer/Footer";
import Header from "./components/header-footer/Header";
import Aboutus from "./pages/aboutus";
import Team from "./pages/team";
import Timeline from "./pages/timeline";

// Toggle Button Component
const ToggleViewButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/";
  const isOverview = location.pathname === "/overview";

  // Only show the button on Home or Overview
  if (!isHome && !isOverview) return null;

  return (
    <button
      onClick={() => navigate(isHome ? "/overview" : "/")}
      className="view-toggle-btn"
    >
      {isHome ? "2D VIEW" : "3D VIEW"}
    </button>
  );
};

function App({ isAnimationDone }) {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isOverviewPage = location.pathname === "/overview";

  return (
    <div className="app-layout">
      <Header />
      <main className="app-content">
        {/* Toggle button appears on both Home and Overview */}
        <ToggleViewButton />

        {/* Hide CompassNavbar on both Home and Overview per your logic */}
        {!isHomePage && !isOverviewPage && <CompassNavbar />}

        <Routes>
          <Route path="/" element={<Homepage isAnimationDone={isAnimationDone} />} />
          <Route path="/overview" element={<Overview />} />

          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="/initiative" element={<Initiative />} />
          <Route path="/teams" element={<Team />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/aboutus" element={<Aboutus />} />
          <Route path="/speakers" element={<Speakers1 />} />
          <Route path="/events/*" element={<Events />} />
        </Routes>
      </main>
      <Footer />

      <style>{`
        .view-toggle-btn {
          position: fixed;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          padding: 10px 25px;
          background: rgba(58, 159, 192, 0.1);
          color: #74e5f9;
          border: 2px solid #78c4e4;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          letter-spacing: 2px;
          backdrop-filter: blur(5px);
          transition: all 0.3s ease;
        }
        .view-toggle-btn:hover {
          background: #a6c2ce;
          color: #000;
          box-shadow: 0 0 15px #acbec8;
        }
      `}</style>
    </div>
  );
}

export default App;