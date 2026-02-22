import { useState, useEffect, useCallback, useRef } from "react";
import { useProgress } from "@react-three/drei";

export function CityLoaderScreen({ onReady }) {
  const { progress, loaded, total } = useProgress();
  const [pct, setPct] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [hidden, setHidden] = useState(false);
  const doneRef = useRef(false);

  const [alreadyLoaded] = useState(() => sessionStorage.getItem('city_initialized') === 'true');

  if (alreadyLoaded || done) {
    sessionStorage.setItem('city_initialized', 'true');
    return null;
  }

  // Keep displayed % always moving forward
  useEffect(() => {
    setPct((p) => Math.max(p, Math.round(progress)));
  }, [progress]);

  const hide = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setFadeOut(true);
    setTimeout(() => {
      setHidden(true);
      onReady?.();
    }, 800);
  }, [onReady]);

  useEffect(() => {
    if (progress >= 100) hide();
  }, [progress, hide]);
  // Hard cap — never stuck beyond 15 s
  useEffect(() => {
    const t = setTimeout(hide, 15000);
    return () => clearTimeout(t);
  }, [hide]);

  if (hidden) return null;

  const bars = Math.floor((pct / 100) * 20);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(ellipse at 60% 40%, #0a1a0a 0%, #000d00 60%, #000 100%)",
        transition: "opacity 0.8s ease",
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? "none" : "all",
      }}
    >
      {/* Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "linear-gradient(rgba(0,255,80,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,80,0.04) 1px,transparent 1px)",
          backgroundSize: "40px 40px",
          animation: "lsGridPulse 4s ease-in-out infinite",
        }}
      />
      {/* Glow orb */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          pointerEvents: "none",
          background:
            "radial-gradient(circle,rgba(0,255,80,0.06) 0%,transparent 70%)",
          animation: "lsOrbPulse 3s ease-in-out infinite",
        }}
      />

      {/* Hex spinner */}
      <div style={{ position: "relative", marginBottom: 44 }}>
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          style={{ animation: "lsSpin 6s linear infinite", display: "block" }}
        >
          <polygon
            points="60,8 104,34 104,86 60,112 16,86 16,34"
            fill="none"
            stroke="rgba(0,255,80,0.6)"
            strokeWidth="2"
            strokeDasharray="8 4"
          />
          <polygon
            points="60,20 94,39 94,81 60,100 26,81 26,39"
            fill="none"
            stroke="rgba(0,255,80,0.22)"
            strokeWidth="1"
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
            filter: "drop-shadow(0 0 14px rgba(0,255,80,0.9))",
            animation: "lsIconPulse 2s ease-in-out infinite",
          }}
        >
          🏙️
        </div>
      </div>

      <div
        style={{
          fontFamily: "'Courier New',monospace",
          fontSize: 12,
          letterSpacing: "0.5em",
          color: "rgba(0,255,80,0.5)",
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      >
        Initializing World
      </div>
      <div
        style={{
          fontFamily: "'Courier New',monospace",
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: "0.18em",
          color: "#00ff50",
          textShadow: "0 0 20px rgba(0,255,80,0.7)",
          marginBottom: 44,
          textTransform: "uppercase",
        }}
      >
        City Loading
      </div>

      {/* Progress bars */}
      <div style={{ display: "flex", gap: 3, marginBottom: 18 }}>
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            style={{
              width: 14,
              height: 28,
              borderRadius: 2,
              background:
                i < bars ? "rgba(0,255,80,0.9)" : "rgba(0,255,80,0.07)",
              border: "1px solid rgba(0,255,80,0.18)",
              transition: "background 0.25s ease",
              boxShadow: i < bars ? "0 0 8px rgba(0,255,80,0.55)" : "none",
            }}
          />
        ))}
      </div>

      <div
        style={{
          fontFamily: "'Courier New',monospace",
          fontSize: 40,
          fontWeight: 700,
          color: "#00ff50",
          textShadow: "0 0 28px rgba(0,255,80,0.8)",
          lineHeight: 1,
          marginBottom: 10,
        }}
      >
        {pct}
        <span style={{ fontSize: 17, color: "rgba(0,255,80,0.55)" }}>%</span>
      </div>
      <div
        style={{
          fontFamily: "'Courier New',monospace",
          fontSize: 10,
          color: "rgba(0,255,80,0.38)",
          letterSpacing: "0.22em",
          marginBottom: 28,
        }}
      >
        {loaded} / {total} ASSETS
      </div>
      <LoaderTicker progress={pct} />

      <style>{`
        @keyframes lsGridPulse  { 0%,100%{opacity:.6} 50%{opacity:1} }
        @keyframes lsOrbPulse   { 0%,100%{transform:scale(1);opacity:.5} 50%{transform:scale(1.13);opacity:1} }
        @keyframes lsSpin       { to{transform:rotate(360deg)} }
        @keyframes lsIconPulse  { 0%,100%{transform:scale(1)} 50%{transform:scale(1.07)} }
        @keyframes lsTicker     { 0%{opacity:0;transform:translateY(6px)} 15%{opacity:1;transform:translateY(0)} 85%{opacity:1} 100%{opacity:0} }
        @keyframes bannerDot    { 0%,80%,100%{transform:scaleY(.35)} 40%{transform:scaleY(1)} }
      `}</style>
    </div>
  );
}

function LoaderTicker({ progress }) {
  const msgs = [
    "Compiling shaders…",
    "Loading terrain…",
    "Placing mountains…",
    "Growing trees…",
    "Laying roads…",
    "Initializing domes…",
    "Baking lighting…",
    "Almost there…",
  ];
  const msg =
    msgs[Math.min(Math.floor((progress / 100) * msgs.length), msgs.length - 1)];
  return (
    <div
      style={{
        fontFamily: "'Courier New',monospace",
        fontSize: 10,
        color: "rgba(0,255,80,0.5)",
        letterSpacing: "0.18em",
        height: 18,
        overflow: "hidden",
      }}
    >
      <span
        key={msg}
        style={{ display: "block", animation: "lsTicker 2.2s ease forwards" }}
      >
        ▸ {msg.toUpperCase()}
      </span>
    </div>
  );
}
