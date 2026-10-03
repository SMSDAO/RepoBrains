import React, { useState } from 'react';
import { 
  Wrench, ShieldCheck, Check, AlertTriangle, FileCode, 
  Sparkles, RefreshCw, GitPullRequest, ArrowRight, ShieldAlert,
  Zap, Lock, Eye, Play
} from 'lucide-react';
import { OracleRegistry, RepairPlanItem } from '../../types/oracle';
import { generateSurgeonPatch } from '../../services/oracleEngine';

interface SurgeryDashboardProps {
  currentRepo: OracleRegistry;
  repairPlans: RepairPlanItem[];
  onApplyRepair: (repairId: string) => void;
  onUpdateRepo: (updated: OracleRegistry) => void;
  onOpenPipeline: () => void;
}

export const SurgeryDashboard: React.FC<SurgeryDashboardProps> = ({
  currentRepo,
  repairPlans,
  onApplyRepair,
  onUpdateRepo,
  onOpenPipeline
}) => {
  const [selectedPlan, setSelectedPlan] = useState<RepairPlanItem | null>(
    repairPlans[0] || null
  );
  const [isGeneratingCustomPatch, setIsGeneratingCustomPatch] = useState(false);
  const [customPatchIssue, setCustomPatchIssue] = useState('Dependency vulnerability in transitive lockfile');
  const [customPatchFile, setCustomPatchFile] = useState('package.json');
  const [customDiffPreview, setCustomDiffPreview] = useState<string | null>(null);

  const handleGenerateCustomPatch = async () => {
    setIsGeneratingCustomPatch(true);
    try {
      const result = await generateSurgeonPatch(
        customPatchIssue,
        customPatchFile,
        selectedPlan?.originalSnippet || '// Current target file'
      );
      setCustomDiffPreview(result.diff);
    } finally {
      setIsGeneratingCustomPatch(false);
    }
  };

  const handleExecuteSurgery = (item: RepairPlanItem) => {
    onApplyRepair(item.id);

    // Heals the repository state upon surgery
    const remainingVulns = currentRepo.security.vulnerabilities.filter(
      v => !item.title.toLowerCase().includes(v.package.toLowerCase())
    );

    const updated: OracleRegistry = {
      ...currentRepo,
      health: {
        score: Math.min(100, currentRepo.health.score + 28),
        status: currentRepo.health.score + 28 >= 80 ? 'HEALTHY' : 'STABLE'
      },
      security: {
        score: Math.min(100, currentRepo.security.score + 25),
        critical: Math.max(0, currentRepo.security.critical - 1),
        vulnerabilities: remainingVulns
      },
      ci: {
        ...currentRepo.ci,
        passing: true
      },
      risk: {
        ...currentRepo.risk,
        score: Math.max(8, currentRepo.risk.score - 35),
        probability_failure: Math.max(0.04, currentRepo.risk.probability_failure - 0.25)
      },
      last_repair: new Date().toISOString()
    };

    onUpdateRepo(updated);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-orange-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-orange-500/10 text-orange-400 border border-orange-500/30">
              ORACLE SURGEON & DOCTOR MODULES
            </span>
            <span className="text-slate-400 text-xs font-mono">• NON-DESTRUCTIVE REMEDIATION</span>
          </div>
          <h1 className="text-2xl font-bold font-cyber text-white">
            SURGERY & AUTONOMOUS REMEDIATION
          </h1>
          <p className="text-xs text-slate-400">
            Autonomous patch synthesis, git unified diff verification, and targeted regression-immune repair.
          </p>
        </div>

        <button
          onClick={onOpenPipeline}
          className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-cyber font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(255,107,0,0.4)] transition-all"
        >
          <Zap className="w-4 h-4 fill-black" /> Run Verification Suite
        </button>
      </div>

      {/* Main Surgery Grid: Repair Queue + Git Diff Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Repair Queue (5 cols) */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-5 border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h2 className="text-sm font-bold font-cyber text-white uppercase tracking-wider flex items-center gap-2">
              <Wrench className="w-4 h-4 text-orange-400" /> Active Repair Plans ({repairPlans.length})
            </h2>
            <span className="text-[11px] font-mono text-cyan-400">Target: {currentRepo.repo.name}</span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {repairPlans.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="text-sm font-bold font-cyber text-white">NO PENDING SURGERIES</h3>
                <p className="text-xs text-slate-400">Repository is currently at stable/healthy threshold.</p>
              </div>
            ) : (
              repairPlans.map((plan) => {
                const isSelected = selectedPlan?.id === plan.id;
                const isApplied = plan.status === 'APPLIED';

                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-orange-500/15 border-orange-400/60 shadow-[0_0_15px_rgba(255,107,0,0.2)]'
                        : 'bg-black/30 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className="text-xs font-bold font-cyber text-white block">
                          {plan.title}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                          <span>Target: <code className="text-cyan-300">{plan.targetFile}</code></span>
                          <span>•</span>
                          <span className="text-slate-300 uppercase">{plan.category}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                        {plan.riskReduction}
                      </span>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        isApplied ? 'bg-emerald-500/10 text-emerald-400' : 'bg-orange-500/10 text-orange-400'
                      }`}>
                        {plan.status}
                      </span>

                      {!isApplied && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExecuteSurgery(plan);
                          }}
                          className="px-3 py-1 rounded bg-orange-500 hover:bg-orange-400 text-black font-cyber font-bold text-[11px] flex items-center gap-1 transition-all"
                        >
                          <Play className="w-3 h-3 fill-black" /> Apply Patch
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Unified Git Diff Visualizer & Surgery Execution (7 cols) */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h2 className="text-base font-bold font-cyber text-white flex items-center gap-2">
                <FileCode className="w-5 h-5 text-cyan-400" /> SURGEON UNIFIED GIT DIFF VIEWER
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Target: <code className="text-cyan-300 font-mono">{selectedPlan?.targetFile || 'package.json'}</code>
              </p>
            </div>
            {selectedPlan && (
              <span className="text-xs font-mono text-emerald-400 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
                {selectedPlan.riskReduction}
              </span>
            )}
          </div>

          {/* Unified Diff Box */}
          <div className="p-4 rounded-xl bg-[#03060c] border border-cyan-500/20 font-mono text-xs max-h-[300px] overflow-y-auto space-y-1">
            {(customDiffPreview || selectedPlan?.diff || '').split('\n').map((line, i) => {
              const isAdd = line.startsWith('+') && !line.startsWith('+++');
              const isDel = line.startsWith('-') && !line.startsWith('---');
              const isHeader = line.startsWith('@@') || line.startsWith('---') || line.startsWith('+++');

              return (
                <div
                  key={i}
                  className={`px-2 py-0.5 rounded leading-relaxed ${
                    isAdd ? 'bg-emerald-950/60 text-emerald-300 font-semibold' :
                    isDel ? 'bg-red-950/60 text-red-300 line-through' :
                    isHeader ? 'text-cyan-400 font-bold' : 'text-slate-300'
                  }`}
                >
                  {line}
                </div>
              );
            })}
          </div>

          {/* Action Row */}
          {selectedPlan && (
            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white font-cyber">{selectedPlan.title}</span>
                <p className="text-[11px] text-slate-400">
                  Governance Policy: Strictly conforms to Non-Destructive Autonomous Rules
                </p>
              </div>

              <button
                disabled={selectedPlan.status === 'APPLIED'}
                onClick={() => handleExecuteSurgery(selectedPlan)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-black font-cyber font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,107,0,0.3)]"
              >
                {selectedPlan.status === 'APPLIED' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" /> Patch Applied & Verified
                  </>
                ) : (
                  <>
                    <Wrench className="w-4 h-4" /> Execute Surgery Patch
                  </>
                )}
              </button>
            </div>
          )}

          {/* AI Autonomous Custom Patch Generator */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-cyber text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" /> GEMINI AI SURGEON PATCH GENERATOR
              </span>
              <span className="text-[10px] font-mono text-cyan-400">Proxy: /api/oracle/generate-patch</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <input
                type="text"
                value={customPatchIssue}
                onChange={(e) => setCustomPatchIssue(e.target.value)}
                placeholder="Issue description..."
                className="bg-black/60 border border-white/10 rounded-lg p-2 text-white font-mono focus:border-cyan-400 focus:outline-none"
              />
              <input
                type="text"
                value={customPatchFile}
                onChange={(e) => setCustomPatchFile(e.target.value)}
                placeholder="Target file path..."
                className="bg-black/60 border border-white/10 rounded-lg p-2 text-white font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <button
              onClick={handleGenerateCustomPatch}
              disabled={isGeneratingCustomPatch}
              className="w-full py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-cyber font-bold flex items-center justify-center gap-2 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingCustomPatch ? 'animate-spin' : ''}`} />
              {isGeneratingCustomPatch ? 'Synthesizing Patch via Gemini AI...' : 'Synthesize AI Remediation Patch'}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
