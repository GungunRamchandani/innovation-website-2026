import "./Footer.css";
import { FaInstagram, FaLinkedin, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="hf-footer">
      <div className="hf-address">
        MKSSS’s Cummins College of Engineering for Women<br />
        Karve Nagar, Pune – 411 052
      </div>

      <div className="hf-icons">
        <a href="https://instagram.com" target="_blank" rel="noreferrer">
          <FaInstagram />
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noreferrer">
          <FaLinkedin />
        </a>
        <a href="mailto:info@cumminscollege.in">
          <FaEnvelope />
        </a>
      </div>
    </footer>
  );
}
