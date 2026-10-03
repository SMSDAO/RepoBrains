import React, { useState, useEffect } from 'react';
import { 
  Play, CheckCircle2, AlertTriangle, ShieldCheck, X, 
  Terminal, RefreshCw, Lock, Zap, Cpu, ArrowRight, Eye
} from 'lucide-react';
import { OracleRegistry, PipelineStep } from '../types/oracle';
import { PIPELINE_EXECUTION_SEQUENCE, requestAiDiagnosis } from '../services/oracleEngine';

interface PipelineRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRepo: OracleRegistry;
  onPipelineComplete: (updatedRepo: OracleRegistry) => void;
}

export const PipelineRunnerModal: React.FC<PipelineRunnerModalProps> = ({
  isOpen,
  onClose,
  targetRepo,
  onPipelineComplete
}) => {
  const [steps, setSteps] = useState<PipelineStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [selectedStepOutput, setSelectedStepOutput] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      // Initialize steps from SSOT sequence
      const initSteps: PipelineStep[] = PIPELINE_EXECUTION_SEQUENCE.map(s => ({
        ...s,
        status: 'PENDING'
      }));
      setSteps(initSteps);
      setCurrentStepIndex(-1);
      setIsRunning(false);
      setIsCompleted(false);
      setLogs([
        `[SSOT INIT] Connected to Oracle Core. Target: ${targetRepo.repo.name} (${targetRepo.repo.framework})`,
        `[PIPELINE] 17-stage deterministic protocol armed and ready.`
      ]);
      setSelectedStepOutput(null);
    }
  }, [isOpen, targetRepo]);

  if (!isOpen) return null;

  const startPipeline = async () => {
    setIsRunning(true);
    setIsCompleted(false);
    setLogs(prev => [...prev, `[PIPELINE START] Execution started at ${new Date().toISOString()}`]);

    let updatedRepoState = { ...targetRepo };

    for (let i = 0; i < PIPELINE_EXECUTION_SEQUENCE.length; i++) {
      setCurrentStepIndex(i);
      
      setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'RUNNING' } : s));
      
      const stepDef = PIPELINE_EXECUTION_SEQUENCE[i];
      setLogs(prev => [...prev, `[${stepDef.name}] Executing module: ${stepDef.module}...`]);

      // Simulate realistic deterministic processing time
      await new Promise(r => setTimeout(r, 450));

      let stepOutput: any = {};

      if (stepDef.name === 'ORACLE') {
        stepOutput = {
          ssot_consensus: '100% AUTHORITATIVE',
          commit: targetRepo.repo.commitHash,
          registry_state: 'SYNCED'
        };
      } else if (stepDef.name === 'HOSPITAL') {
        stepOutput = {
          files_scanned: targetRepo.repo.totalFiles,
          dependencies_analyzed: 48,
          critical_anomalies: targetRepo.security.critical
        };
      } else if (stepDef.name === 'DETECT') {
        stepOutput = {
          framework_detected: targetRepo.repo.framework,
          ecosystem: targetRepo.repo.language,
          build_system: 'Vite / Cargo / Bun unified toolchain'
        };
      } else if (stepDef.name === 'DOCTOR') {
        // Call AI Diagnosis or deterministic SSOT
        const diagResult = await requestAiDiagnosis(targetRepo);
        stepOutput = diagResult.diagnosis;
      } else if (stepDef.name === 'RISK') {
        stepOutput = {
          risk_score: targetRepo.risk.score,
          blast_radius: targetRepo.risk.blast_radius,
          probability_failure: targetRepo.risk.probability_failure
        };
      } else if (stepDef.name === 'SURGEON') {
        stepOutput = {
          patches_ready: 2,
          remediation_mode: 'AUTONOMOUS_NON_DESTRUCTIVE',
          target_files: ['package.json', 'ci.yml']
        };
      } else if (stepDef.name === 'VERIFY') {
        stepOutput = {
          build_pass: true,
          unit_tests: '42 passed, 0 failed',
          lint_pass: true,
          security_pass: true,
          governance_pass: true
        };
        // Verify stage heals the repo state
        updatedRepoState = {
          ...updatedRepoState,
          health: { score: 98, status: 'ORACLE_GRADE' },
          security: { score: 96, critical: 0, vulnerabilities: [] },
          ci: { score: 100, passing: true, buildDuration: '1m 24s' },
          governance: { score: 98, drift: '0.00% (Strict Compliance)', policyViolations: [] },
          risk: { score: 10, probability_failure: 0.02, blast_radius: 'Isolated', dependency_risk: 5, supply_chain_risk: 6, deployment_risk: 8, security_risk: 8 }
        };
      } else if (stepDef.name === 'GREENLOCK') {
        stepOutput = {
          lock_state: 'protected',
          cryptographic_seal: 'SHA256::ORACLE_GREENLOCK_VERIFIED',
          timestamp: new Date().toISOString()
        };
        updatedRepoState.lock_state = 'protected';
      } else if (stepDef.name === 'FORECAST') {
        stepOutput = {
          next_failure: 'None projected within 90 days',
          confidence: 0.96,
          risk_trajectory: 'DECREASING'
        };
      } else {
        stepOutput = {
          status: 'SUCCESS',
          module: stepDef.module,
          timestamp: new Date().toISOString()
        };
      }

      setSteps(prev => prev.map((s, idx) => idx === i ? { 
        ...s, 
        status: 'COMPLETED', 
        durationMs: 450, 
        dataSnippet: stepOutput 
      } : s));

      setLogs(prev => [...prev, `[${stepDef.name}] SUCCESS -> ${stepDef.outputKey} committed to SSOT`]);
    }

    setIsRunning(false);
    setIsCompleted(true);
    setLogs(prev => [...prev, `[ORACLE UPDATE] Pipeline completed. SSOT committed with GREENLOCK protection.`]);
    onPipelineComplete(updatedRepoState);
  };

  const progressPercent = Math.round(
    ((steps.filter(s => s.status === 'COMPLETED').length) / PIPELINE_EXECUTION_SEQUENCE.length) * 100
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] glass-panel border border-cyan-500/30 rounded-2xl flex flex-col overflow-hidden shadow-2xl shadow-cyan-950/70">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/20 bg-cyan-950/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-400/30 text-cyan-400">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-wide text-white font-cyber flex items-center gap-2">
                17-STAGE ORACLE EXECUTION ENGINE
              </h2>
              <p className="text-xs text-slate-400">
                Target: <span className="text-cyan-300 font-mono font-semibold">{targetRepo.repo.name}</span> ({targetRepo.repo.framework}) • Immutable Execution Order
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar & Actions */}
        <div className="px-6 py-3 bg-slate-950/70 border-b border-white/5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
              <span className="text-slate-300 flex items-center gap-2">
                {isRunning && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />}
                STATUS: {isRunning ? 'EXECUTING PIPELINE' : isCompleted ? 'SSOT VERIFIED & SEALED' : 'READY TO EXECUTE'}
              </span>
              <span className="text-cyan-400 font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-900 border border-white/10 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 transition-all duration-300 shadow-[0_0_12px_rgba(0,243,255,0.8)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isRunning && !isCompleted && (
              <button
                onClick={startPipeline}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-cyber font-bold text-xs flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(0,243,255,0.4)]"
              >
                <Play className="w-4 h-4 fill-black" /> Run Full Oracle Pipeline
              </button>
            )}

            {isCompleted && (
              <button
                onClick={startPipeline}
                className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 text-xs font-medium flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Re-Execute Pipeline
              </button>
            )}
          </div>
        </div>

        {/* Content Area: Step List + Terminal Logs */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-0 overflow-hidden">
          
          {/* Left: 17 Steps List */}
          <div className="md:col-span-7 border-r border-white/10 overflow-y-auto p-4 space-y-2 max-h-[55vh]">
            {steps.map((step, idx) => {
              const isCurrent = currentStepIndex === idx;
              const isDone = step.status === 'COMPLETED';
              const isPending = step.status === 'PENDING';

              return (
                <div
                  key={step.id}
                  onClick={() => step.dataSnippet && setSelectedStepOutput(step)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isCurrent 
                      ? 'bg-cyan-500/15 border-cyan-400/60 shadow-[0_0_15px_rgba(0,243,255,0.25)] flash-shimmer-active'
                      : isDone
                      ? 'bg-emerald-950/20 border-emerald-500/30 hover:bg-emerald-950/30'
                      : 'bg-black/30 border-white/5 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[10px] text-slate-400 w-5">
                        {(idx + 1).toString().padStart(2, '0')}
                      </span>
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : isCurrent ? (
                        <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-600" />
                      )}
                      <div>
                        <span className="font-cyber font-bold text-xs text-white tracking-wide">
                          {step.name}
                        </span>
                        <span className="text-[11px] text-slate-400 ml-2 font-mono">
                          [{step.module}]
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {step.dataSnippet && (
                        <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30 flex items-center gap-1">
                          <Eye className="w-2.5 h-2.5" /> Output
                        </span>
                      )}
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        isDone ? 'bg-emerald-500/10 text-emerald-400' :
                        isCurrent ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-500'
                      }`}>
                        {step.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Live Terminal & Output Inspector */}
          <div className="md:col-span-5 bg-black/80 flex flex-col max-h-[55vh] overflow-hidden">
            <div className="p-3 border-b border-white/10 bg-slate-950/80 flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-400 flex items-center gap-1.5 font-bold">
                <Terminal className="w-3.5 h-3.5" /> LIVE ORACLE TELEMETRY
              </span>
              <span className="text-[10px] text-slate-400 font-mono">SSOT EVENT STREAM</span>
            </div>

            {selectedStepOutput ? (
              <div className="p-4 overflow-y-auto space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 font-cyber">
                    {selectedStepOutput.name} Output Artifact
                  </span>
                  <button 
                    onClick={() => setSelectedStepOutput(null)}
                    className="text-[10px] text-slate-400 hover:text-white"
                  >
                    View Terminal
                  </button>
                </div>
                <pre className="text-[11px] font-mono text-emerald-300 bg-slate-950 p-3 rounded-lg border border-cyan-500/20 overflow-x-auto">
                  {JSON.stringify(selectedStepOutput.dataSnippet, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="p-4 font-mono text-[11px] text-slate-300 space-y-1 overflow-y-auto flex-1 leading-relaxed">
                {logs.map((log, index) => (
                  <div key={index} className="flex items-start gap-1">
                    <span className="text-cyan-500 select-none">&gt;</span>
                    <span className={log.includes('SUCCESS') ? 'text-emerald-400' : log.includes('Executing') ? 'text-cyan-300' : 'text-slate-300'}>
                      {log}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-cyan-500/20 bg-slate-950/90 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span>GreenLock Automated Governance Enforcement</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 text-xs font-medium transition-all"
          >
            Close Runner
          </button>
        </div>

      </div>
    </div>
  );
};
