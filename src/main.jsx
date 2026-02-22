import { useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import Animation from "./pages/animation.jsx";
import App from "./App.jsx";

function Main() {
  const [animationDone, setAnimationDone] = useState(() =>
    sessionStorage.getItem("animationShown") === "true"
  );

  const [phase, setPhase] = useState("loader");

  const handleComplete = () => {
    sessionStorage.setItem("animationShown", "true");
    setAnimationDone(true);
  };

  return (
    <>
      <App phase={phase} setPhase={setPhase} />

      {!animationDone && (
        <Animation onComplete={handleComplete} />
      )}
    </>
  );
}

createRoot(document.getElementById("root")).render(

  <Main />

);