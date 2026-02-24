import React, { useState, useEffect, useRef } from 'react';
import './timeline2.css';
import roadVertical from '../../assets/timeline-photos/road3.png';
import roadHorizontal from '../../assets/timeline-photos/horizontal road.jpeg';

const CARD_HEIGHT_ESTIMATE = 260; // approximate card height in px
const EDGE_PADDING = 12; // min distance from screen edge

function getSafeCardStyle(markerX, markerY, isLaptop) {
  const cardWidth = isLaptop ? 320 : 280;
  const cardHeight = CARD_HEIGHT_ESTIMATE;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let left = markerX;
  let top = markerY;
  let translateX = '-50%';
  let translateY = '-100%';
  let transformOrigin = 'bottom center';

  // --- Horizontal clamping ---
  const cardLeft = markerX - cardWidth / 2;
  const cardRight = markerX + cardWidth / 2;

  if (cardLeft < EDGE_PADDING) {
    // Too close to left edge — pin card to left
    left = EDGE_PADDING;
    translateX = '0%';
    transformOrigin = 'bottom left';
  } else if (cardRight > vw - EDGE_PADDING) {
    // Too close to right edge — pin card to right
    left = vw - EDGE_PADDING - cardWidth;
    translateX = '0%';
    transformOrigin = 'bottom right';
  }

  // --- Vertical flipping ---
  if (markerY - cardHeight < EDGE_PADDING) {
    // Not enough space above — flip to below marker
    top = markerY + 24;
    translateY = '0%';
  }

  // Final clamp: ensure card never goes below bottom of screen
  const wouldBottom = top + (translateY === '0%' ? cardHeight : 0);
  if (wouldBottom > vh - EDGE_PADDING) {
    top = vh - EDGE_PADDING - cardHeight;
    translateY = '0%';
  }

  return {
    top: `${top}px`,
    left: `${left}px`,
    transform: `translate(${translateX}, ${translateY})`,
    // Override the animation to match new transform origin
    animation: 'none',
  };
}

const Timeline2 = () => {
  const [activePoint, setActivePoint] = useState(null);
  const [cardStyle, setCardStyle] = useState({});
  const [isLaptop, setIsLaptop] = useState(window.innerWidth > 768);
  // Used to re-trigger animation after style is set
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setIsLaptop(window.innerWidth > 768);
      setActivePoint(null); // close card on resize to avoid stale positions
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Vertical Coordinates (Original Path)
  const verticalLocs = [
  { id: 1, x: 85, y: 140, title: "Software Hackathon", venue: "Mech building classrooms" },
  { id: 2, x: 88, y: 132, title: "Code Conquer", venue: "tnp lab" },
  { id: 3, x: 85, y: 120, title: "ML Bootcamp", venue: "mech auditorium" },
  { id: 4, x: 65, y: 125, title: "Open Source Competition", venue: "main building classroom" },
  { id: 5, x: 55, y: 125, title: "AI Cloud event", venue: "kb joshi auditorium" },
  { id: 6, x: 42, y: 122, title: "Zero UI Challenge", venue: "5th floor main building" },  
  { id: 7, x: 35, y: 118, title: "AR Game", venue: "Main Building 1st floor" },
  { id: 8, x: 32, y: 110, title: "Project Exhibition", venue: "Between IT and Main Building" },
  { id: 9, x: 32, y: 100, title: "Saksham Hackathon", venue: "Main Building 2nd floor classrooms" },
  { id: 10, x: 40, y: 92,  title: "Datathon (Datasprint)", venue: "Day 1/2: IT Building 4th floor" },
  { id: 11, x: 52, y: 83,  title: "Protosprint", venue: "Cerie lab" },
  { id: 12, x: 56, y: 78,  title: "Structural Showdown", venue: "5th floor mech or Danfoss lab" },
  { id: 13, x: 57, y: 71,  title: "Escape Room", venue: "Mech 2nd floor" },
  { id: 14, x: 44, y: 64,  title: "Mozilla Event", venue: "Instru green space" },
  { id: 15, x: 35, y: 58,  title: "Hardware Hackathon", venue: "Any 2 labs from main building 4th floor" },
  { id: 16, x: 35, y: 52,  title: "Mini Carnival", venue: "Main Quad" },
  { id: 17, x: 39, y: 43,  title: "Botsprint", venue: "Instru Quad" },
  { id: 18, x: 44, y: 38,  title: "Buildathon", venue: "Instru Labs" },
  { id: 19, x: 45, y: 33,  title: "Trailblazers", venue: "Mechanical Circle" },
  { id: 20, x: 35, y: 26,  title: "Business", venue: "KB Joshi" },
  { id: 21, x: 15, y: 5,   title: "The Algorithm Human Bot", venue: "Tutorial room IT building Ground floor" },
  { id: 22, x: 18, y: 22,  title: "ImpEx", venue: "Discussion Room - Main building 3rd floor" },
  { id: 23, x: 15, y: 12,  title: "Math on Spot", venue: "Near Canteen" },
];

  // Horizontal Coordinates (Custom plotted for your horizontal image path)
  const horizontalLocs = [
  { id: 1,  x: 5,   y: 46, title: "Software Hackathon", venue: "Mech building classrooms" },
  { id: 2,  x: 15,  y: 50, title: "Code Conquer", venue: "tnp lab" },
  { id: 3,  x: 16,  y: 55, title: "ML Bootcamp", venue: "mech auditorium" },
  { id: 4,  x: 15,  y: 59, title: "Open Source Competition", venue: "main building classroom" },
  { id: 5,  x: 25,  y: 66, title: "AI Cloud event", venue: "kb joshi auditorium" },
  { id: 6,  x: 35,  y: 67, title: "Zero UI Challenge", venue: "5th floor main building" },
  { id: 7,  x: 48,  y: 63, title: "AR Game", venue: "Main Building 1st floor" },
  { id: 8,  x: 60,  y: 60, title: "Project Exhibition", venue: "Between IT and Main Building" },
  { id: 9,  x: 68,  y: 50, title: "Saksham Hackathon", venue: "Main Building 2nd floor classrooms" },
  { id: 10, x: 65,  y: 41, title: "Datathon (Datasprint)", venue: "Day 1/2: IT Building 4th floor" },
  { id: 11, x: 75,  y: 39, title: "Protosprint", venue: "Cerie lab" },
  { id: 12, x: 85,  y: 42, title: "Structural Showdown", venue: "5th floor mech or Danfoss lab" },
  { id: 13, x: 89,  y: 52, title: "Escape Room", venue: "Mech 2nd floor" },
  { id: 14, x: 87,  y: 62, title: "Mozilla Event", venue: "Instru green space" },
  { id: 15, x: 90,  y: 70, title: "Hardware Hackathon", venue: "Any 2 labs from main building 4th floor" },
  { id: 16, x: 94,  y: 74, title: "Mini Carnival", venue: "Main Quad" },
  { id: 17, x: 105, y: 77, title: "Botsprint", venue: "Instru Quad" },
  { id: 18, x: 118, y: 78, title: "Buildathon", venue: "Instru Labs" },
  { id: 19, x: 128, y: 78, title: "Trailblazers", venue: "Mechanical Circle" },
  { id: 20, x: 142, y: 75, title: "Business", venue: "KB Joshi" },
  { id: 21, x: 155, y: 67, title: "The Algorithm Human Bot", venue: "Tutorial room IT building Ground floor" },
  { id: 22, x: 155, y: 67, title: "ImpEx", venue: "Discussion Room - Main building 3rd floor" },
  { id: 23, x: 166, y: 60, title: "Math on Spot", venue: "Near Canteen" },
];

  const locations = isLaptop ? horizontalLocs : verticalLocs;

  const handleMarkerClick = (e, loc) => {
    e.stopPropagation();

    const svg = e.currentTarget.closest('svg');
    const rect = svg.getBoundingClientRect();
    const viewBox = isLaptop ? [0, 0, 177.7, 100] : [0, 0, 100, 150];
    const scaleX = rect.width / viewBox[2];
    const scaleY = rect.height / viewBox[3];

    // Pixel coords of marker tip on screen
    const markerX = loc.x * scaleX + rect.left;
    const markerY = loc.y * scaleY + rect.top;

    const safeStyle = getSafeCardStyle(markerX, markerY, isLaptop);
    setCardStyle(safeStyle);
    setActivePoint(loc);
    setAnimKey(k => k + 1); // retrigger animation
  };

  // Build the final inline style for the card.
  // We keep all CSS class styles but selectively override position + transform.
  // We re-enable the animation via a CSS class trick using animKey.
  const cardInlineStyle = activePoint ? cardStyle : {};

  return (
    <div className={`timeline-container2 ${isLaptop ? 'laptop-view' : 'mobile-view'}`}>
      <div className="map-wrapper2" onClick={() => setActivePoint(null)}>
        <svg
          viewBox={isLaptop ? "0 0 177.7 100" : "0 0 100 150"}
          className="map-svg2"
        >
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
              onClick={(e) => handleMarkerClick(e, loc)}
            >
              <circle cx={loc.x} cy={loc.y} r="4" fill="transparent" />
              <g transform={`translate(${loc.x},${loc.y})`}>
                <path
                  d="M 0,-1.2 A 1.2,1.2 0 0,1 1.2,0 Q 1.2,1.5 0,2.5 Q -1.2,1.5 -1.2,0 A 1.2,1.2 0 0,1 0,-1.2 Z"
                  className="marker-pin2"
                />
                <circle cx="0" cy="0" r="0.4" fill="white" />
              </g>
              <text x={loc.x + 5} y={loc.y - 3} className="marker-label2">
                {loc.title}
              </text>
            </g>
          ))}
        </svg>

        {activePoint && (
          <div
            key={animKey}                  // forces remount → re-runs CSS animation
            className="detail-card2"
            style={cardInlineStyle}        // overrides position + transform only
            onClick={(e) => e.stopPropagation()}
          >
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

export default Timeline2;