import { motion, useScroll, useTransform } from "framer-motion";
import { Eye, Lightbulb, Sparkles, Target } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Globe from "../components/Aboutus/Globe";
import WaveBackground from '../components/team/WaveBackground';
import "./aboutus.css";


const GlobalBackButton = ({ destinationUrl, label = "Back to Events" }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleBackClick = () => {
    window.location.href = destinationUrl;
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Hide on mobile */}
      <style>{`
        @media (max-width: 768px) {
          .global-back-btn {
            display: none !important;
          }
        }
      `}</style>

      <button
        onClick={handleBackClick}
        className="global-back-btn"
        style={{
          position: 'fixed',
          top: isScrolled ? '30px' : '140px', // 🔥 dynamic top
          left: '30px',
          zIndex: 9999,

          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 28px',
          borderRadius: '16px',

          background:
            'linear-gradient(135deg, rgba(44, 53, 57, 0.7) 0%, rgba(12, 18, 20, 0.8) 100%)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          cursor: 'pointer',

          fontFamily: "'Inter', sans-serif",
          fontSize: '16px',
          fontWeight: '600',

          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          transition: 'top 0.4s ease, transform 0.3s ease, background 0.3s ease',
          outline: 'none'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background =
            'linear-gradient(135deg, rgba(54, 63, 67, 0.9) 0%, rgba(22, 28, 30, 0.9) 100%)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background =
            'linear-gradient(135deg, rgba(44, 53, 57, 0.7) 0%, rgba(12, 18, 20, 0.8) 100%)';
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
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>

        <span>{label}</span>
      </button>
    </>
  );
};


/* ---------------- RevealCard Component ---------------- */

const RevealCard = ({
  title,
  content,
  icon,
  gradient = "cyan",
}) => {
  const gradientClasses = {
    cyan: "from-innovation-cyan/20 to-innovation-purple/10",
    amber: "from-innovation-amber/20 to-innovation-cyan/10",
    purple: "from-innovation-purple/20 to-innovation-teal/10",
  };

  const borderClasses = {
    cyan: "border-innovation-cyan/30",
    amber: "border-innovation-amber/30",
    purple: "border-innovation-purple/30",
  };

  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl 
        bg-gradient-to-br ${gradientClasses[gradient]} 
        backdrop-blur-xl border ${borderClasses[gradient]} 
        w-full max-w-md 
        p-6 md:p-8 
        mx-auto`}
      whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
    >
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-gradient-to-b from-innovation-cyan/20 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10">
        <motion.div
          className="icon-square mb-6 w-14 h-14"
          whileHover={{ rotate: 10 }}
        >
          {icon}
        </motion.div>

        <h3 className="text-2xl font-orbitron font-bold text-foreground mb-4">
          {title}
        </h3>

        <p className="leading-relaxed text-base md:text-xl text-muted-foreground">
          {content}
        </p>
      </div>
    </motion.div>
  );
};

/* ---------------- DoubleRingSection ---------------- */

const DoubleRingSection = ({ leftContent, rightContent, sectionId }) => {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const leftRingX = useTransform(scrollYProgress, [0.2, 0.5], [0, -120]);
  const rightRingX = useTransform(scrollYProgress, [0.2, 0.5], [0, 120]);
  const ringOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);
  const ringScale = useTransform(scrollYProgress, [0.1, 0.4], [0.5, 1]);
  const contentOpacity = useTransform(scrollYProgress, [0.35, 0.5], [0, 1]);
  const contentScale = useTransform(scrollYProgress, [0.35, 0.5], [0.8, 1]);

  return (
    <>
      {/* Desktop */}
      <section
        ref={sectionRef}
        id={sectionId}
        className="flex relative w-full py-28 items-center justify-center"
      >
        {/* THIS IS THE REDIRECT BUTTON */}
        <GlobalBackButton
          destinationUrl="/overview" // This redirects to your overview page
          label="BACK"
        />
        <div className="container mx-auto px-4 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 300,
                height: 300,
                x: leftRingX,
                opacity: ringOpacity,
                scale: ringScale,
                border: "3px solid transparent",
                backgroundImage:
                  "linear-gradient(hsl(var(--background)), hsl(var(--background))), linear-gradient(135deg, hsl(var(--innovation-cyan)), hsl(var(--innovation-purple)))",
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box",
                left: -150,
                top: -150,
              }}
            />
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 300,
                height: 300,
                x: rightRingX,
                opacity: ringOpacity,
                scale: ringScale,
                border: "3px solid transparent",
                backgroundImage:
                  "linear-gradient(hsl(var(--background)), hsl(var(--background))), linear-gradient(135deg, hsl(var(--innovation-amber)), hsl(var(--innovation-purple)))",
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box",
                left: -150,
                top: -150,
              }}
            />
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 relative z-10 text-center md:text-left">
            <motion.div style={{ opacity: contentOpacity, scale: contentScale }}>
              {leftContent}
            </motion.div>
            <motion.div style={{ opacity: contentOpacity, scale: contentScale }}>
              {rightContent}
            </motion.div>
          </div>
        </div>
      </section>


    </>
  );
};

/* ---------------- MultiRingGallery ---------------- */

const MultiRingGallery = () => {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const ringRotation = useTransform(scrollYProgress, [0, 1], [0, 180]);

  return (
    <section ref={sectionRef} className="min-h-screen py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 rounded-full"
            style={{
              width: 200 + i * 150,
              height: 200 + i * 150,
              x: "-50%",
              y: "-50%",
              rotate: ringRotation,
              border: "1px solid",
              borderColor: `hsl(var(--innovation-${i % 2 === 0 ? "cyan" : "purple"}) / ${0.1 + i * 0.05})`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <h2 className="text-4xl md:text-6xl font-orbitron font-bold mb-6 text-gradient">
          Innovation Orientation
        </h2>

        <div className="flex justify-center mt-12">
          <div className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-[0_0_60px_hsl(var(--innovation-cyan)/0.3)] border border-border">
            <iframe
              src="https://www.youtube.com/embed/QUXPZWzBfRQ"
              title="Innovation Orientation"
              frameBorder="0"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

/* ---------------- MAIN COMPONENT ---------------- */

const AboutUs = () => {
  return (


    <div className="min-h-screen overflow-x-hidden">
      <br></br>
      <br></br>
      <h2 className="text-4xl md:text-6xl font-orbitron font-bold mb-6 text-center text-gradient ">
        ABOUT US
      </h2>

      
      <div className="hero-stats">

  {/* Participants Card */}
  <div className="stat-card">
    <div className="stat-icon">
      <i className="fas fa-user-friends"></i>
    </div>
    <div className="stat-content">
      <div className="stat-number">6000+</div>
      <div className="stat-label">PARTICIPANTS</div>
    </div>
    <div className="stat-glow"></div>
  </div>

  {/* Prize Pool Card */}
  <div className="stat-card">
    <div className="stat-icon">
      <i className="fas fa-trophy"></i>
    </div>
    <div className="stat-content">
      <div className="stat-number">6 Lakh+</div>
      <div className="stat-label">PRIZE POOL</div>
    </div>
    <div className="stat-glow"></div>
  </div>

  {/* Events Card */}
  <div className="stat-card">
    <div className="stat-icon">
      <i className="fas fa-calendar-check"></i>
    </div>
    <div className="stat-content">
      <div className="stat-number">30+</div>
      <div className="stat-label">EVENTS</div>
    </div>
    <div className="stat-glow"></div>
  </div>

</div>


      <DoubleRingSection
        sectionId="innovation-cummins"
        leftContent={
          <RevealCard
            title="INNOVATION 2026"
            content="The annual national-level technical fest inspiring creativity."
            icon={<Sparkles className="w-6 h-6 text-innovation-cyan" />}
          />
        }
        rightContent={
          <RevealCard
            title="MKSSS Cummins College of Engineering"
            content="Empowering women in technology and fostering innovation."
            icon={<Lightbulb className="w-6 h-6 text-innovation-amber" />}
            gradient="amber"
          />
        }
      />

      <DoubleRingSection
        sectionId="aim-vision"
        leftContent={
          <RevealCard
            title="Our Mission"
            content="To ignite curiosity and foster creativity among students."
            icon={<Target className="w-6 h-6 text-innovation-purple" />}
            gradient="purple"
          />
        }
        rightContent={
          <RevealCard
            title="Our Vision"
            content="Creating a world where technology empowers everyone."
            icon={<Eye className="w-6 h-6 text-innovation-cyan" />}
          />
        }
      />


      <h2 className="text-4xl md:text-6xl font-orbitron font-bold mb-1 text-center text-gradient ">
        IMAGE GALLERY
      </h2>

      {/* Globe Section */}
      <section className="w-full py-2 md:py-8  flex justify-center">
        <WaveBackground />
        <div className="w-full max-w-6xl">
          <Globe />
        </div>
      </section>
      <MultiRingGallery />

    </div>
  );
};

export default AboutUs;
