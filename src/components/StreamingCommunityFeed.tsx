import React, { useState, useEffect } from 'react';
import { Radio, Heart, MessageSquare, ShieldCheck, Zap, Globe, Lock, Share2 } from 'lucide-react';

interface FeedEvent {
  id: string;
  repoName: string;
  action: 'SCANNED' | 'CERTIFIED' | 'REPAIR_GENERATED' | 'HEALTH_IMPROVED';
  user: string;
  delta?: string;
  privacy: 'PUBLIC' | 'PRIVATE' | 'ORGANIZATION';
  timestamp: string;
}

const INITIAL_FEED_EVENTS: FeedEvent[] = [
  {
    id: 'f-1',
    repoName: 'SolanaRemix/CyberAi',
    action: 'CERTIFIED',
    user: 'gxqstudio',
    delta: 'Health Score 78% → 100%',
    privacy: 'PUBLIC',
    timestamp: new Date(Date.now() - 45000).toISOString()
  },
  {
    id: 'f-2',
    repoName: 'hyperliquid-vault-core',
    action: 'REPAIR_GENERATED',
    user: 'oracle-bot[bot]',
    delta: 'Patch #219: Tokio channels bounded buffer refactor',
    privacy: 'PUBLIC',
    timestamp: new Date(Date.now() - 120000).toISOString()
  },
  {
    id: 'f-3',
    repoName: 'enterprise-cloud-portal',
    action: 'SCANNED',
    user: 'mega-corp-admin',
    delta: 'Detected CVE-2024-34351 SSRF in Next.js 14 Server Actions',
    privacy: 'ORGANIZATION',
    timestamp: new Date(Date.now() - 300000).toISOString()
  }
];

export const StreamingCommunityFeed: React.FC = () => {
  const [events, setEvents] = useState<FeedEvent[]>(INITIAL_FEED_EVENTS);
  const [privacyFilter, setPrivacyFilter] = useState<'ALL' | 'PUBLIC' | 'ORGANIZATION'>('ALL');

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time incoming events
      const randomRepos = ['solana-amm-dex-router', 'hyperliquid-vault-core', 'anchor-multisig', 'web3-wallet-auth'];
      const randomUsers = ['sol-dev', 'rustacean', 'ether_genius', 'next_wizard'];
      const randomActions: Array<FeedEvent['action']> = ['SCANNED', 'CERTIFIED', 'REPAIR_GENERATED', 'HEALTH_IMPROVED'];
      const randomDeltas = [
        'Detected missing Signer Check inside vault transfer handler',
        'Auto-applied require_keys_eq! macro patch to instructions',
        'Health score raised from 42% to 98%',
        'Sealed repository with 100% GreenLock signature'
      ];

      const action = randomActions[Math.floor(Math.random() * randomActions.length)];
      const newEvent: FeedEvent = {
        id: `f-${Date.now()}`,
        repoName: randomRepos[Math.floor(Math.random() * randomRepos.length)],
        action,
        user: randomUsers[Math.floor(Math.random() * randomUsers.length)],
        delta: randomDeltas[Math.floor(Math.random() * randomDeltas.length)],
        privacy: Math.random() > 0.3 ? 'PUBLIC' : 'ORGANIZATION',
        timestamp: new Date().toISOString()
      };

      setEvents(prev => [newEvent, ...prev.slice(0, 15)]);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const filteredEvents = events.filter(evt => {
    if (privacyFilter === 'ALL') return true;
    return evt.privacy === privacyFilter;
  });

  return (
    <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 space-y-4">
      
      {/* Title & Privacy Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <h3 className="font-cyber font-bold text-sm text-white uppercase tracking-wider">
              Streaming Community Feed
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              LIVE BROADCAST
            </span>
          </div>
          <p className="text-xs text-slate-300 font-mono">
            Real-time fleet activity stream of scanned, certified, and remediated repositories.
          </p>
        </div>

        {/* Privacy Selector */}
        <div className="flex items-center gap-1 bg-black/60 border border-white/10 rounded-xl p-1 text-xs font-mono">
          <button
            onClick={() => setPrivacyFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg transition-all ${privacyFilter === 'ALL' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            All
          </button>
          <button
            onClick={() => setPrivacyFilter('PUBLIC')}
            className={`px-2.5 py-1 rounded-lg transition-all ${privacyFilter === 'PUBLIC' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            Public
          </button>
          <button
            onClick={() => setPrivacyFilter('ORGANIZATION')}
            className={`px-2.5 py-1 rounded-lg transition-all ${privacyFilter === 'ORGANIZATION' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            Org
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
        {filteredEvents.map(evt => (
          <div
            key={evt.id}
            className="p-3 rounded-xl bg-black/40 border border-white/5 hover:border-cyan-500/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono"
          >
            <div className="flex items-start sm:items-center gap-3 overflow-hidden">
              <span className={`p-2 rounded-lg text-xs shrink-0 ${
                evt.action === 'CERTIFIED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                evt.action === 'REPAIR_GENERATED' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                evt.action === 'SCANNED' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              }`}>
                {evt.action === 'CERTIFIED' ? <ShieldCheck className="w-4 h-4 text-emerald-400" /> : <Zap className="w-4 h-4" />}
              </span>

              <div className="space-y-0.5 overflow-hidden">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="font-bold text-white uppercase text-[10px] bg-white/5 px-1.5 py-0.2 rounded">
                    {evt.action}
                  </span>
                  <span className="font-cyber font-bold text-cyan-300 truncate max-w-[200px]">
                    {evt.repoName}
                  </span>
                  <span className="text-slate-400 text-[10px]">by @{evt.user}</span>
                </div>
                <p className="text-slate-300 text-[11px] truncate">{evt.delta}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                {evt.privacy === 'PUBLIC' ? <Globe className="w-3 h-3 text-cyan-400" /> : <Lock className="w-3 h-3 text-yellow-400" />}
                {evt.privacy}
              </span>
              <span className="text-slate-500 text-[10px]">
                {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
