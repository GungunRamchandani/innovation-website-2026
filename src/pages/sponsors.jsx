import SponsorCard from "../components/sponsors/SponsorCard";
import { sponsors } from "../components/sponsors/sponsorsData";
import "../pages/sponsors.css";

const GlobalBackButton = ({ destinationUrl, label = "RETURN TO HOME" }) => {
  const handleBackClick = () => {
    // This will send the user to the same URL every time
    window.location.href = destinationUrl;
  };

  return (
    <button
      onClick={handleBackClick}
      style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        padding: '10px 20px',
        backgroundColor: '#111',
        color: '#66bed2', // Matches your drone/neon theme
        border: '2px solid #085d81',
        cursor: 'pointer',
        zIndex: 1000,
        fontWeight: 'bold'
      }}
    >
      ← {label}
    </button>
  );
};

function Sponsors() {
  return (
    <div className="sponsor-page">
      {/* THIS IS THE REDIRECT BUTTON */}
      <GlobalBackButton
        destinationUrl="/overview" // This redirects to your overview page
        label="BACK TO HOME"
      />
      {Object.entries(sponsors).map(([category, list]) => (
        <section key={category}>
          <h2 className={`title ${category.toLowerCase()}`}>
            {category} Sponsors
          </h2>


          <div className="grid">
            {list.map((item, i) => (
              <SponsorCard
                key={i}
                logo={item.logo}
                name={item.name}
                url={item.url}
                category={category.toLowerCase()}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}


export default Sponsors;