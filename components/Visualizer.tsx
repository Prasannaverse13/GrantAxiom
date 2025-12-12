import React, { useState, useEffect } from 'react';
import { Play, Sparkles, Loader2, RefreshCw, Maximize2 } from 'lucide-react';
import { generateImpactSimulation } from '../services/geminiService';
import { Reference, AnalysisReport } from '../types';

interface VisualizerProps {
  proposalText: string;
  references: Reference[];
  report: AnalysisReport | null;
  simulationCode: string | null;
  setSimulationCode: (code: string | null) => void;
}

export const Visualizer: React.FC<VisualizerProps> = ({ 
  proposalText, 
  references, 
  report, 
  simulationCode, 
  setSimulationCode 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [userPrompt, setUserPrompt] = useState('');
  
  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const code = await generateImpactSimulation(proposalText, references, report, userPrompt);
      setSimulationCode(code);
    } catch (error) {
      console.error("Failed to generate", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Auto-generate on first load if no simulation exists
  useEffect(() => {
    if (!simulationCode && !isGenerating && proposalText) {
      handleGenerate();
    }
  }, []);

  return (
    <div className="h-full flex flex-col p-6 animate-fade-in relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3 drop-shadow-md">
            <div className="p-2 bg-gradient-to-br from-audit-yellow/20 to-orange-500/20 rounded-lg border border-audit-yellow/20">
                <Sparkles className="w-5 h-5 text-audit-yellow" />
            </div>
            Impact Simulator
          </h2>
          <p className="text-slate-400 text-sm mt-1 ml-12">
            Generative "Broader Impacts" artifacts powered by Gemini 3.
          </p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto p-1 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md">
             <input 
                type="text" 
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="Custom simulation goal..."
                className="bg-transparent border-none rounded-lg px-3 py-2 text-sm text-white w-full md:w-64 focus:outline-none placeholder:text-slate-500"
             />
            <button 
                onClick={handleGenerate}
                disabled={isGenerating || !proposalText}
                className="bg-scientific-600 hover:bg-scientific-500 disabled:bg-slate-700/50 disabled:text-slate-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold shadow-lg shadow-scientific-900/50 whitespace-nowrap transition-all"
            >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                {simulationCode ? 'Regenerate' : 'Generate'}
            </button>
        </div>
      </div>

      <div className="flex-1 glass-card rounded-2xl border border-white/10 overflow-hidden relative shadow-2xl flex flex-col backdrop-blur-xl bg-black/40">
        {simulationCode ? (
          <iframe 
            srcDoc={simulationCode}
            title="Generated Simulation"
            className="w-full h-full border-0 bg-white"
            sandbox="allow-scripts" 
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-6 p-8 text-center relative overflow-hidden">
             {/* Background decorative elements */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-scientific-500/10 rounded-full blur-[100px] pointer-events-none"></div>

             <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center relative border border-white/10 shadow-glass backdrop-blur-sm z-10">
                <Sparkles className={`w-10 h-10 ${isGenerating ? 'text-scientific-400' : 'text-slate-600'}`} />
                {isGenerating && (
                    <div className="absolute inset-0 border-2 border-transparent border-t-scientific-500 border-r-scientific-500 rounded-full animate-spin"></div>
                )}
             </div>
             
             <div className="max-w-md z-10">
               <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
                 {isGenerating ? "Synthesizing Artifact..." : "Initializing Neural Engine"}
               </h3>
               <p className="text-sm text-slate-400 leading-relaxed">
                 {isGenerating 
                   ? "Gemini is analyzing your methodology to construct a bespoke HTML5 educational simulation..." 
                   : "Waiting for context ingestion..."}
               </p>
             </div>
          </div>
        )}
        
        {simulationCode && (
           <div className="absolute top-4 right-4 bg-black/60 border border-white/10 p-2 rounded-lg text-[10px] text-scientific-300 pointer-events-none backdrop-blur-md z-10 uppercase tracking-widest font-bold">
              Gemini 3 Pro Generated
           </div>
        )}
      </div>
      
      {/* Simulation Info Footer */}
      {simulationCode && (
        <div className="mt-4 p-4 glass-card rounded-xl border border-white/5 flex justify-between items-center bg-white/5">
           <div className="flex items-center gap-6">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-scientific-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-slate-300 font-mono">Status: <span className="text-white">Active</span></span>
             </div>
             <div className="h-4 w-px bg-white/10"></div>
             <div className="text-xs text-slate-400">Context: <span className="text-slate-200">{proposalText.split('\n')[0].substring(0, 30)}...</span></div>
           </div>
           
           <div className="flex gap-2">
             <button 
               onClick={() => setSimulationCode(null)}
               className="text-slate-400 hover:text-white flex items-center gap-1.5 text-xs px-3 py-1.5 rounded hover:bg-white/10 transition-colors"
             >
               <RefreshCw className="w-3 h-3" /> Reset
             </button>
           </div>
        </div>
      )}
    </div>
  );
};