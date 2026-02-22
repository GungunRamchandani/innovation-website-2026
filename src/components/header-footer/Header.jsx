import { useEffect, useRef } from "react";
import "./Header.css";

import icon1 from "../../assets/header-footer/icon-1.png";
import icon2 from "../../assets/header-footer/icon-2.png";
import icon3 from "../../assets/header-footer/icon-3.png";
import icon4 from "../../assets/header-footer/icon-4.png";
import icon5 from "../../assets/header-footer/icon-5.png";
import icon6 from "../../assets/header-footer/icon-6.png";
import icon7 from "../../assets/header-footer/icon-7.png";
import icon8 from "../../assets/header-footer/icon-8.png";

import sideLeft from "../../assets/header-footer/logo-2.png";
import sideRight from "../../assets/header-footer/logo-1.png";

function Header() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const points = [
      { x: 0.11, y: 0.25 },
      { x: 0.08, y: 0.5 },
      { x: 0.13, y: 0.9 },
      { x: 0.23, y: 0.15 },
      { x: 0.28, y: 0.95 },
      { x: 0.33, y: 0.10, black:true},
      { x: 0.38, y: 0.88 },
      { x: 0.43, y: 0.23 },
      { x: 0.48, y: 0.45 },
      { x: 0.53, y: 0.15},
      { x: 0.58, y: 0.89, black:true},
      { x: 0.63, y: 0.08 },
      { x: 0.73, y: 0.13, black:true },
      { x: 0.78, y: 0.95 },
      { x: 0.83, y: 0.4 },
      { x: 0.88, y: 0.5, black:true },
      { x: 0.93, y: 0.35 },
      { x: 0.1, y: 0.75 },
      { x: 0.2, y: 0.7, black:true },
      { x: 0.3, y: 0.8, black:true },
      { x: 0.5, y: 0.78 },
      { x: 0.7, y: 0.8 , black:true},
      { x: 0.8, y: 0.72 },
      { x: 0.9, y: 0.78 }
    ];

    function draw() {
      const dpr = window.devicePixelRatio || 1;
      const displayWidth = canvas.parentElement.clientWidth;
      const displayHeight = 125;

      canvas.style.width = displayWidth + "px";
      canvas.style.height = displayHeight + "px";

      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, displayWidth, displayHeight);

      const scaled = points.map(p => ({
        x: p.x * displayWidth,
        y: p.y * displayHeight
      }));

      // Draw lines
      const isMobile = window.innerWidth <= 768;
      const maxDistance = isMobile ? 100 : 200;
      for (let i = 0; i < scaled.length; i++) {
        for (let j = i + 1; j < scaled.length; j++) {
          const dx = scaled[i].x - scaled[j].x;
          const dy = scaled[i].y - scaled[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            ctx.strokeStyle = "rgba(0,240,255,0.25)"

            ctx.lineWidth = isMobile ? 0.8 : 1;

            ctx.beginPath();
            ctx.moveTo(scaled[i].x, scaled[i].y);
            ctx.lineTo(scaled[j].x, scaled[j].y);
            ctx.stroke();
          }
        }
      }
      // Draw dots
      scaled.forEach((point, i) => {
        const original = points[i];

        ctx.fillStyle = original.black ? "#000000" : "#00f0ff";

        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    draw();
    window.addEventListener("resize", draw);

    return () => {
      window.removeEventListener("resize", draw);
    };
  }, []);

  return (
    <header className="hero">
      <canvas ref={canvasRef} className="plexus-canvas" />

      {/* ICONS */}
      <img src={icon1} className="icon i1" alt="" />
      <img src={icon2} className="icon i2" alt="" />
      <img src={icon3} className="icon i3" alt="" />
      <img src={icon4} className="icon i4" alt="" />
      <img src={icon5} className="icon i5" alt="" />
      <img src={icon6} className="icon i6" alt="" />
      <img src={icon7} className="icon i7" alt="" />
      <img src={icon8} className="icon i8" alt="" />

      {/* SIDE LOGOS */}
      <img src={sideLeft} alt="Left Logo" className="side-logo left-logo" />
      <img src={sideRight} alt="Right Logo" className="side-logo right-logo" />

      <div className="center-content">
        <h1>INNOVATION 2026</h1>
        <h2>EQUINOX: POWERED BY PURPOSE</h2>
      </div>
    </header>
  );
}

export default Header;