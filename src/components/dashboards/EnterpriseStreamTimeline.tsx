import React, { useState, useEffect } from 'react';
import { 
  Radio, Shield, GitPullRequest, Wrench, Lock, CheckCircle2, 
  Filter, Play, Pause, ArrowRight, Eye, RefreshCw, Sparkles,
  Users, Activity, ChevronRight, Download
} from 'lucide-react';
import { EnterpriseTimelineEvent, OracleRegistry } from '../../types/oracle';
import { INITIAL_ENTERPRISE_STREAM_EVENTS } from '../../data/mockUserDataAndTrends';

interface EnterpriseStreamTimelineProps {
  currentRepo: OracleRegistry;
  onSelectRepoByName: (name: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const EnterpriseStreamTimeline: React.FC<EnterpriseStreamTimelineProps> = ({
  currentRepo,
  onSelectRepoByName,
  onNavigateTab
}) => {
  const [events, setEvents] = useState<EnterpriseTimelineEvent[]>(INITIAL_ENTERPRISE_STREAM_EVENTS);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'REPAIR_SURGERY' | 'GREENLOCK_SEAL' | 'PR_MERGED' | 'WIREUP_SYNC'>('ALL');
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [selectedEventModal, setSelectedEventModal] = useState<EnterpriseTimelineEvent | null>(null);

  // Live streaming simulation: pushes realistic developer events into the timeline
  useEffect(() => {
    let interval: any;
    if (isLiveStreaming) {
      interval = setInterval(() => {
        const devPool = [
          { name: 'David SecOps', role: 'Security Architect', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
          { name: 'Sarah Jenkins', role: 'Staff Security Engineer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
          { name: 'Alex Thorne', role: 'Lead Backend Architect', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
          { name: 'Autonomous Oracle Daemon', role: 'Protocol Agent v4.9', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80' }
        ];
        const randomDev = devPool[Math.floor(Math.random() * devPool.length)];
        const actions: Array<'REPAIR_SURGERY' | 'GREENLOCK_SEAL' | 'PR_MERGED' | 'WIREUP_SYNC'> = [
          'REPAIR_SURGERY', 'GREENLOCK_SEAL', 'PR_MERGED', 'WIREUP_SYNC'
        ];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        const repos = ['hyperliquid-vault-core', 'enterprise-cloud-portal', 'solana-amm-dex-router', 'fintech-edge-gateway'];
        const randomRepo = repos[Math.floor(Math.random() * repos.length)];

        const newEvent: EnterpriseTimelineEvent = {
          id: `STREAM-EV-${Date.now().toString().slice(-4)}`,
          developerName: randomDev.name,
          developerAvatar: randomDev.avatar,
          developerRole: randomDev.role,
          repoName: randomRepo,
          actionType: randomAction,
          summary: `Synchronized autonomous invariant check on branch 'main'.`,
          healthShift: { before: 78, after: 97 },
          timestamp: 'Just now',
          productionImpact: 'Maintained 0-drift compliance across active microservice nodes.',
          verified: true
        };

        setEvents(prev => [newEvent, ...prev.slice(0, 14)]);
      }, 12000);
    }
    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  const filteredEvents = events.filter(e => {
    if (selectedFilter === 'ALL') return true;
    return e.actionType === selectedFilter;
  });

  const getActionBadge = (type: EnterpriseTimelineEvent['actionType']) => {
    switch (type) {
      case 'GREENLOCK_SEAL':
        return { label: 'GREENLOCK SEALED', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', icon: Lock };
      case 'PR_MERGED':
        return { label: 'PR MERGED', color: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30', icon: GitPullRequest };
      case 'REPAIR_SURGERY':
        return { label: 'SURGERY REPAIR', color: 'bg-orange-500/10 text-orange-400 border-orange-500/30', icon: Wrench };
      case 'WIREUP_SYNC':
        return { label: 'WIRE-UP SYNC', color: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30', icon: Activity };
      default:
        return { label: 'ADMISSION SCAN', color: 'bg-blue-500/10 text-blue-300 border-blue-500/30', icon: Shield };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5 font-bold">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              MULTI-USER REPO STREAMING TIMELINE
            </span>
            <span className="text-slate-400 text-xs font-mono">• LIVE ENTERPRISE RADAR</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white font-cyber tracking-tight">
            COMMUNITY & TEAM REPO ACTIVITY STREAM
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Live federated stream of repository admissions, autonomous surgeries, GreenLock seals, and database wire-up synchronizations across all developers in the organization.
          </p>
        </div>

        {/* Live Stream Controller */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`px-4 py-2 rounded-xl text-xs font-cyber font-bold flex items-center gap-2 transition-all ${
              isLiveStreaming
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                : 'bg-black/60 text-slate-400 border border-white/10'
            }`}
          >
            {isLiveStreaming ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Live Feed Active</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Resume Feed</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter Tabs & Event Stream Header */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold font-cyber text-white">
              REAL-TIME ENTERPRISE REPO EVENT LOG ({filteredEvents.length})
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            <span className="text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            {[
              { id: 'ALL', label: 'All Events' },
              { id: 'GREENLOCK_SEAL', label: 'GreenLock' },
              { id: 'PR_MERGED', label: 'PRs' },
              { id: 'REPAIR_SURGERY', label: 'Surgeries' },
              { id: 'WIREUP_SYNC', label: 'Wire-ups' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id as any)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedFilter === f.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_10px_rgba(0,243,255,0.2)]'
                    : 'text-slate-400 hover:text-white bg-black/40 border border-white/5'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Timeline List */}
        <div className="space-y-3">
          {filteredEvents.map((event) => {
            const badge = getActionBadge(event.actionType);
            const Icon = badge.icon;

            return (
              <div
                key={event.id}
                onClick={() => setSelectedEventModal(event)}
                className="p-4 rounded-xl bg-black/40 border border-white/5 hover:border-cyan-500/40 transition-all cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
              >
                {/* Dev Profile + Action Summary */}
                <div className="flex items-start gap-3.5">
                  <img
                    src={event.developerAvatar}
                    alt={event.developerName}
                    className="w-10 h-10 rounded-full object-cover border border-cyan-400/40 shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-cyber font-bold text-xs text-white group-hover:text-cyan-300 transition-colors">
                        {event.developerName}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">({event.developerRole})</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-xs font-mono text-cyan-300 font-semibold">{event.repoName}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-snug">{event.summary}</p>
                    <p className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
                      <span>Impact: {event.productionImpact}</span>
                    </p>
                  </div>
                </div>

                {/* Right: Badge, Health Shift & Timestamp */}
                <div className="flex items-center gap-4 shrink-0 font-mono text-xs">
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 text-xs font-bold justify-end">
                      <span className="text-slate-400">{event.healthShift.before}%</span>
                      <span>→</span>
                      <span className="text-emerald-400 font-cyber text-sm">{event.healthShift.after}%</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{event.timestamp}</span>
                  </div>

                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border flex items-center gap-1 ${badge.color}`}>
                    <Icon className="w-3 h-3" />
                    <span>{badge.label}</span>
                  </span>

                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Inspection Detail Modal */}
      {selectedEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel border border-cyan-500/40 rounded-2xl p-6 w-full max-w-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold font-cyber text-white">
                  ENTERPRISE STREAM EVENT DOSSIER
                </h3>
              </div>
              <button 
                onClick={() => setSelectedEventModal(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-black/60 border border-white/10 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[10px]">
                  <span>EVENT ID: {selectedEventModal.id}</span>
                  <span>{selectedEventModal.timestamp}</span>
                </div>
                <h4 className="text-white font-cyber font-bold text-sm">{selectedEventModal.repoName}</h4>
                <p className="text-slate-300 mt-1">{selectedEventModal.summary}</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-white/5 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase block">Developer Provenance</span>
                <div className="flex items-center gap-2">
                  <img src={selectedEventModal.developerAvatar} alt="" className="w-6 h-6 rounded-full" />
                  <span className="text-white font-bold">{selectedEventModal.developerName}</span>
                  <span className="text-slate-400 text-[10px]">({selectedEventModal.developerRole})</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 space-y-1">
                <span className="text-emerald-400 text-[10px] uppercase block font-bold">Production Impact Statement</span>
                <p className="text-slate-200">{selectedEventModal.productionImpact}</p>
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
                  onSelectRepoByName(selectedEventModal.repoName);
                  setSelectedEventModal(null);
                  onNavigateTab('public');
                }}
                className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-cyber font-bold flex items-center gap-1"
              >
                Inspect Repo in Public View <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
