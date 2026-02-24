import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Calendar, ChevronLeft, ChevronRight, Clock, GeoAlt, Heart, Lightbulb, People, Trophy } from 'react-bootstrap-icons';
import WaveBackground from "../components/team/WaveBackground";
import career from "../photos/career.png";
import digital_literacy from "../photos/digital_literacy.png";
import hackathon from "../photos/hackathon.png";
import "./initiative.css";





const GlobalBackButton = ({ destinationUrl, label = "Back to Events" }) => {
    const handleBackClick = () => {
        window.location.href = destinationUrl;
    };

    return (
        <>
          

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

    // Ensure the CSS variable --header-offset matches the real header height.
    useEffect(() => {
        const setHeaderOffset = () => {
            // Try several common header selectors used across the site
            const headerEl = document.querySelector('header') || document.querySelector('.site-header') || document.querySelector('.header');
            const height = headerEl ? Math.ceil(headerEl.getBoundingClientRect().height) : 0;
            // Fallback to 120 if no header found
            const offset = height || 120;
            document.documentElement.style.setProperty('--header-offset', `${offset}px`);
        };

        setHeaderOffset();
        window.addEventListener('resize', setHeaderOffset);

        // watch for DOM changes that might affect header height (e.g., sticky class toggles)
        const obs = new MutationObserver(setHeaderOffset);
        obs.observe(document.body, { attributes: true, childList: true, subtree: true });

        return () => {
            window.removeEventListener('resize', setHeaderOffset);
            obs.disconnect();
        };
    }, []);


    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            // Only apply the header offset when we're on the home page.
            // Detect common home page paths or body class.
            const path = window.location.pathname || '';
            const isHome = path === '/' || path === '/index.html' || path.toLowerCase().includes('homepage') || document.body.classList.contains('home');
            // also treat the initiative route as a home-like page for header offset
            const isInitiative = path.toLowerCase().includes('initiative') || document.body.classList.contains('initiative');


            if (isHome) {
                // calculate header height dynamically so the target lands below the header
                const headerEl = document.querySelector('header.hero');
                const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-offset')) || 120;
                const elementTop = element.getBoundingClientRect().top + window.scrollY;
                const scrollTarget = Math.max(0, elementTop - headerHeight - 8); // small breathing room
                window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
            } else {
                // Default behavior on other pages: native scrollIntoView
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };


    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % galleryPhotos.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + galleryPhotos.length) % galleryPhotos.length);


    // ─── Initiative Data ──────────────────────────────────────────────────────
    const initiativeData = {
        title: "Navira",
        tagline: "Empowering through digital inclusion",
        introduction: {
            title: "Why This Initiative?",
            content: `In today's digital age, access to technology is not just a convenience but a necessity. However, many women, especially in underserved communities, lack the awareness and skills to navigate the digital world safely and effectively. Navira was born out of the need to bridge this digital divide and empower women with the tools and knowledge they need to thrive in the digital world.`,
        },
        impactGoals: {
            title: "Impact & Goals",
            content: `Navira is committed to reducing the digital divide by making technology accessible, understandable, and empowering for women across generations.

In an increasingly digital world, lack of awareness can limit opportunities and create vulnerability. Navira addresses this gap by equipping women with practical digital skills, financial technology awareness, and exposure to emerging innovations.

Our impact goes beyond teaching tools — we build confidence, encourage curiosity, and create safe spaces where women feel empowered to participate actively in the digital ecosystem.`,
            stats: [
                { number: "500+", label: "Women Impacted", icon: People },
                { number: "50+", label: "Sessions", icon: Lightbulb },
                { number: "100%", label: "Satisfaction", icon: Heart },
                { number: "25+", label: "Awards", icon: Trophy },
            ],
            goals: [
                "Create awareness about digital fraud, UPI safety, and secure online practices",
                "Encourage early career exploration in STEM and technology fields",
                "Foster intergenerational learning environments that support inclusivity",
                "Build long-term digital confidence and independence among women",
            ],
        },
        events: {
            sessions: [
                {
                    id: 1,
                    title: "School Girls Career Guidance Session",
                    subtitle: "Digital Literacy & Coding Fundamentals",
                    description: `Hands-on learning on emerging technologies in the college laboratories to build foundational digital skills and confidence.`,
                    date: "March 15, 2026",
                    time: "10:00 AM - 4:00 PM",
                    venue: "Cummins College of Engineering, Pune",
                    registrationLink: "",
                    image: career,
                },
                {
                    id: 2,
                    title: "Senior Citizens Digital Awareness Program",
                    subtitle: "Technology for Daily Life",
                    description: `Interactive and hands-on sessions designed to help senior citizens navigate digital tools for communication, financial transactions, and accessing essential services safely.`,
                    date: "March 22, 2026",
                    time: "2:00 PM - 5:00 PM",
                    venue: "Cummins College of Engineering, Pune",
                    registrationLink: "",
                    image: digital_literacy,
                },
            ],
            hackathon: {
                title: "All-Women Hackathon",
                subtitle: "Code for Change: Women Edition",
                description: `Hackathon focused on creating innovative solutions that address challenges faced by women in technology.Open to all women, regardless of coding experience, with mentorship and workshops leading up to the event to ensure everyone can participate and contribute meaningfully.`,
                date: "April 5-6, 2026",
                time: "See in description",
                venue: "Cummins College of Engineering, Pune",
                registrationLink: "",
                image: hackathon,
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
  <>
    <GlobalBackButton
      destinationUrl="/overview"
      label="BACK"
    />

   

    <div className="initiative-page" ref={containerRef}>

            <WaveBackground />
            

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
                    <h1 className="hero-title" data-text={initiativeData.title}>
                        {initiativeData.title}
                    </h1>
                    <br></br>
                    <span className="hero-badge">Women Empowerment Initiative</span>
                    
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
        </div>
        </>
    );
};


export default Initiative;




