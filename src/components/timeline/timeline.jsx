import React, { useState, useEffect } from 'react';
import './timeline2.css';
import roadVertical from '../../assets/timeline-photos/road3.png';
import roadHorizontal from '../../assets/timeline-photos/horizontal road.jpeg'; // Using your new laptop image

const Timeline = () => {
  const [activePoint, setActivePoint] = useState(null);
  const [cardPosition, setCardPosition] = useState({ top: 0, left: 0 });
  const [isLaptop, setIsLaptop] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => setIsLaptop(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Vertical Coordinates (Original Path)
  const verticalLocs = [
    { id: 1,  x: 85, y: 140, title: "EVENT A", venue: "IT Building" },
    { id: 2,  x: 88, y: 132, title: "EVENT B", venue: "IT Building" },
    { id: 3,  x: 85, y: 120, title: "EVENT C", venue: "IT Building" },
    { id: 4,  x: 65, y: 125, title: "EVENT D", venue: "IT Building" },
    { id: 5,  x: 42, y: 122, title: "EVENT E", venue: "IT Building" },
    { id: 6,  x: 32, y: 110, title: "EVENT F", venue: "IT Building" },
    { id: 7,  x: 40, y: 92,  title: "EVENT G", venue: "IT Building" },
    { id: 8,  x: 52, y: 83,  title: "EVENT H", venue: "IT Building" },
    { id: 9,  x: 56, y: 78,  title: "EVENT I", venue: "IT Building" },
    { id: 10, x: 57, y: 71,  title: "EVENT J", venue: "IT Building" },
    { id: 11, x: 44, y: 64,  title: "EVENT K", venue: "IT Building" },
    { id: 12, x: 35, y: 58,  title: "EVENT L", venue: "IT Building" },
    { id: 13, x: 39, y: 43,  title: "EVENT M", venue: "IT Building" },
    { id: 14, x: 45, y: 33,  title: "EVENT N", venue: "IT Building" },
    { id: 15, x: 35, y: 26,  title: "EVENT O", venue: "IT Building" },
    { id: 16, x: 18, y: 22,  title: "EVENT P", venue: "IT Building" },
    { id: 17, x: 15, y: 12,  title: "EVENT Q", venue: "IT Building" },
    { id: 18, x: 14, y: 5,   title: "EVENT R", venue: "IT Building" },
  ];

  // Horizontal Coordinates (Custom plotted for your horizontal image path)
  const horizontalLocs = [
    { id: 1,  x: 5,   y: 46, title: "EVENT A", venue: "IT Building" },
    { id: 2,  x: 15,  y: 50, title: "EVENT B", venue: "IT Building" },
    { id: 3,  x: 25,  y: 66, title: "EVENT C", venue: "IT Building" },
    { id: 4,  x: 35,  y: 67, title: "EVENT D", venue: "IT Building" },
    { id: 5,  x: 48,  y: 63, title: "EVENT E", venue: "IT Building" },
    { id: 6,  x: 60,  y: 60, title: "EVENT F", venue: "IT Building" },
    { id: 7,  x: 68,  y: 50, title: "EVENT G", venue: "IT Building" },
    { id: 8,  x: 75,  y: 39, title: "EVENT H", venue: "IT Building" },
    { id: 9,  x: 85,  y: 42, title: "EVENT I", venue: "IT Building" },
    { id: 10, x: 89,  y: 52, title: "EVENT J", venue: "IT Building" },
    { id: 11, x: 87,  y: 62, title: "EVENT K", venue: "IT Building" },
    { id: 12, x: 90,  y: 70, title: "EVENT L", venue: "IT Building" },
    { id: 13, x: 105, y: 77, title: "EVENT M", venue: "IT Building" },
    { id: 14, x: 128, y: 78, title: "EVENT N", venue: "IT Building" },
    { id: 15, x: 142, y: 75, title: "EVENT O", venue: "IT Building" },
    { id: 16, x: 155, y: 67, title: "EVENT P", venue: "IT Building" },
    { id: 17, x: 166, y: 60, title: "EVENT Q", venue: "IT Building" },
    { id: 18, x: 175, y: 55, title: "EVENT R", venue: "IT Building" },
  ];

  const locations = isLaptop ? horizontalLocs : verticalLocs;

  return (
    <div className={`timeline-container2 ${isLaptop ? 'laptop-view' : 'mobile-view'}`}>
      <div className="map-wrapper2" onClick={() => setActivePoint(null)}>
        <svg viewBox={isLaptop ? "0 0 177.7 100" : "0 0 100 150"} className="map-svg2">
          <image 
            href={isLaptop ? roadHorizontal : roadVertical} 
            width={isLaptop ? "177.7" : "100"} 
            height={isLaptop ? "100" : "150"} 
            preserveAspectRatio="xMidYMid slice" 
          />

          {locations.map((loc) => (
            <g 
              key={loc.id} 
              className={`marker-group2 ${activePoint?.id === loc.id ? 'active' : ''}`} 
              onClick={(e) => {
                e.stopPropagation();
                const svg = e.currentTarget.closest('svg');
                const rect = svg.getBoundingClientRect();
                const viewBox = isLaptop ? [0, 0, 177.7, 100] : [0, 0, 100, 150];
                const scaleX = rect.width / viewBox[2];
                const scaleY = rect.height / viewBox[3];
                const pixelX = loc.x * scaleX + rect.left;
                const pixelY = loc.y * scaleY + rect.top;
                setCardPosition({ top: pixelY - 20, left: pixelX });
                setActivePoint(loc);
              }}
            >
              <circle cx={loc.x} cy={loc.y} r="4" fill="transparent" />
              <g transform={`translate(${loc.x},${loc.y})`}>
                <path 
                  d="M 0,-1.2 A 1.2,1.2 0 0,1 1.2,0 Q 1.2,1.5 0,2.5 Q -1.2,1.5 -1.2,0 A 1.2,1.2 0 0,1 0,-1.2 Z" 
                  className="marker-pin2"
                />
                <circle cx="0" cy="0" r="0.4" fill="white" />
              </g>
              <text x={loc.x + 5} y={loc.y - 3} className="marker-label2">{loc.title}</text>
            </g>
          ))}
        </svg>

        {activePoint && (
          <div className="detail-card2" style={{ top: `${cardPosition.top}px`, left: `${cardPosition.left}px` }} onClick={(e) => e.stopPropagation()}>
            <button className="close-btn2" onClick={() => setActivePoint(null)}>×</button>
            <div className="card-header2">
              <span className="id-badge2">{activePoint.id}</span>
              <h3>{activePoint.title}</h3>
            </div>
            <p className="venue-text"><strong>Venue:</strong> {activePoint.venue}</p> 
            <p className="desc-text">Join us at this location for an exclusive event on the journey.</p>
            <button className="register-btn2">Register Now</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline;