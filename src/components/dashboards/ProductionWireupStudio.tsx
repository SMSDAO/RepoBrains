import React, { useState } from 'react';
import { 
  Database, Cpu, Globe, Layers, CheckCircle2, AlertTriangle, 
  Copy, Check, Wrench, RefreshCw, Zap, ArrowRight, ShieldCheck,
  FileCode, Play, Lock, ExternalLink
} from 'lucide-react';
import { ProductionWireupRepair, OracleRegistry } from '../../types/oracle';
import { INITIAL_PRODUCTION_WIREUP_REPAIRS } from '../../data/mockUserDataAndTrends';

interface ProductionWireupStudioProps {
  currentRepo: OracleRegistry;
  onUpdateRepo: (updated: OracleRegistry) => void;
}

export const ProductionWireupStudio: React.FC<ProductionWireupStudioProps> = ({
  currentRepo,
  onUpdateRepo
}) => {
  const [wireups, setWireups] = useState<ProductionWireupRepair[]>(INITIAL_PRODUCTION_WIREUP_REPAIRS);
  const [selectedWireup, setSelectedWireup] = useState<ProductionWireupRepair>(wireups[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [repairedNotice, setRepairedNotice] = useState<string | null>(null);

  const handleApplyWireupRepair = (wireup: ProductionWireupRepair) => {
    setWireups(prev => prev.map(w => w.id === wireup.id ? { ...w, connectionStatus: 'SYNCHRONIZED' } : w));
    setSelectedWireup(prev => prev.id === wireup.id ? { ...prev, connectionStatus: 'SYNCHRONIZED' } : prev);
    
    setRepairedNotice(`Production wire-up '${wireup.targetService}' repaired! Production Score upgraded from ${wireup.productionScoring.before}% to ${wireup.productionScoring.after}%.`);
    setTimeout(() => setRepairedNotice(null), 4000);

    // Boost repository production health
    const updated: OracleRegistry = {
      ...currentRepo,
      health: { score: Math.min(100, currentRepo.health.score + 14), status: 'ORACLE_GRADE' },
      ci: { ...currentRepo.ci, passing: true }
    };
    onUpdateRepo(updated);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5 font-bold">
              <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              PRODUCTION WIRE-UP & SDK/API ARCHITECTURE REPAIR
            </span>
            <span className="text-slate-400 text-xs font-mono">• ENTERPRISE EDITION</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white font-cyber tracking-tight">
            DB, SDK, API & UI WIRE-UP REPAIR STUDIO
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Automated production readiness diagnostics for database connection pooling, cloud storage SDKs, third-party APIs, and WebSocket UI gateways.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right font-mono">
            <span className="text-[10px] text-slate-400 uppercase block">Composite Production Score</span>
            <span className="text-3xl font-bold font-cyber text-emerald-400">97.4%</span>
          </div>
        </div>
      </div>

      {/* Repair Notice Toast */}
      {repairedNotice && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-between text-xs text-emerald-300 shadow-2xl animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-semibold">{repairedNotice}</span>
          </div>
          <button 
            onClick={() => setRepairedNotice(null)}
            className="text-xs font-mono text-emerald-400 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid: Wireup Cards + Code & Env Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Wire-up Service List (5 cols) */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h2 className="text-sm font-bold font-cyber text-white uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" /> Active Service Wire-ups ({wireups.length})
            </h2>
            <span className="text-[11px] font-mono text-slate-400">Target: {currentRepo.repo.name}</span>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {wireups.map((w) => {
              const isSelected = selectedWireup.id === w.id;
              const isSynced = w.connectionStatus === 'SYNCHRONIZED';

              return (
                <div
                  key={w.id}
                  onClick={() => setSelectedWireup(w)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-400 shadow-[0_0_15px_rgba(0,243,255,0.2)]'
                      : 'bg-black/30 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-cyber text-white">{w.targetService}</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-cyan-300 uppercase">
                          {w.wireupType}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{w.issueDescription}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        isSynced ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                      }`}>
                        {w.connectionStatus.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>Prod Score: <strong className="text-white">{w.productionScoring.before}% → {w.productionScoring.after}%</strong></span>
                    <span className="text-emerald-400">{w.productionScoring.latencyReduction}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Wire-up Detail & Production Code Generator (7 cols) */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase">SERVICE ID: {selectedWireup.id}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  selectedWireup.connectionStatus === 'SYNCHRONIZED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-orange-500/10 text-orange-400'
                }`}>
                  {selectedWireup.connectionStatus}
                </span>
              </div>
              <h3 className="text-base font-bold font-cyber text-white">{selectedWireup.targetService}</h3>
            </div>

            <button
              onClick={() => handleApplyWireupRepair(selectedWireup)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-cyber font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(52,211,153,0.3)]"
            >
              <Wrench className="w-3.5 h-3.5" />
              Repair Wire-Up Invariant
            </button>
          </div>

          {/* Production Scoring Card */}
          <div className="grid grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase">Production Score</span>
              <div className="flex items-center gap-2 font-bold">
                <span className="text-red-400">{selectedWireup.productionScoring.before}%</span>
                <span>→</span>
                <span className="text-emerald-400 text-sm font-cyber">{selectedWireup.productionScoring.after}%</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase">Latency Reduction</span>
              <p className="text-cyan-300 font-bold">{selectedWireup.productionScoring.latencyReduction}</p>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase">Reliability Gain</span>
              <p className="text-emerald-400 font-bold">{selectedWireup.productionScoring.reliabilityGain}</p>
            </div>
          </div>

          {/* Environment Variables Required */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-white/10 space-y-2 text-xs font-mono">
            <span className="text-slate-400 uppercase text-[10px] font-bold block">
              Required Production Environment Variables (.env / Secrets Manager):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedWireup.envVarsRequired.map((env, i) => (
                <code key={i} className="px-2 py-0.5 rounded bg-black border border-cyan-500/30 text-cyan-300 text-[11px]">
                  {env}
                </code>
              ))}
            </div>
          </div>

          {/* Production Code Snippet */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Repaired Production Code Output:</span>
              <button
                onClick={() => copyToClipboard(selectedWireup.repairedCodeSnippet, selectedWireup.id)}
                className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300"
              >
                {copiedId === selectedWireup.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedId === selectedWireup.id ? 'Copied' : 'Copy Code'}
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-[#03060c] border border-cyan-500/20 font-mono text-xs text-cyan-200 max-h-[220px] overflow-y-auto leading-relaxed">
              {selectedWireup.repairedCodeSnippet}
            </pre>
          </div>
        </div>

      </div>

    </div>
  );
};
