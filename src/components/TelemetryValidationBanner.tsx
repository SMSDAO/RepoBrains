import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, CheckCircle2, ArrowRight, RefreshCw, Zap } from 'lucide-react';
import { OracleRegistry } from '../types/oracle';
import { validateOracleRegistry } from '../utils/oracleValidator';

interface TelemetryValidationBannerProps {
  currentRepo: OracleRegistry;
  onSyncGithub: () => void;
  onOpenSurgery: () => void;
}

export const TelemetryValidationBanner: React.FC<TelemetryValidationBannerProps> = ({
  currentRepo,
  onSyncGithub,
  onOpenSurgery
}) => {
  const validation = validateOracleRegistry(currentRepo);

  return (
    <div className={`p-4 rounded-2xl border font-mono text-xs transition-all ${
      validation.isValid
        ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
        : (validation.errors.length > 0
          ? 'bg-red-950/25 border-red-500/40 text-red-200'
          : 'bg-yellow-950/25 border-yellow-500/40 text-yellow-200')
    }`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-xl text-lg shrink-0 ${
            validation.isValid
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : (validation.errors.length > 0
                ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40')
          }`}>
            {validation.isValid ? <ShieldCheck className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-cyber font-bold text-sm text-white uppercase">
                Oracle Registry Telemetry Audit: {validation.score}%
              </span>
              <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                validation.sealStatus === 'VERIFIED'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
              }`}>
                SEAL: {validation.sealStatus}
              </span>
            </div>

            <p className="text-slate-300 leading-relaxed text-[11px]">
              {validation.recommendation}
            </p>

            {/* Missing fields or warnings */}
            {validation.missingFields.length > 0 && (
              <div className="text-red-300 text-[10px] flex items-center gap-1 font-bold">
                <span>Missing telemetry fields:</span>
                <code className="bg-black/40 px-1 py-0.5 rounded text-red-200">
                  {validation.missingFields.join(', ')}
                </code>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {!validation.isValid && (
            <button
              onClick={onSyncGithub}
              className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync GitHub Metadata</span>
            </button>
          )}

          <button
            onClick={onOpenSurgery}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-cyber font-bold text-xs flex items-center gap-1.5 shadow-[0_0_12px_rgba(52,211,153,0.3)] transition-all"
          >
            <Zap className="w-3.5 h-3.5 fill-black" />
            <span>{validation.isValid ? 'Deploy / Surgery' : 'Fix Invariants'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
