import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppState, SimulationResult } from './types';
// import { simulatePipelineEvaluation } from './services/geminiService';
import { UploadSection } from './components/UploadSection';
import { PipelineVisualizer } from './components/PipelineVisualizer';
import { ResultsDashboard } from './components/ResultsDashboard';
import { AboutSection } from './components/AboutSection';
import { Sparkles, ArrowRight, Github } from 'lucide-react';
import { GlassCard } from './components/ui/GlassCard';
import { uploadDocument, runEvaluation } from './services/api';

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [file, setFile] = useState<File | null>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SimulationResult[]>([]);

  const handleFileSelect = async (selectedFile: File) => {
  try {
    setFile(selectedFile);
    await uploadDocument(selectedFile);
    setAppState(AppState.READY);
  } catch (e) {
    console.error(e);
    alert("File upload failed");
    setAppState(AppState.IDLE);
  }
};

  const handleRunEvaluation = async () => {
  if (!query.trim() || !file) return;

  setAppState(AppState.PROCESSING);

  try {
    const data = await runEvaluation(query);

    setResults(data);

    // ✅ THIS IS THE FIX
    setAppState(AppState.COMPLETE);

  } catch (e) {
    console.error(e);
    setAppState(AppState.IDLE);
  }
};


  const handleVisualizationComplete = () => {
    setAppState(AppState.COMPLETE);
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white selection:bg-neon-purple/30">
      
      {/* Background Ambient Glow */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-[40vw] h-[40vw] bg-neon-purple/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[30vw] h-[30vw] bg-neon-cyan/5 rounded-full blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full px-8 py-6 z-50 flex justify-between items-center backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-neon-cyan" />
          <span className="font-semibold tracking-tight text-white">RAG Optimizer</span>
        </div>
        <div className="hidden md:flex items-center space-x-6 text-sm text-zinc-400">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center space-x-2">
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>
          <div className="h-4 w-px bg-zinc-700" />
          <span className="text-neon-green text-xs border border-neon-green/30 px-2 py-0.5 rounded-full bg-neon-green/5">v1.2.0-beta</span>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="relative z-10 pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto min-h-screen flex flex-col">
        
        {/* Header Section */}
        <AnimatePresence>
          {appState !== AppState.COMPLETE && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center mb-12"
            >
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-500 mb-6">
                Optimize Your <br/> RAG Pipeline
              </h1>
              <p className="text-lg text-zinc-400 max-w-2xl mx-auto font-light">
                Upload your knowledge base. Define your query. We simulate varying chunking strategies and embedding models to maximize faithfulness.
              </p>
              <p className="text-sm text-zinc-400 max-w-2xl mx-auto font-light">
                Ps: This is a retrieval-focused system, not a full LLM. Answers reflect retrieved context, not model imagination.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Flow */}
        <div className="w-full max-w-3xl mx-auto space-y-8">
          
          {appState !== AppState.COMPLETE && appState !== AppState.PROCESSING && (
            <UploadSection onFileSelect={handleFileSelect} />
          )}

          {/* Query Input */}
          <AnimatePresence>
            {appState === AppState.READY && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <GlassCard style={{ width: '100%' }} className="p-2 flex items-center group focus-within:ring-1 focus-within:ring-neon-cyan/50 transition-all">
                  <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter your evaluation query..."
                    className="flex-1 min-w-0 bg-transparent border-none outline-none text-white px-4 py-3 text-lg placeholder:text-zinc-600 text-left w-full"
                    style={{ width: '100%' }}
                  />
                  <button 
                    onClick={handleRunEvaluation}
                    disabled={!query.trim()}
                    className="shrink-0 px-6 py-3 bg-white text-black font-medium rounded-xl hover:bg-neon-cyan transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <span>Run Eval</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Processing Visualizer */}
          <AnimatePresence>
            {appState === AppState.PROCESSING && (
              <motion.div
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
              >
                <div className="text-center mb-8">
                   <h3 className="text-xl font-light text-white animate-pulse">Running...</h3>
                   <p className="text-zinc-500 text-sm">Testing 4 pipeline configurations</p>
                </div>
                <PipelineVisualizer isActive={appState === AppState.PROCESSING} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results View */}
        {appState === AppState.COMPLETE && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
           >
             <div className="flex justify-center mb-10">
                <button 
                  onClick={() => {
                    setAppState(AppState.READY);
                    setResults([]);
                  }}
                  className="text-xs text-zinc-500 hover:text-white transition-colors underline"
                >
                  Run Another Test
                </button>
             </div>
             <ResultsDashboard results={results} />
           </motion.div>
        )}

      </main>

      {/* Technical Deep Dive Section */}
      <AboutSection />

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 text-center text-zinc-600 text-sm">
        <p>© 2025 RAG Pipeline Optimizer. Experimental Build.</p>
      </footer>
    </div>
  );
}

export default App;