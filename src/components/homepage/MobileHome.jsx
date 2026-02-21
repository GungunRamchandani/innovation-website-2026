import { useNavigate } from "react-router-dom";

export default function MobileHome() {
  const navigate = useNavigate();

  return (
    <div style={containerStyle}>
      {/* Background */}
      <img src="/images/city-bg.jpeg" alt="bg" style={bgStyle} />
      <div style={overlayStyle} />

      {/* Foreground PNG (rings + connectors) */}
      <img
        src="/images/foreground2.png"
        alt="foreground"
        style={foregroundStyle}
      />

      {/* ICONS INSIDE CIRCLES */}
      <IconNode
        top="13%"
        left="60%"
        icon="/images/icon_3.png"
        onClick={() => navigate("/timeline")}
      />
      <IconNode
        top="27.5%"
        left="34%"
        icon="/images/icon_2.png"
        onClick={() => navigate("/speakers")}
      />
      <IconNode
        top="41%"
        left="59.5%"
        icon="/images/icon_0.png"
        onClick={() => navigate("/events")}
      />
      <IconNode
        top="53%"
        left="34%"
        icon="/images/icon_1.png"
        onClick={() => navigate("/sponsors")}
      />
      <IconNode
        top="64.5%"
        left="60%"
        icon="/images/icon_5.png"
        onClick={() => navigate("/initiative")}
      />
      <IconNode
        top="76.5%"
        left="34%"
        icon="/images/icon_6.png"
        onClick={() => navigate("/initiative")}
      />
      <IconNode
        top="89%"
        left="59.5%"
        icon="/images/icon_4.png"
        onClick={() => navigate("/initiative")}
      />
      <TextLabel top="13%" left="35%" text="TIMELINE" />
      <TextLabel top="27%" left="58%" text="TEAM" />
      <TextLabel top="41%" left="35%" text="EVENTS" />
      <TextLabel top="53%" left="58%" text="SPEAKERS" />
      <TextLabel top="65%" left="35%" text="SPONSORS" />
      <TextLabel top="77%" left="58%" text="INITIATIVE" />
      <TextLabel top="88%" left="35%" text="ABOUT US" />
    </div>
  );
}

/* ---------------- ICON NODE ---------------- */

function TextLabel({ text, top, left }) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        transform: "translate(-50%, -50%)",
        fontFamily: "Poppins, sans-serif",
        fontSize: "14px",
        fontWeight: 600,
        color: "#7FFFD4",
        letterSpacing: "1.5px",
        textShadow: "0 0 12px rgba(0,255,220,0.6)",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
}

function IconNode({ top, left, icon, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        position: "absolute",
        top,
        left,
        transform: "translate(-50%, -50%)",
        width: "80px",
        height: "80px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "30px",
        cursor: "pointer",
        zIndex: 3,
        transition: "transform 0.3s ease",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = "translate(-50%, -50%) scale(1.1)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.transform = "translate(-50%, -50%) scale(1)")
      }
    >
      {typeof icon === "string" && icon.startsWith("/") ? (
        <img src={icon} alt="icon" style={{ width: "55px", height: "55px" }} />
      ) : (
        <span style={{ fontSize: "40px" }}>{icon}</span>
      )}
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const containerStyle = {
  position: "relative",
  width: "100vw",
  height: "100vh",
  overflow: "hidden",
};

/* Background darker for better blending */
const bgStyle = {
  position: "absolute",
  width: "100%",
  height: "100%",
  objectFit: "cover",
  filter: "brightness(0.45) blur(0.3px)",
  transform: "scale(1.05)",
  zIndex: 0,
};

/* Slight teal overlay to match glow theme */
const overlayStyle = {
  position: "absolute",
  inset: 0,
  background: "linear-gradient(rgba(0,255,200,0.08), rgba(0,255,200,0.08))",
  zIndex: 1,
};

/* Foreground toned down slightly */
const foregroundStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  zIndex: 2,
  pointerEvents: "none",
  filter: "brightness(0.9)", // reduced intensity
};
