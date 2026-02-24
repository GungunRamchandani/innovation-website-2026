import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./cards.css";

function Card({ frontClass, title, description }) {
  const innerRef = useRef(null);
  const cardRef = useRef(null);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  // Check if it's a mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = (e) => {
    if (isMobile) return; // Don't run mouse effects on mobile

    const card = e.currentTarget;
    const inner = innerRef.current;
    if (!inner) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    inner.style.transform = `
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateY(-6px)
      scale(1.03)
    `;
  };

  const handleMouseLeave = () => {
    if (isMobile) return; // Don't run mouse effects on mobile

    const inner = innerRef.current;
    if (!inner) return;

    inner.style.transform = `
      rotateX(0deg)
      rotateY(0deg)
      translateY(0px)
      scale(1)
    `;
  };

  // Mobile touch 3D effect
  const handleTouchMove = (e) => {
    if (!isMobile) return;

    const card = cardRef.current;
    const inner = innerRef.current;
    if (!card || !inner) return;

    const touch = e.touches[0];
    const rect = card.getBoundingClientRect();
    
    // Get touch position relative to card
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    // Calculate center of card
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation based on touch position (more subtle on mobile)
    const rotateY = ((x - centerX) / centerX) * 20; // More rotation on mobile
    const rotateX = ((centerY - y) / centerY) * 15; // Inverted for natural feel
    
    // Calculate shadow intensity based on tilt
    const shadowIntensity = Math.abs(rotateY) * 0.5;
    
    // Apply 3D transform
    inner.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateZ(${Math.abs(rotateY) * 0.5}px)
    `;
    
    // Dynamic shadow based on tilt
    inner.style.boxShadow = `
      ${rotateY > 0 ? '-' : ''}${shadowIntensity * 2}px 10px 30px rgba(0, 255, 255, ${0.1 + shadowIntensity * 0.05})
    `;
  };

  const handleTouchEnd = () => {
    if (!isMobile) return;

    const inner = innerRef.current;
    if (!inner) return;

    // Smooth reset to original position
    inner.style.transition = 'transform 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28), box-shadow 0.5s ease';
    inner.style.transform = `
      perspective(1000px)
      rotateX(0deg)
      rotateY(0deg)
      translateZ(0px)
    `;
    inner.style.boxShadow = 'var(--shadow)';
    
    // Remove transition after reset
    setTimeout(() => {
      inner.style.transition = '';
    }, 500);
  };

  // Alternative: Device orientation 3D effect (if device supports it)
  useEffect(() => {
    if (!isMobile || !innerRef.current) return;

    const handleDeviceOrientation = (e) => {
      const inner = innerRef.current;
      if (!inner) return;

      // Use gamma (left-right tilt) and beta (front-back tilt)
      const tiltY = e.gamma ? e.gamma / 10 : 0; // Reduced sensitivity
      const tiltX = e.beta ? (e.beta - 90) / 15 : 0; // Adjusted for portrait
      
      // Limit the rotation
      const limitedTiltX = Math.max(Math.min(tiltX, 10), -10);
      const limitedTiltY = Math.max(Math.min(tiltY, 10), -10);
      
      inner.style.transform = `
        perspective(1200px)
        rotateX(${limitedTiltX}deg)
        rotateY(${limitedTiltY}deg)
      `;
    };

    // Only add if device supports orientation
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleDeviceOrientation);
      
      return () => {
        window.removeEventListener('deviceorientation', handleDeviceOrientation);
      };
    }
  }, [isMobile]);

  const handleInfoClick = (e) => {
  e.preventDefault();
  e.stopPropagation();

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // remove special characters
    .replace(/\s+/g, "-"); // replace spaces with -

  navigate(`/events/info/${slug}`, {
  state: {
    title,
    description,
    backgroundClass: frontClass
  }
});
};

  return (
    <div
      className="card"
      ref={cardRef}
      onMouseMove={!isMobile ? handleMouseMove : undefined}
      onMouseLeave={!isMobile ? handleMouseLeave : undefined}
      onTouchMove={isMobile ? handleTouchMove : undefined}
      onTouchEnd={isMobile ? handleTouchEnd : undefined}
      onTouchCancel={isMobile ? handleTouchEnd : undefined}
    >
      <div className="card-inner" ref={innerRef}>
        <div className={`card-face card-front ${frontClass}`}>
          <div>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>

          <div className="cta-buttons">
            <button onClick={handleInfoClick} className="secondary">
              Info
            </button>
            <a href="#" className="primary">Register</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;