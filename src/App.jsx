import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import CompassNavbar from "./components/CompassNavbar/CompassNavbar";
import Sponsors from "./pages/sponsors";
import Initiative from "./pages/initiative";
import Team from "./pages/team";
import Timeline from "./pages/timeline";
import Homepage from "./pages/homepage";
import Speakers1 from "./pages/speakers";
import { CityLoadingBanner, CityLoaderScreen } from "./pages/city"; // Import your loaders

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import City from "./pages/city_component"; // Your actual City 3D code
import { CityLoaderScreen, CityLoadingBanner } from "./pages/city";

function AppContent() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  // This state is the ONLY thing that controls the loading screens.
  // Once it is 'ready', it stays 'ready' forever.
  const [globalStatus, setGlobalStatus] = useState("loading"); // loading, banner, ready

  return (
    <div className="app-viewport">
      <CompassNavbar />

      {/* --- THE PERSISTENT 3D WORLD --- */}
      <div className="canvas-container" style={{
        position: 'fixed', inset: 0, zIndex: 1,
        pointerEvents: isHome ? "all" : "none" // Only interact on Home
      }}>
        <Canvas>
          <Suspense fallback={null}>
            <City />
          </Suspense>
        </Canvas>
      </div>

      {/* --- THE PERSISTENT LOADERS --- */}
      {/* These will ONLY ever show once per site visit */}
      {globalStatus === "loading" && (
        <CityLoaderScreen onReady={() => setGlobalStatus("banner")} />
      )}
      {globalStatus === "banner" && (
        <CityLoadingBanner done={false} />
        /* You can set a timeout here to call setGlobalStatus("ready") */
      )}

      {/* --- THE UI OVERLAYS --- */}
      <div className="ui-layer" style={{ position: 'relative', zIndex: 10 }}>
        <Routes>
          {/* We leave "/" empty because the City is already there */}
          <Route path="/" element={<HomeUI onFinish={() => setGlobalStatus("ready")} />} />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="/initiative" element={<Initiative />} />
          <Route path="/teams" element={<Team />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/speakers" element={<Speakers1 />} />
          {/* ... other routes */}
        </Routes>
      </div>
    </div>
  );
}


export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}