// pages/Overview.jsx
import React from "react";

export default function Overview() {
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