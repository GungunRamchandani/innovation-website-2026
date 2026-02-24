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
          { name: "Home", path: "/" },
          { name: "Events", path: "/Events" },
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
              onClick={() => {
                setOpen(false);
                navigate(item.path);
              }}
            >
            {item.name}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default CompassNavbar;
