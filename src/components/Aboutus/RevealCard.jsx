import { motion } from "framer-motion";

// ---------------- RevealCard Component ----------------
const RevealCard = ({
  title,
  content,
  icon,
  gradient = "cyan",
  delay = 0,
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
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.3 },
      }}
    >
      {/* Glow effect */}
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
        <p className="text-muted-foreground leading-relaxed text-sm">
          {content}
        </p>
      </div>
    </motion.div>
  );
};

export default RevealCard;