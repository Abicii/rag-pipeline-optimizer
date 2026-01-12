import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  noBlur?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = "", 
  glowColor,
  noBlur = false,
  ...props 
}) => {
  return (
    <motion.div
      className={`relative rounded-2xl border border-white/10 ${noBlur ? 'bg-zinc-900/50' : 'glass-panel'} overflow-hidden ${className}`}
      {...props}
    >
      {glowColor && (
        <div 
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10 pointer-events-none blur-3xl"
          style={{ backgroundColor: glowColor }}
        />
      )}
      <div className="relative z-10" style={{ width: '100%' }}>
        {children}
      </div>
    </motion.div>
  );
};