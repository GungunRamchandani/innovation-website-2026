import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Calendar, Clock, GeoAlt, People, Heart, Lightbulb, Trophy, ChevronLeft, ChevronRight } from 'react-bootstrap-icons';
import "./initiative.css";

// Import event photos
import eventPhoto1 from "../photos/images.jpg";
import eventPhoto2 from "../photos/images1.jpg";
import eventPhoto3 from "../photos/images2.jpg";
import eventPhoto4 from "../photos/images3.jpg";
import eventPhoto5 from "../photos/images4.jpg";
import eventPhoto6 from "../photos/images5.jpg";

const GlobalBackButton = ({ destinationUrl, label = "Back to Events" }) => {
    const handleBackClick = () => {
        window.location.href = destinationUrl;
    };

    return (
        <>
            {/* Media Query to hide on mobile (screens smaller than 768px) */}
            <style>{`
        @media (max-width: 768px) {
          .global-back-btn {
            display: none !important;
          }
        }
      `}</style>

            <button
                onClick={handleBackClick}
                className="global-back-btn" // Added class name here
                style={{
                    // Positioning
                    position: 'fixed',
                    top: '30px',
                    left: '30px',
                    zIndex: 9999,

                    // Layout & Shape
                    display: 'flex', // This is overridden by the media query on mobile
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 28px',
                    borderRadius: '16px',

                    // Glassmorphism Styling
                    background: 'linear-gradient(135deg, rgba(44, 53, 57, 0.7) 0%, rgba(12, 18, 20, 0.8) 100%)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    cursor: 'pointer',

                    // Typography
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '16px',
                    fontWeight: '600',

                    // Effects
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                    transition: 'all 0.3s ease-in-out',
                    outline: 'none'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(54, 63, 67, 0.9) 0%, rgba(22, 28, 30, 0.9) 100%)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(44, 53, 57, 0.7) 0%, rgba(12, 18, 20, 0.8) 100%)';
                    e.currentTarget.style.transform = 'translateY(0)';
                }}
            >
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>

                <span>{label}</span>
            </button>
        </>
    );
};

const Initiative = () => {
    const [activeSection, setActiveSection] = useState(0);
    const [currentSlide, setCurrentSlide] = useState(0);
    const containerRef = useRef(null);

    // Sections for side navigation
    const sections = [
        { id: "hero", label: "Home" },
        { id: "introduction", label: "Why" },
        { id: "impact", label: "Impact" },
        { id: "events", label: "Events" },
        { id: "gallery", label: "Gallery" },
    ];

    // Gallery photos for slider
    const galleryPhotos = [
        { src: eventPhoto1, alt: "Workshop Session 1", caption: "Empowering Through Code" },
        { src: eventPhoto2, alt: "Workshop Session 2", caption: "Building Digital Skills" },
        { src: eventPhoto3, alt: "Hackathon Event", caption: "Innovation in Action" },
        { src: eventPhoto4, alt: "Training Session", caption: "Learning Together" },
        { src: eventPhoto5, alt: "Award Ceremony", caption: "Celebrating Success" },
        { src: eventPhoto6, alt: "Community Gathering", caption: "Stronger Together" },
    ];

    // Auto-slide for gallery
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % galleryPhotos.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [galleryPhotos.length]);

    // Interactive bubble background — follows mouse
    useEffect(() => {
        const bubble = document.querySelector(".interactive");
        let x = 0, y = 0, tx = 0, ty = 0;
        const move = () => {
            x += (tx - x) / 20;
            y += (ty - y) / 20;
            if (bubble) {
                bubble.style.transform = `translate(${x}px, ${y}px)`;
            }
            requestAnimationFrame(move);
        };
        const handleMouseMove = (e) => {
            tx = e.clientX;
            ty = e.clientY;
        };
        window.addEventListener("mousemove", handleMouseMove);
        move();
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // Track active section on scroll
    useEffect(() => {
        const handleScroll = () => {
            const sectionElements = sections.map((s) => document.getElementById(s.id));
            const scrollPosition = window.scrollY + window.innerHeight / 3;

            sectionElements.forEach((section, index) => {
                if (section) {
                    const top = section.offsetTop;
                    const bottom = top + section.offsetHeight;
                    if (scrollPosition >= top && scrollPosition < bottom) {
                        setActiveSection(index);
                    }
                }
            });
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [sections]);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % galleryPhotos.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + galleryPhotos.length) % galleryPhotos.length);

    // ─── Initiative Data ──────────────────────────────────────────────────────
    const initiativeData = {
        title: "Women in Tech Initiative",
        tagline: "Empowering Women Through Technology & Innovation",
        introduction: {
            title: "Why This Initiative?",
            content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.`,
        },
        impactGoals: {
            title: "Impact & Goals",
            content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel justo eu mi scelerisque vulputate. Aliquam in metus eu lectus aliquet egestas.

Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec lacinia eros non enim mattis.`,
            stats: [
                { number: "500+", label: "Women Impacted", icon: People },
                { number: "50+", label: "Sessions", icon: Lightbulb },
                { number: "100%", label: "Satisfaction", icon: Heart },
                { number: "25+", label: "Awards", icon: Trophy },
            ],
            goals: [
                "Bridge the digital divide for underserved women communities",
                "Provide hands-on technology training and mentorship",
                "Create sustainable pathways for career development",
                "Foster a supportive community of women in technology",
            ],
        },
        events: {
            sessions: [
                {
                    id: 1,
                    title: "Adivasi Girls Tech Workshop",
                    subtitle: "Digital Literacy & Coding Fundamentals",
                    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus luctus urna sed urna ultricies ac tempor dui sagittis. In condimentum facilisis porta.

Nulla fringilla, orci ac euismod semper, magna diam porttitor mauris, quis sollicitudin sapien justo in libero.`,
                    date: "March 15, 2026",
                    time: "10:00 AM - 4:00 PM",
                    venue: "Community Center, Tribal Area",
                    registrationLink: "",
                    image: eventPhoto1,
                },
                {
                    id: 2,
                    title: "Old Age Home Women Program",
                    subtitle: "Technology for Daily Life",
                    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.

Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Vestibulum ac diam sit amet quam vehicula elementum.`,
                    date: "March 22, 2026",
                    time: "2:00 PM - 5:00 PM",
                    venue: "Sunshine Old Age Home",
                    registrationLink: "",
                    image: eventPhoto2,
                },
            ],
            hackathon: {
                title: "All-Women Hackathon",
                subtitle: "Code for Change: Women Edition",
                description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Sed porttitor lectus nibh.

Pellentesque in ipsum id orci porta dapibus. Donec sollicitudin molestie malesuada. Vivamus magna justo, lacinia eget consectetur sed.`,
                date: "April 5-6, 2026",
                time: "24-Hour Hackathon",
                venue: "Innovation Hub, Main Campus",
                prizes: ["1st Place: $5000", "2nd Place: $3000", "3rd Place: $1500"],
                registrationLink: "",
                image: eventPhoto3,
            },
        },
    };

    // ─── Framer Motion Variants ───────────────────────────────────────────────
    const fadeInUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
    };

    const staggerChildren = {
        visible: { transition: { staggerChildren: 0.1 } },
    };

    // ─── JSX ──────────────────────────────────────────────────────────────────
    return (
        <div className="initiative-page" ref={containerRef}>
            {/* THIS IS THE REDIRECT BUTTON */}
            <GlobalBackButton
                destinationUrl="/overview" // This redirects to your overview page
                label="BACK TO HOME"
            />
            {/* ── Animated Gradient Background ── */}
            <div className="gradient-bg">
                <div className="g1" />
                <div className="g2" />
                <div className="g3" />
                <div className="g4" />
                <div className="g5" />
                <div className="interactive" />
            </div>

            {/* ── Side Navigation HUD ── */}
            <nav className="side-nav">
                <div className="nav-line">
                    <div
                        className="nav-progress"
                        style={{ height: `${((activeSection + 1) / sections.length) * 100}%` }}
                    />
                </div>

                {sections.map((section, index) => (
                    <button
                        key={section.id}
                        className={`nav-dot ${activeSection === index ? "active" : ""}`}
                        onClick={() => scrollToSection(section.id)}
                        aria-label={`Navigate to ${section.label}`}
                    >
                        <span className="nav-label">{section.label}</span>
                        <span className="dot" />
                    </button>
                ))}
            </nav>

            {/* ── Hero ── */}
            <section id="hero" className="hero-section">
                <div className="hero-bg-pattern" />

                <motion.div
                    className="hero-content"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="hero-badge">Women Empowerment Initiative</span>
                    <h1 className="hero-title" data-text={initiativeData.title}>
                        {initiativeData.title}
                    </h1>
                    <p className="hero-tagline">{initiativeData.tagline}</p>

                    <div className="hero-cta">
                        <a href="#events" className="cta-btn primary">
                            Explore Events <ArrowRight />
                        </a>
                        <a href="#introduction" className="cta-btn secondary">
                            Learn More
                        </a>
                    </div>
                </motion.div>

                <div className="hero-scroll-indicator">
                    <span>Scroll</span>
                    <div className="scroll-line" />
                </div>
            </section>

            {/* ── Introduction ── */}
            <section id="introduction" className="content-section intro-section">
                <div className="section-container">
                    <motion.div
                        className="section-header"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeInUp}
                    >
                        <span className="section-number">01</span>
                        <h2>{initiativeData.introduction.title}</h2>
                    </motion.div>

                    <motion.div
                        className="intro-content"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        {initiativeData.introduction.content.split("\n\n").map((p, i) => (
                            <p key={i}>{p}</p>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── Impact & Goals ── */}
            <section id="impact" className="content-section impact-section">
                <div className="section-container">
                    <motion.div
                        className="section-header"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <span className="section-number">02</span>
                        <h2>{initiativeData.impactGoals.title}</h2>
                    </motion.div>

                    <motion.div
                        className="impact-text"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        {initiativeData.impactGoals.content.split("\n\n").map((p, i) => (
                            <p key={i}>{p}</p>
                        ))}
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        className="stats-grid"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerChildren}
                    >
                        {initiativeData.impactGoals.stats.map((stat, i) => (
                            <motion.div key={i} className="stat-card" variants={fadeInUp}>
                                <stat.icon className="stat-icon" />
                                <span className="stat-number">{stat.number}</span>
                                <span className="stat-label">{stat.label}</span>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Goals list */}
                    <motion.div
                        className="goals-grid"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerChildren}
                    >
                        <h3>Our Goals</h3>
                        <ul>
                            {initiativeData.impactGoals.goals.map((goal, i) => (
                                <motion.li key={i} variants={fadeInUp}>
                                    <span className="goal-marker">{String(i + 1).padStart(2, "0")}</span>
                                    {goal}
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </section>

            {/* ── Events ── */}
            <section id="events" className="content-section events-section">
                <div className="section-container">
                    <motion.div
                        className="section-header"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <span className="section-number">03</span>
                        <h2>Our Events</h2>
                    </motion.div>

                    {/* Sessions */}
                    <div className="events-subsection">
                        <h3 className="subsection-title">
                            <Calendar /> Sessions
                        </h3>

                        {initiativeData.events.sessions.map((session, idx) => (
                            <motion.div
                                key={session.id}
                                className="event-card"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeInUp}
                            >
                                <div className="event-image">
                                    <img src={session.image} alt={session.title} />
                                    <div className="event-overlay" />
                                </div>

                                <div className="event-content">
                                    <span className="event-tag">Session {idx + 1}</span>
                                    <h4>{session.title}</h4>
                                    <p className="event-subtitle">{session.subtitle}</p>

                                    <div className="event-description">
                                        {session.description.split("\n\n").map((p, i) => (
                                            <p key={i}>{p}</p>
                                        ))}
                                    </div>

                                    <div className="event-meta">
                                        <div className="meta-item">
                                            <Calendar size={14} />
                                            <span>{session.date}</span>
                                        </div>
                                        <div className="meta-item">
                                            <Clock size={14} />
                                            <span>{session.time}</span>
                                        </div>
                                        <div className="meta-item">
                                            <GeoAlt size={14} />
                                            <span>{session.venue}</span>
                                        </div>
                                    </div>

                                    <a href={session.registrationLink || "#"} className="register-btn">
                                        Register Now <ArrowRight size={14} />
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Hackathon */}
                    <div className="events-subsection hackathon-subsection">
                        <h3 className="subsection-title">
                            <Trophy /> Hackathon
                        </h3>

                        <motion.div
                            className="hackathon-card"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                        >
                            <div className="hackathon-hero">
                                <img
                                    src={initiativeData.events.hackathon.image}
                                    alt={initiativeData.events.hackathon.title}
                                />
                                <div className="hackathon-overlay">
                                    <span className="featured-tag">Featured Event</span>
                                    <h4>{initiativeData.events.hackathon.title}</h4>
                                    <p>{initiativeData.events.hackathon.subtitle}</p>
                                </div>
                            </div>

                            <div className="hackathon-body">
                                <div className="hackathon-description">
                                    {initiativeData.events.hackathon.description.split("\n\n").map((p, i) => (
                                        <p key={i}>{p}</p>
                                    ))}
                                </div>

                                <div className="hackathon-info">
                                    <div className="hackathon-meta">
                                        <div className="meta-item">
                                            <Calendar size={16} />
                                            <span>{initiativeData.events.hackathon.date}</span>
                                        </div>
                                        <div className="meta-item">
                                            <Clock size={16} />
                                            <span>{initiativeData.events.hackathon.time}</span>
                                        </div>
                                        <div className="meta-item">
                                            <GeoAlt size={16} />
                                            <span>{initiativeData.events.hackathon.venue}</span>
                                        </div>
                                    </div>

                                    <div className="prizes">
                                        <h5>Prizes</h5>
                                        <div className="prize-list">
                                            {initiativeData.events.hackathon.prizes.map((prize, i) => (
                                                <div
                                                    key={i}
                                                    className={`prize-item rank-${i + 1}`}
                                                >
                                                    <Trophy size={16} />
                                                    <span>{prize}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <a
                                    href={initiativeData.events.hackathon.registrationLink || "#"}
                                    className="register-btn hackathon-btn"
                                >
                                    Register for Hackathon <ArrowRight size={16} />
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Gallery ── */}
            <section id="gallery" className="content-section gallery-section">
                <div className="section-container">
                    <motion.div
                        className="section-header"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <span className="section-number">04</span>
                        <h2>Event Gallery</h2>
                    </motion.div>

                    <div className="gallery-slider">
                        <div className="slider-container">
                            {/* Corner accents */}
                            <span className="corner-accent tl" />
                            <span className="corner-accent br" />

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentSlide}
                                    className="slide"
                                    initial={{ opacity: 0, x: 80 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -80 }}
                                    transition={{ duration: 0.45, ease: "easeInOut" }}
                                >
                                    <img
                                        src={galleryPhotos[currentSlide].src}
                                        alt={galleryPhotos[currentSlide].alt}
                                    />
                                    <div className="slide-caption">
                                        <span>{galleryPhotos[currentSlide].caption}</span>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <button className="slider-btn prev" onClick={prevSlide} aria-label="Previous slide">
                            <ChevronLeft />
                        </button>
                        <button className="slider-btn next" onClick={nextSlide} aria-label="Next slide">
                            <ChevronRight />
                        </button>

                        <div className="slider-dots">
                            {galleryPhotos.map((_, i) => (
                                <button
                                    key={i}
                                    className={`dot ${currentSlide === i ? "active" : ""}`}
                                    onClick={() => setCurrentSlide(i)}
                                    aria-label={`Go to slide ${i + 1}`}
                                />
                            ))}
                        </div>

                        {/* Slide counter (hidden via CSS by default) */}
                        <div className="slider-counter">
                            <span className="current">{String(currentSlide + 1).padStart(2, "0")}</span>
                            <span className="separator">/</span>
                            <span className="total">{String(galleryPhotos.length).padStart(2, "0")}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="cta-section">
                <div className="section-container">
                    <motion.div
                        className="cta-content"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <h2>Be Part of the Change</h2>
                        <p>Join our mission to empower women through technology</p>
                        <div className="cta-buttons">
                            <a href="#" className="cta-btn primary large">
                                Get Involved <ArrowRight />
                            </a>
                            <a href="#" className="cta-btn secondary large">
                                Contact Us
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

        </div>
    );
};

export default Initiative;
