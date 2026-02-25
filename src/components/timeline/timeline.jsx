import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './timeline2.css';
import roadVertical from '../../assets/timeline-photos/road3.png';
import roadHorizontal from '../../assets/timeline-photos/horizontal road.jpeg';

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRvwQiV77nS4flE63dZnbIEWo6aZVeuDA5cgxUSqCn0I9vA_hFktZJU-GPjXMzZpnUbSAyukHZEpWhq/pub?gid=0&single=true&output=csv"; 

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
  { id: 4,  x: 85, y: 120 },
  { id: 5,  x: 72, y: 116 },
  { id: 7,  x: 62, y: 123 },
  { id: 8, x: 46, y: 127 },
  { id: 10, x: 35, y: 120 },
  { id: 11, x: 32, y: 110 },
  { id: 12, x: 32, y: 100 },
  { id: 17, x: 40, y: 92  },
  { id: 18, x: 60, y: 82 },
  { id: 19, x: 48, y: 78  },
  { id: 21, x: 62, y: 71  },
  { id: 22, x: 49, y: 64  },
  { id: 23, x: 39, y: 58  },
  { id: 25, x: 29, y: 52  },
  { id: 26, x: 39, y: 43  },
  { id: 30, x: 44, y: 36  },
  { id: 31, x: 45, y: 27  },
  { id: 33, x: 35, y: 22  },
  { id: 35, x: 17, y: 24},
];

// Horizontal Coordinates
const horizontalLocs = [
  { id: 1,  x: 8,   y: 41 },
  { id: 3,  x: 15,  y: 45 },
  { id: 4,  x: 16,  y: 53 },
  { id: 5,  x: 15,  y: 61 },
  { id: 7,  x: 24,  y: 65 },
  { id: 8, x: 38,  y: 67 },
  { id: 10, x: 48,  y: 61 },
  { id: 11, x: 60,  y: 58 },
  { id: 12, x: 68,  y: 50 },
  { id: 17, x: 65,  y: 41 },
  { id: 18, x: 75,  y: 33 },
  { id: 19, x: 85,  y: 42 },
  { id: 21, x: 89,  y: 52 },
  { id: 22, x: 87,  y: 62 },
  { id: 23, x: 90,  y: 70 },
  { id: 25, x: 96,  y: 73 },
  { id: 26, x: 105, y: 76 },
  { id: 30, x: 118, y: 77 },
  { id: 31, x: 128, y: 75 },
  { id: 33, x: 144, y: 73},
  { id: 35, x: 158, y: 66 },
];

  // Logic to find live data from the CSV based on Sr. No 
  const currentCoords = isLaptop ? horizontalLocs : verticalLocs;
  const locations = currentCoords.map(loc => {
    const liveRow = sheetData.find(row => parseInt(row['Sr. No']) === loc.id);
    return {
      ...loc,
      title: liveRow ? liveRow['Event Name'] : "Loading...", 
      venue: liveRow ? liveRow['Venue'] : "Loading Venue...",
      time: liveRow ? liveRow['Time'] : '' 
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
                       <button 
  className="register-btn2"
  onClick={() => {
    // 1. Define your internal base URL
    const baseUrl = "/events/info"; 
    
    // 2. Format the title for the URL (e.g., "Software Hackathon" -> "software-hackathon")
    const eventSlug = activePoint.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with dashes
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes

    // 3. Redirect to internal page
    window.location.href = `${baseUrl}/${eventSlug}`;
  }}
>
  More info
</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline;