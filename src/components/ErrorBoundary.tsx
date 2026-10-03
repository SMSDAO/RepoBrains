import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw, Copy, Check, Terminal, ChevronDown, ChevronUp, AlertOctagon } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
  copied: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
    copied: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      showDetails: false,
      copied: false
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[REPO-BRAIN ERROR BOUNDARY] Captured uncaught React runtime error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      copied: false
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleCopyError = () => {
    const errorText = `[REPO-BRAIN RUNTIME DIAGNOSTIC LOG]\nTimestamp: ${new Date().toISOString()}\nError: ${this.state.error?.message || 'Unknown Error'}\nStack: ${this.state.error?.stack || ''}\nComponent Stack: ${this.state.errorInfo?.componentStack || ''}`;
    navigator.clipboard.writeText(errorText);
    this.setState({ copied: true });
    setTimeout(() => this.setState({ copied: false }), 3000);
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#03060c] text-white flex items-center justify-center p-6 font-sans">
          <div className="w-full max-w-3xl glass-panel border-2 border-red-500/50 bg-gradient-to-b from-red-950/40 via-[#070e1c] to-[#020409] rounded-3xl p-8 shadow-[0_0_80px_rgba(239,68,68,0.3)] space-y-6 relative overflow-hidden">
            
            {/* Ambient Background Lights */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header Badge */}
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
              <div className="p-3 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                <ShieldAlert className="w-8 h-8 animate-pulse" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/20 text-red-300 border border-red-500/40">
                    RUNTIME ISOLATION SHIELD
                  </span>
                  <span className="text-xs font-mono text-slate-400">• REPO-BRAIN ORACLE DEFENSE</span>
                </div>
                <h1 className="text-2xl font-extrabold text-white font-cyber tracking-tight mt-1">
                  APPLICATION RUNTIME EXCEPTION INTERCEPTED
                </h1>
              </div>
            </div>

            {/* Error Message Display */}
            <div className="p-5 rounded-2xl bg-black/60 border border-red-500/30 font-mono text-xs text-red-300 space-y-2">
              <span className="text-[10px] uppercase text-red-400 font-bold block">Interception Diagnosis:</span>
              <p className="text-sm font-bold text-white leading-relaxed">
                {this.state.error?.message || 'An unexpected runtime error occurred.'}
              </p>
            </div>

            {/* Expandable Technical Details */}
            <div className="space-y-2 font-mono text-xs">
              <button
                onClick={() => this.setState(prev => ({ showDetails: !prev.showDetails }))}
                className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-bold"
              >
                <Terminal className="w-4 h-4" />
                <span>{this.state.showDetails ? 'Hide Component Stack Trace' : 'Inspect Detailed Component Stack Trace'}</span>
                {this.state.showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {this.state.showDetails && (
                <div className="p-4 rounded-xl bg-[#02050b] border border-cyan-500/30 text-cyan-200 text-[11px] overflow-x-auto max-h-60 leading-relaxed whitespace-pre-wrap">
                  <p className="text-yellow-300 font-bold mb-2">Error Stack:</p>
                  {this.state.error?.stack}
                  {this.state.errorInfo?.componentStack && (
                    <>
                      <p className="text-yellow-300 font-bold mt-4 mb-2">React Component Stack:</p>
                      {this.state.errorInfo.componentStack}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Recovery Action Buttons */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={this.handleCopyError}
                className="px-4 py-2.5 rounded-xl bg-black/60 hover:bg-white/10 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold flex items-center gap-2 transition-all"
              >
                {this.state.copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{this.state.copied ? 'Diagnostic Copied!' : 'Copy Diagnostic Log'}</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={this.handleReset}
                  className="px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 text-xs font-cyber font-bold transition-all"
                >
                  Reset UI State
                </button>

                <button
                  onClick={this.handleReload}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-cyber font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(52,211,153,0.4)] transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Recover & Reload App</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
