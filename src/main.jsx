import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Animation from './pages/animation.jsx'
import App from './App.jsx'

function Main() {
  const [showApp, setShowApp] = useState(false);
  
  const handleAnimationComplete = () => {
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
