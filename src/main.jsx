import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Animation from './pages/animation.jsx'
import App from './App.jsx'

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
      {!showApp ? (
        <Animation onComplete={handleAnimationComplete} />
      ) : (
        <App />
      )}
    </>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Main />
  </StrictMode>,
)
