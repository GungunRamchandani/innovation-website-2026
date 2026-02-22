import Papa from 'papaparse';
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Card from "./Card";
import "./cards.css";

function CardGrid() {
  const location = useLocation();
  const selectedCategory = location.state?.category || null;
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
            // Map 'Event Name' to title, 'Event Description' to description, and 'Class' to frontClass
            const formattedCards = results.data.map(row => {
              // Try different possible header variations for event name
              const eventName = row['Event Name'] || row['Event_Name'] || row['event name'] || row['eventName'] || row['title'] || "Untitled Event";
              
              // Try different possible header variations for event description
              const eventDescription = row['Event Description'] || row['Event_Description'] || row['event description'] || row['eventDescription'] || row['description'] || "No description available";
              
              const category = row['Category'] || row['category'] || "Uncategorized";
              // Try different possible header variations for front class
              // You can add more variations based on your column name in Google Sheets
              const frontClass = row['Class'] || row['Front Class'] || row['frontClass'] || row['front_class'] || row['cardClass'] || row['card-class'] || "one"; // Default to "one" if not found
              
              return {
                frontClass: frontClass, // Now fetched from sheet
                title: eventName,
                description: eventDescription,
                category,

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
  }, []);
  /*function CardGrid() {
  const location = useLocation();
  const selectedCategory = location.state?.category || null; // Get passed category
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRvwQiV77nS4flE63dZnbIEWo6aZVeuDA5cgxUSqCn0I9vA_hFktZJU-GPjXMzZpnUbSAyukHZEpWhq/pub?gid=0&single=true&output=csv";

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);
        const response = await fetch(SHEET_URL);
        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            let formattedCards = results.data.map(row => {
              const eventName = row['Event Name'] || "Untitled Event";
              const eventDescription = row['Event Description'] || "No description available";
              const frontClass = row['Class'] || "one";
              const eventCategory = row['Category'] || "Uncategorized"; // <-- make sure your sheet has a Category column

              return {
                title: eventName,
                description: eventDescription,
                frontClass,
                category: eventCategory
              };
            });

            // Filter by selected category
            if (selectedCategory) {
              formattedCards = formattedCards.filter(card => card.category === selectedCategory);
            }

            setCards(formattedCards);
            setLoading(false);
          },
          error: (err) => {
            console.error("Error parsing CSV:", err);
            setError("Failed to parse sheet data.");
            setLoading(false);
          }
        });
      } catch (err) {
        console.error("Error fetching CSV:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCards();
  }, [selectedCategory]); // Re-fetch if selectedCategory changes*/

  const prev = () => setIndex((i) => (i - 1 + cards.length) % cards.length);
  const next = () => setIndex((i) => (i + 1) % cards.length);

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
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
    <div className="page">
      <div className="carousel-wrapper">
        <button className="nav-btn left" onClick={prev}>‹</button>

        <div className="carousel">
          {cards.map((card, i) => {
            let position = "hidden";

            if (i === index) position = "center";
            else if (i === (index - 1 + cards.length) % cards.length) position = "left";
            else if (i === (index + 1) % cards.length) position = "right";

            return (
              <div key={i} className={`carousel-item ${position}`}>
                <Card {...card} />
              </div>
            );
          })}
        </div>

        <button className="nav-btn right" onClick={next}>›</button>
      </div>
    </div>
  );
}

export default CardGrid;