import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle2 } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';

interface UploadSectionProps {
  onFileSelect: (file: File) => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type === "text/plain" || file.name.endsWith('.txt')) {
      setSelectedFile(file);
      onFileSelect(file);
    } else {
      alert("Please upload a valid .txt document.");
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto mb-12">
      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <GlassCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`cursor-pointer transition-all duration-300 group ${
              isDragging ? 'border-neon-cyan/50 bg-neon-cyan/5' : 'hover:border-white/20'
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            glowColor="#00f2ea"
          >
            <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className={`p-4 rounded-full bg-white/5 transition-all duration-300 ${isDragging ? 'scale-110 bg-neon-cyan/10' : 'group-hover:scale-105'}`}>
                <Upload className={`w-8 h-8 ${isDragging ? 'text-neon-cyan' : 'text-zinc-400'}`} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-1">Upload Knowledge Base</h3>
                <p className="text-sm text-zinc-400">Drag & drop your .txt file or click to browse</p>
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileInput}
                accept=".txt"
                className="hidden" 
              />
            </div>
          </GlassCard>
        ) : (
          <GlassCard
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="border-neon-green/30"
            glowColor="#00ff9d"
          >
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-neon-green/10 text-neon-green">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-medium">{selectedFile.name}</h3>
                  <p className="text-xs text-zinc-400 font-mono">{(selectedFile.size / 1024).toFixed(2)} KB • Ready for processing</p>
                </div>
              </div>
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }}
                className="text-neon-green"
              >
                <CheckCircle2 className="w-6 h-6" />
              </motion.div>
            </div>
          </GlassCard>
        )}
      </AnimatePresence>
    </div>
  );
};