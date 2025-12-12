import React from 'react';
import { AnalysisReport, Claim } from '../types';
import { CheckCircle, AlertTriangle, XCircle, FileCheck, ShieldAlert, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface AuditDashboardProps {
  report: AnalysisReport;
}

export const AuditDashboard: React.FC<AuditDashboardProps> = ({ report }) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'verified': return { 
          bg: 'bg-audit-green/10', 
          text: 'text-audit-green', 
          border: 'border-audit-green/20',
          icon: <CheckCircle className="w-5 h-5 text-audit-green" />
      };
      case 'warning': return { 
          bg: 'bg-audit-yellow/10', 
          text: 'text-audit-yellow', 
          border: 'border-audit-yellow/20',
          icon: <AlertTriangle className="w-5 h-5 text-audit-yellow" />
      };
      case 'contradiction': return { 
          bg: 'bg-audit-red/10', 
          text: 'text-audit-red', 
          border: 'border-audit-red/20',
          icon: <XCircle className="w-5 h-5 text-audit-red" />
      };
      default: return { bg: 'bg-slate-700', text: 'text-slate-300', border: 'border-slate-600', icon: null };
    }
  };

  const stats = [
    { name: 'Verified', value: report.claims.filter(c => c.status === 'verified').length, color: '#34d399' },
    { name: 'Warning', value: report.claims.filter(c => c.status === 'warning').length, color: '#fbbf24' },
    { name: 'Contradiction', value: report.claims.filter(c => c.status === 'contradiction').length, color: '#f87171' },
  ];

  return (
    <div className="h-full overflow-y-auto p-6 space-y-8 animate-fade-in scrollbar-thin">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
          <div className="relative z-10 flex flex-col justify-between h-full">
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
               <Activity className="w-4 h-4 text-scientific-500" /> Axiom Score
            </h3>
            <div className="mt-4">
               <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">{report.overallScore}</div>
               <p className="text-xs text-slate-500 mt-1 font-medium">Readiness Index</p>
            </div>
            
            <div className="mt-4 w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-scientific-600 to-scientific-400" style={{ width: `${report.overallScore}%` }}></div>
            </div>
          </div>
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-scientific-500/20 blur-3xl rounded-full pointer-events-none group-hover:bg-scientific-500/30 transition-all duration-500" />
        </div>

        <div className="glass-card rounded-2xl p-6 flex items-center justify-between">
          <div>
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">Claims Audited</h3>
            <div className="text-4xl font-bold text-white mt-2">{report.claims.length}</div>
            <div className="flex gap-2 mt-2">
                {stats.map(s => s.value > 0 && (
                    <div key={s.name} className="flex items-center gap-1 text-[10px] text-slate-400">
                        <span className="w-2 h-2 rounded-full" style={{background: s.color}}></span>
                        {s.value}
                    </div>
                ))}
            </div>
          </div>
          <div className="h-24 w-24 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                    data={stats} 
                    innerRadius={25} 
                    outerRadius={38} 
                    paddingAngle={5} 
                    dataKey="value"
                    stroke="none"
                >
                  {stats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                    contentStyle={{background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px'}}
                    itemStyle={{color: '#f8fafc'}}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
           <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
             <ShieldAlert className="w-4 h-4 text-scientific-400" /> Compliance Checks
           </h3>
           <ul className="space-y-3">
             {report.complianceIssues.length === 0 ? (
               <li className="text-audit-green text-sm flex items-center gap-2 bg-audit-green/5 p-2 rounded border border-audit-green/10">
                 <CheckCircle className="w-4 h-4" /> All checks passed
               </li>
             ) : (
               report.complianceIssues.slice(0, 3).map((issue, i) => (
                 <li key={i} className="text-slate-300 text-xs flex items-start gap-2 bg-white/5 p-2 rounded border border-white/5">
                   <AlertTriangle className="w-3.5 h-3.5 text-audit-yellow shrink-0 mt-0.5" />
                   <span className="leading-tight">{issue}</span>
                 </li>
               ))
             )}
           </ul>
        </div>
      </div>

      {/* Main Claims List */}
      <div>
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <div className="p-2 bg-white/5 rounded-lg border border-white/10">
             <FileCheck className="w-5 h-5 text-scientific-400" />
          </div>
          Verification Matrix
        </h3>
        <div className="space-y-4">
          {report.claims.map((claim) => {
             const styles = getStatusStyles(claim.status);
             return (
            <div key={claim.id} className="glass-card rounded-xl p-6 transition-all hover:border-white/20 hover:shadow-lg group">
              <div className="flex items-start gap-5">
                <div className={`mt-1 shrink-0 p-2 rounded-full ${styles.bg} border ${styles.border}`}>
                  {styles.icon}
                </div>
                <div className="flex-1">
                  <p className="text-slate-100 font-medium text-lg leading-relaxed font-sans">
                    "{claim.text}"
                  </p>
                  
                  <div className={`mt-4 p-4 rounded-lg text-sm ${styles.bg} border ${styles.border} backdrop-blur-sm`}>
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`font-bold uppercase text-[10px] tracking-widest ${styles.text}`}>
                        {claim.status}
                        </span>
                    </div>
                    <span className="text-slate-200 opacity-90">{claim.explanation}</span>
                  </div>

                  {claim.suggestion && (
                    <div className="mt-3 text-sm text-slate-400 flex items-start gap-3 bg-black/20 p-3 rounded-lg border border-white/5 ml-1">
                      <span className="text-scientific-400 font-bold text-xs uppercase shrink-0 mt-0.5 tracking-wider">Suggestion</span>
                      <span className="text-slate-300">{claim.suggestion}</span>
                    </div>
                  )}

                  {claim.sourceId && (
                    <div className="mt-3 flex items-center gap-4 text-xs text-slate-500 font-mono">
                      <span className="px-2 py-1 bg-white/5 rounded text-slate-400">ID: {claim.sourceId}</span>
                      <span className="flex items-center gap-1">
                        Confidence: 
                        <span className={`${claim.confidence > 0.8 ? 'text-audit-green' : 'text-audit-yellow'}`}>
                            {Math.round(claim.confidence * 100)}%
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )})}
        </div>
      </div>
    </div>
  );
};