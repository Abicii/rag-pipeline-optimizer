import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SimulationResult } from '../types';
import { GlassCard } from './ui/GlassCard';
import { ChevronDown, BarChart2, Check, Clock, DollarSign } from 'lucide-react';

interface ResultsDashboardProps {
  results: SimulationResult[];
}

const MetricBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div className="mb-3">
    <div className="flex justify-between text-xs mb-1">
      <span className="text-zinc-400 uppercase tracking-wider">{label}</span>
      <span className="font-mono text-white">{(value * 100).toFixed(0)}%</span>
    </div>
    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value * 100}%` }}
        transition={{ duration: 1, delay: 0.2 }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  </div>
);

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ results }) => {
  const [expandedId, setExpandedId] = useState<string | null>(results[0]?.pipeline || null);
  const dashboardRef = useRef<HTMLDivElement | null>(null);

  const toggleExpand = (id: string) => {
    const isClosing = expandedId === id;

    setExpandedId(isClosing ? null : id);

    if (isClosing && dashboardRef.current) {
        // Force window-level scroll (works regardless of layout)
        const top =
        dashboardRef.current.getBoundingClientRect().top +
        window.scrollY -
        24; // small offset for visual comfort

        window.scrollTo({
        top,
        behavior: 'smooth',
        });
    }
};

  return (
    <div ref={dashboardRef} className="w-full max-w-6xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-center space-x-3 mb-8">
        <BarChart2 className="text-neon-purple w-6 h-6" />
        <h2 className="text-2xl font-light text-white tracking-tight">Evaluation Results</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {results.map((result, index) => {
            const isWinner = index === 0;
            const isExpanded = expandedId === result.pipeline;

            return (
                <motion.div
                    key={result.pipeline}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`${isExpanded ? 'md:col-span-3' : 'md:col-span-1'}`}
                >
                    <GlassCard 
                        className={`h-full transition-all duration-500 cursor-pointer ${isExpanded ? 'bg-white/5' : 'hover:bg-white/5'}`}
                        glowColor={isWinner ? "#00f2ea" : undefined}
                        onClick={() => !isExpanded && toggleExpand(result.pipeline)}
                    >
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <div className="flex items-center space-x-2 mb-2">
                                        <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${isWinner ? 'bg-neon-cyan text-black' : 'bg-white/10 text-zinc-400'}`}>
                                            #{index + 1}
                                        </span>
                                        <h3 className="text-lg font-medium text-white">{result.pipeline}</h3>
                                    </div>
                                    <div className="flex space-x-3 text-xs text-zinc-400 font-mono">
                                        <span>Chunk Size : {result.chunk_size}</span>
                                        <span>•</span>
                                        <span>{result.embedding_model}</span>
                                    </div>
                                </div>
                                {isWinner && (
                                    <div className="p-2 rounded-full bg-neon-cyan/10 text-neon-cyan">
                                        <Check className="w-4 h-4" />
                                    </div>
                                )}
                            </div>

                            {/* Metrics Grid */}
                            <div className={`grid ${isExpanded ? 'grid-cols-1 md:grid-cols-3 gap-8' : 'grid-cols-1 gap-2'}`}>
                                <div className="space-y-1">
                                    <MetricBar label="Faithfulness" value={result.scores.faithfulness} color="#00f2ea" />
                                    <MetricBar label="Relevance" value={result.scores.relevance} color="#b026ff" />
                                    <MetricBar label="Recall" value={result.scores.context_recall} color="#00ff9d" />
                                </div>

                                {isExpanded && (
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-medium text-zinc-300 uppercase tracking-wider">Performance</h4>
                                        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                                            <div className="flex items-center space-x-2 text-zinc-400">
                                                <Clock className="w-4 h-4" />
                                                <span>Latency</span>
                                            </div>
                                            <span className="font-mono text-white">{result.scores.latency}s</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                                            <div className="flex items-center space-x-2 text-zinc-400">
                                                
                                                <span>Cost Est.</span>
                                            </div>
                                            <span className="font-mono text-white">{result.scores.cost} tokens</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Expandable Content (Answer & Context) */}
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-8 pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8"
                                    >
                                        <div>
                                            <h4 className="text-sm font-medium text-zinc-300 uppercase tracking-wider mb-4">Generated Answer</h4>
                                            <div className="p-4 rounded-lg bg-black/40 border border-white/5 font-mono text-sm text-zinc-300 leading-relaxed">
                                                {result.answer}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-zinc-300 uppercase tracking-wider mb-4">Retrieved Chunks</h4>
                                            <div className="space-y-3">
                                                {result.retrieved_chunks.map((ctx, i) => (
                                                    <div key={i} className="p-3 rounded-lg bg-white/5 border-l-2 border-neon-purple/50 font-mono text-xs text-zinc-400">
                                                        "{ctx}"
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="mt-4 flex justify-center">
  <button
    onClick={(e) => {
      e.stopPropagation(); // 🔥 THIS IS CRITICAL
      toggleExpand(result.pipeline);
    }}
    className="p-2 rounded-full hover:bg-white/10 transition-colors"
  >
    <ChevronDown
      className={`w-5 h-5 text-zinc-500 transition-transform duration-300 ${
        isExpanded ? 'rotate-180' : ''
      }`}
    />
  </button>
</div>
                        </div>
                    </GlassCard>
                </motion.div>
            );
        })}
      </div>
    </div>
  );
};