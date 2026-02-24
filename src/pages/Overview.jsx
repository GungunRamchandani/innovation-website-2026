// pages/Overview.jsx
import React from "react";

function Overview() {
    return (
        <div style={{
            width: "100vw",
            height: "100vh",
            background: "#000",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#00ff50"
        }}>
            <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem' }}>2D OVERVIEW MAP</h1>
                <p style={{ opacity: 0.6 }}>Static navigation or dashboard goes here</p>
            </div>
        </div>
    );
}

import { useState } from "react";

// Place your image in the public folder or src folder and update path accordingly
const bgImage = "./homepage/images/city.png";

// Hotspot positions as % of container — adjust top/left to align with each dome on screen
const hotspots = [
    {
        id: "speakers",
        label: "SPEAKERS",
        top: "41%",
        left: "41%",
        description: "Meet our expert speakers for Innovation 2026.",
        path: "/speakers"
    },
    {
        id: "team",
        label: "TEAM",
        top: "41%",
        left: "60%",
        description: "Get to know the team behind Innovation 2026.",
        path: "/team"
    },
    {
        id: "events",
        label: "EVENTS",
        top: "56%",
        left: "27%",
        description: "Explore all the exciting events at Equinox 2026.",
        path: "/teams"
    },
    {
        id: "initiative",
        label: "INITIATIVE",
        top: "56%",
        left: "50%",
        description: "Discover our core initiatives driving change.",
        path: "/initiative"
    },
    {
        id: "timeline",
        label: "TIMELINE",
        top: "56%",
        left: "74%",
        description: "View the full event timeline and schedule.",
        path: "/timeline"
    },
    {
        id: "sponsors",
        label: "SPONSORS",
        top: "82%",
        left: "35%",
        width: "210px",
        height: "210px",
        description: "Meet the sponsors powering this event.",
        path: "/sponsors"
    },
    {
        id: "about",
        label: "ABOUT US",
        top: "82%",
        left: "67%",
        width: "210px",
        height: "210px",
        description: "Learn more about Cummins College of Engineering.",
        path: "/aboutus"
    },
];

export default function InnovationMap() {
    const [active, setActive] = useState(null);

    const handleClick = (spot) => {
        setActive(spot.id === active ? null : spot);
    };

    const activeSpot = hotspots.find((s) => s.id === active?.id);

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #000; overflow: hidden; }

        .hotspot {
          position: absolute;
          transform: translate(-50%, -50%);
          width: 160px;
          height: 160px;
          border-radius: 50%;
          background: transparent;
          border: none;
          cursor: pointer;
          z-index: 10;
          outline: none;
        }
        .hotspot:hover {
          background: rgba(0, 255, 247, 0.08);
        }
        .hotspot.active {
          background: rgba(0, 255, 247, 0.12);
        }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(16px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .info-panel {
          animation: fadeSlideUp 0.25s ease forwards;
        }
        .cta-btn:hover {
          background: rgba(0,255,247,0.15) !important;
        }
      `}</style>

            <div
                style={{
                    width: "100vw",
                    height: "100vh",
                    position: "fixed",
                    overflow: "hidden",
                    top: 0,               // <--- ADD THIS
                    left: 0,              // <--- ADD THIS
                    zIndex: 1,
                }}
            >
                {/* Fullscreen background image */}
                <img
                    src={bgImage}
                    alt="Innovation 2026"
                    style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                    }}
                />

                {/* Invisible clickable hotspots — no text, no design, just a transparent circle */}
                {hotspots.map((spot) => (
                    <button
                        key={spot.id}
                        className={`hotspot${active?.id === spot.id ? " active" : ""}`}
                        style={{
                            top: spot.top,
                            left: spot.left,
                            width: spot.width,
                            height: spot.height,
                        }}
                        onClick={() => handleClick(spot)}
                        aria-label={spot.label}
                    />
                ))}

                {/* Info panel shown on click */}
                {activeSpot && (
                    <div
                        className="info-panel"
                        style={{
                            position: "absolute",
                            bottom: "11%",
                            left: "50%",
                            transform: "translateX(-50%)",
                            background: "rgba(0, 8, 18, 0.88)",
                            border: "1px solid rgba(0,255,247,0.5)",
                            borderRadius: "14px",
                            padding: "28px 36px",
                            minWidth: "300px",
                            maxWidth: "380px",
                            textAlign: "center",
                            zIndex: 30,
                            boxShadow:
                                "0 0 40px rgba(0,255,247,0.2), inset 0 0 30px rgba(0,255,247,0.03)",
                            fontFamily: "'Orbitron', sans-serif",
                        }}
                    >
                        {/* Close */}
                        <button
                            onClick={() => setActive(null)}
                            style={{
                                position: "absolute",
                                top: "12px",
                                right: "16px",
                                background: "none",
                                border: "none",
                                color: "rgba(0,255,247,0.6)",
                                fontSize: "18px",
                                cursor: "pointer",
                                lineHeight: 1,
                            }}
                        >
                            ✕
                        </button>

                        {/* Glow dot */}
                        <div
                            style={{
                                width: "10px",
                                height: "10px",
                                borderRadius: "50%",
                                background: "#00fff7",
                                margin: "0 auto 14px",
                                boxShadow: "0 0 14px #00fff7, 0 0 30px rgba(0,255,247,0.4)",
                            }}
                        />

                        <h2
                            style={{
                                color: "#00fff7",
                                fontSize: "18px",
                                letterSpacing: "4px",
                                marginBottom: "10px",
                                textShadow: "0 0 12px rgba(0,255,247,0.7)",
                            }}
                        >
                            {activeSpot.label}
                        </h2>

                        <p
                            style={{
                                color: "rgba(160,232,232,0.85)",
                                fontSize: "13px",
                                lineHeight: "1.7",
                                marginBottom: "20px",
                                letterSpacing: "0.5px",
                            }}
                        >
                            {activeSpot.description}
                        </p>

                        <button
                            className="cta-btn"
                            onClick={() => window.location.href = activeSpot.path}
                            style={{
                                background: "transparent",
                                border: "1px solid rgba(0,255,247,0.6)",
                                color: "#00fff7",
                                padding: "9px 28px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontSize: "12px",
                                letterSpacing: "3px",
                                fontFamily: "'Orbitron', sans-serif",
                                transition: "background 0.2s",
                            }}
                        >
                            EXPLORE →
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
