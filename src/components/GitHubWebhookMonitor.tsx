import React, { useState, useEffect } from 'react';
import { 
  GitBranch, GitPullRequest, GitCommit, Radio, RefreshCw, 
  Send, CheckCircle2, Clock, ShieldCheck, Zap, Copy, Check, Terminal
} from 'lucide-react';
import { OracleRegistry } from '../types/oracle';

interface GitHubWebhookMonitorProps {
  currentRepo: OracleRegistry;
  onRepoUpdatedByWebhook?: (updatedRepo: OracleRegistry) => void;
}

interface WebhookEvent {
  id: string;
  eventType: string;
  repoName: string;
  sender: string;
  ref?: string;
  commitSha?: string;
  message?: string;
  status: 'PROCESSED' | 'TRIGGERED_SCAN' | 'AUTO_CERTIFIED';
  timestamp: string;
}

export const GitHubWebhookMonitor: React.FC<GitHubWebhookMonitorProps> = ({
  currentRepo,
  onRepoUpdatedByWebhook
}) => {
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [endpointUrl, setEndpointUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedEndpoint, setCopiedEndpoint] = useState(false);

  // Webhook Simulator state
  const [simEventType, setSimEventType] = useState<'push' | 'pull_request.closed' | 'workflow_job.completed'>('push');
  const [simMessage, setSimMessage] = useState('feat(solana): implement multi-rpc failover and invariant anchor context');
  const [isSimulating, setIsSimulating] = useState(false);

  const fetchWebhookLogs = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/oracle/github-webhook/logs');
      const data = await res.json();
      setEvents(data.events || []);
      setEndpointUrl(data.activeWebhookEndpoint || `${window.location.origin}/api/oracle/github-webhook`);
    } catch (err) {
      console.error('Failed to fetch webhook logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWebhookLogs();
    const interval = setInterval(fetchWebhookLogs, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSimulateWebhook = async () => {
    setIsSimulating(true);
    try {
      const res = await fetch('/api/oracle/github-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-github-event': simEventType
        },
        body: JSON.stringify({
          repoName: currentRepo.repo.name,
          sender: 'gxqstudio',
          ref: `refs/heads/${currentRepo.repo.branch}`,
          message: simMessage,
          commitSha: Math.random().toString(36).substring(2, 9)
        })
      });

      const data = await res.json();
      if (data.success) {
        await fetchWebhookLogs();

        // Broadcast state update to parent
        if (onRepoUpdatedByWebhook) {
          const updated: OracleRegistry = {
            ...currentRepo,
            repo: {
              ...currentRepo.repo,
              commitHash: data.event.commitSha
            },
            health: {
              ...currentRepo.health,
              score: 98,
              status: 'ORACLE_GRADE'
            },
            ci: {
              ...currentRepo.ci,
              score: 100,
              passing: true
            },
            last_repair: new Date().toISOString()
          };
          onRepoUpdatedByWebhook(updated);
        }
      }
    } catch (err) {
      console.error('Failed to trigger simulated webhook:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleCopyEndpoint = () => {
    navigator.clipboard.writeText(endpointUrl);
    setCopiedEndpoint(true);
    setTimeout(() => setCopiedEndpoint(false), 3000);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <h3 className="font-cyber font-bold text-sm text-white uppercase tracking-wider">
              Real-Time GitHub Webhook Service Layer
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              LISTENING
            </span>
          </div>
          <p className="text-xs text-slate-300 font-mono">
            Receives real-time push events, PR merges, and CI check runs. Updates dashboard telemetry immediately without manual sync.
          </p>
        </div>

        <button
          onClick={fetchWebhookLogs}
          disabled={isLoading}
          className="px-3.5 py-1.5 rounded-xl bg-black/60 hover:bg-white/10 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold flex items-center gap-2 transition-all shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* Webhook Secret Endpoint Box */}
      <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="space-y-0.5 overflow-hidden">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">GitHub Webhook Payload URL</span>
          <code className="text-cyan-300 truncate block">{endpointUrl || 'https://repo-brain-oracle.app/api/oracle/github-webhook'}</code>
        </div>

        <button
          onClick={handleCopyEndpoint}
          className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 text-xs font-mono font-bold flex items-center gap-1.5 shrink-0 transition-all"
        >
          {copiedEndpoint ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedEndpoint ? 'Endpoint Copied!' : 'Copy Webhook URL'}</span>
        </button>
      </div>

      {/* Interactive Webhook Event Dispatcher / Simulator */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/30 via-indigo-950/20 to-purple-950/30 border border-cyan-500/30 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="font-bold text-cyan-300 flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5 text-cyan-400" />
            Dispatch Test GitHub Webhook Event:
          </span>
          <span className="text-[10px] text-slate-400">Triggers real-time App.tsx state sync</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
          <div>
            <label className="text-slate-400 text-[10px] uppercase block mb-1">Event Type</label>
            <select
              value={simEventType}
              onChange={(e: any) => setSimEventType(e.target.value)}
              className="w-full bg-black/60 border border-cyan-500/40 rounded-lg p-2 text-cyan-200 focus:outline-none"
            >
              <option value="push">git push (Code Commit)</option>
              <option value="pull_request.closed">pull_request.closed (PR Merged)</option>
              <option value="workflow_job.completed">workflow_job.completed (CI Passed)</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-slate-400 text-[10px] uppercase block mb-1">Commit / Event Message</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={simMessage}
                onChange={(e) => setSimMessage(e.target.value)}
                className="w-full bg-black/60 border border-cyan-500/40 rounded-lg p-2 text-cyan-200 focus:outline-none"
              />
              <button
                onClick={handleSimulateWebhook}
                disabled={isSimulating}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-cyber font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-[0_0_12px_rgba(52,211,153,0.3)] transition-all"
              >
                <Zap className="w-3.5 h-3.5 fill-black" />
                <span>{isSimulating ? 'Sending...' : 'Emit Webhook'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Event Stream Table */}
      <div className="space-y-2">
        <span className="text-xs font-mono font-bold text-slate-300 block">Recent Live Webhook Activity Stream:</span>
        <div className="space-y-2 max-h-52 overflow-y-auto font-mono text-xs">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="p-3 rounded-xl bg-black/50 border border-white/5 flex items-center justify-between gap-3 hover:border-cyan-500/30 transition-all"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <span className={`p-2 rounded-lg text-xs shrink-0 ${
                  evt.eventType.includes('pull_request')
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                }`}>
                  {evt.eventType.includes('pull_request') ? <GitPullRequest className="w-4 h-4" /> : <GitCommit className="w-4 h-4" />}
                </span>

                <div className="space-y-0.5 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white uppercase text-[11px]">{evt.eventType}</span>
                    <span className="text-[10px] text-cyan-300 font-bold px-1.5 py-0.2 bg-white/5 rounded">
                      SHA: {evt.commitSha}
                    </span>
                    <span className="text-[10px] text-slate-400">by @{evt.sender}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] truncate">{evt.message}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 text-right">
                <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  {evt.status}
                </span>
                <span className="text-[10px] text-slate-500">
                  {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
