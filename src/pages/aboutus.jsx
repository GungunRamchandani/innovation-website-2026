import { motion, useScroll, useTransform } from "framer-motion";
import { Eye, Lightbulb, Sparkles, Target } from "lucide-react";
import { useRef } from "react";
import Globe from "../components/Aboutus/Globe";
import WaveBackground from '../components/team/WaveBackground';
import "./aboutus.css";


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
        className="hidden md:flex relative w-full py-28 items-center justify-center"
      >
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

      {/* Mobile */}
      <section className="flex flex-col md:hidden items-center gap-12 py-16">
        {[leftContent, rightContent].map((content, idx) => (
          <div key={idx} className="w-11/12">
            {content}
          </div>
        ))}
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
       <WaveBackground />
      <DoubleRingSection
        sectionId="innovation-cummins"
        leftContent={
          <RevealCard
            title="INNOVATION"
            content="The annual national-level technical fest inspiring creativity."
            icon={<Sparkles className="w-6 h-6 text-innovation-cyan" />}
          />
        }
        rightContent={
          <RevealCard
            title="CUMMINS"
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
            title="Our Aim"
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

     
       <h2 className="text-4xl md:text-6xl font-orbitron font-bold mb-6 text-center text-gradient ">
          IMAGE GALLERY 
        </h2>

      {/* Globe Section */}
      <section className="w-full py-24 flex justify-center">
        <div className="w-full max-w-6xl">
          <Globe />
        </div>
      </section>
 <MultiRingGallery />

      <footer className="py-8 border-t border-border/50 text-center">
        <p className="text-muted-foreground text-sm">
          © 2026 Innovation — MKSSS's Cummins College of Engineering for Women, Pune
        </p>
      </footer>
    </div>
  );
};

export default AboutUs;
