import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './timeline2.css';
import roadVertical from '../../assets/timeline-photos/road3.png';
import roadHorizontal from '../../assets/timeline-photos/horizontal road.jpeg';

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS849usCcQ4dSmg1iQqhm_OmtJs97jk8986SmHaFWCs6cFNKXokNWLgsOxQ5XHMV35wPdziLmW0LkcT/pub?gid=0&single=true&output=csv"; 

const CARD_HEIGHT_ESTIMATE = 260; 
const EDGE_PADDING = 12;

function getSafeCardStyle(markerX, markerY, isLaptop) {
  const cardWidth = isLaptop ? 320 : 280;
  const cardHeight = CARD_HEIGHT_ESTIMATE;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let left = markerX;
  let top = markerY;
  let translateX = '-50%';
  let translateY = '-100%';

  const cardLeft = markerX - cardWidth / 2;
  const cardRight = markerX + cardWidth / 2;

  if (cardLeft < EDGE_PADDING) {
    left = EDGE_PADDING;
    translateX = '0%';
  } else if (cardRight > vw - EDGE_PADDING) {
    left = vw - EDGE_PADDING - cardWidth;
    translateX = '0%';
  }

  if (markerY - cardHeight < EDGE_PADDING) {
    top = markerY + 24;
    translateY = '0%';
  }

  const wouldBottom = top + (translateY === '0%' ? cardHeight : 0);
  if (wouldBottom > vh - EDGE_PADDING) {
    top = vh - EDGE_PADDING - cardHeight;
    translateY = '0%';
  }

  return {
    top: `${top}px`,
    left: `${left}px`,
    transform: `translate(${translateX}, ${translateY})`,
  };
}

const Timeline = () => {
  const [activePoint, setActivePoint] = useState(null);
  const [cardStyle, setCardStyle] = useState({});
  const [isLaptop, setIsLaptop] = useState(window.innerWidth > 768);
  const [animKey, setAnimKey] = useState(0);
  const [sheetData, setSheetData] = useState([]);

  useEffect(() => {
    const fetchSheetData = () => {
      Papa.parse(SHEET_URL, {
        download: true,
        header: true,
        complete: (results) => setSheetData(results.data),
        error: (error) => console.error("Error fetching sheet:", error)
      });
    };

    fetchSheetData();
    const handleResize = () => {
      setIsLaptop(window.innerWidth > 768);
      setActivePoint(null);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Simplified: Only IDs and Coordinates
  // Your Coordinates (IDs match Sr. No in Sheet)
const verticalLocs = [
  { id: 1,  x: 75, y: 142 },
  { id: 3,  x: 88, y: 132 },
  { id: 5,  x: 85, y: 120 },
  { id: 6,  x: 72, y: 116 },
  { id: 9,  x: 62, y: 123 },
  { id: 10, x: 46, y: 127 },
  { id: 12, x: 35, y: 120 },
  { id: 13, x: 32, y: 110 },
  { id: 14, x: 32, y: 100 },
  { id: 18, x: 40, y: 92  },
  { id: 19, x: 60, y: 82 },
  { id: 20, x: 48, y: 78  },
  { id: 21, x: 62, y: 71  },
  { id: 22, x: 49, y: 64  },
  { id: 23, x: 39, y: 58  },
  { id: 24, x: 29, y: 52  },
  { id: 25, x: 39, y: 43  },
  { id: 28, x: 44, y: 36  },
  { id: 29, x: 45, y: 27  },
  { id: 30, x: 35, y: 22  },
  { id: 31, x: 15, y: 5   },
  { id: 32, x: 17, y: 24},
  { id: 33, x: 18, y: 15  },
];

// Horizontal Coordinates
const horizontalLocs = [
  { id: 1,  x: 5,   y: 40 },
  { id: 3,  x: 15,  y: 45 },
  { id: 5,  x: 16,  y: 53 },
  { id: 6,  x: 15,  y: 61 },
  { id: 9,  x: 24,  y: 65 },
  { id: 10, x: 33,  y: 69 },
  { id: 12, x: 45,  y: 61 },
  { id: 13, x: 60,  y: 58 },
  { id: 14, x: 68,  y: 50 },
  { id: 18, x: 65,  y: 41 },
  { id: 19, x: 75,  y: 33 },
  { id: 20, x: 85,  y: 42 },
  { id: 21, x: 89,  y: 52 },
  { id: 22, x: 87,  y: 62 },
  { id: 23, x: 90,  y: 70 },
  { id: 24, x: 96,  y: 74 },
  { id: 25, x: 105, y: 77 },
  { id: 28, x: 118, y: 78 },
  { id: 29, x: 128, y: 73 },
  { id: 30, x: 142, y: 76},
  { id: 31, x: 155, y: 67 },
  { id: 32, x: 155, y: 67 },
  { id: 33, x: 166, y: 60 },
];

  // Logic to find live data from the CSV based on Sr. No 
  const currentCoords = isLaptop ? horizontalLocs : verticalLocs;
  const locations = currentCoords.map(loc => {
    const liveRow = sheetData.find(row => parseInt(row['Sr. No']) === loc.id);
    return {
      ...loc,
      title: liveRow ? liveRow['Event Name'] : "Loading...", 
      venue: liveRow ? liveRow['Venue'] : "Loading Venue...",
      time: liveRow ? liveRow['Day & Time'] : '' 
    };
  });

  const handleMarkerClick = (e, loc) => {
    e.stopPropagation();
    const svg = e.currentTarget.closest('svg');
    const rect = svg.getBoundingClientRect();
    const viewBox = isLaptop ? [0, 0, 177.7, 100] : [0, 0, 100, 150];
    
    const markerX = (loc.x / viewBox[2]) * rect.width + rect.left;
    const markerY = (loc.y / viewBox[3]) * rect.height + rect.top;

    setCardStyle(getSafeCardStyle(markerX, markerY, isLaptop));
    setActivePoint(loc);
    setAnimKey(k => k + 1);
  };

  return (
    <div className="timeline-container2">
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
              key={`${loc.id}-${loc.title}`}
              className={`marker-group2 ${activePoint?.id === loc.id ? 'active' : ''}`}
              onClick={(e) => handleMarkerClick(e, loc)}
            >
              <circle cx={loc.x} cy={loc.y} r="5" fill="transparent" />
              <g transform={`translate(${loc.x},${loc.y})`}>
                <path d="M 0,-1.5 A 1.5,1.5 0 0,1 1.5,0 Q 1.5,2 0,3.5 Q -1.5,2 -1.5,0 A 1.5,1.5 0 0,1 0,-1.5 Z" className="marker-pin2" />
                <circle cx="0" cy="0" r="0.5" fill="white" />
              </g>
              <text x={loc.x + 3} y={loc.y - 3} className="marker-label2">{loc.title}</text>
            </g>
          ))}
        </svg>

        {activePoint && (
          <div
            key={animKey}
            className="detail-card2"
            style={cardStyle}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-btn2" onClick={() => setActivePoint(null)}>×</button>
            <div className="card-header2">
              <span className="id-badge2">{activePoint.id}</span>
              <h3>{activePoint.title}</h3>
            </div>
            <p className="venue-text"><strong>Venue:</strong> {activePoint.venue}</p>
           {activePoint.time && <p className="venue-text" style={{color: '#fff', fontSize: '0.75rem', opacity: 0.8, fontWeight: 'bold'}}>Time: {activePoint.time}</p>}
           <button className="register-btn2">More info</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline;