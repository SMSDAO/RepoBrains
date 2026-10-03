import React, { useState } from 'react';
import { Terminal, Copy, Check, ShieldCheck, Download, Code2 } from 'lucide-react';
import { OracleRegistry } from '../types/oracle';
import { generateOracleSummaryYaml } from '../services/oracleEngine';

interface OracleOutputViewerProps {
  repo: OracleRegistry;
}

export const OracleOutputViewer: React.FC<OracleOutputViewerProps> = ({ repo }) => {
  const [copied, setCopied] = useState(false);
  const yamlContent = generateOracleSummaryYaml(repo);

  const handleCopy = () => {
    navigator.clipboard.writeText(yamlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([yamlContent], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oracle-summary-${repo.repo.name}.yaml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-panel border border-cyan-500/30 rounded-2xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="px-5 py-3 border-b border-white/10 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="font-cyber font-bold text-xs uppercase tracking-wider text-white">
            ORACLE SSOT SUMMARY OUTPUT (CANONICAL FORMAT)
          </span>
          <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
            VALIDATED
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
            {copied ? 'Copied' : 'Copy YAML'}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export .yaml
          </button>
        </div>
      </div>

      {/* Code Display */}
      <div className="p-4 bg-[#03060c] overflow-x-auto">
        <pre className="font-mono text-xs text-cyan-200/90 leading-relaxed selection:bg-cyan-500/40">
          {yamlContent}
        </pre>
      </div>

      {/* Footer Law reminder */}
      <div className="px-5 py-2.5 bg-black/40 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>SSOT Consensus: 100% Deterministic</span>
        <span className="text-cyan-400/80">"Oracle Registry is the ONLY source of truth"</span>
      </div>
    </div>
  );
};
