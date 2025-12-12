import React, { useRef } from 'react';
import { Upload, FileText, Play, Trash2, X } from 'lucide-react';
import { Reference } from '../types';

interface IngestionProps {
  proposalText: string;
  setProposalText: (text: string) => void;
  references: Reference[];
  setReferences: React.Dispatch<React.SetStateAction<Reference[]>>;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export const Ingestion: React.FC<IngestionProps> = ({ 
  proposalText, 
  setProposalText, 
  references, 
  setReferences, 
  onAnalyze, 
  isAnalyzing 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = async (fileList: FileList) => {
    const newRefs: Reference[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      let snippet = `[Binary content from ${file.name}]`;
      
      if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
          try {
          const text = await file.text();
          snippet = text.slice(0, 300) + (text.length > 300 ? '...' : '');
          } catch (e) {
            console.error("Error reading file", e);
          }
      } else {
          snippet = `Document uploaded: ${file.name}. Size: ${(file.size/1024).toFixed(1)}KB. (Content extraction simulated)`;
      }

      newRefs.push({
          id: `local-${Date.now()}-${i}`,
          title: file.name,
          authors: 'Uploaded Document',
          year: new Date().getFullYear(),
          contentSnippet: snippet
      });
    }
    setReferences(prev => [...prev, ...newRefs]);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        processFiles(e.target.files);
    }
    // Reset input so same file can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleRemoveRef = (id: string) => {
    setReferences(prev => prev.filter(r => r.id !== id));
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="h-full flex flex-col p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 drop-shadow-md">
          <div className="p-2 bg-white/5 rounded-lg border border-white/10">
            <FileText className="w-5 h-5 text-scientific-400" />
          </div>
          Context Ingestion
        </h2>
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className={`flex items-center gap-2 px-8 py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-lg ${
            isAnalyzing 
              ? 'bg-slate-800/50 text-slate-500 border border-white/5 cursor-not-allowed'
              : 'bg-gradient-to-r from-scientific-600 to-scientific-500 hover:from-scientific-500 hover:to-scientific-400 text-white shadow-scientific-500/30 border border-scientific-400/20 hover:scale-[1.02]'
          }`}
        >
          {isAnalyzing ? (
            <>Thinking...</>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" /> Run Audit
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-0">
        {/* Proposal Editor */}
        <div className="glass-card rounded-2xl p-1 border border-glass-border flex flex-col shadow-xl">
          <div className="px-4 py-3 border-b border-glass-border flex justify-between items-center bg-white/5 rounded-t-xl">
             <label className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
               Draft Proposal <span className="bg-white/10 text-white px-1.5 py-0.5 rounded text-[10px]">Latex/Word</span>
             </label>
          </div>
          <textarea
            value={proposalText}
            onChange={(e) => setProposalText(e.target.value)}
            className="flex-1 bg-black/20 m-2 rounded-lg p-5 text-slate-200 font-mono text-sm leading-relaxed focus:ring-1 focus:ring-scientific-500/50 focus:border-scientific-500/50 border border-transparent focus:outline-none resize-none scrollbar-thin transition-all placeholder:text-slate-600"
            placeholder="Paste your grant proposal abstract or body here..."
          />
        </div>

        {/* Reference Library */}
        <div className="glass-card rounded-2xl p-1 border border-glass-border flex flex-col shadow-xl">
          <div className="px-4 py-3 border-b border-glass-border flex justify-between items-center bg-white/5 rounded-t-xl">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Reference Library
            </label>
            <button 
              onClick={triggerFileUpload}
              className="text-xs bg-scientific-500/10 hover:bg-scientific-500/20 text-scientific-300 border border-scientific-500/20 px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all"
            >
              <Upload className="w-3 h-3" /> Upload PDF
            </button>
            <input 
              type="file" 
              multiple 
              accept=".pdf,.doc,.docx,.txt" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange}
            />
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-black/20 m-2 rounded-lg">
            {references.map((ref) => (
              <div key={ref.id} className="bg-slate-800/40 p-4 rounded-lg border border-white/5 hover:border-scientific-500/30 transition-all group relative hover:bg-slate-800/60 hover:shadow-lg">
                <div className="flex items-start justify-between pr-8">
                  <div>
                    <h4 className="text-slate-200 font-medium text-sm">{ref.title}</h4>
                    <p className="text-xs text-scientific-300/80 mt-1 flex items-center gap-2">
                       {ref.authors} 
                       <span className="w-1 h-1 bg-slate-500 rounded-full"></span> 
                       {ref.year}
                    </p>
                  </div>
                  <span className="text-[10px] bg-slate-900/50 border border-white/10 text-slate-400 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    PDF
                  </span>
                </div>
                <div className="mt-3 text-xs text-slate-500 line-clamp-2 border-l-2 border-slate-700 pl-3 italic font-serif">
                  "{ref.contentSnippet}"
                </div>
                
                <button 
                  onClick={() => handleRemoveRef(ref.id)}
                  className="absolute top-3 right-3 p-1.5 rounded-md text-slate-500 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-all"
                  title="Remove Reference"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            <div 
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={triggerFileUpload}
              className="border-2 border-dashed border-white/5 rounded-xl p-8 text-center hover:border-scientific-500/30 hover:bg-white/5 transition-all cursor-pointer group flex flex-col items-center justify-center gap-3 min-h-[150px]"
            >
              <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                 <Upload className="w-5 h-5 text-slate-500 group-hover:text-scientific-400" />
              </div>
              <div className="text-slate-500 group-hover:text-slate-300 text-sm font-medium">
                Drag and drop citation PDFs <br/>
                <span className="text-xs text-slate-600 font-normal">or click to browse</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};