// App.jsx

import { BrowserRouter } from "react-router-dom";

import SceneCanvas from "./SceneCanvas";
import AppContent from "./AppContent";

function App({ phase, setPhase }) {
  return (
    <BrowserRouter>
      <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
        <SceneCanvas phase={phase} setPhase={setPhase} />
      </div>

      <AppContent phase={phase} setPhase={setPhase} />
    </BrowserRouter>
  );
}

export default App;