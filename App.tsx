import React, { useState } from 'react';
import { LayoutDashboard, FileText, Microscope, Menu, X, CheckSquare, Sparkles, LogOut } from 'lucide-react';
import { Ingestion } from './components/Ingestion';
import { AuditDashboard } from './components/AuditDashboard';
import { Visualizer } from './components/Visualizer';
import { Chat } from './components/Chat';
import { LandingPage } from './components/LandingPage';
import { analyzeProposal } from './services/geminiService';
import { Reference, AnalysisReport, MOCK_PROPOSAL, MOCK_REFERENCES } from './types';

function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [activeTab, setActiveTab] = useState<'context' | 'audit' | 'simulate'>('context');
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  
  // Shared State
  const [proposalText, setProposalText] = useState(MOCK_PROPOSAL);
  const [references, setReferences] = useState<Reference[]>(MOCK_REFERENCES);
  const [simulationCode, setSimulationCode] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeProposal(proposalText, references);
      setReport(result);
      setActiveTab('audit');
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLogout = () => {
    setHasStarted(false);
    // Reset state to ensure fresh start on next login
    setActiveTab('context');
    setReport(null);
    setProposalText(MOCK_PROPOSAL);
    setReferences(MOCK_REFERENCES);
    setSimulationCode(null);
    setSidebarOpen(true);
  };

  if (!hasStarted) {
    return <LandingPage onGetStarted={() => setHasStarted(true)} />;
  }

  return (
    <div className="flex h-screen w-full font-sans text-slate-200 animate-fade-in">
      
      {/* Mobile Menu Toggle */}
      <button 
        className="lg:hidden absolute top-4 left-4 z-50 p-2 glass-panel rounded-md text-white border border-glass-border"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Navigation */}
      <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-40 w-64 h-full glass-panel border-r border-glass-border transition-transform duration-300 flex flex-col`}>
        <div className="p-6 border-b border-glass-border bg-gradient-to-r from-scientific-900/20 to-transparent">
          <div className="flex items-center gap-3">
             <div className="w-9 h-9 bg-gradient-to-br from-scientific-500 to-scientific-800 rounded-xl flex items-center justify-center shadow-lg shadow-scientific-500/20 border border-scientific-400/20">
                <CheckSquare className="text-white w-5 h-5" />
             </div>
             <div>
               <h1 className="text-xl font-bold text-white tracking-tight drop-shadow-sm">GrantAxiom</h1>
               <span className="text-[10px] uppercase text-scientific-300 font-bold tracking-widest">Research Audit</span>
             </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-3">
          {[
            { id: 'context', icon: FileText, label: 'Context Ingestion' },
            { id: 'audit', icon: LayoutDashboard, label: 'Audit Dashboard', disabled: !report && !isAnalyzing },
            { id: 'simulate', icon: Microscope, label: 'Impact Simulator' }
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => !item.disabled && setActiveTab(item.id as any)}
              disabled={item.disabled}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden group
                ${activeTab === item.id 
                  ? 'bg-gradient-to-r from-scientific-600/20 to-scientific-600/5 text-white shadow-glow border border-scientific-500/30' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'}
                ${item.disabled ? 'opacity-40 cursor-not-allowed hover:bg-transparent' : ''}
              `}
            >
              {activeTab === item.id && <div className="absolute left-0 top-0 h-full w-0.5 bg-scientific-500 box-shadow-glow" />}
              <item.icon size={18} className={`${activeTab === item.id ? 'text-scientific-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
              <span className="font-medium tracking-wide">{item.label}</span>
              {item.id === 'audit' && isAnalyzing && <span className="ml-auto w-2 h-2 bg-scientific-400 rounded-full animate-pulse shadow-[0_0_10px_#8b5cf6]" />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-glass-border flex flex-col gap-4">
          <div className="glass-card rounded-xl p-4 border border-scientific-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles size={40} />
            </div>
            <p className="text-xs text-scientific-300 mb-2 font-semibold">Pro Tip</p>
            <p className="text-xs text-slate-400 leading-relaxed relative z-10">
              Use "Impact Simulator" to generate interactive artifacts for your "Broader Impacts" section.
            </p>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-slate-400 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 group"
          >
            <LogOut size={18} className="text-slate-500 group-hover:text-red-400" />
            <span className="font-medium tracking-wide text-sm">Exit Session</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
         <main className="flex-1 overflow-hidden relative">
            {activeTab === 'context' && (
              <Ingestion 
                proposalText={proposalText} 
                setProposalText={setProposalText}
                references={references}
                setReferences={setReferences}
                onAnalyze={handleAnalyze} 
                isAnalyzing={isAnalyzing} 
              />
            )}
            {activeTab === 'audit' && report && <AuditDashboard report={report} />}
            {activeTab === 'simulate' && (
              <Visualizer 
                proposalText={proposalText} 
                references={references}
                report={report}
                simulationCode={simulationCode}
                setSimulationCode={setSimulationCode}
              />
            )}
         </main>
      </div>

      {/* Right Sidebar - Chat Agent */}
      <div className="hidden xl:block h-full glass-panel border-l border-glass-border backdrop-blur-xl">
        <Chat />
      </div>

    </div>
  );
}

export default App;