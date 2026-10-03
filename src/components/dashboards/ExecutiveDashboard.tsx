import React, { useState } from 'react';
import { 
  ShieldCheck, AlertTriangle, Activity, Wrench, Zap, 
  TrendingUp, Lock, ArrowUpRight, CheckCircle2, ShieldAlert,
  Server, Cpu, Eye, FileText, Check, DollarSign, Clock,
  Filter, AlertOctagon, Flame, ChevronRight, Download, GitPullRequest, Sparkles
} from 'lucide-react';
import { OracleRegistry, RepairPlanItem } from '../../types/oracle';
import { ExecutiveTrendChart } from '../ExecutiveTrendChart';
import { StreamingCommunityFeed } from '../StreamingCommunityFeed';

interface ExecutiveDashboardProps {
  currentRepo: OracleRegistry;
  fleetRepos: OracleRegistry[];
  repairQueue: RepairPlanItem[];
  onOpenPipeline: () => void;
  onNavigateTab: (tab: string) => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  currentRepo,
  fleetRepos,
  repairQueue,
  onOpenPipeline,
  onNavigateTab
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM'>('ALL');
  const [selectedEventModal, setSelectedEventModal] = useState<any | null>(null);
  const [showBoardReportModal, setShowBoardReportModal] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Aggregated fleet metrics
  const totalFleetRepos = currentRepo.fleet.total_repositories;
  const avgFleetHealth = Math.round(
    fleetRepos.reduce((acc, r) => acc + r.health.score, 0) / fleetRepos.length
  );
  const criticalRepos = fleetRepos.filter(r => r.health.score < 40).length;
  const stableRepos = fleetRepos.filter(r => r.health.score >= 40 && r.health.score < 80).length;
  const oracleGradeRepos = fleetRepos.filter(r => r.health.score >= 80).length;
  const totalActiveVulns = fleetRepos.reduce((acc, r) => acc + r.security.vulnerabilities.length, 0);

  // Security Events Feed for Stakeholders
  const securityEvents = [
    {
      id: 'SEC-EV-101',
      repoName: 'enterprise-cloud-portal',
      type: 'SSRF Vulnerability Detected',
      severity: 'CRITICAL',
      cve: 'CVE-2024-34351',
      description: 'Server Actions redirect parameter manipulation vector detected in next@14.1.0.',
      financialExposure: '$140,000 / day',
      actionableFix: 'Deploy Surgeon patch REP-003-1 (Next.js 14.2.7 upgrade)',
      timestamp: '14 mins ago',
      status: 'AWAITING_APPROVAL'
    },
    {
      id: 'SEC-EV-102',
      repoName: 'solana-amm-dex-router',
      type: 'Unchecked Authority Invariant',
      severity: 'HIGH',
      cve: 'CVE-2024-8199',
      description: 'Missing account owner verification check in cross-swap callback.',
      financialExposure: '$420,000 at risk in pool',
      actionableFix: 'Apply constraint assertion macro in Anchor program',
      timestamp: '42 mins ago',
      status: 'PATCH_READY'
    },
    {
      id: 'SEC-EV-103',
      repoName: 'fintech-edge-gateway',
      type: 'PBKDF2 Cryptographic Loop Anomaly',
      severity: 'MEDIUM',
      cve: 'CVE-2024-24786',
      description: 'High computational iteration bound in legacy crypto utility.',
      financialExposure: 'Service Latency Degradation',
      actionableFix: 'Auto-bump golang.org/x/crypto to v0.24.0',
      timestamp: '2 hours ago',
      status: 'AUTO_RESOLVED'
    },
    {
      id: 'SEC-EV-104',
      repoName: 'hyperliquid-vault-core',
      type: 'SOC2 Drift Verification Pass',
      severity: 'MEDIUM',
      cve: 'POLICY-GOV-SOC2',
      description: 'All 412 source files cryptographically sealed under GreenLock GLOCK-AXUM-992.',
      financialExposure: '$0 (Compliant)',
      actionableFix: 'No action required - GreenLock verified',
      timestamp: '3 hours ago',
      status: 'PROTECTED'
    }
  ];

  const filteredEvents = securityEvents.filter(ev => {
    if (selectedSeverity === 'ALL') return true;
    return ev.severity === selectedSeverity;
  });

  const handleApproveAllSafe = () => {
    setActionSuccessMessage('Executive Authorization confirmed: 3 queued non-destructive patches scheduled for GreenLock deployment.');
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Action Notification Toast */}
      {actionSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-between text-xs text-emerald-300 shadow-2xl animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold">{actionSuccessMessage}</span>
          </div>
          <button 
            onClick={() => setActionSuccessMessage(null)}
            className="text-emerald-400 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Hero Banner: Executive Governance Command Center */}
      <div className="p-6 rounded-2xl glass-panel relative overflow-hidden border border-cyan-500/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                EXECUTIVE INTELLIGENCE & GOVERNANCE
              </span>
              <span className="text-slate-400 text-xs font-mono">• SINGLE SOURCE OF TRUTH (SSOT)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white font-cyber tracking-tight">
              EXECUTIVE BOARD & FLEET GOVERNANCE DASHBOARD
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Real-time operational health, audit compliance, financial risk exposure, and autonomous repair pipeline across <strong className="text-white">{totalFleetRepos} multi-stack production repositories</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('repoprompt')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 hover:from-cyan-400 hover:to-blue-400 text-black font-cyber font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all"
            >
              <Sparkles className="w-4 h-4" />
              REPO PROMPT (COPILOT)
            </button>
            <button
              onClick={() => onNavigateTab('admission')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-cyber font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(255,107,0,0.35)] transition-all"
            >
              <GitPullRequest className="w-4 h-4" />
              PR REPAIR BOX
            </button>
            <button
              onClick={() => setShowBoardReportModal(true)}
              className="px-4 py-2.5 rounded-xl glass-panel hover:bg-white/10 text-white font-cyber text-xs border border-white/10 flex items-center gap-2 transition-all"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              BOARD AUDIT REPORT
            </button>
            <button
              onClick={handleApproveAllSafe}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-cyber font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(52,211,153,0.3)] transition-all"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              AUTHORIZE ALL SAFE PATCHES
            </button>
            <button
              onClick={onOpenPipeline}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-cyber font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all"
            >
              <Zap className="w-4 h-4 fill-black" />
              RUN PIPELINE
            </button>
          </div>
        </div>
      </div>

      {/* 5 Primary Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Metric 1: Fleet Health Index */}
        <div className="p-5 rounded-2xl glass-panel border border-cyan-500/20 relative overflow-hidden group hover:border-cyan-400/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Fleet Health</span>
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-cyber">{avgFleetHealth}</span>
              <span className="text-xs font-mono text-cyan-400">/ 100</span>
              <span className="ml-auto text-[10px] font-mono text-emerald-400 flex items-center">
                +4.2% <TrendingUp className="w-3 h-3 ml-0.5" />
              </span>
            </div>
            <div className="mt-2.5 w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full rounded-full" style={{ width: `${avgFleetHealth}%` }} />
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>{oracleGradeRepos} Oracle Grade</span>
            <span className="text-red-400">{criticalRepos} Critical</span>
          </div>
        </div>

        {/* Metric 2: Governance Compliance Rate */}
        <div className="p-5 rounded-2xl glass-panel border border-emerald-500/20 relative overflow-hidden group hover:border-emerald-400/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Governance</span>
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-cyber">96.8%</span>
              <span className="ml-auto text-[10px] font-mono text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                SOC2 / ISO
              </span>
            </div>
            <div className="mt-2.5 w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: '96.8%' }} />
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Zero-Trust Policy</span>
            <span className="text-emerald-300">0 Drift</span>
          </div>
        </div>

        {/* Metric 3: Active Risks & Blast Radius */}
        <div className="p-5 rounded-2xl glass-panel border border-red-500/20 relative overflow-hidden group hover:border-red-400/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Active Risks</span>
              <div className="p-1.5 rounded-lg bg-red-500/10 text-red-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-cyber">{totalActiveVulns}</span>
              <span className="text-xs font-mono text-red-400">CVEs</span>
              <span className="ml-auto text-[10px] font-mono text-red-400 px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20">
                {currentRepo.risk.blast_radius}
              </span>
            </div>
            <div className="mt-2.5 w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-400 to-red-500 h-full rounded-full" style={{ width: `${currentRepo.risk.score}%` }} />
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Max Blast Radius</span>
            <span className="text-orange-300">Fleet-Wide</span>
          </div>
        </div>

        {/* Metric 4: Repair Queue & MTTR */}
        <div className="p-5 rounded-2xl glass-panel border border-orange-500/20 relative overflow-hidden group hover:border-orange-400/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Repair Queue</span>
              <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400">
                <Wrench className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-cyber">{repairQueue.length}</span>
              <span className="text-xs font-mono text-orange-400">Patches</span>
              <span className="ml-auto text-[10px] font-mono text-emerald-400">
                85% Auto
              </span>
            </div>
            <div className="mt-2.5 w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div className="bg-orange-400 h-full rounded-full" style={{ width: '85%' }} />
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>MTTR Efficacy</span>
            <span className="text-cyan-300">3.8 minutes</span>
          </div>
        </div>

        {/* Metric 5: GreenLock Sealed Repositories */}
        <div className="p-5 rounded-2xl glass-panel border border-yellow-500/20 relative overflow-hidden group hover:border-yellow-400/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">GreenLock Status</span>
              <div className="p-1.5 rounded-lg bg-yellow-500/10 text-yellow-400">
                <Lock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-cyber text-white uppercase truncate">
                {currentRepo.lock_state.replace('_', ' ')}
              </span>
            </div>
            <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-mono text-slate-300">
              <span className={`w-2 h-2 rounded-full ${currentRepo.lock_state === 'protected' ? 'bg-emerald-400' : 'bg-yellow-400 animate-pulse'}`} />
              <span>{currentRepo.lock_state === 'protected' ? 'Cryptographically Sealed' : 'Awaiting Seal'}</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Sig Verified</span>
            <span className="text-cyan-300">SHA-256</span>
          </div>
        </div>

      </div>

      {/* Mini-Trend Recharts Visualizer: 30-Day Health & Failure Incidents Trajectory */}
      <ExecutiveTrendChart
        currentRepoName={currentRepo.repo.name}
        currentHealthScore={currentRepo.health.score}
      />

      {/* Middle Section: Active Risks & Repair Queue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Active Risks & Predictive Failure Radar (7 cols) */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-400" />
              <div>
                <h2 className="text-base font-bold text-white font-cyber tracking-wide">
                  ACTIVE BUSINESS RISKS & PREDICTIVE FORECAST
                </h2>
                <p className="text-xs text-slate-400">Prioritized by financial blast radius and failure probability</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('surgery')}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
            >
              Open Surgeon <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Actionable Executive Callout: Forecast Engine */}
          <div className="p-4 rounded-xl glass-orange border border-orange-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-cyber font-bold text-orange-400 flex items-center gap-1.5">
                <Cpu className="w-4 h-4" /> PREDICTIVE FAILURE MITIGATION ALERT
              </span>
              <span className="font-mono text-slate-400 bg-black/40 px-2 py-0.5 rounded border border-orange-500/20">
                Confidence: {(currentRepo.forecast.confidence * 100).toFixed(0)}%
              </span>
            </div>
            <p className="text-xs text-white font-medium leading-relaxed">
              "{currentRepo.forecast.next_failure}"
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-orange-500/20 text-[11px] font-mono text-slate-300">
              <div>
                <span className="text-orange-400 font-semibold">Predicted Root Cause: </span>
                <span>{currentRepo.forecast.root_cause_prediction}</span>
              </div>
              <div className="sm:text-right">
                <span className="text-emerald-400 font-semibold">Remediation: </span>
                <span>Non-Destructive AST Patch Ready</span>
              </div>
            </div>
          </div>

          {/* Granular Active Risks List */}
          <div className="space-y-3">
            {currentRepo.security.vulnerabilities.map((v) => (
              <div 
                key={v.id} 
                onClick={() => setSelectedEventModal({
                  title: `${v.package} (${v.cve || v.id})`,
                  severity: v.severity,
                  issue: v.issue,
                  fixedIn: v.fixedIn || '14.2.7',
                  riskScore: currentRepo.risk.score,
                  blastRadius: currentRepo.risk.blast_radius
                })}
                className="p-3.5 rounded-xl bg-black/40 border border-white/10 hover:border-cyan-500/40 cursor-pointer transition-all flex items-start justify-between gap-4 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                      v.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      v.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                      'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {v.severity}
                    </span>
                    <span className="text-xs font-mono font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {v.package}
                    </span>
                    {v.cve && <span className="text-[11px] font-mono text-slate-400">{v.cve}</span>}
                  </div>
                  <p className="text-xs text-slate-300 leading-snug">{v.issue}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 block">
                    Auto-Remediable
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono mt-1 flex items-center justify-end gap-1">
                    Details <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Surgeon Repair Queue & Executive Approvals (5 cols) */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-white/10 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-cyan-400" />
                <div>
                  <h2 className="text-base font-bold text-white font-cyber tracking-wide">
                    SURGEON REPAIR QUEUE
                  </h2>
                  <p className="text-xs text-slate-400">Autonomous remediation workflow</p>
                </div>
              </div>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                {repairQueue.length} Queued
              </span>
            </div>

            <div className="space-y-3 mt-3">
              {repairQueue.slice(0, 3).map((item) => (
                <div key={item.id} className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2">
                  <div className="flex items-start justify-between text-xs">
                    <span className="font-bold text-white font-cyber">{item.title}</span>
                    <span className="text-emerald-400 font-mono text-[11px] shrink-0">{item.riskReduction}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Target: <code className="text-cyan-300">{item.targetFile}</code></span>
                    <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300 uppercase">{item.category}</span>
                  </div>
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      item.status === 'APPLIED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-orange-500/10 text-orange-400'
                    }`}>
                      {item.status}
                    </span>
                    <button
                      onClick={() => onNavigateTab('surgery')}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
                    >
                      Review Diff <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick SLA / ROI Barometer */}
          <div className="mt-4 p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between text-slate-300 font-bold">
              <span>SLA Incident Recovery Time</span>
              <span className="text-emerald-400">3.8 min vs 4.2 days manual</span>
            </div>
            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: '95%' }} />
            </div>
            <p className="text-[11px] text-slate-400">
              Estimated engineering hours saved this cycle: <strong className="text-cyan-300">142 hours</strong>
            </p>
          </div>
        </div>

      </div>

      {/* Streaming Community Feed (Enterprise Live Event Broadcast) */}
      <StreamingCommunityFeed />

      {/* Bottom Section: Real-Time Security Events Stream */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-white/10">
          <div>
            <h2 className="text-base font-bold font-cyber text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-red-400" /> REAL-TIME SECURITY EVENTS & THREAT RADAR
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live audit events captured by AI-Guard, Firewall, and Hospital agents across all repositories.
            </p>
          </div>

          {/* Severity Filters */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                  selectedSeverity === sev
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(0,243,255,0.2)]'
                    : 'text-slate-400 hover:text-white bg-black/40 border border-white/5'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Security Events Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px]">
                <th className="pb-3 font-semibold">Event ID & Repository</th>
                <th className="pb-3 font-semibold">Threat Vector</th>
                <th className="pb-3 font-semibold">Severity</th>
                <th className="pb-3 font-semibold">Business / Financial Exposure</th>
                <th className="pb-3 font-semibold">Actionable Remediation</th>
                <th className="pb-3 font-semibold">Timestamp</th>
                <th className="pb-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredEvents.map((ev) => (
                <tr key={ev.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 pr-4">
                    <span className="text-cyan-300 font-bold font-cyber">{ev.id}</span>
                    <span className="text-slate-300 block text-[11px] font-mono mt-0.5">{ev.repoName}</span>
                  </td>

                  <td className="py-3.5 pr-4">
                    <span className="text-white font-semibold">{ev.type}</span>
                    <span className="text-[11px] text-slate-400 block font-mono">{ev.cve}</span>
                  </td>

                  <td className="py-3.5 pr-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ev.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      ev.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                      'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {ev.severity}
                    </span>
                  </td>

                  <td className="py-3.5 pr-4 text-slate-300">
                    <span className="text-orange-300 font-semibold">{ev.financialExposure}</span>
                  </td>

                  <td className="py-3.5 pr-4 text-slate-300 max-w-xs truncate">
                    {ev.actionableFix}
                  </td>

                  <td className="py-3.5 pr-4 text-slate-400 text-[11px]">
                    {ev.timestamp}
                  </td>

                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => onNavigateTab('surgery')}
                      className="px-3 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-mono transition-colors"
                    >
                      Remediate →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Board Audit Report Modal */}
      {showBoardReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel border border-cyan-500/40 rounded-2xl p-6 w-full max-w-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold font-cyber text-white">
                  EXECUTIVE BOARD AUDIT REPORT (SSOT COMPLIANCE)
                </h3>
              </div>
              <button 
                onClick={() => setShowBoardReportModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-mono">
              <div className="p-3 rounded-lg bg-black/60 border border-white/10 space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>AUDIT PERIOD: Q4 2026</span>
                  <span>STATUS: SOC2 TYPE-II COMPLIANT</span>
                </div>
                <div className="text-cyan-300 font-bold">
                  OVERALL FLEET HEALTH: {avgFleetHealth} / 100 • RESILIENCE INDEX: 99.4%
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-950 border border-white/5 space-y-1">
                  <span className="text-slate-400 uppercase text-[10px]">Zero-Trust Enforcement</span>
                  <p className="text-emerald-400 font-bold">100% Verified</p>
                  <p className="text-slate-400 text-[10px]">Direct production pushes blocked: 18</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-white/5 space-y-1">
                  <span className="text-slate-400 uppercase text-[10px]">GreenLock Sealed Nodes</span>
                  <p className="text-cyan-400 font-bold">{oracleGradeRepos} of {totalFleetRepos} Repositories</p>
                  <p className="text-slate-400 text-[10px]">ECDSA Governance Signatures Verified</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-white/5 space-y-1">
                <span className="text-slate-400 uppercase text-[10px]">Executive Summary Directives:</span>
                <ul className="space-y-1 list-disc list-inside text-slate-300 text-[11px]">
                  <li>Mandate automated Next.js 14.2.7 upgrade to eliminate SSRF vector in cloud portal.</li>
                  <li>Authorize GreenLock seal on Anchor program ID updates.</li>
                  <li>Maintain strict SSOT consensus; enforce zero agent local memory policies.</li>
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400">Authoritative Hash: 0x9924a...71b</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowBoardReportModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowBoardReportModal(false);
                    setActionSuccessMessage('Executive Board Audit Report exported to secure ledger.');
                  }}
                  className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-cyber font-bold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Export PDF / CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Incident Drill-Down Detail Modal */}
      {selectedEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel border border-cyan-500/40 rounded-2xl p-6 w-full max-w-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <h3 className="text-sm font-bold font-cyber text-white">
                  RISK INCIDENT DOSSIER
                </h3>
              </div>
              <button 
                onClick={() => setSelectedEventModal(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-black/60 border border-white/10 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-cyan-300 font-bold">{selectedEventModal.title}</span>
                  <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-mono font-bold">
                    {selectedEventModal.severity}
                  </span>
                </div>
                <p className="text-slate-300 mt-1">{selectedEventModal.issue}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                <div className="p-2.5 rounded bg-slate-950 border border-white/5">
                  <span className="text-slate-400 block text-[10px]">Blast Radius:</span>
                  <span className="text-red-400 font-bold">{selectedEventModal.blastRadius}</span>
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-white/5">
                  <span className="text-slate-400 block text-[10px]">Remediation Target:</span>
                  <span className="text-emerald-400 font-bold">Fixed in v{selectedEventModal.fixedIn}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedEventModal(null)}
                className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs font-mono"
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  setSelectedEventModal(null);
                  onNavigateTab('surgery');
                }}
                className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-cyber font-bold flex items-center gap-1"
              >
                Launch Surgery Patch <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
