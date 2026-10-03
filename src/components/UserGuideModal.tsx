import React, { useState } from 'react';
import { 
  BookOpen, X, Shield, Cpu, Activity, AlertTriangle, Key, 
  CheckCircle2, Terminal, Layers, Lock, GitPullRequest, ArrowRight,
  Database, Zap, Eye
} from 'lucide-react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'ssot' | 'order' | 'modules' | 'rules' | 'scoring' | 'crypto'>('ssot');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[90vh] glass-panel border border-cyan-500/30 rounded-2xl flex flex-col overflow-hidden shadow-2xl shadow-cyan-950/60">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/20 bg-cyan-950/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-400/30 text-cyan-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-wide text-white font-cyber flex items-center gap-2">
                REPO-BRAIN ENTERPRISE <span className="text-cyan-400 text-xs px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">SSOT SPECIFICATION</span>
              </h2>
              <p className="text-xs text-slate-400">Autonomous Repository Governance Protocol & Master Operational Guide</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/5 bg-slate-950/50 px-6 overflow-x-auto gap-2 py-2">
          {[
            { id: 'ssot', label: 'Prime Directive & SSOT', icon: Shield },
            { id: 'order', label: '17-Step Execution Order', icon: Zap },
            { id: 'modules', label: 'Official Modules', icon: Layers },
            { id: 'rules', label: 'Remediation Rules & Contracts', icon: Terminal },
            { id: 'scoring', label: 'Scoring Model', icon: Activity },
            { id: 'crypto', label: 'Crypto & GreenLock', icon: Key },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  active 
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(0,243,255,0.25)]' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-300">
          
          {/* TAB 1: PRIME DIRECTIVE & SSOT */}
          {activeTab === 'ssot' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="p-4 rounded-xl glass-cyan border border-cyan-500/30">
                <h3 className="text-cyan-300 font-bold text-base font-cyber uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-cyan-400" /> The Prime Directive: Stateless Autonomous Governance
                </h3>
                <p className="text-slate-300 text-xs leading-relaxed">
                  ALL AGENTS ARE STATELESS. All decisions, audit diagnoses, risk scores, and repair plans must originate strictly from the 
                  <strong className="text-cyan-300"> Single Source Of Truth (SSOT)</strong>:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3 font-mono text-xs">
                  <div className="p-2 rounded bg-black/40 border border-cyan-500/20 text-cyan-200">1. Oracle Registry</div>
                  <div className="p-2 rounded bg-black/40 border border-cyan-500/20 text-cyan-200">2. Knowledge Graph</div>
                  <div className="p-2 rounded bg-black/40 border border-cyan-500/20 text-cyan-200">3. Governance Policies</div>
                  <div className="p-2 rounded bg-black/40 border border-cyan-500/20 text-cyan-200">4. Risk Registry</div>
                  <div className="p-2 rounded bg-black/40 border border-cyan-500/20 text-cyan-200">5. Fleet Registry</div>
                  <div className="p-2 rounded bg-black/40 border border-cyan-500/20 text-cyan-200">6. Agent Contracts</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30">
                <h4 className="text-red-400 font-bold text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-400" /> The Insufficient Data Law
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  If information is not present inside Oracle State, any agent must return: <code className="text-red-300 bg-red-950/60 px-2 py-0.5 rounded font-mono font-bold">"INSUFFICIENT ORACLE DATA"</code>.
                  Never hallucinate. Never infer. Never invent repo state.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-2">
                <h4 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" /> Knowledge Graph Traversal Law
                </h4>
                <p className="text-xs text-slate-400">
                  All intelligence must resolve through strict graph relationships without bypassing graph traversal:
                </p>
                <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs text-cyan-300 bg-black/60 p-3 rounded-lg border border-cyan-500/20">
                  <span>repo</span> <ArrowRight className="w-3 h-3 text-slate-500" />
                  <span>framework</span> <ArrowRight className="w-3 h-3 text-slate-500" />
                  <span>dependencies</span> <ArrowRight className="w-3 h-3 text-slate-500" />
                  <span>vulnerabilities</span> <ArrowRight className="w-3 h-3 text-slate-500" />
                  <span>fixes</span> <ArrowRight className="w-3 h-3 text-slate-500" />
                  <span>pull_requests</span> <ArrowRight className="w-3 h-3 text-slate-500" />
                  <span>outcomes</span> <ArrowRight className="w-3 h-3 text-slate-500" />
                  <span>health</span> <ArrowRight className="w-3 h-3 text-slate-500" />
                  <span>forecasts</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 17-STEP EXECUTION ORDER */}
          {activeTab === 'order' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold font-cyber text-base">Immutable Oracle Execution Pipeline</h3>
                  <p className="text-xs text-slate-400">Pipeline execution order is strictly deterministic and cannot be bypassed.</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  17 Deterministic Stages
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { step: '01', name: 'ORACLE', desc: 'Initialize SSOT consensus & establish baseline identity.' },
                  { step: '02', name: 'HOSPITAL', desc: 'Full admission: health, dependency, structure, and workflow scans.' },
                  { step: '03', name: 'DETECT', desc: 'Framework discovery across 23+ ecosystems (React, Axum, Fiber, Solana, etc.).' },
                  { step: '04', name: 'NORMALIZE', desc: 'Convert repository architecture to standard unified SSOT structure.' },
                  { step: '05', name: 'DOCTOR', desc: 'Diagnostics: broken configs, failing builds, dependency conflicts.' },
                  { step: '06', name: 'GENOME', desc: 'Repository DNA: mutation analysis, diff tracking, and code lineage.' },
                  { step: '07', name: 'RISK', desc: 'Computes risk score, failure probability, and blast radius.' },
                  { step: '08', name: 'SURGEON', desc: 'Autonomous repair generation (dependency, CI, config, build, deployment).' },
                  { step: '09', name: 'VERIFY', desc: 'Verification layer: build success, tests pass, lint pass, governance pass.' },
                  { step: '10', name: 'AI GUARD', desc: 'LLM security enforcement: prompt injection & secret exposure detection.' },
                  { step: '11', name: 'FIREWALL', desc: 'Governance boundary: blocks unauthorized files and direct prod changes.' },
                  { step: '12', name: 'IMMUNIZER', desc: 'Prevent regression with invariants and permanent protections.' },
                  { step: '13', name: 'GREENLOCK', desc: 'Cryptographic repository lock upon verification pass.' },
                  { step: '14', name: 'VITALS', desc: 'Real-time telemetry: health, security, governance, and CI scores.' },
                  { step: '15', name: 'FORECAST', desc: 'Predict future failures, confidence score, and root cause vector.' },
                  { step: '16', name: 'FLEET', desc: 'Multi-repository governance and cross-repo dependency drift.' },
                  { step: '17', name: 'DASHBOARD & UPDATE', desc: 'Commit final authoritative state to SSOT and synchronize view.' },
                ].map((item) => (
                  <div key={item.step} className="p-3 rounded-xl glass-panel border border-white/10 flex items-start gap-3">
                    <span className="text-cyan-400 font-mono font-bold text-xs px-2 py-1 rounded bg-cyan-950/60 border border-cyan-500/20">
                      {item.step}
                    </span>
                    <div>
                      <h4 className="text-white text-xs font-bold font-cyber tracking-wide">{item.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: OFFICIAL MODULES */}
          {activeTab === 'modules' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-white font-bold font-cyber text-base">Official Oracle Modules</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { name: 'HOSPITAL', color: 'cyan', role: 'Full Admission', output: 'hospital_report', desc: 'Health, dependencies, structure, CI, workflow, security & governance scan.' },
                  { name: 'DETECT', color: 'cyan', role: 'Framework Discovery', output: 'framework_profile', desc: 'Supports 23+ ecosystems: Next.js, React, Vite, Astro, Remix, SvelteKit, Nuxt, Vue, Node, FastAPI, Flask, Go, Fiber, Echo, Rust, Axum, Actix, Spring Boot, Solidity, Foundry, Hardhat, Solana, Anchor.' },
                  { name: 'NORMALIZE', color: 'blue', role: 'Architecture Standard', output: 'normalized_structure', desc: 'Folder, config, workflow, and package standardization across fleets.' },
                  { name: 'DOCTOR', color: 'orange', role: 'Diagnostics Engine', output: 'diagnosis', desc: 'Detects broken configs, failing builds, invalid workflows, dependency conflicts.' },
                  { name: 'GENOME', color: 'blue', role: 'Repository DNA', output: 'genome_map', desc: 'Mutation analysis, diff tracking, ownership tracing, and code lineage.' },
                  { name: 'RISK ENGINE', color: 'red', role: 'Risk Evaluation', output: 'risk_report', desc: 'Computes risk_score, dependency_risk, supply_chain_risk, failure_probability, blast_radius.' },
                  { name: 'SURGEON', color: 'orange', role: 'Repair Synthesis', output: 'repair_plan & patch_generation', desc: 'Autonomous dependency, CI, config, build, and deployment remediation.' },
                  { name: 'VERIFY', color: 'cyan', role: 'Verification Layer', output: 'verification_report', desc: 'Build success, tests pass, lint pass, security pass, governance pass.' },
                  { name: 'AI-GUARD', color: 'red', role: 'LLM Security Gate', output: 'security_report', desc: 'Prompt injection detection, unsafe workflows, malicious code patterns, secret leaks.' },
                  { name: 'FIREWALL', color: 'red', role: 'Governance Boundary', output: 'firewall_report', desc: 'Blocks unsafe modifications, unauthorized files, and deployment bypasses.' },
                  { name: 'IMMUNIZER', color: 'cyan', role: 'Regression Prevention', output: 'immunization_report', desc: 'Permanent safeguards, invariants, branch protection rules.' },
                  { name: 'GREENLOCK', color: 'cyan', role: 'Cryptographic Lock', output: 'lock_state: protected', desc: 'Cryptographically seals repository state with sovereign governance signatures.' },
                ].map((mod) => (
                  <div key={mod.name} className="p-3.5 rounded-xl glass-panel border border-white/10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-white font-cyber tracking-wider">{mod.name}</span>
                        <span className="text-[10px] text-cyan-400 font-mono px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/20">{mod.role}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-snug">{mod.desc}</p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Output:</span>
                      <span className="text-cyan-300">{mod.output}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: AUTONOMOUS REMEDIATION RULES & CONTRACTS */}
          {activeTab === 'rules' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                  <h4 className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Allowed Autonomous Actions
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Dependency version upgrades and lockfile synchronizations
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Config repairs (tsconfig, vite.config, cargo.toml, next.config)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      CI/CD pipeline workflow repairs (.github/workflows)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Security invariant insertions & immunization shields
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30">
                  <h4 className="text-red-400 font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                    <X className="w-4 h-4 text-red-400" /> Strictly Prohibited Actions
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                      Delete repositories or drop entire databases
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                      Remove major modules or bypass governance registry
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                      Deploy to production directly without GreenLock seal
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                      Alter Governance Policy outside SSOT consensus
                    </li>
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-xl glass-panel border border-white/10">
                <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2 font-cyber">Agent Contract Example (Surgeon Agent)</h4>
                <pre className="text-xs font-mono text-cyan-300 bg-black/60 p-3 rounded-lg border border-cyan-500/20 overflow-x-auto">
{`agent:
  id: surgeon
permissions:
  read:
    - oracle/*
    - graph/*
    - registry/*
  write:
    - repair_plan.yaml
  prohibited:
    - direct_push
    - delete_repo
    - deploy_production
  requires:
    - approval
    - verification`}
                </pre>
                <p className="text-xs text-slate-400 mt-2">
                  Any agent attempting actions in the <code className="text-red-400 font-mono">prohibited</code> list triggers an immediate contract violation halt.
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: SCORING MODEL */}
          {activeTab === 'scoring' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-white font-bold font-cyber text-base">SSOT Scoring & Health Model</h3>
              <p className="text-xs text-slate-400">Health scores are calculated from composite weights across security, governance, and CI passes:</p>

              <div className="space-y-2.5">
                {[
                  { range: '95 - 100', grade: 'Oracle Grade', color: 'emerald', desc: 'Flawless verification, 0 critical CVEs, GreenLock cryptographically sealed, full CI pass.' },
                  { range: '80 - 94', grade: 'Healthy', color: 'cyan', desc: 'Passed verification, minimal non-critical drift, compliant with all active policies.' },
                  { range: '60 - 79', grade: 'Stable', color: 'yellow', desc: 'Acceptable operational threshold. Minor CVEs or workflow warnings scheduled for surgeon queue.' },
                  { range: '40 - 59', grade: 'Poor', color: 'orange', desc: 'Failing CI checks or critical dependency drift. Remediation mandated within 24h.' },
                  { range: '0 - 39', grade: 'Critical', color: 'red', desc: 'Severe security vulnerability (CVSS > 9.0) or build failure. Autonomous quarantine enforced.' },
                ].map((tier) => (
                  <div key={tier.range} className="p-3 rounded-xl glass-panel border border-white/10 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold text-white px-2.5 py-1 rounded bg-black/60 border border-white/10">
                        {tier.range}
                      </span>
                      <div>
                        <span className={`text-xs font-bold uppercase tracking-wider ${
                          tier.color === 'emerald' ? 'text-emerald-400' :
                          tier.color === 'cyan' ? 'text-cyan-400' :
                          tier.color === 'yellow' ? 'text-yellow-400' :
                          tier.color === 'orange' ? 'text-orange-400' : 'text-red-400'
                        }`}>
                          {tier.grade}
                        </span>
                        <p className="text-xs text-slate-400 mt-0.5">{tier.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: CRYPTO & GREENLOCK */}
          {activeTab === 'crypto' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-xl glass-cyan border border-cyan-500/30">
                <h3 className="text-cyan-300 font-bold font-cyber text-base mb-1 flex items-center gap-2">
                  <Key className="w-4 h-4 text-cyan-400" /> Cryptographic Governance & GreenLock Sealing
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Repo-Brain Enterprise links autonomous code changes to cryptographic proof. 
                  Operators can generate a sovereign Web Crypto keypair or connect a hardware wallet to sign GreenLock seals and autonomous remediation patch releases.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl glass-panel border border-white/10">
                  <div className="flex items-center gap-2 text-white font-bold text-xs uppercase font-cyber mb-2">
                    <Lock className="w-4 h-4 text-cyan-400" /> GreenLock Invariant
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Once all verification, governance, and security scans pass, GreenLock applies a cryptographic seal. 
                    No code may enter production without a valid GreenLock signature matching an authorized governance keypair.
                  </p>
                </div>

                <div className="p-4 rounded-xl glass-panel border border-white/10">
                  <div className="flex items-center gap-2 text-white font-bold text-xs uppercase font-cyber mb-2">
                    <Terminal className="w-4 h-4 text-orange-400" /> Sovereign Key Derivation
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Generates 12-word cryptographic seed mnemonics and derives deterministically formatted public addresses and 256-bit private keys inside browser memory using Web Crypto SHA-256 APIs.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-cyan-500/20 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>CYBERAI ORACLE NETWORK PROTOCOL v4.9</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 text-xs font-medium transition-all"
          >
            Acknowledge & Close
          </button>
        </div>

      </div>
    </div>
  );
};
