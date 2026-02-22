import "./CompassNavbar.css";
import compassImg from "../../assets/CompassNavbar/compass-iii.jpeg";
import { useState } from "react";
import { Link } from "react-router-dom";

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
        {[
          { name: "Home", path: "/" },
          { name: "Events", path: "/events" },
          { name: "Timeline", path: "/timeline" },
          { name: "Speakers", path: "/speakers" },
          { name: "Initiative", path: "/initiative" },
          { name: "Sponsors", path: "/sponsors" },
          { name: "Team", path: "/teams" },
          { name: "About Us", path: "/aboutus" },
        ].map((item, index) => (
            <li
              key={item.name}
              style={{
                transitionDelay: open ? `${index * 0.08}s` : "0s",
              }}
            >
              <Link to={item.path} onClick={() => setOpen(false)}>
                {item.name}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default CompassNavbar;
