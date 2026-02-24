import { useState } from "react";
import { useNavigate } from "react-router-dom";
import compassImg from "../../assets/CompassNavbar/compass-iii.jpeg";
import "./CompassNavbar.css";


function CompassNavbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const toggleCompass = () => {
    setOpen(!open);
  };

  const handleNavigation = (item) => {
    setOpen(false);

    // Check if the item is "Home"
    if (item.name === "Home") {
      // If screen width is less than 768px (mobile), go to "/", else go to "/overview"
      const path = window.innerWidth <= 768 ? "/" : "/overview";
      navigate(path);
    } else {
      navigate(item.path);
    }
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
      <h3 className="menu-heading">MENU</h3>
      <ul id="nav-menu" className={open ? "show" : ""}>
        {[
          { name: "Home", path: "/overview" }, // This path is now the desktop default
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
            onClick={() => handleNavigation(item)}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CompassNavbar;
