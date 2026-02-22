import SponsorCard from "../components/sponsors/SponsorCard";
import { sponsors } from "../components/sponsors/sponsorsData";
import "../pages/sponsors.css";

function Sponsors() {
  return (
    <div className="sponsor-page">
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