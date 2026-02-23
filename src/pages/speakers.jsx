import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { X } from "react-bootstrap-icons";
import TrackVisibility from "react-on-screen";
import NeuralBackground from "./NeuralBackground";
import "./speaker.css";
import speaker1 from "../assets/speakers/prathamkohli.png";


const Speakers1 = () => {
    const [selectedSpeaker, setSelectedSpeaker] = useState(null);


    // The neural network renders inside a position:fixed iframe at z-index 0.
    // Any opaque background on body / #root will block it — force transparency
    // while this component is mounted, then restore on unmount.
    useEffect(() => {
        const body = document.body;
        const root = document.getElementById("root");
        const prevBodyBg = body.style.backgroundColor;
        const prevRootBg = root ? root.style.backgroundColor : "";


        body.style.backgroundColor = "transparent";
        if (root) root.style.backgroundColor = "transparent";


        return () => {
            body.style.backgroundColor = prevBodyBg;
            if (root) root.style.backgroundColor = prevRootBg;
        };
    }, []);


    const speakersData = [
        {
            id: 1,
            name: "Pratham Kohli",
            photo: speaker1,
            role: "AI Engineer at Salesforce | Ex-Amazon, ServiceNow, ISRO",
            about:
                "Pratham Kohli is an AI Engineer and one of the fastest-growing tech educators, impacting 100,000+ learners online. From working at top tech giants to mentoring students on cracking dream companies, his journey is packed with real-world insights.\n\nHe specializes in AI, full-stack development, and career growth, and is passionate about helping students achieve their dream tech roles.\n\nDon't miss this chance to learn directly from someone who has done it.",
            date: "March 1, 2026",
            time: "10:00 AM - 11:30 AM",
            venue: "Main Auditorium, Hall A",
        },
        {
            id: 2,
            name: "Prof. Michael Chen",
            photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=500",
            role: "Quantum Information Pioneer",
            about:
                "Professor Michael Chen is a renowned expert in quantum information theory and quantum cryptography. He has founded three successful startups and advises major corporations on quantum technology integration strategies.",
            date: "March 1, 2026",
            time: "2:00 PM - 3:30 PM",
            venue: "Tech Hub, Room 203",
        },
    ];


    const handleCardClick = (speaker) => setSelectedSpeaker(speaker);
    const handleCloseModal = () => setSelectedSpeaker(null);


    return (
        <section className="speakers1" id="speakers1">


            {/* Neural Network Background — rendered directly via Three.js in React */}
            <NeuralBackground />


            <Container className="speakers-container">
                <TrackVisibility>
                    {({ isVisible }) => (
                        <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>
                            <h2 className="speakers-title">Featured Speakers</h2>
                            <p className="speakers-subtitle">
                                Meet the quantum minds leading Innovation Fest 2026
                            </p>
                        </div>
                    )}
                </TrackVisibility>


                <div className="quantum-entanglement-layout">
                    {/* Entanglement beam between the two speakers */}
                    <div className="entanglement-beam">
                        <div className="beam-particle p1" />
                        <div className="beam-particle p2" />
                        <div className="beam-particle p3" />
                        <div className="beam-particle p4" />
                        <div className="beam-particle p5" />
                    </div>


                    {speakersData.map((speaker, index) => (
                        <div
                            key={speaker.id}
                            className={`quantum-speaker speaker-${index + 1}`}
                            onClick={() => handleCardClick(speaker)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === "Enter" && handleCardClick(speaker)}
                            aria-label={`View details for ${speaker.name}`}
                        >
                            {/* Orbiting electron rings */}
                            <div className="electron-ring ring-1">
                                <div className="electron" />
                            </div>
                            <div className="electron-ring ring-2">
                                <div className="electron" />
                            </div>
                            <div className="electron-ring ring-3">
                                <div className="electron" />
                            </div>


                            {/* Speaker photo */}
                            <div className="quantum-photo-wrapper">
                                <img src={speaker.photo} alt={speaker.name} />
                            </div>


                            {/* Speaker info */}
                            <div className="quantum-speaker-info">
                                <h3>{speaker.name}</h3>
                                <p>{speaker.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>


            {/* Speaker Detail Modal */}
            {selectedSpeaker && (
                <div
                    className="speaker-modal-overlay"
                    onClick={handleCloseModal}
                    role="dialog"
                    aria-modal="true"
                    aria-label={`${selectedSpeaker.name} details`}
                >
                    <div
                        className="speaker-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="modal-close"
                            onClick={handleCloseModal}
                            aria-label="Close modal"
                        >
                            <X size={24} />
                        </button>


                        <div className="modal-content">
                            <div className="modal-header">
                                <img
                                    src={selectedSpeaker.photo}
                                    alt={selectedSpeaker.name}
                                    className="modal-photo"
                                />
                                <div className="modal-header-text">
                                    <h2>{selectedSpeaker.name}</h2>
                                    <h3>{selectedSpeaker.role}</h3>
                                </div>
                            </div>


                            <div className="modal-body">
                                <div className="modal-section">
                                    <h4>About</h4>
                                    <p>{selectedSpeaker.about}</p>
                                </div>


                                <div className="modal-info-grid">
                                    <div className="info-item">
                                        <span className="info-label">Date</span>
                                        <span className="info-value">{selectedSpeaker.date}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Time</span>
                                        <span className="info-value">{selectedSpeaker.time}</span>
                                    </div>
                                    <div className="info-item full-width">
                                        <span className="info-label">Venue</span>
                                        <span className="info-value">{selectedSpeaker.venue}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};


export default Speakers1;