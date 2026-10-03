import React, { useState } from 'react';
import { 
  Server, Shield, Terminal, Play, CheckCircle2, AlertOctagon, 
  ExternalLink, Plus, RefreshCw, Lock, ArrowRight, ShieldAlert,
  Cpu, FileCode, GitBranch
} from 'lucide-react';
import { OracleRegistry, AgentContract } from '../../types/oracle';
import { AGENT_CONTRACTS } from '../../data/mockRepositories';

interface AdminDashboardProps {
  currentRepo: OracleRegistry;
  repositories: OracleRegistry[];
  onSelectRepo: (repo: OracleRegistry) => void;
  onOpenPipeline: () => void;
  onAddCustomRepo: (name: string, framework: any, branch: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentRepo,
  repositories,
  onSelectRepo,
  onOpenPipeline,
  onAddCustomRepo
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRepoName, setNewRepoName] = useState('');
  const [newFramework, setNewFramework] = useState('React');
  const [newBranch, setNewBranch] = useState('main');
  const [selectedAgent, setSelectedAgent] = useState<AgentContract>(AGENT_CONTRACTS[0]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRepoName.trim()) return;
    onAddCustomRepo(newRepoName.trim(), newFramework as any, newBranch.trim() || 'main');
    setNewRepoName('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              ORACLE ADMINISTRATIVE CORE
            </span>
            <span className="text-slate-400 text-xs font-mono">• SSOT REGISTRY v4.9</span>
          </div>
          <h1 className="text-2xl font-bold font-cyber text-white">
            ADMIN & REPOSITORY REGISTRY
          </h1>
          <p className="text-xs text-slate-400">
            Control fleet registration, agent contract boundaries, pipeline execution, and immutable governance policies.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl glass-panel hover:bg-white/10 text-white font-cyber text-xs border border-white/10 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" /> Register Repository
          </button>
          <button
            onClick={onOpenPipeline}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-cyber font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(0,243,255,0.3)]"
          >
            <Play className="w-3.5 h-3.5 fill-black" /> Run 17-Step Pipeline
          </button>
        </div>
      </div>

      {/* Grid: Repo Registry List & Active Repo Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Repositories List (5 cols) */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h2 className="text-sm font-bold font-cyber text-white uppercase tracking-wider flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" /> Registered Repositories ({repositories.length})
            </h2>
            <span className="text-[11px] font-mono text-slate-400">Select to Target</span>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {repositories.map((repo) => {
              const isSelected = repo.repo.id === currentRepo.repo.id;
              return (
                <div
                  key={repo.repo.id}
                  onClick={() => onSelectRepo(repo)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-400/60 shadow-[0_0_15px_rgba(0,243,255,0.2)]'
                      : 'bg-black/30 border-white/5 hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold font-cyber text-white">{repo.repo.name}</span>
                        {repo.lock_state === 'protected' && (
                          <Lock className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-slate-400">
                        <span className="text-cyan-300 font-semibold">{repo.repo.framework}</span>
                        <span>•</span>
                        <span>{repo.repo.language}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-300">
                          <GitBranch className="w-3 h-3 text-slate-500" /> {repo.repo.branch}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-1.5 justify-end">
                        <span className={`text-xs font-mono font-bold ${
                          repo.health.score >= 80 ? 'text-emerald-400' :
                          repo.health.score >= 60 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {repo.health.score}/100
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                        {repo.health.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Repository Detail & SSOT Registry Card (7 cols) */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h2 className="text-base font-bold font-cyber text-white flex items-center gap-2">
                ACTIVE SSOT REGISTRY: <span className="text-cyan-300">{currentRepo.repo.name}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Commit: <code className="text-cyan-300 font-mono">{currentRepo.repo.commitHash}</code> • Owner: {currentRepo.repo.owner}
              </p>
            </div>
            <span className={`text-xs font-mono px-3 py-1 rounded-full border ${
              currentRepo.lock_state === 'protected' 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
            }`}>
              {currentRepo.lock_state === 'protected' ? 'SEALED: GREENLOCK' : 'STATE: PENDING SEAL'}
            </span>
          </div>

          {/* Metric grid of active repo */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-slate-400 font-mono uppercase text-[10px]">Framework</span>
              <p className="text-white font-bold font-cyber text-sm">{currentRepo.repo.framework}</p>
              <span className="text-[10px] text-slate-400">{currentRepo.repo.language}</span>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-slate-400 font-mono uppercase text-[10px]">Total Files</span>
              <p className="text-white font-bold font-cyber text-sm">{currentRepo.repo.totalFiles.toLocaleString()}</p>
              <span className="text-[10px] text-slate-400">{currentRepo.repo.linesOfCode.toLocaleString()} LOC</span>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-slate-400 font-mono uppercase text-[10px]">CI Build Status</span>
              <p className={`font-bold font-cyber text-sm ${currentRepo.ci.passing ? 'text-emerald-400' : 'text-red-400'}`}>
                {currentRepo.ci.passing ? 'PASSING' : 'FAILED'}
              </p>
              <span className="text-[10px] text-slate-400">{currentRepo.ci.buildDuration}</span>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-slate-400 font-mono uppercase text-[10px]">Deployment</span>
              <p className="text-white font-bold font-cyber text-sm truncate">{currentRepo.repo.deployment}</p>
              <span className="text-[10px] text-slate-400">Branch: {currentRepo.repo.branch}</span>
            </div>
          </div>

          {/* Governance Drift & Policy Violations */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-bold uppercase tracking-wider font-cyber">
                Governance Drift Analysis
              </span>
              <span className="font-mono text-cyan-400">{currentRepo.governance.score} / 100</span>
            </div>
            <p className="text-xs text-slate-300 font-mono">
              Drift: {currentRepo.governance.drift}
            </p>
            {currentRepo.governance.policyViolations.length > 0 && (
              <div className="space-y-1 pt-2 border-t border-white/5">
                <span className="text-[11px] text-red-400 font-bold uppercase">Active Policy Violations:</span>
                {currentRepo.governance.policyViolations.map((pv, i) => (
                  <p key={i} className="text-xs text-red-300 flex items-center gap-1.5 font-mono">
                    <AlertOctagon className="w-3 h-3 text-red-400 shrink-0" />
                    {pv}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Bottom Section: Agent Contracts Law Matrix */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
          <div>
            <h2 className="text-base font-bold font-cyber text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" /> AGENT CONTRACTS & GOVERNANCE PERMISSION BOUNDARIES
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Every agent must respect strict read/write boundaries. Contract violations immediately halt execution.
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-black/60 border border-white/10 text-cyan-300">
            Law: "No Agent Operates from Local Memory"
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Agent Picker (4 cols) */}
          <div className="md:col-span-4 space-y-1.5 max-h-[300px] overflow-y-auto">
            {AGENT_CONTRACTS.map((agent) => (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  selectedAgent.id === agent.id
                    ? 'bg-cyan-500/20 border-cyan-400 text-white'
                    : 'bg-black/30 border-white/5 text-slate-300 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-cyber font-bold text-xs">{agent.name}</span>
                  <span className="text-[10px] font-mono text-emerald-400">{agent.activeStatus}</span>
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">{agent.role}</p>
              </button>
            ))}
          </div>

          {/* Agent Detail Contract View (8 cols) */}
          <div className="md:col-span-8 p-4 rounded-xl bg-black/60 border border-cyan-500/20 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div>
                <h3 className="font-cyber font-bold text-sm text-cyan-300">{selectedAgent.name} Contract</h3>
                <p className="text-xs text-slate-400">{selectedAgent.role}</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ACTIVE LAW
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-900/80 border border-white/5 space-y-1">
                <span className="text-cyan-400 font-bold uppercase tracking-wider text-[10px] block">Read Permissions</span>
                <ul className="space-y-1 text-slate-300 font-mono text-[11px]">
                  {selectedAgent.permissions.read.map((r, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="text-cyan-500">•</span> {r}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/80 border border-white/5 space-y-1">
                <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px] block">Write Permissions</span>
                <ul className="space-y-1 text-slate-300 font-mono text-[11px]">
                  {selectedAgent.permissions.write.map((w, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="text-emerald-500">•</span> {w}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-red-950/20 border border-red-500/20 space-y-1">
                <span className="text-red-400 font-bold uppercase tracking-wider text-[10px] block">Strictly Prohibited</span>
                <ul className="space-y-1 text-slate-300 font-mono text-[11px]">
                  {selectedAgent.permissions.prohibited.map((p, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-red-300">
                      <span className="text-red-400">✕</span> {p}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/80 border border-white/5 space-y-1">
                <span className="text-yellow-400 font-bold uppercase tracking-wider text-[10px] block">Pre-requisites Required</span>
                <ul className="space-y-1 text-slate-300 font-mono text-[11px]">
                  {selectedAgent.permissions.requires.map((req, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="text-yellow-400">✓</span> {req}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Custom Repository Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel border border-cyan-500/40 rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-base font-bold font-cyber text-white">Register New Repository into SSOT</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-mono">Repository Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. quantum-gateway-api"
                  value={newRepoName}
                  onChange={(e) => setNewRepoName(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-mono">Framework Profile</label>
                <select
                  value={newFramework}
                  onChange={(e) => setNewFramework(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-cyan-400"
                >
                  <option value="Next.js">Next.js</option>
                  <option value="React">React</option>
                  <option value="Vite">Vite</option>
                  <option value="Astro">Astro</option>
                  <option value="Remix">Remix</option>
                  <option value="FastAPI">FastAPI</option>
                  <option value="Flask">Flask</option>
                  <option value="Go">Go</option>
                  <option value="Fiber">Fiber</option>
                  <option value="Rust">Rust</option>
                  <option value="Axum">Axum</option>
                  <option value="Solidity">Solidity</option>
                  <option value="Anchor">Anchor</option>
                  <option value="Solana">Solana</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-mono">Default Branch</label>
                <input
                  type="text"
                  value={newBranch}
                  onChange={(e) => setNewBranch(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-cyber font-bold"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
