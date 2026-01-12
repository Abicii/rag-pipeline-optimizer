import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { STAGES, ProcessingStage } from '../types';
import { FileText, Scissors, Database, Search, MessageSquare, Zap } from 'lucide-react';

interface PipelineVisualizerProps {
  isActive: boolean;
  onComplete: () => void;
}

const icons = {
  document: FileText,
  chunking: Scissors,
  embedding: Database,
  vector: Search,
  generation: MessageSquare,
  evaluation: Zap,
};

export const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({ isActive, onComplete }) => {
  const [activeStageIndex, setActiveStageIndex] = useState(-1);

  useEffect(() => {
    if (isActive) {
      let current = 0;
      setActiveStageIndex(0);
      
      const interval = setInterval(() => {
        current++;
        if (current < STAGES.length) {
          setActiveStageIndex(current);
        } else {
          clearInterval(interval);
          setTimeout(onComplete, 800); // Slight delay after last stage before showing results
        }
      }, 1500); // 1.5s per stage

      return () => clearInterval(interval);
    } else {
      setActiveStageIndex(-1);
    }
  }, [isActive, onComplete]);

  if (!isActive && activeStageIndex === -1) return null;

  return (
    <div className="w-full py-12 px-4 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="relative flex justify-between items-center">
          
          {/* Connecting Line Background */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -translate-y-1/2 z-0" />
          
          {/* Active Line Progress */}
          <motion.div 
            className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-cyan -translate-y-1/2 z-0"
            initial={{ width: "0%" }}
            animate={{ width: `${(activeStageIndex / (STAGES.length - 1)) * 100}%` }}
            transition={{ duration: 1.5, ease: "linear" }}
          />

          {STAGES.map((stage, index) => {
            const Icon = icons[stage.id];
            const isCompleted = index < activeStageIndex;
            const isActiveStage = index === activeStageIndex;
            
            return (
              <div key={stage.id} className="relative z-10 flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ 
                    scale: isActiveStage ? 1.2 : 1, 
                    opacity: isCompleted || isActiveStage ? 1 : 0.5,
                    backgroundColor: isActiveStage ? "rgba(0, 242, 234, 0.1)" : "rgba(255, 255, 255, 0.05)",
                    borderColor: isActiveStage ? "#00f2ea" : isCompleted ? "#00ff9d" : "rgba(255, 255, 255, 0.1)"
                  }}
                  className={`w-14 h-14 rounded-xl border backdrop-blur-md flex items-center justify-center transition-colors duration-300
                    ${isActiveStage ? 'shadow-[0_0_20px_rgba(0,242,234,0.4)]' : ''}
                  `}
                >
                  <Icon 
                    className={`w-6 h-6 ${
                      isActiveStage ? 'text-neon-cyan' : isCompleted ? 'text-neon-green' : 'text-zinc-500'
                    }`} 
                  />
                  
                  {isActiveStage && (
                    <motion.div 
                      className="absolute inset-0 rounded-xl ring-2 ring-neon-cyan"
                      animate={{ scale: [1, 1.4], opacity: [0.8, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </motion.div>
                
                <motion.div 
                  className="mt-4 text-center"
                  animate={{ opacity: isActiveStage || isCompleted ? 1 : 0.4 }}
                >
                  <span className={`text-xs font-medium uppercase tracking-wider ${
                     isActiveStage ? 'text-neon-cyan' : isCompleted ? 'text-neon-green' : 'text-zinc-500'
                  }`}>
                    {stage.label}
                  </span>
                  {isActiveStage && (
                     <motion.div 
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       className="text-[10px] text-zinc-400 mt-1 font-mono"
                     >
                       Processing...
                     </motion.div>
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};