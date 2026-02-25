import Papa from 'papaparse';
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import WaveBackground from "../team/WaveBackground";
import Card from "./Card";
import "./cards.css";

function CardGrid() {
  const location = useLocation();
  const selectedCategory = location.state?.category || null;
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


const GlobalBackButton = ({ label = "Back" }) => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  const handleBackClick = () => {
    navigate(-1);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          top: isScrolled ? '30px' : '140px',
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
          transition: 'all 0.4s ease',  // smooth animation
          outline: 'none',
        }}
      >
        ← {label}
      </button>
    </>
  );
};



  // Your working CSV link (the one that downloads)
  const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRvwQiV77nS4flE63dZnbIEWo6aZVeuDA5cgxUSqCn0I9vA_hFktZJU-GPjXMzZpnUbSAyukHZEpWhq/pub?gid=0&single=true&output=csv";

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);
        console.log("Fetching from:", SHEET_URL);
        
        const response = await fetch(SHEET_URL);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const csvText = await response.text();
        console.log("CSV data received, length:", csvText.length);
        
        // Parse CSV using Papa Parse
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            console.log("Parsed data:", results.data);
            console.log("Headers found:", results.meta.fields);
            
            // Transform the data to match your card structure
            const formattedCards = results.data.map(row => {
              // Try different possible header variations for event name
              const eventName = row['Event Name'] || row['Event_Name'] || row['event name'] || row['eventName'] || row['title'] || "Untitled Event";
              
              // Try different possible header variations for event description
              const eventDescription = row['Event Description'] || row['Event_Description'] || row['event description'] || row['eventDescription'] || row['description'] || "No description available";
              
              const category = row['Category'] || row['category'] || "Uncategorized";
              
              // Try different possible header variations for front class
              const frontClass = row['Class'] || row['Front Class'] || row['frontClass'] || row['front_class'] || row['cardClass'] || row['card-class'] || "one"; // Default to "one" if not found
              
              // Check for registration link - Try different possible column names
              const registrationLink = row['Registration Link'] || 
                                      row['Registration_Link'] || 
                                      row['registration link'] || 
                                      row['Register Link'] || 
                                      row['Register_Link'] || 
                                      row['register link'] || 
                                      row['Link'] || 
                                      row['link'] ||
                                      row['Registration URL'] ||
                                      row['registration_url'] ||
                                      row['Registration'] ||
                                      row['registration'] ||
                                      null;
              
              return {
                frontClass: frontClass,
                title: eventName,
                description: eventDescription,
                category,
                registrationLink: registrationLink && registrationLink.startsWith('http') ? registrationLink : null, // Store registration link
                
                // NEW FIELDS FROM SHEET
                date: row['Date'] || "",
                teamSize: row['Team Size'] || "",
                prizePool: row['Prize Pool'] || "",
                registrationFee: row['Registration Fee'] || "",
                venue: row['Venue'] || "",
                coordinators: row['Student Coordinator'] || "",
              };
            }).filter(card => card.title !== "Untitled Event" && card.title.trim() !== ""); // Remove empty rows
            
            let filteredCards = formattedCards;

            if (selectedCategory) {
              filteredCards = formattedCards.filter(
                card =>
                  card.category?.toLowerCase() ===
                  selectedCategory?.toLowerCase()
              );
            }

            console.log("Formatted cards:", formattedCards);
            console.log("Cards with registration links:", filteredCards.map(c => ({ title: c.title, hasLink: !!c.registrationLink })));
            
            if (formattedCards.length === 0) {
              setError("No cards found in the sheet. Please check if your sheet has data.");
            } else {
              setCards(filteredCards);
              setError(null);
            }
            setLoading(false);
          },
          error: (parseError) => {
            console.error("Error parsing CSV:", parseError);
            setError("Failed to parse sheet data. Please check your sheet format.");
            setLoading(false);
          }
        });
      } catch (err) {
        console.error("Error fetching cards:", err);
        setError(err.message || "Failed to load events from Google Sheet");
        setLoading(false);
      }
    };

    fetchCards();
  }, [selectedCategory]); // Added selectedCategory to dependencies

  const prev = () => setIndex((i) => (i - 1 + cards.length) % cards.length);
  const next = () => setIndex((i) => (i + 1) % cards.length);

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <WaveBackground />
          <p>Loading Events...</p>
        </div>
      </div>
    );
  }

  // Show error if something went wrong
  if (error) {
    return (
      <div className="page">
        <div className="error-container">
          <h2>⚠️ Error Loading Events</h2>
          <p>{error}</p>
          <p>Debug info:</p>
          <ul>
            <li>URL is working (file downloads)</li>
            <li>Make sure your sheet has columns: "Event Name", "Event Description", and "Class" (for frontClass)</li>
            <li>For registration links, add a column named "Registration Link" with valid URLs</li>
            <li>Check browser console for more details (F12)</li>
          </ul>
          <button 
            className="retry-btn" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show message if no cards (sheet was empty)
  if (cards.length === 0) {
    return (
      <div className="page">
        <div className="empty-container">
          <h2>No Events Found</h2>
          <p>Your Google Sheet is empty. Please add some events with "Event Name", "Event Description", and "Class".</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <GlobalBackButton label="BACK" />
      <div className="page">
        <div className="carousel-wrapper">
          <WaveBackground />
          <button className="nav-btn left" onClick={prev}>‹</button>

          <div className="carousel">
            {cards.map((card, i) => {
              let position = "hidden";

              if (i === index) position = "center";
              else if (i === (index - 1 + cards.length) % cards.length) position = "left";
              else if (i === (index + 1) % cards.length) position = "right";

              return (
                <div key={i} className={`carousel-item ${position}`}>
                  <Card 
                    {...card} 
                    registrationLink={card.registrationLink} // Pass registration link to Card component
                  />
                </div>
              );
            })}
          </div>

          <button className="nav-btn right" onClick={next}>›</button>
        </div>
      </div>
    </>
  );
}

export default CardGrid;