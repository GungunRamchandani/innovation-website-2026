import "./CompassNavbar.css";
import compassImg from "../../assets/CompassNavbar/compass-iii.jpeg";
import { useState } from "react";

function CompassNavbar() {
  const [open, setOpen] = useState(false);

  const toggleCompass = () => {
    setOpen(!open);
  };

  return (
    <div className="compass-container">
      <div className={`guiding-light ${open ? "show" : ""}`}></div>

      <button
        id="compass-btn"
        className={open ? "active" : ""}
        onClick={toggleCompass}
      >
        <img src={compassImg} alt="Compass" />
      </button>

      <ul id="nav-menu" className={open ? "show" : ""}>
        {["Events", "Timeline", "Speakers", "Sponsors", "Team", "About Us"].map(
          (item, index) => (
            <li
              key={item}
              style={{
                transitionDelay: open ? `${index * 0.08}s` : "0s",
              }}
            >
              {item}
            </li>
          )
        )}
      </ul>
    </div>
  );
}

export default CompassNavbar;
