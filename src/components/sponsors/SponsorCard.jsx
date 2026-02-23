import "./SponsorCard.css";


function SponsorCard({ logo, name, category, url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="sponsor-link"
    >
      <div className="sponsor-card">
        <div className="card-wrapper">
          <div className={`glow-card ${category}`}>
            <div className="logo-box">
              <img src={logo} alt={name} className="sponsor-logo" />
            </div>
          </div>
        </div>


        <p className="sponsor-name">{name}</p>
      </div>
    </a>
  );
}


export default SponsorCard;