import { useEffect, useRef, useState } from 'react';
//import dashboardImg from "../assets/image.png";
import Papa from 'papaparse';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../styles/InfoPage.css';
import { useParams } from "react-router-dom";



function InfoPage() {
  const location = useLocation();
  const navigate = useNavigate();
  //const { title, description, backgroundClass } = location.state || {};
  

// const title = location.state?.title || "Events";
const { eventName } = useParams();
 if (!eventName) {
  return <div className="info-page">Invalid Event</div>;
}


const formatTitle = (slug) => {
  if (!slug) return "Events";
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

// const title =
//   formatTitle(eventName) ||
//   location.state?.title ||
//   "Events";
const title = formatTitle(eventName);
  
// const description = location.state?.description || "";
// const backgroundClass = location.state?.backgroundClass || "";
  
  const canvasRef = useRef(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initiativeImage, setInitiativeImage] = useState(null);
  
  // Your published EventDetails sheet URL
  const DETAILS_SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRvwQiV77nS4flE63dZnbIEWo6aZVeuDA5cgxUSqCn0I9vA_hFktZJU-GPjXMzZpnUbSAyukHZEpWhq/pub?gid=0&single=true&output=csv";
  
  // Helper function to determine text length category for dynamic font sizing
  const getTextLengthCategory = (text) => {
    if (!text) return 'medium';
    const length = text.toString().length;
    if (length < 10) return 'short';
    if (length < 20) return 'medium';
    return 'long';
  };

 const GlobalBackButton = ({ label = "Back" }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // 👈 go one step back in history
  };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .global-back-btn {
            display: none !important;
          }
        }
      `}</style>

      <button
        onClick={handleBackClick}
        className="global-back-btn"
        style={{
          position: 'fixed',
          top: '30px',
          left: '30px',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 28px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(44, 53, 57, 0.7) 0%, rgba(12, 18, 20, 0.8) 100%)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          cursor: 'pointer',
          fontFamily: "'Inter', sans-serif",
          fontSize: '16px',
          fontWeight: '600',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          transition: 'all 0.3s ease-in-out',
          outline: 'none'
        }}
      >
        ← {label}
      </button>
    </>
  );
};


  // Fetch event details from Google Sheets
  useEffect(() => {
    setLoading(true);
    setEventDetails(null);
    setError(null);
    setInitiativeImage(null);

    const fetchEventDetails = async () => {
      if (!eventName) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Add timestamp to bypass cache
        const url = `${DETAILS_SHEET_URL}&t=${Date.now()}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            console.log("Event details fetched:", results.data);
            
            // Clean and compare titles
            /*const cleanTitle = title.trim().toLowerCase();
            
            const event = results.data.find(row => {
              const rowTitle = (row['Event Name'] || row['Event_Name'] || row['event name'] || row['title'] || row.Title || "").trim().toLowerCase();
              return rowTitle === cleanTitle;
            });*/
            const cleanTitle = title.trim().toLowerCase();

/*const event = results.data.find(row => {
  const rowTitle =
    (row['Event Name'] ||
      row['Event_Name'] ||
      row['event name'] ||
      row['title'] ||
      row.Title ||
      "")
      .toString()
      .trim()
      .toLowerCase();

  return rowTitle.includes(cleanTitle); // more flexible matching
});*/
const normalize = (str) =>
  str
    ?.toString()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();

const cleanTitleNormalized = normalize(title);

const event = results.data.find(row => {
  const rowTitleRaw =
    row['Event Name'] ||
    row['Event_Name'] ||
    row['event name'] ||
    row['title'] ||
    row.Title ||
    "";

  const rowTitleNormalized = normalize(rowTitleRaw);

  return (
    rowTitleNormalized === cleanTitleNormalized ||
    rowTitleNormalized.includes(cleanTitleNormalized) ||
    cleanTitleNormalized.includes(rowTitleNormalized)
  );
});
            
            if (event) {
              // Check for initiative image link
              const initiativeLink = event['Initiative link'] || event['Initiative'] || event['initiative'] || event.initiative || null;
              
              if (initiativeLink && initiativeLink.trim() !== "" && initiativeLink.startsWith('http')) {
                setInitiativeImage(initiativeLink.trim());
              } else {
                setInitiativeImage(null);
              }
              
              setEventDetails({
                date: event['Day & Time'] || event['Day_&_Time'] || event['day & time'] || event.date || event.Date || "TBA",
                venue: event['Finalized Venues'] || event['Finalized_Venues'] || event['finalized venues'] || event.venue || event.Venue || "TBA",
                teamSize: event['Team Size'] || event['Team_Size'] || event['team size'] || "N/A",
                noOfTeams: event['No. of Teams'] || event['No_of_Teams'] || event['no of teams'] || "N/A",
                prizePool: event['Prize Pool'] || event['Prize_Pool'] || event['prize pool'] || "N/A",
                registrationFee: event['Registration Fees/team'] || event['Registration_Fees/team'] || event['registration fees/team'] || "N/A",
                studentCoordinator: event['Student Coordinator'] || event['Student_Coordinator'] || event['student coordinator'] || "N/A",
                facultyCoordinator: event['Faculty Coordinator'] || event['Faculty_Coordinator'] || event['faculty coordinator'] || "N/A",
                detailedDescription: event['Event Description'] || event['Event_Description'] || event['event description']
              });
              setError(null);
            } else {
              setError(`No additional details found for "${title}"`);
              setInitiativeImage(null);
            }
            setLoading(false);
          },
          error: (parseError) => {
            console.error("Error parsing event details:", parseError);
            setError("Failed to parse event details");
            setLoading(false);
          }
        });
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventName]);

  // Matrix animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    //if (!canvas) return;
    if (!canvas || !canvas.getContext) return;

    const ctx = canvas.getContext('2d');
    let animationId;

    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };

    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const fontSize = 14;
    let columns;
    let drops = [];

    function initMatrix() {
      resizeCanvas();
      columns = Math.floor(canvas.width / fontSize);
      drops = [];
      for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * canvas.height / fontSize);
      }
    }

    function draw() {
      ctx.fillStyle = 'rgba(10, 12, 16, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#00f5ff';
      ctx.font = `${fontSize}px 'Fira Code', monospace`;
      
      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        
        ctx.fillText(char, x, y);
        
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    function animate() {
      draw();
      animationId = requestAnimationFrame(animate);
    }

    initMatrix();
    animate();

    window.addEventListener('resize', initMatrix);

    return () => {
      window.removeEventListener('resize', initMatrix);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Floating particles
  /*useEffect(() => {
    const container = document.querySelector('.hack-particles');
    if (!container) return;

    const particleCount = 20;
    const chars = ['0', '1', '{', '}', '[', ']', '<', '>', '/', '*'];

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.textContent = chars[Math.floor(Math.random() * chars.length)];
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 8}s`;
      particle.style.animationDuration = `${6 + Math.random() * 4}s`;
      container.appendChild(particle);
    }

    return () => {
      container.innerHTML = '';
    };
  }, []);
*/
useEffect(() => {
  const timeout = setTimeout(() => {
    const container = document.querySelector('.hack-particles');
    if (!container) return;

    const particleCount = 20;
    const chars = ['0', '1', '{', '}', '[', ']', '<', '>', '/', '*'];

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.textContent = chars[Math.floor(Math.random() * chars.length)];
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 8}s`;
      particle.style.animationDuration = `${6 + Math.random() * 4}s`;
      container.appendChild(particle);
    }
  }, 0);

  return () => clearTimeout(timeout);
}, []);
  const handleBackClick = () => {
    navigate(-1);
  };

  // Helper function to format coordinator names
  const formatCoordinatorNames = (names) => {
    if (!names || names === "N/A") return [];
    return names.split('\n').map(name => name.trim()).filter(name => name);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="info-page">
        
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading Event Details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="info-page">
     
    <GlobalBackButton
      label="BACK"
    />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg">
          <canvas ref={canvasRef} className="matrix-canvas"></canvas>
          <div className="grid-overlay"></div>
          <div className="scan-line"></div>
          <div className="hack-particles"></div>
        </div>
        
        <div className="hero-container">
          <div className="hero-content">
            {/* Event Title and Details */}
            {title && (
              <div className="event-title-container fade-in">
                <h1 className="event-title">
                  {title ? title.toUpperCase(): "EVENTS"}
                </h1>
                
                {/* Detailed Description - Right under title */}
                {eventDetails?.detailedDescription && (
                  <div className="detailed-description-block">
                    <p className="detailed-description-text">
                      {eventDetails.detailedDescription}
                    </p>
                  </div>
                )}
                
                {/* Error message if no details found */}
                {error && !eventDetails && (
                  <div className="error-message-small">
                    <p>{error}</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Event Info Cards - All details from sheet */}
            {eventDetails && (
              <>
                {/* Primary Stats Row - Date, Team Size, Prize Pool, Registration Fee */}
                <div className="hero-stats">
                  {/* Date Card */}
                  <div className="stat-card">
                    <div className="stat-icon">
                      <i className="fas fa-calendar-alt"></i>
                    </div>
                    <div className="stat-content">
                      <div 
                        className="stat-number" 
                        data-length={getTextLengthCategory(eventDetails.date)}
                      >
                        {eventDetails.date}
                      </div>
                      <div className="stat-label">DATE & TIME</div>
                    </div>
                    <div className="stat-glow"></div>
                  </div>
                  
                  {/* Team Size Card */}
                  <div className="stat-card">
                    <div className="stat-icon">
                      <i className="fas fa-users"></i>
                    </div>
                    <div className="stat-content">
                      <div 
                        className="stat-number" 
                        data-length={getTextLengthCategory(eventDetails.teamSize)}
                      >
                        {eventDetails.teamSize}
                      </div>
                      <div className="stat-label">TEAM SIZE</div>
                    </div>
                    <div className="stat-glow"></div>
                  </div>

                  {/* Prize Pool Card - Only if not N/A */}
                  {eventDetails.prizePool && eventDetails.prizePool !== "N/A" && eventDetails.prizePool !== "NA" && (
                    <div className="stat-card">
                      <div className="stat-icon">
                        <i className="fas fa-trophy"></i>
                      </div>
                      <div className="stat-content">
                        <div 
                          className="stat-number" 
                          data-length={getTextLengthCategory(eventDetails.prizePool)}
                        >
                          ₹{eventDetails.prizePool}
                        </div>
                        <div className="stat-label">PRIZE POOL</div>
                      </div>
                      <div className="stat-glow"></div>
                    </div>
                  )}

                  {/* Registration Fee Card - Only if not N/A */}
                  {eventDetails.registrationFee && eventDetails.registrationFee !== "N/A" && eventDetails.registrationFee !== "NA" && (
                    <div className="stat-card">
                      <div className="stat-icon">
                        <i className="fas fa-tag"></i>
                      </div>
                      <div className="stat-content">
                        <div 
                          className="stat-number" 
                          data-length={getTextLengthCategory(eventDetails.registrationFee)}
                        >
                          ₹{eventDetails.registrationFee}
                        </div>
                        <div className="stat-label">REGISTRATION FEE</div>
                      </div>
                      <div className="stat-glow"></div>
                    </div>
                  )}
                </div>

                {/* Professional Info Block - Only show on LEFT when initiative image EXISTS */}
                {initiativeImage && (
                  <div className="professional-info-block left-side-block">
                    <div className="info-grid">
                      {/* Venue Card */}
                      {eventDetails.venue && (
                        <div className="info-item">
                          <div className="info-icon">
                            <i className="fas fa-map-marker-alt"></i>
                          </div>
                          <div className="info-details">
                            <div className="info-label">VENUE</div>
                            <div className="info-value" data-length={getTextLengthCategory(eventDetails.venue)}>
                              {eventDetails.venue}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Student Coordinator Card */}
                      {formatCoordinatorNames(eventDetails.studentCoordinator).length > 0 && (
                        <div className="info-item coordinator-item">
                          <div className="info-icon">
                            <i className="fas fa-user-graduate"></i>
                          </div>
                          <div className="info-details">
                            <div className="info-label">STUDENT COORDINATOR</div>
                            <div className="coordinator-list">
                              {formatCoordinatorNames(eventDetails.studentCoordinator).map((name, index) => (
                                <span key={index} >{name}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Faculty Coordinator Card */}
                      {formatCoordinatorNames(eventDetails.facultyCoordinator).length > 0 && (
                        <div className="info-item coordinator-item">
                          <div className="info-icon">
                            <i className="fas fa-chalkboard-teacher"></i>
                          </div>
                          <div className="info-details">
                            <div className="info-label">FACULTY COORDINATOR</div>
                            <div className="coordinator-list">
                              {formatCoordinatorNames(eventDetails.facultyCoordinator).map((name, index) => (
                                <span key={index} className="coordinator-badge faculty-badge">{name}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Decorative elements */}
                    <div className="block-glow"></div>
                    <div className="block-corner top-left"></div>
                    <div className="block-corner top-right"></div>
                    <div className="block-corner bottom-left"></div>
                    <div className="block-corner bottom-right"></div>
                  </div>
                )}
              </>
            )}
            
           
          </div>
          
          
          {/* RIGHT SIDE - Changes based on initiative image */}
          <div className="hero-visual">
            {initiativeImage ? (
              /* Case 1: Initiative image EXISTS - Show monitor */
              <div className="security-monitor">
                <div className="monitor-frame">
                  <div className="monitor-screen">
                    <div className="screen-content">
                      <div className="screen-header">
                        <div className="screen-dots">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                        <div className="screen-title">EVENT INITIATIVE</div>
                      </div>
                      <div className="screen-body">
                        <img
                          src={initiativeImage}
                          alt="Event Initiative"
                          className="initiative-image"
                          onError={(e) => {
                            // If image fails to load, hide the entire monitor
                            e.target.closest('.security-monitor').style.display = 'none';
                            // Force a re-render to adjust layout
                            window.dispatchEvent(new Event('resize'));
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="monitor-stand"></div>
                </div>
                <div className="floating-icons">
                  <div className="float-icon icon-1">
                    <i className="fas fa-calendar-alt"></i>
                  </div>
                  <div className="float-icon icon-2">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="float-icon icon-3">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="float-icon icon-4">
                    <i className="fas fa-clock"></i>
                  </div>
                </div>
              </div>
            ) : (
              /* Case 2: NO initiative image - Show venue/coordinator block on RIGHT */
              eventDetails && (
                <div className="professional-info-block right-side-block">
                  <div className="info-grid">
                    {/* Venue Card */}
                    {eventDetails.venue && (
                      <div className="info-item">
                        <div className="info-icon">
                          <i className="fas fa-map-marker-alt"></i>
                        </div>
                        <div className="info-details">
                          <div className="info-label">VENUE</div>
                          <div className="info-value" data-length={getTextLengthCategory(eventDetails.venue)}>
                            {eventDetails.venue}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Student Coordinator Card */}
                    {formatCoordinatorNames(eventDetails.studentCoordinator).length > 0 && (
                      <div className="info-item coordinator-item">
                        <div className="info-icon">
                          <i className="fas fa-user-graduate"></i>
                        </div>
                        <div className="info-details">
                          <div className="info-label">STUDENT COORDINATOR</div>
                          <div className="coordinator-list">
                            {formatCoordinatorNames(eventDetails.studentCoordinator).map((name, index) => (
                              <span key={index} className="coordinator-badge">{name}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Faculty Coordinator Card */}
                    {formatCoordinatorNames(eventDetails.facultyCoordinator).length > 0 && (
                      <div className="info-item coordinator-item">
                        <div className="info-icon">
                          <i className="fas fa-chalkboard-teacher"></i>
                        </div>
                        <div className="info-details">
                          <div className="info-label">FACULTY COORDINATOR</div>
                          <div className="coordinator-list">
                            {formatCoordinatorNames(eventDetails.facultyCoordinator).map((name, index) => (
                              <span key={index} className="coordinator-badge faculty-badge">{name}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                   {/* Buttons */}
            <div className="hero-buttons">
              <button className="btn btn-primary">
                <span>Register Now</span>
                <i className="fas fa-arrow-right"></i>
                <div className="btn-shine"></div>
              </button>
             
            </div>
                  
                  {/* Decorative elements */}
                  <div className="block-glow"></div>
                  <div className="block-corner top-left"></div>
                  <div className="block-corner top-right"></div>
                  <div className="block-corner bottom-left"></div>
                  <div className="block-corner bottom-right"></div>
                </div>

                
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default InfoPage;