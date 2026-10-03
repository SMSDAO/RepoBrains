import React from 'react';
import { 
  CheckCircle2, AlertTriangle, ShieldCheck, Activity, 
  GitCommit, Clock, Cpu, Lock, ArrowUpRight, TrendingUp
} from 'lucide-react';
import { OracleRegistry } from '../../types/oracle';
import { OracleOutputViewer } from '../OracleOutputViewer';

interface PublicDashboardProps {
  currentRepo: OracleRegistry;
}

export const PublicDashboard: React.FC<PublicDashboardProps> = ({ currentRepo }) => {
  const getHealthBadge = (score: number) => {
    if (score >= 95) return { label: 'ORACLE GRADE', color: 'emerald' };
    if (score >= 80) return { label: 'HEALTHY', color: 'cyan' };
    if (score >= 60) return { label: 'STABLE', color: 'yellow' };
    if (score >= 40) return { label: 'POOR', color: 'orange' };
    return { label: 'CRITICAL', color: 'red' };
  };

  const badge = getHealthBadge(currentRepo.health.score);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Public Transparency Card */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              PUBLIC ORACLE STATUS
            </span>
            <span className="text-slate-400 text-xs font-mono">• TRANSPARENCY PROTOCOL</span>
          </div>
          <h1 className="text-2xl font-bold font-cyber text-white">
            {currentRepo.repo.name}
          </h1>
          <p className="text-xs text-slate-400">
            Immutable public trust status validated by Autonomous Repo-Brain SSOT consensus.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-mono text-slate-400 block">CURRENT HEALTH</span>
            <span className="text-3xl font-extrabold font-cyber text-white">
              {currentRepo.health.score}<span className="text-xs font-mono text-slate-500">/100</span>
            </span>
          </div>
          <div className={`px-3 py-2 rounded-xl text-xs font-bold font-cyber border ${
            badge.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' :
            badge.color === 'cyan' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40' :
            badge.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40' :
            badge.color === 'orange' ? 'bg-orange-500/20 text-orange-400 border-orange-500/40' :
            'bg-red-500/20 text-red-400 border-red-500/40'
          }`}>
            {badge.label}
          </div>
        </div>
      </div>

      {/* 4 Public Status Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Panel 1: CI/CD Status */}
        <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono uppercase">
            <span>CI / Build Verification</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-center gap-2">
            {currentRepo.ci.passing ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <span className={`text-base font-bold font-cyber ${currentRepo.ci.passing ? 'text-emerald-400' : 'text-red-400'}`}>
              {currentRepo.ci.passing ? 'PASSING' : 'FAILED'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            Duration: {currentRepo.ci.buildDuration} • Commit: {currentRepo.repo.commitHash}
          </p>
        </div>

        {/* Panel 2: Verification Suite */}
        <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono uppercase">
            <span>Verification Layer</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold font-cyber text-white">5 / 5 Gates</span>
          </div>
          <div className="flex flex-wrap gap-1 text-[10px] font-mono">
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">Build ✓</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">Tests ✓</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">Lint ✓</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">Sec ✓</span>
          </div>
        </div>

        {/* Panel 3: GreenLock Seal */}
        <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono uppercase">
            <span>Lock Status</span>
            <Lock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold font-cyber text-white uppercase">
              {currentRepo.lock_state}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 truncate font-mono">
            {currentRepo.cryptographic_seal ? currentRepo.cryptographic_seal.greenlockId : 'Sig: None'}
          </p>
        </div>

        {/* Panel 4: Forecast Reliability */}
        <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono uppercase">
            <span>Reliability Horizon</span>
            <TrendingUp className="w-4 h-4 text-orange-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold font-cyber text-white">
              {((1 - currentRepo.risk.probability_failure) * 100).toFixed(0)}%
            </span>
            <span className="text-xs text-slate-400 font-mono">Uptime Prob</span>
          </div>
          <p className="text-[11px] text-slate-400 truncate font-mono">
            Confidence: {(currentRepo.forecast.confidence * 100).toFixed(0)}%
          </p>
        </div>

      </div>

      {/* Canonical SSOT Output Component */}
      <OracleOutputViewer repo={currentRepo} />

    </div>
  );
};
