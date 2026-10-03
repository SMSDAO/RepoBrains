import React, { useState } from 'react';
import { 
  User, X, Check, RefreshCw, GitBranch, ShieldCheck, 
  ExternalLink, LogOut, ArrowRight, Sparkles, Key, AlertTriangle, 
  CheckCircle2, Globe, Database, Cpu
} from 'lucide-react';
import { UserProfile, OracleRegistry } from '../types/oracle';
import { INITIAL_USER_PROFILES } from '../data/mockUserDataAndTrends';

interface UserAuthSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSwitchUser: (user: UserProfile) => void;
  repositories: OracleRegistry[];
  onSyncRepositories: (provider: 'google' | 'github') => void;
}

export const UserAuthSyncModal: React.FC<UserAuthSyncModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSwitchUser,
  repositories,
  onSyncRepositories
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'sync' | 'switch'>('profile');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMessage, setSyncStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTriggerSync = (provider: 'google' | 'github') => {
    setIsSyncing(true);
    setSyncStatusMessage(null);
    setTimeout(() => {
      setIsSyncing(false);
      onSyncRepositories(provider);
      setSyncStatusMessage(`Successfully synced ${repositories.length} repositories from ${provider.toUpperCase()}. Real-time webhook listeners attached.`);
      setTimeout(() => setSyncStatusMessage(null), 4000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl glass-panel border border-cyan-500/30 rounded-2xl flex flex-col overflow-hidden shadow-2xl shadow-cyan-950/70">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/20 bg-cyan-950/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-400/30 text-cyan-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-wide text-white font-cyber flex items-center gap-2">
                INDEPENDENT USER REPOSITORY SYNC & AUTH <span className="text-cyan-400 text-xs px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">ENTERPRISE</span>
              </h2>
              <p className="text-xs text-slate-400">Google Workspace & GitHub OAuth 2.0 Repository Synchronization</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sync Success Message */}
        {syncStatusMessage && (
          <div className="px-6 py-2.5 bg-emerald-950/80 border-b border-emerald-500/30 flex items-center gap-2 text-xs font-mono text-emerald-300 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{syncStatusMessage}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-white/5 bg-slate-950/40 px-6 gap-2 py-2">
          {[
            { id: 'profile', label: 'Active Account & Scoring' },
            { id: 'sync', label: 'OAuth Sync (Google & GitHub)' },
            { id: 'switch', label: 'Switch Dev Profile' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-cyber transition-all ${
                activeTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(0,243,255,0.2)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          
          {/* TAB 1: ACTIVE PROFILE & USER INDEPENDENT SCORING */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              {/* User Identity Card */}
              <div className="p-4 rounded-xl glass-cyan border border-cyan-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name} 
                    className="w-12 h-12 rounded-full border-2 border-cyan-400 object-cover shadow-[0_0_12px_rgba(0,243,255,0.4)]" 
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-cyber font-bold text-white text-base">{currentUser.name}</h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase font-bold">
                        {currentUser.provider}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-mono">{currentUser.email}</p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">{currentUser.enterpriseRole} • {currentUser.activeOrg}</p>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-[10px] text-slate-400 uppercase block">Synced Repos</span>
                  <span className="text-2xl font-bold font-cyber text-white">{repositories.length}</span>
                </div>
              </div>

              {/* Connected Repositories Scoring & Surgery Requirements */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                  <span className="font-bold uppercase">Your Connected Repositories & Surgery Status:</span>
                  <span className="text-cyan-400">Independent User Feed</span>
                </div>

                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {repositories.map((repo) => {
                    const needsSurgery = repo.health.score < 80 || repo.security.critical > 0 || !repo.ci.passing;
                    return (
                      <div key={repo.repo.id} className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs font-mono">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white font-cyber">{repo.repo.name}</span>
                            <span className="text-[10px] text-slate-400">({repo.repo.framework})</span>
                          </div>
                          <span className="text-[10px] text-slate-500">Branch: {repo.repo.branch} • {repo.repo.linesOfCode.toLocaleString()} LOC</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className={`font-bold ${repo.health.score >= 80 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {repo.health.score}%
                            </span>
                            <span className="text-[10px] text-slate-400 block">{repo.health.status}</span>
                          </div>

                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            needsSurgery ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}>
                            {needsSurgery ? 'SURGERY REQUIRED' : 'SEALED'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OAUTH SYNC WITH GOOGLE & GITHUB */}
          {activeTab === 'sync' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect your organization's Google Workspace or GitHub account to automatically pull, analyze, and score all private and team repositories in real time.
              </p>

              {/* GitHub OAuth Card */}
              <div className="p-4 rounded-xl glass-panel border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center border border-white/20 text-white font-cyber font-bold text-sm">
                    GH
                  </div>
                  <div>
                    <h4 className="text-sm font-bold font-cyber text-white">GitHub Enterprise Sync</h4>
                    <p className="text-xs text-slate-400">Sync all org repositories, branch protections & automated PRs</p>
                  </div>
                </div>

                <button
                  onClick={() => handleTriggerSync('github')}
                  disabled={isSyncing}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:from-slate-800 text-black font-cyber font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(0,243,255,0.3)]"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Syncing Repos...' : 'Sync with GitHub'}
                </button>
              </div>

              {/* Google Workspace OAuth Card */}
              <div className="p-4 rounded-xl glass-panel border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-950 flex items-center justify-center border border-blue-500/30 text-cyan-400 font-cyber font-bold text-sm">
                    G
                  </div>
                  <div>
                    <h4 className="text-sm font-bold font-cyber text-white">Google Workspace & Cloud Source</h4>
                    <p className="text-xs text-slate-400">Sync Google Cloud Run, Cloud SQL & Firebase architectures</p>
                  </div>
                </div>

                <button
                  onClick={() => handleTriggerSync('google')}
                  disabled={isSyncing}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:from-slate-800 text-black font-cyber font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(52,211,153,0.3)]"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Syncing Repos...' : 'Sync with Google'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: SWITCH DEVELOPER PROFILE */}
          {activeTab === 'switch' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Switch between developer profiles to test multi-user repository streaming and permission boundaries:
              </p>

              <div className="space-y-2">
                {INITIAL_USER_PROFILES.map((profile) => {
                  const isCurrent = profile.id === currentUser.id;
                  return (
                    <div
                      key={profile.id}
                      onClick={() => onSwitchUser(profile)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isCurrent
                          ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_12px_rgba(0,243,255,0.25)]'
                          : 'bg-black/40 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img src={profile.avatar} alt={profile.name} className="w-9 h-9 rounded-full object-cover border border-cyan-400/50" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-cyber font-bold text-xs text-white">{profile.name}</span>
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-slate-300 uppercase">
                              {profile.provider}
                            </span>
                          </div>
                          <span className="text-[11px] font-mono text-slate-400">{profile.email} • {profile.enterpriseRole}</span>
                        </div>
                      </div>

                      {isCurrent ? (
                        <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Active
                        </span>
                      ) : (
                        <button className="text-xs font-mono text-cyan-400 hover:underline">
                          Select →
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-cyan-500/20 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>Enterprise User Auth Protocol v4.9</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 text-xs font-medium transition-all"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
