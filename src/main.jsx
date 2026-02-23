import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import Animation from './pages/animation.jsx'
import App from './App.jsx'

import { BrowserRouter } from "react-router-dom";


function Main() {

  // Check if animation has already been shown in this session
  const [showApp, setShowApp] = useState(() => {
    return sessionStorage.getItem('animationShown') === 'true';
  });


  const handleAnimationComplete = () => {

    sessionStorage.setItem('animationShown', 'true');

    setShowApp(true);

  };


  return (

    <>
      {/* Always render Animation if not shown yet; it stays on top */}
      {!showApp && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10000 }}>
          <Animation onComplete={handleAnimationComplete} />
        </div>
      )}

      {/* The App is always rendered now. 
        visibility: hidden ensures it doesn't block the animation, 
        but it still "mounts" so the City assets start downloading immediately.
    */}
      <div style={{
        visibility: showApp ? "visible" : "hidden",
        height: showApp ? "auto" : "0",
        overflow: "hidden"
      }}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </div>
    </>

  );

}



createRoot(document.getElementById('root')).render(

  <StrictMode>

    <Main />

  </StrictMode>

)