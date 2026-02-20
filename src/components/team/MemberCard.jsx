import { motion } from 'framer-motion';
import { Github, Linkedin, Instagram, Cpu } from 'lucide-react';

export default function MemberCard({ member, index, variant = "large" }) {
  // variant: "large" for Technical Panel, "small" for Development Team
  const isSmall = variant === "small";
  const cardHeight = isSmall ? "h-[320px]" : "h-[400px]";
  const nameSize = isSmall ? "text-lg" : "text-2xl";
  const iconSize = isSmall ? "w-4 h-4" : "w-5 h-5";
  const iconPadding = isSmall ? "p-2" : "p-2.5";

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.5,
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      className={`group w-full ${cardHeight}`}
    >
      <div className="relative w-full h-full rounded-2xl overflow-hidden border border-primary/20 bg-card/40 backdrop-blur-sm box-glow group-hover:border-primary/50 transition-colors">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 z-10" />

        {/* Image */}
        <img
          src={member.imageUrl}
          alt={member.name}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105"
        />

        {/* Overlay Content */}
        <div className="absolute bottom-0 left-0 w-full p-6 z-20">
          {/* Role badge */}
          <div className="flex items-center gap-2 mb-2">
            <div className="h-[2px] w-8 bg-primary shadow-[0_0_10px_#0FB9B1]" />
            <span className="text-primary font-mono text-xs tracking-[0.2em] uppercase">
              {member.role}
            </span>
          </div>

          {/* Name */}
          <h3 className={`font-display ${nameSize} text-white mb-3 group-hover:text-glow transition-all`}>
            {member.name}
          </h3>

          {/* Social Icons */}
          <div className="flex gap-3">
            {member.instagram && (
              <a
                href={member.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={`${iconPadding} rounded-lg border border-white/10 bg-white/5 hover:bg-primary/20 hover:border-primary hover:text-primary text-white/70 transition-all duration-300 hover:scale-110`}
                onClick={(e) => e.stopPropagation()}
              >
                <Instagram className={iconSize} />
              </a>
            )}
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={`${iconPadding} rounded-lg border border-white/10 bg-white/5 hover:bg-primary/20 hover:border-primary hover:text-primary text-white/70 transition-all duration-300 hover:scale-110`}
                onClick={(e) => e.stopPropagation()}
              >
                <Linkedin className={iconSize} />
              </a>
            )}
            {member.github && (
              <a
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                className={`${iconPadding} rounded-lg border border-white/10 bg-white/5 hover:bg-primary/20 hover:border-primary hover:text-primary text-white/70 transition-all duration-300 hover:scale-110`}
                onClick={(e) => e.stopPropagation()}
              >
                <Github className={iconSize} />
              </a>
            )}
          </div>
        </div>

        {/* Animated icon on hover */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <Cpu className="text-primary w-6 h-6 animate-pulse" />
        </div>

        {/* Decorative Corners */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none border border-white/5 rounded-2xl z-20">
          <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-primary" />
          <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-primary" />
          <div className="absolute bottom-4 left-4 w-2 h-2 border-b border-l border-primary" />
          <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-primary" />
        </div>
      </div>
    </motion.div>
  );
}
