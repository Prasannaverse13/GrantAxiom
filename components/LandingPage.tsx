import React, { useState } from 'react';
import { ArrowRight, Play, CheckSquare, Cpu, X, Database, ShieldCheck, Zap } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

// Internal component for the 3D Isometric Cubes
const IsometricBlock = ({ delay = '0s', color = 'cyan' }: { delay?: string, color?: 'cyan' | 'purple' }) => {
  const baseColor = color === 'cyan' ? 'bg-cyan-500' : 'bg-purple-500';
  const shadowColor = color === 'cyan' ? 'bg-cyan-900' : 'bg-purple-900';
  const faceColor = color === 'cyan' ? 'bg-cyan-400' : 'bg-purple-400';

  return (
    <div className="relative w-24 h-24 group" style={{ animation: `float 6s ease-in-out infinite ${delay}` }}>
       {/* Top Face */}
       <div className={`absolute top-0 left-0 w-24 h-24 ${faceColor} opacity-90`} 
            style={{ transform: 'rotateX(60deg) rotateZ(45deg) translate(-20px, -20px)', boxShadow: 'inset 0 0 20px rgba(255,255,255,0.2)' }}>
            <div className="absolute inset-2 border-2 border-white/20 rounded-sm"></div>
       </div>
       {/* Right Face */}
       <div className={`absolute top-0 left-0 w-24 h-24 ${baseColor} opacity-80`} 
            style={{ transform: 'rotateX(60deg) rotateZ(45deg) translate(0px, -20px) rotateY(-90deg) translate(12px, 0)', height: '40px' }}>
       </div>
       {/* Left Face */}
       <div className={`absolute top-0 left-0 w-24 h-24 ${shadowColor} opacity-90`} 
            style={{ transform: 'rotateX(60deg) rotateZ(45deg) translate(-20px, 0px) rotateX(-90deg) translate(0, -12px)', height: '40px' }}>
       </div>
       
       {/* Reflection/Glow */}
       <div className={`absolute -bottom-16 left-2 w-20 h-20 ${baseColor} blur-xl opacity-40 rounded-full transform scale-y-50`}></div>
    </div>
  );
};

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const handleStart = () => {
    setIsExiting(true);
    setTimeout(() => {
      onGetStarted();
    }, 3000);
  };

  return (
    <div className="h-full w-full flex items-center justify-center bg-[#050505] overflow-hidden relative font-sans selection:bg-cyan-500/30 selection:text-cyan-100">
        
        {/* === Background Ambient Blobs === */}
        {/* Top Center - Cyan/Blue */}
        <div className="absolute top-[-10%] left-[30%] w-[60vw] h-[60vw] bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" style={{animationDuration: '8s'}} />
        {/* Bottom Left - Purple/Pink */}
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-fuchsia-600/20 rounded-full blur-[100px]" />
        {/* Bottom Right - Orange/Blue Mix */}
        <div className="absolute -bottom-[20%] right-[0%] w-[40vw] h-[40vw] bg-blue-600/20 rounded-full blur-[100px]" />

        {/* === Transition Overlay === */}
        {isExiting && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-3xl animate-[fadeIn_0.5s_ease-out_forwards]">
                 <div className="relative mb-8">
                    {/* Outer Ring */}
                    <div className="w-32 h-32 rounded-full border-2 border-white/5 border-t-cyan-500 border-b-fuchsia-500 animate-spin"></div>
                    {/* Inner Pulsing Core */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-cyan-900/50 to-fuchsia-900/50 rounded-full animate-pulse border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                           <Cpu className="w-8 h-8 text-white animate-pulse" />
                        </div>
                    </div>
                 </div>
                 
                 <div className="font-mono text-cyan-400 text-sm tracking-[0.3em] uppercase mb-2 animate-pulse">
                    System Initialization
                 </div>
                 
                 <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-fuchsia-500 via-cyan-500 to-fuchsia-500 animate-[progress_3s_ease-in-out_forwards] w-0"></div>
                 </div>
                 
                 <div className="mt-2 font-mono text-[10px] text-slate-500">
                    Loading Modules...
                 </div>
            </div>
        )}

        {/* === About Modal === */}
        {showAbout && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-[fadeIn_0.3s_ease-out_forwards]">
            <div className="bg-[#0f172a] border border-white/10 rounded-3xl max-w-3xl w-full p-8 md:p-10 shadow-2xl relative overflow-hidden ring-1 ring-white/10">
               {/* Background Glow */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
               
               {/* Close button */}
               <button 
                 onClick={() => setShowAbout(false)} 
                 className="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all z-10"
               >
                  <X size={20} />
               </button>
               
               <h2 className="text-3xl font-bold text-white mb-2">About GrantAxiom</h2>
               <div className="h-1 w-20 bg-gradient-to-r from-cyan-400 to-fuchsia-500 rounded-full mb-6"></div>
               
               <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-8 max-w-2xl">
                  GrantAxiom is an advanced AI-powered workbench designed to streamline the scientific grant writing process. 
                  By leveraging the reasoning capabilities of Gemini 2.5, it audits your proposals for factual accuracy against 
                  your reference library and helps generate broader impact artifacts to secure funding.
               </p>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {/* Step 1 */}
                   <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-all group">
                      <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors">
                          <Database className="text-cyan-400" size={24}/>
                      </div>
                      <h3 className="text-white font-semibold mb-2 text-lg">1. Ingest</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Drag and drop your PDF reference library and paste your draft proposal text for context-aware analysis.
                      </p>
                   </div>
                   
                   {/* Step 2 */}
                   <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-fuchsia-500/30 transition-all group">
                      <div className="w-12 h-12 bg-fuchsia-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-fuchsia-500/20 transition-colors">
                          <ShieldCheck className="text-fuchsia-400" size={24}/>
                      </div>
                      <h3 className="text-white font-semibold mb-2 text-lg">2. Audit</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Execute a deep AI audit to verify claims, detect hallucinations, and check compliance with guidelines.
                      </p>
                   </div>
                   
                   {/* Step 3 */}
                   <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-orange-500/30 transition-all group">
                       <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
                          <Zap className="text-orange-400" size={24}/>
                      </div>
                      <h3 className="text-white font-semibold mb-2 text-lg">3. Visualize</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Instantly generate interactive HTML5/Canvas simulations to strengthen your "Broader Impacts" section.
                      </p>
                   </div>
               </div>

               <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
                   <button 
                      onClick={() => setShowAbout(false)}
                      className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-white/10"
                   >
                     Close
                   </button>
               </div>
            </div>
          </div>
        )}

        {/* === Main Glass Container === */}
        <div className={`relative w-[95%] h-[90%] md:w-[90%] md:h-[85%] max-w-[1400px] bg-white/[0.03] backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-2xl flex flex-col overflow-hidden z-10 transition-all duration-1000 ease-in-out transform ${isExiting ? 'scale-110 opacity-0 blur-xl' : 'scale-100 opacity-100'}`}>
            
            {/* Header / Nav */}
            <header className="flex justify-between items-center p-8 md:p-10 z-20">
                <div className="flex items-center gap-2">
                    <CheckSquare className="text-white w-6 h-6" />
                    <span className="text-xl font-bold text-white tracking-tight">GrantAxiom</span>
                </div>
                <nav className="flex items-center gap-6">
                    <button 
                        onClick={() => setShowAbout(true)}
                        className="text-sm font-medium text-slate-400 hover:text-white transition-colors tracking-wide"
                    >
                        About
                    </button>
                    {/* Add more nav items if needed */}
                </nav>
            </header>

            {/* Content Body */}
            <main className="flex-1 flex flex-col md:flex-row items-center px-8 md:px-16 pb-12 relative">
                
                {/* Left Column: Text */}
                <div className="flex-1 z-20 flex flex-col justify-center items-start pt-10 md:pt-0">
                    <div className="mb-6 h-1 w-20 bg-gradient-to-r from-cyan-400 to-fuchsia-500 rounded-full"></div>
                    
                    <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-6 drop-shadow-lg">
                        GRANT<br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">AXIOM</span>
                    </h1>

                    <p className="text-slate-400 text-sm md:text-base max-w-md leading-relaxed mb-10 border-l border-white/10 pl-4">
                        The ultimate AI auditor for scientific proposals. <br/>
                        Ingest data. Verify claims. Generate impact. <br/>
                        <span className="text-cyan-400">Secure your funding with precision.</span>
                    </p>

                    <div className="flex items-center gap-4">
                        <button 
                            onClick={handleStart}
                            className="px-8 py-3 rounded-full bg-gradient-to-r from-fuchsia-600 to-cyan-600 text-white font-bold text-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-105 transition-all duration-300 flex items-center gap-2"
                        >
                            Get Started
                        </button>
                        
                        <a 
                            href="https://youtu.be/yQHEBdRUR7k" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-8 py-3 rounded-full border border-white/20 text-white font-medium text-sm hover:bg-white/5 transition-all flex items-center gap-2 group"
                        >
                            Watch Video <Play className="w-3 h-3 fill-current group-hover:text-cyan-400 transition-colors" />
                        </a>
                    </div>
                </div>

                {/* Right Column: 3D Visuals */}
                <div className="flex-1 w-full h-full flex items-center justify-center relative perspective-1000 mt-12 md:mt-0">
                    
                    {/* Isometric Grid Container */}
                    <div className="relative w-80 h-80 transform rotate-x-60 rotate-z-45" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(60deg) rotateZ(-45deg)' }}>
                         
                         {/* Block 1: Top Back */}
                         <div className="absolute top-0 left-10 z-10">
                            <IsometricBlock delay="0s" color="purple" />
                         </div>

                         {/* Block 2: Top Front */}
                         <div className="absolute top-20 left-32 z-20">
                            <IsometricBlock delay="1s" color="cyan" />
                         </div>

                         {/* Block 3: Bottom Back */}
                         <div className="absolute top-24 -left-12 z-20">
                            <IsometricBlock delay="1.5s" color="cyan" />
                         </div>

                         {/* Block 4: Bottom Front */}
                         <div className="absolute top-44 left-10 z-30">
                            <IsometricBlock delay="2s" color="purple" />
                         </div>

                         {/* Floor Glow */}
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl transform -translate-z-20"></div>
                    </div>
                </div>
            </main>

            {/* Decorative bottom blob sticking into the card */}
            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-t from-orange-500/20 to-transparent blur-3xl pointer-events-none"></div>
        </div>

        <style>{`
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-15px); }
            }
            @keyframes progress {
                0% { width: 0%; }
                100% { width: 100%; }
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .perspective-1000 {
                perspective: 1000px;
            }
        `}</style>
    </div>
  );
};