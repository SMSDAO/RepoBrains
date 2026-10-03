import React, { useState } from 'react';
import { 
  Server, ShieldCheck, AlertTriangle, Layers, Wrench, 
  CheckCircle2, RefreshCw, ArrowUpRight, Zap, GitBranch, Lock
} from 'lucide-react';
import { OracleRegistry } from '../../types/oracle';

interface FleetDashboardProps {
  repositories: OracleRegistry[];
  onSelectRepo: (repo: OracleRegistry) => void;
  onOpenPipeline: () => void;
  onBulkRemediation: () => void;
}

export const FleetDashboard: React.FC<FleetDashboardProps> = ({
  repositories,
  onSelectRepo,
  onOpenPipeline,
  onBulkRemediation
}) => {
  const [isBulkRunning, setIsBulkRunning] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<number | null>(null);

  const avgHealth = Math.round(
    repositories.reduce((acc, r) => acc + r.health.score, 0) / repositories.length
  );
  const totalVulns = repositories.reduce(
    (acc, r) => acc + r.security.vulnerabilities.length, 0
  );
  const totalLoc = repositories.reduce(
    (acc, r) => acc + r.repo.linesOfCode, 0
  );
  const lockedCount = repositories.filter(r => r.lock_state === 'protected').length;

  const handleRunBulk = () => {
    setIsBulkRunning(true);
    setBulkProgress(15);
    setTimeout(() => setBulkProgress(50), 600);
    setTimeout(() => setBulkProgress(85), 1200);
    setTimeout(() => {
      setBulkProgress(100);
      setIsBulkRunning(false);
      onBulkRemediation();
      setTimeout(() => setBulkProgress(null), 1500);
    }, 1800);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              FLEET MODULE
            </span>
            <span className="text-slate-400 text-xs font-mono">• MULTI-REPOSITORY FEDERATION</span>
          </div>
          <h1 className="text-2xl font-bold font-cyber text-white">
            MULTI-REPOSITORY FLEET GOVERNANCE
          </h1>
          <p className="text-xs text-slate-400">
            Cross-repository synchronization, global dependency drift mitigation, and fleet-wide autonomous remediation.
          </p>
        </div>

        <button
          onClick={handleRunBulk}
          disabled={isBulkRunning}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:from-slate-800 disabled:to-slate-800 text-black font-cyber font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all"
        >
          {isBulkRunning ? <RefreshCw className="w-4 h-4 animate-spin text-black" /> : <Zap className="w-4 h-4 fill-black" />}
          {isBulkRunning ? `Remediating Fleet (${bulkProgress}%)` : 'Execute Fleet-Wide Autonomous Remediation'}
        </button>
      </div>

      {/* 4 Fleet Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-2">
          <span className="text-xs font-mono text-slate-400 uppercase">Composite Fleet Health</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-cyber text-white">{avgHealth}</span>
            <span className="text-xs font-mono text-cyan-400">/ 100</span>
          </div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
            <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${avgHealth}%` }} />
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-2">
          <span className="text-xs font-mono text-slate-400 uppercase">Repositories Managed</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-cyber text-white">{repositories.length}</span>
            <span className="text-xs font-mono text-slate-400">Nodes</span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">{totalLoc.toLocaleString()} total lines of code</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-2">
          <span className="text-xs font-mono text-slate-400 uppercase">Fleet Vulnerabilities</span>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold font-cyber ${totalVulns > 0 ? 'text-orange-400' : 'text-emerald-400'}`}>
              {totalVulns}
            </span>
            <span className="text-xs font-mono text-slate-400">Active</span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">100% auto-remediable via Surgeon</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-2">
          <span className="text-xs font-mono text-slate-400 uppercase">GreenLock Sealed</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-cyber text-emerald-400">{lockedCount}</span>
            <span className="text-xs font-mono text-slate-400">/ {repositories.length} Protected</span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">Cryptographic authority verified</p>
        </div>
      </div>

      {/* Fleet Repositories Table */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h2 className="text-base font-bold font-cyber text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-cyan-400" /> FLEET REGISTRY MATRIX & POLICIES
          </h2>
          <span className="text-xs font-mono text-cyan-400">Synchronized with Oracle Registry</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px]">
                <th className="pb-3 font-semibold">Repository</th>
                <th className="pb-3 font-semibold">Framework / Stack</th>
                <th className="pb-3 font-semibold">Health Score</th>
                <th className="pb-3 font-semibold">CI Status</th>
                <th className="pb-3 font-semibold">Risk Level</th>
                <th className="pb-3 font-semibold">GreenLock</th>
                <th className="pb-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {repositories.map((repo) => (
                <tr key={repo.repo.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 pr-4">
                    <div className="font-cyber font-bold text-white text-xs">{repo.repo.name}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <GitBranch className="w-3 h-3 text-slate-500" />
                      <span>{repo.repo.branch}</span>
                      <span>•</span>
                      <span>{repo.repo.commitHash}</span>
                    </div>
                  </td>

                  <td className="py-3.5 pr-4">
                    <span className="text-cyan-300 font-bold">{repo.repo.framework}</span>
                    <span className="text-slate-400 ml-1.5">({repo.repo.language})</span>
                  </td>

                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${
                        repo.health.score >= 80 ? 'text-emerald-400' :
                        repo.health.score >= 60 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {repo.health.score}/100
                      </span>
                      <span className="text-[10px] text-slate-500">[{repo.health.status}]</span>
                    </div>
                  </td>

                  <td className="py-3.5 pr-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      repo.ci.passing ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {repo.ci.passing ? 'PASSING' : 'FAILING'}
                    </span>
                  </td>

                  <td className="py-3.5 pr-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                      repo.risk.score < 25 ? 'bg-emerald-500/10 text-emerald-400' :
                      repo.risk.score < 60 ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {repo.risk.score} pts ({repo.risk.blast_radius})
                    </span>
                  </td>

                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-1.5">
                      <Lock className={`w-3.5 h-3.5 ${repo.lock_state === 'protected' ? 'text-emerald-400' : 'text-yellow-400'}`} />
                      <span className="capitalize text-slate-300">{repo.lock_state}</span>
                    </div>
                  </td>

                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => onSelectRepo(repo)}
                      className="px-3 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-mono transition-colors"
                    >
                      Inspect Node →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
