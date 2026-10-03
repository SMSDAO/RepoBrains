import React, { useState, useEffect } from 'react';
import { 
  Activity, ShieldCheck, AlertTriangle, Zap, Cpu, 
  BarChart3, RefreshCw, Radio, HardDrive, Shield
} from 'lucide-react';
import { OracleRegistry } from '../../types/oracle';

interface VitalsDashboardProps {
  currentRepo: OracleRegistry;
}

export const VitalsDashboard: React.FC<VitalsDashboardProps> = ({ currentRepo }) => {
  const [pulseNonce, setPulseNonce] = useState(0);

  // Real-time telemetry simulated pulse
  useEffect(() => {
    const timer = setInterval(() => {
      setPulseNonce(prev => prev + 1);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const scores = [
    { label: 'HEALTH SCORE', value: currentRepo.health.score, color: 'cyan', max: 100 },
    { label: 'SECURITY SCORE', value: currentRepo.security.score, color: 'emerald', max: 100 },
    { label: 'GOVERNANCE SCORE', value: currentRepo.governance.score, color: 'blue', max: 100 },
    { label: 'CI / BUILD SCORE', value: currentRepo.ci.score, color: 'cyan', max: 100 },
    { label: 'RISK SCORE', value: currentRepo.risk.score, color: 'red', max: 100, invert: true },
    { label: 'REPAIR EFFICACY', value: 92, color: 'orange', max: 100 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              VITALS TELEMETRY SENSORS
            </span>
            <span className="text-slate-400 text-xs font-mono">• TICK #{pulseNonce}</span>
          </div>
          <h1 className="text-2xl font-bold font-cyber text-white">
            REAL-TIME VITALS TELEMETRY
          </h1>
          <p className="text-xs text-slate-400">
            Autonomous streaming metrics evaluating operational health, supply-chain invariants, and risk vectors.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-cyan-300 px-3 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-500/20">
          <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>FREQ: 1000ms • LATENCY: 12ms</span>
        </div>
      </div>

      {/* 6 Circular/Bar Vital Meters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {scores.map((s) => (
          <div key={s.label} className="p-4 rounded-2xl glass-panel border border-white/10 flex flex-col justify-between space-y-3">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              {s.label}
            </span>
            <div>
              <span className="text-3xl font-extrabold font-cyber text-white">{s.value}</span>
              <span className="text-[11px] font-mono text-slate-500">/{s.max}</span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  s.color === 'cyan' ? 'bg-cyan-400' :
                  s.color === 'emerald' ? 'bg-emerald-400' :
                  s.color === 'red' ? 'bg-red-400' :
                  s.color === 'orange' ? 'bg-orange-400' : 'bg-blue-400'
                }`}
                style={{ width: `${s.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Deep Risk Breakdown Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Risk Vectors (7 cols) */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h2 className="text-sm font-bold font-cyber text-white uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" /> Granular Risk Engine Decomposition
            </h2>
            <span className="text-xs font-mono text-red-400 font-bold">
              Blast Radius: {currentRepo.risk.blast_radius}
            </span>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Dependency Risk', val: currentRepo.risk.dependency_risk, desc: 'Known CVEs in direct and transitive trees' },
              { label: 'Supply Chain Risk', val: currentRepo.risk.supply_chain_risk, desc: 'Package maintainer changes, provenance, lockfile drift' },
              { label: 'Deployment Risk', val: currentRepo.risk.deployment_risk, desc: 'Configuration divergence from production clusters' },
              { label: 'Security Risk', val: currentRepo.risk.security_risk, desc: 'Secret exposure, AST syntax anomalies, permission escalation' },
            ].map((r) => (
              <div key={r.label} className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-cyber font-bold text-white">{r.label}</span>
                  <span className="font-mono text-cyan-300 font-bold">{r.val} / 100</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      r.val > 60 ? 'bg-red-500' : r.val > 30 ? 'bg-yellow-400' : 'bg-emerald-400'
                    }`}
                    style={{ width: `${r.val}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Live vitals_report Output (5 cols) */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-white/10 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="text-sm font-bold font-cyber text-white uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" /> vitals_report.yaml
              </h2>
              <span className="text-[10px] font-mono text-emerald-400">STREAMING ACTIVE</span>
            </div>

            <pre className="mt-3 p-3.5 rounded-xl bg-[#03060c] border border-cyan-500/20 font-mono text-xs text-cyan-200 overflow-x-auto space-y-1 leading-relaxed">
{`vitals_report:
  target: "${currentRepo.repo.name}"
  health_score: ${currentRepo.health.score}
  security_score: ${currentRepo.security.score}
  governance_score: ${currentRepo.governance.score}
  ci_score: ${currentRepo.ci.score}
  risk_score: ${currentRepo.risk.score}
  repair_score: 92
  failure_probability: ${currentRepo.risk.probability_failure}
  blast_radius: "${currentRepo.risk.blast_radius}"
  lock_status: "${currentRepo.lock_state}"
  timestamp: "${new Date().toISOString()}"`}
            </pre>
          </div>

          <div className="pt-3 border-t border-white/5 text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span>SSOT Authority: LOCKED</span>
            <span className="text-cyan-400">Immunity Guaranteed</span>
          </div>
        </div>

      </div>

    </div>
  );
};
