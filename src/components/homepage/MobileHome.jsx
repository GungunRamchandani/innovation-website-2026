import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";

/* ─── Nav config ─────────────────────────────────────────────── */
const NAV_ITEMS = [
  {
    icon: "/homepage/images/icon_3.png",
    label: "TIMELINE",
    route: "/timeline",
    side: "right",
  },
  {
    icon: "/homepage/images/icon_2.png",
    label: "TEAM",
    route: "/teams",
    side: "left",
  },
  {
    icon: "/homepage/images/icon_0.png",
    label: "EVENTS",
    route: "/events",
    side: "right",
  },
  {
    icon: "/homepage/images/icon_1.png",
    label: "SPEAKERS",
    route: "/speakers",
    side: "left",
  },
  {
    icon: "/homepage/images/icon_5.png",
    label: "SPONSORS",
    route: "/sponsors",
    side: "right",
  },
  {
    icon: "/homepage/images/icon_6.png",
    label: "INITIATIVE",
    route: "/initiative",
    side: "left",
  },
  {
    icon: "/homepage/images/icon_4.png",
    label: "ABOUT US",
    route: "/aboutus",
    side: "right",
  },
];

export default function MobileHome() {
  const navigate = useNavigate();
  const wrapRef = useRef(null);
  const [dim, setDim] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setDim({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { w, h } = dim;

  /* ── Compute node centres ────────────────────────────────── */
  // vertical range: 10% → 92% of screen height
  const TOP_START = 0.1;
  const TOP_END = 0.92;

  const nodes = NAV_ITEMS.map((item, i) => {
    const frac = i / (NAV_ITEMS.length - 1);
    const cy = h * (TOP_START + frac * (TOP_END - TOP_START));
    const cx = item.side === "right" ? w * 0.63 : w * 0.34;
    return { ...item, cx, cy };
  });

  // Ring radius: responsive but capped
  const ICON_R = Math.min(Math.max(w * 0.105, 28), 60);
  const RING_W = Math.max(2, ICON_R * 0.14);
  const LINE_W = Math.max(1, w * 0.004);

  return (
    <div ref={wrapRef} style={styles.container}>
      {/* ── Background image ── */}
      <img src="/homepage/images/city-bg.jpeg" alt="bg" style={styles.bg} />
      <div style={styles.overlay} />

      {/* ── SVG: lines + rings ── */}
      {w > 0 && (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={styles.svg}>
          <defs>
            {/* Glow for lines and rings */}
            <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="3"
                result="blur"
              />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Metallic ring shimmer */}
            <linearGradient id="metalRing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="25%" stopColor="#c0c0c0" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#6e6e6e" stopOpacity="0.9" />
              <stop offset="75%" stopColor="#b0b0b0" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
            </linearGradient>

            {/* Inner circle dark fill */}
            <radialGradient id="innerFill" cx="38%" cy="32%" r="68%">
              <stop offset="0%" stopColor="#00382a" stopOpacity="0.97" />
              <stop offset="100%" stopColor="#000c09" stopOpacity="1" />
            </radialGradient>

            {/* Outer halo */}
            <radialGradient id="halo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00ffc8" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#00ffc8" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* ── Connector lines (edge-to-edge, not centre-to-centre) ── */}
          {nodes.slice(0, -1).map((n, i) => {
            const next = nodes[i + 1];
            const dx = next.cx - n.cx;
            const dy = next.cy - n.cy;
            const len = Math.sqrt(dx * dx + dy * dy);
            const ux = dx / len;
            const uy = dy / len;
            return (
              <line
                key={`ln-${i}`}
                x1={n.cx + ux * (ICON_R + 2)}
                y1={n.cy + uy * (ICON_R + 2)}
                x2={next.cx - ux * (ICON_R + 2)}
                y2={next.cy - uy * (ICON_R + 2)}
                stroke="#c0c0c0"
                strokeWidth={LINE_W}
                strokeOpacity="0.6"
                filter="url(#glow)"
              />
            );
          })}

          {/* ── Circles ── */}
          {nodes.map((n, i) => (
            <g key={`nd-${i}`}>
              {/* Halo glow */}
              <circle cx={n.cx} cy={n.cy} r={ICON_R * 1.6} fill="url(#halo)" />
              {/* Dark inner fill (behind ring so ring overlaps edge) */}
              <circle cx={n.cx} cy={n.cy} r={ICON_R} fill="url(#innerFill)" />
              {/* Metallic outer ring */}
              <circle
                cx={n.cx}
                cy={n.cy}
                r={ICON_R}
                fill="none"
                stroke="url(#metalRing)"
                strokeWidth={RING_W}
                filter="url(#glow)"
              />
              {/* Thin inner accent ring */}
            </g>
          ))}
        </svg>
      )}

      {/* ── Icons + Labels ── */}
      {w > 0 &&
        nodes.map((n, i) => {
          const iconSize = ICON_R * 1.5;
          const isRight = n.side === "right";
          // Label sits on the OPPOSITE side of the icon
          const labelStyle = {
            position: "absolute",
            top: n.cy,
            transform: "translateY(-50%)",
            fontFamily: "'Poppins', sans-serif",
            fontSize: `clamp(9px, ${w * 0.034}px, 13px)`,
            fontWeight: 700,
            color: "#e0e0e0",

            letterSpacing: "1.5px",
            textShadow:
              "0 0 10px rgba(200,200,200,0.8), 0 0 22px rgba(255,255,255,0.3)",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 5,
            // if icon is on the right, label is on the left (right-aligned)
            ...(isRight
              ? { right: w - (n.cx - ICON_R * 1.35), textAlign: "right" }
              : { left: n.cx + ICON_R * 1.35, textAlign: "left" }),
          };

          return (
            <div key={`item-${i}`}>
              {/* Clickable icon button */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => navigate(n.route)}
                onKeyDown={(e) => e.key === "Enter" && navigate(n.route)}
                style={{
                  position: "absolute",
                  left: n.cx - iconSize / 2,
                  top: n.cy - iconSize / 2,
                  width: iconSize,
                  height: iconSize,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  zIndex: 5,
                  borderRadius: "50%",
                  transition: "transform 0.22s ease, filter 0.22s ease",
                  WebkitTapHighlightColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.14)";
                  e.currentTarget.style.filter =
                    "drop-shadow(0 0 10px #00ffcc)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.filter = "none";
                }}
                onTouchStart={(e) => {
                  e.currentTarget.style.transform = "scale(1.1)";
                  e.currentTarget.style.filter = "drop-shadow(0 0 8px #00ffcc)";
                }}
                onTouchEnd={(e) => {
                  setTimeout(() => {
                    if (e.currentTarget) {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.filter = "none";
                    }
                  }, 150);
                }}
              >
                <img
                  src={n.icon}
                  alt={n.label}
                  draggable={false}
                  style={{
                    width: "120%",
                    height: "120%",
                    objectFit: "contain",
                    filter: "drop-shadow(0 0 6px rgba(0,255,180,0.8))",
                    userSelect: "none",
                  }}
                />
              </div>

              {/* Label */}
              <div style={labelStyle}>{n.label}</div>
            </div>
          );
        })}
    </div>
  );
}

/* ─── Base styles ─────────────────────────────────────────────── */
const styles = {
  container: {
    position: "relative",
    width: "100%",
    maxWidth: "430px",
    height: "100dvh",
    margin: "0 auto",
    overflow: "hidden",
    background: "#000e0a",
  },
  bg: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
    filter: "brightness(0.6)",
    zIndex: 0,
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg,rgba(0,18,12,0.6) 0%,rgba(0,8,6,0.25) 50%,rgba(0,18,12,0.65) 100%)",
    zIndex: 1,
  },
  svg: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 2,
    pointerEvents: "none",
  },
};
