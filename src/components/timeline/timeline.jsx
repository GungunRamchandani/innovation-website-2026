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
  { id: 1, x: 85, y: 140, title: "Inauguration", venue: "Main Quadrangle" },
  { id: 2, x: 88, y: 132, title: "Software Hackathon", venue: "Mech building classrooms" },
  { id: 3, x: 85, y: 120, title: "ML Bootcamp", venue: "mech auditorium" },
  { id: 4, x: 65, y: 125, title: "Open Source Competition", venue: "main building classroom" },
  { id: 5, x: 55, y: 125, title: "AR Game", venue: "Main Building 1st floor" },
  { id: 6, x: 42, y: 122, title: "No Code Hackathon", venue: "TBD" },  
  { id: 7, x: 35, y: 118, title: "Project Exhibition", venue: "Between IT and Main Building" },
  { id: 8, x: 32, y: 110, title: "Saksham Hackathon", venue: "Main Building 2nd floor classrooms" },
  { id: 9, x: 32, y: 100, title: "Datathon (Datasprint)", venue: "Inauguration: KB Joshi auditorium" },
  { id: 10, x: 40, y: 92,  title: "Structural Showdown", venue: "Day 1: 5th floor mech or Danfoss lab 1st floor" },
  { id: 11, x: 52, y: 83,  title: "Analysis Workshop", venue: "Cerie Lab" },
  { id: 12, x: 56, y: 78,  title: "Escape Room", venue: "Mech 2nd floor" },
  { id: 13, x: 57, y: 71,  title: "Mozilla Event", venue: "Instru green space" },
  { id: 14, x: 44, y: 64,  title: "Arduino Workshop (AW)", venue: "Main building 3rd floor Lab" },
  { id: 15, x: 35, y: 58,  title: "Hardware Hackathon", venue: "Any 2 labs from main building 4th floor" },
  { id: 16, x: 35, y: 52,  title: "Mini Carnival", venue: "Main Quad" },
  { id: 17, x: 39, y: 43,  title: "Botsprint", venue: "Instru Quad" },
  { id: 18, x: 44, y: 38,  title: "Trailblazers", venue: "Mechanical Circle" },
  { id: 19, x: 45, y: 33,  title: "Business", venue: "KB Joshi" },
  { id: 20, x: 35, y: 26,  title: "The Algorithm Human Bot", venue: "Tutorial room IT building Ground floor" },
  { id: 21, x: 15, y: 5,   title: "Esports", venue: "Stumble guys - placement cell lab; BGMI - Instru quad" },
  { id: 22, x: 25, y: 25,  title: "ImpEx", venue: "Discussion Room - Main building 3rd floor" },
  { id: 23, x: 18, y: 22,  title: "Math on Spot", venue: "Near Canteen" },
];

  // Horizontal Coordinates (Custom plotted for your horizontal image path)
 const horizontalLocs = [
  { id: 1,  x: 5,   y: 46, title: "Inauguration", venue: "Main Quadrangle" },
  { id: 2,  x: 15,  y: 50, title: "Software Hackathon", venue: "Mech building classrooms" },
  { id: 3,  x: 16,  y: 55, title: "ML Bootcamp", venue: "mech auditorium" },
  { id: 4,  x: 15,  y: 59, title: "Open Source Competition", venue: "main building classroom" },
  { id: 5,  x: 25,  y: 66, title: "AR Game", venue: "Main Building 1st floor" },
  { id: 6,  x: 35,  y: 67, title: "No Code Hackathon", venue: "TBD" },
  { id: 7,  x: 48,  y: 63, title: "Project Exhibition", venue: "Between IT and Main Building" },
  { id: 8,  x: 60,  y: 60, title: "Saksham Hackathon", venue: "Main Building 2nd floor classrooms" },
  { id: 9,  x: 68,  y: 50, title: "Datathon (Datasprint)", venue: "Inauguration: KB Joshi auditorium" },
  { id: 10, x: 65,  y: 41, title: "Structural Showdown", venue: "Day 1: 5th floor mech or Danfoss lab 1st floor" },
  { id: 11, x: 75,  y: 39, title: "Analysis Workshop", venue: "Cerie Lab" },
  { id: 12, x: 85,  y: 42, title: "Escape Room", venue: "Mech 2nd floor" },
  { id: 13, x: 89,  y: 52, title: "Mozilla Event", venue: "Instru green space" },
  { id: 14, x: 87,  y: 62, title: "Arduino Workshop (AW)", venue: "Main building 3rd floor Lab" },
  { id: 15, x: 90,  y: 70, title: "Hardware Hackathon", venue: "Any 2 labs from main building 4th floor" },
  { id: 16, x: 94,  y: 74, title: "Mini Carnival", venue: "Main Quad" },
  { id: 17, x: 105, y: 77, title: "Botsprint", venue: "Instru Quad" },
  { id: 18, x: 118, y: 78, title: "Trailblazers", venue: "Mechanical Circle" },
  { id: 19, x: 128, y: 78, title: "Business", venue: "KB Joshi" },
  { id: 20, x: 142, y: 75, title: "The Algorithm Human Bot", venue: "Tutorial room IT building Ground floor" },
  { id: 21, x: 155, y: 67, title: "Esports", venue: "Stumble guys - placement cell lab; BGMI - Instru quad" },
  { id: 22, x: 155, y: 67, title: "ImpEx", venue: "Discussion Room - Main building 3rd floor" },
  { id: 23, x: 166, y: 60, title: "Math on Spot", venue: "Near Canteen" },
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