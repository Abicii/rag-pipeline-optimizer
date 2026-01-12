import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { GlassCard } from './ui/GlassCard';

export const AboutSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [200, -200]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 10]);

  return (
    <div ref={containerRef} className="relative w-full py-32 overflow-hidden">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-20 text-center">
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 mb-4">
            How It Works
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            A comprehensive breakdown of the RAG optimization pipeline. 
            We simulate multiple strategies in parallel to find the optimal configuration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* Visual Side */}
            <div className="h-[500px] relative perspective-1000">
                <motion.div style={{ y: y1, rotateX: 10, rotateY: -10 }} className="absolute top-0 left-0 w-64 z-30">
                    <GlassCard className="p-6 border-neon-cyan/20 bg-black/60 backdrop-blur-xl">
                        <div className="h-2 w-12 bg-neon-cyan rounded-full mb-4" />
                        <h3 className="text-neon-cyan font-mono text-sm mb-2">01. Smart Chunking</h3>
                        <p className="text-xs text-zinc-400">Adaptive window sizes based on semantic density.</p>
                        <div className="mt-4 grid grid-cols-3 gap-2">
                            <div className="h-8 bg-neon-cyan/10 rounded" />
                            <div className="h-8 bg-neon-cyan/20 rounded col-span-2" />
                        </div>
                    </GlassCard>
                </motion.div>

                <motion.div style={{ y: y2, rotateX: 5, rotateY: 5 }} className="absolute top-40 right-10 w-64 z-20">
                    <GlassCard className="p-6 border-neon-purple/20 bg-black/60 backdrop-blur-xl">
                         <div className="h-2 w-12 bg-neon-purple rounded-full mb-4" />
                        <h3 className="text-neon-purple font-mono text-sm mb-2">02. High-Dim Embeddings</h3>
                        <p className="text-xs text-zinc-400">Projecting text into 1536-dimensional latent space.</p>
                        <div className="mt-4 flex justify-center items-center h-12">
                             <div className="w-full h-px bg-neon-purple/30 relative">
                                <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-neon-purple rounded-full -translate-y-1/2 shadow-[0_0_10px_#b026ff]" />
                                <div className="absolute top-1/2 left-3/4 w-2 h-2 bg-neon-purple rounded-full -translate-y-1/2 shadow-[0_0_10px_#b026ff]" />
                             </div>
                        </div>
                    </GlassCard>
                </motion.div>

                <motion.div style={{ y: 0, rotateZ: rotate }} className="absolute bottom-10 left-20 w-72 z-10">
                    <GlassCard className="p-6 border-neon-green/20 bg-black/60 backdrop-blur-xl">
                        <div className="h-2 w-12 bg-neon-green rounded-full mb-4" />
                        <h3 className="text-neon-green font-mono text-sm mb-2">03. Synthetic Evaluation</h3>
                        <p className="text-xs text-zinc-400">Using LLMs to grade LLMs on faithfulness and recall.</p>
                        <div className="mt-4 space-y-2">
                             <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-neon-green w-[85%]" />
                             </div>
                             <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-neon-green w-[92%]" />
                             </div>
                        </div>
                    </GlassCard>
                </motion.div>
            </div>

            {/* Text Explainer Side */}
            <div className="space-y-12">
                <div className="group">
                    <h3 className="text-xl font-medium text-white mb-2 flex items-center">
                        <span className="w-8 h-[1px] bg-zinc-600 mr-4 group-hover:bg-neon-cyan transition-colors" />
                        Multi-Stage Pipeline
                    </h3>
                    <p className="text-zinc-400 pl-12 leading-relaxed">
                        We don't just run one query. The optimizer spins up concurrent pipelines with varying parameters (chunk size, overlap, embedding models) to empirically determine the best configuration for your specific data.
                    </p>
                </div>

                <div className="group">
                     <h3 className="text-xl font-medium text-white mb-2 flex items-center">
                        <span className="w-8 h-[1px] bg-zinc-600 mr-4 group-hover:bg-neon-purple transition-colors" />
                        Latent Space Analysis
                    </h3>
                    <p className="text-zinc-400 pl-12 leading-relaxed">
                        By visualizing the vector distribution, we ensure that your retrieval step isn't just matching keywords, but capturing semantic intent. We optimize for maximum marginal relevance.
                    </p>
                </div>

                <div className="group">
                     <h3 className="text-xl font-medium text-white mb-2 flex items-center">
                        <span className="w-8 h-[1px] bg-zinc-600 mr-4 group-hover:bg-neon-green transition-colors" />
                        Cost vs. Quality
                    </h3>
                    <p className="text-zinc-400 pl-12 leading-relaxed">
                        The highest quality answer isn't always the right choice. We provide a computed "Cost Proxy" so you can balance token usage against retrieval accuracy.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};