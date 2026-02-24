import React from "react";

// Place your image in the public folder or src folder and update path accordingly
const bgImage = "./homepage/images/city.png";

const hotspots = [
    { id: "speakers", label: "SPEAKERS", top: "41%", left: "41%", path: "/speakers" },
    { id: "team", label: "TEAM", top: "41%", left: "60%", path: "/teams" },
    { id: "events", label: "EVENTS", top: "56%", left: "27%", path: "/events" },
    { id: "initiative", label: "INITIATIVE", top: "56%", left: "50%", path: "/initiative" },
    { id: "timeline", label: "TIMELINE", top: "56%", left: "74%", path: "/timeline" },
    {
        id: "sponsors",
        label: "SPONSORS",
        top: "82%",
        left: "35%",
        width: "210px",
        height: "210px",
        path: "/sponsors"
    },
    {
        id: "about",
        label: "ABOUT US",
        top: "82%",
        left: "67%",
        width: "210px",
        height: "210px",
        path: "/aboutus"
    },
];

export default function InnovationMap() {
    // Direct redirection function
    const handleHotspotClick = (path) => {
        window.location.href = path;
    };

    return (
        <>
            <style>{`
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
                    transition: background 0.3s ease;
                }

                /* Visual feedback so user knows it is clickable */
                .hotspot:hover {
                    background: rgba(0, 255, 247, 0.15);
                    box-shadow: 0 0 30px rgba(0, 255, 247, 0.2);
                }
            `}</style>

            <div
                style={{
                    width: "100vw",
                    height: "100vh",
                    position: "fixed",
                    overflow: "hidden",
                    top: 0,
                    left: 0,
                    zIndex: 1,
                }}
            >
                {/* Fullscreen background image */}
                <img
                    src={bgImage}
                    alt="Innovation 2026 Map"
                    style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                    }}
                />

                {/* Clickable hotspots that redirect immediately */}
                {hotspots.map((spot) => (
                    <button
                        key={spot.id}
                        className="hotspot"
                        style={{
                            top: spot.top,
                            left: spot.left,
                            width: spot.width || "160px",   // Uses custom width or default
                            height: spot.height || "160px", // Uses custom height or default
                        }}
                        onClick={() => handleHotspotClick(spot.path)}
                        aria-label={spot.label}
                    />
                ))}
            </div>
        </>
    );
}