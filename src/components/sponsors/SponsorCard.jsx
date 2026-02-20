import "./SponsorCard.css";

function SponsorCard({ logo, name, category }) {
  return (
    <div className="sponsor-card">
      <div className="card-wrapper">
        <div className={`glow-card ${category}`}>
          
          <div className="logo-box">
            <img
              src={logo}
              alt={name}
              className="sponsor-logo"
            />
          </div>
        </div>
      </div>

      <p className="sponsor-name">{name}</p>
    </div>
  );
}

export default SponsorCard;
