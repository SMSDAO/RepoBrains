import React, { useState } from 'react';
import { 
  ShieldCheck, ShieldAlert, Key, Users, Settings, Database, 
  Cpu, Lock, RefreshCw, CheckCircle2, AlertTriangle, Play, 
  Pause, Power, Radio, Layers, Download, Check, ExternalLink,
  Zap, Globe, Terminal, Sparkles, Sliders, Server
} from 'lucide-react';
import { OracleRegistry, UserProfile, EnterprisePlugin } from '../../types/oracle';
import { INITIAL_ENTERPRISE_PLUGINS, INITIAL_USER_PROFILES } from '../../data/mockUserDataAndTrends';

interface SuperAdminEnterpriseDashboardProps {
  currentUser: UserProfile;
  repositories: OracleRegistry[];
  onUpdateRepo: (updated: OracleRegistry) => void;
  onOpenPipeline: () => void;
}

export const SuperAdminEnterpriseDashboard: React.FC<SuperAdminEnterpriseDashboardProps> = ({
  currentUser,
  repositories,
  onUpdateRepo,
  onOpenPipeline
}) => {
  const [plugins, setPlugins] = useState<EnterprisePlugin[]>(INITIAL_ENTERPRISE_PLUGINS);
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USER_PROFILES);
  const [isEmergencyLockdown, setIsEmergencyLockdown] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'plugins' | 'rbac' | 'audit_keys'>('overview');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isSuperAdminUser = currentUser.email.toLowerCase() === 'gxqstudio@gmail.com' || currentUser.isSuperAdmin;

  const handleTogglePlugin = (pluginId: string) => {
    setPlugins(prev => prev.map(p => {
      if (p.id === pluginId) {
        const nextState = !p.enabled;
        setToastMessage(`Plugin '${p.name}' is now ${nextState ? 'ENABLED (Live Sync)' : 'DISABLED'}`);
        setTimeout(() => setToastMessage(null), 3000);
        return {
          ...p,
          enabled: nextState,
          status: nextState ? 'ACTIVE' : 'DISABLED',
          lastSync: 'Just now'
        };
      }
      return p;
    }));
  };

  const handleEmergencyLockdownToggle = () => {
    const next = !isEmergencyLockdown;
    setIsEmergencyLockdown(next);
    setToastMessage(next 
      ? '🚨 EMERGENCY FLEET LOCKDOWN ACTIVATED: All repository branches set to read-only zero-trust!' 
      : '✅ EMERGENCY LOCKDOWN LIFTED: Fleet autonomous pipelines restored.');
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handlePromoteRole = (userId: string, newRole: UserProfile['enterpriseRole']) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, enterpriseRole: newRole } : u));
    setToastMessage(`User role updated to ${newRole}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Super Admin Top Authority Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/40 relative overflow-hidden shadow-2xl shadow-cyan-950/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-lg text-xs font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 flex items-center gap-1.5 font-bold shadow-[0_0_15px_rgba(0,243,255,0.3)]">
                <Lock className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                ADMIN EXCLUSIVE ENTERPRISE DASHBOARD
              </span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                ROOT SUPER ADMIN: gxqstudio@gmail.com
              </span>
              <span className="text-slate-400 text-xs font-mono">• MASTER NODE ACTIVE</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-white font-cyber tracking-tight">
              SUPER ADMIN GOVERNANCE & FLEET MASTER CONTROL
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Full authority console for enterprise organization root governance, automated plugin orchestration, sovereign GreenLock key rotations, and multi-tenant developer access matrix.
            </p>
          </div>

          {/* Master Emergency Controls */}
          <div className="flex items-center gap-3 shrink-0 relative z-10">
            <button
              onClick={handleEmergencyLockdownToggle}
              className={`px-4 py-2.5 rounded-xl font-cyber font-bold text-xs flex items-center gap-2 transition-all shadow-lg ${
                isEmergencyLockdown
                  ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_25px_rgba(239,68,68,0.5)] animate-pulse'
                  : 'bg-black/60 hover:bg-red-950/40 text-red-400 border border-red-500/30'
              }`}
            >
              <Power className="w-4 h-4" />
              {isEmergencyLockdown ? 'EMERGENCY LOCKDOWN ACTIVE' : 'Fleet Emergency Lockdown'}
            </button>

            <button
              onClick={onOpenPipeline}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-cyber font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(0,243,255,0.35)] transition-all"
            >
              <Zap className="w-4 h-4 fill-black" />
              Master Pipeline
            </button>
          </div>
        </div>

        {/* Super Admin Status Ticker */}
        <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-400 text-[10px] uppercase block">Super Admin Identity</span>
            <span className="text-white font-bold">{currentUser.email}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase block">Authority Level</span>
            <span className="text-cyan-300 font-bold">Root Master Authority (Tier 0)</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase block">Enterprise License</span>
            <span className="text-emerald-300 font-bold">Enterprise Elite (∞ Seats)</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase block">Compliance Certification</span>
            <span className="text-emerald-400 font-bold">SOC2 / ISO 27001 / FedRAMP</span>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-4 rounded-xl bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-between text-xs text-cyan-200 shadow-2xl animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
            <span className="font-semibold">{toastMessage}</span>
          </div>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-xs font-mono text-slate-400 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Super Admin Navigation Tabs */}
      <div className="flex border-b border-white/10 bg-black/40 p-2 rounded-2xl gap-2">
        {[
          { id: 'overview', label: 'Master Overview & Health', icon: ActivityIcon },
          { id: 'plugins', label: 'Enterprise Plugins & SDK Modules', icon: Layers },
          { id: 'rbac', label: 'RBAC User & Dev Access Matrix', icon: Users },
          { id: 'audit_keys', label: 'GreenLock Master Keys & Audit Vault', icon: Key },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-cyber transition-all ${
                active
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(0,243,255,0.25)]'
                  : 'text-slate-400 hover:text-white bg-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: MASTER OVERVIEW */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 space-y-2">
              <span className="text-slate-400 text-xs font-mono uppercase">Managed Production Repos</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white font-cyber">{repositories.length}</span>
                <span className="text-emerald-400 text-xs font-mono font-bold">100% Synced</span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">0 Unresolved Disconnects</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 space-y-2">
              <span className="text-slate-400 text-xs font-mono uppercase">Active Enterprise Plugins</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white font-cyber">
                  {plugins.filter(p => p.enabled).length} / {plugins.length}
                </span>
                <span className="text-cyan-400 text-xs font-mono font-bold">All Operational</span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">WebSocket & Webhook Active</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-yellow-500/20 space-y-2">
              <span className="text-slate-400 text-xs font-mono uppercase">GreenLock Master Seals</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white font-cyber">100%</span>
                <span className="text-yellow-400 text-xs font-mono font-bold">SHA-256</span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">Hardware HSM Verified</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-purple-500/20 space-y-2">
              <span className="text-slate-400 text-xs font-mono uppercase">Active Dev Seats</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white font-cyber">{users.length}</span>
                <span className="text-purple-400 text-xs font-mono font-bold">Unlimited Tier</span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">Super Admin Root Assigned</p>
            </div>
          </div>

          {/* Infrastructure Health & Database Pools */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <h2 className="text-sm font-bold font-cyber text-white uppercase tracking-wider flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" /> Real-Time Database Connection & Microservice Pool Telemetry
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-black/50 border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">PostgreSQL Master Cluster</span>
                  <span className="text-emerald-400 font-bold">HEALTHY</span>
                </div>
                <div className="space-y-1 text-slate-300">
                  <p>• Active Pool: 42 / 50 connections</p>
                  <p>• P99 Query Latency: 4.8ms</p>
                  <p>• Idle Eviction Timeout: 10,000ms</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/50 border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Redis Cluster & Cache</span>
                  <span className="text-emerald-400 font-bold">HEALTHY</span>
                </div>
                <div className="space-y-1 text-slate-300">
                  <p>• Cache Hit Ratio: 99.2%</p>
                  <p>• Memory Usage: 1.4 GB / 8.0 GB</p>
                  <p>• Rate Limiting: Sliding Window (Active)</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/50 border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Cloud KMS Key Enclave</span>
                  <span className="text-cyan-400 font-bold">LOCKED & SEALED</span>
                </div>
                <div className="space-y-1 text-slate-300">
                  <p>• GreenLock Root Nonce: #49281</p>
                  <p>• Key Rotation: Automated (30d)</p>
                  <p>• Signature: RSA-4096-PSS</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ENTERPRISE PLUGINS & SDK MODULES */}
      {activeAdminTab === 'plugins' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h2 className="text-sm font-bold font-cyber text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" /> Enterprise Plugins & Microservice Modules ({plugins.length})
            </h2>
            <span className="text-xs font-mono text-slate-400">Super Admin Orchestration</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plugins.map((plugin) => (
              <div
                key={plugin.id}
                className={`p-5 rounded-2xl border transition-all space-y-3 ${
                  plugin.enabled
                    ? 'glass-panel border-cyan-500/30'
                    : 'bg-black/40 border-white/5 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-cyber font-bold text-sm text-white">{plugin.name}</h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-cyan-300 font-bold">
                        {plugin.version}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">{plugin.category}</span>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => handleTogglePlugin(plugin.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                      plugin.enabled
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(52,211,153,0.2)]'
                        : 'bg-black/60 text-slate-400 border border-white/10'
                    }`}
                  >
                    <Power className="w-3 h-3" />
                    <span>{plugin.enabled ? 'ACTIVE' : 'DISABLED'}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{plugin.description}</p>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Frequency: <strong className="text-cyan-300">{plugin.syncFrequency}</strong></span>
                  <span>Last Sync: <strong className="text-slate-200">{plugin.lastSync}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: RBAC USER & DEV ACCESS MATRIX */}
      {activeAdminTab === 'rbac' && (
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h2 className="text-sm font-bold font-cyber text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" /> Multi-Tenant Developer Access Matrix
            </h2>
            <span className="text-xs font-mono text-emerald-400 font-bold">Total Developers: {users.length}</span>
          </div>

          <div className="space-y-3">
            {users.map((user) => {
              const isSuper = user.email.toLowerCase() === 'gxqstudio@gmail.com' || user.isSuperAdmin;
              return (
                <div
                  key={user.id}
                  className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-cyan-400" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-cyber font-bold text-xs text-white">{user.name}</span>
                        {isSuper && (
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                            SUPER ADMIN
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">{user.email} • {user.activeOrg}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={user.enterpriseRole}
                      disabled={isSuper}
                      onChange={(e) => handlePromoteRole(user.id, e.target.value as any)}
                      className="bg-black/60 border border-white/10 rounded-lg p-2 text-xs font-mono text-cyan-300 focus:outline-none"
                    >
                      <option value="Super Admin (Root Authority)">Super Admin (Root Authority)</option>
                      <option value="Principal Architect">Principal Architect</option>
                      <option value="Security Lead">Security Lead</option>
                      <option value="Staff Engineer">Staff Engineer</option>
                      <option value="DevOps Lead">DevOps Lead</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT KEYS & VAULT */}
      {activeAdminTab === 'audit_keys' && (
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h2 className="text-sm font-bold font-cyber text-white uppercase tracking-wider flex items-center gap-2">
              <Key className="w-4 h-4 text-cyan-400" /> Cryptographic Root Key Vault & Audit Logs
            </h2>
            <button
              onClick={() => setToastMessage('Audit log exported to encrypted JSON archive.')}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Export Audit Archive
            </button>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 font-mono text-xs">
            {[
              { time: '13:48:21 UTC', event: 'GREENLOCK_MASTER_SEAL', target: 'enterprise-cloud-portal', actor: 'gxqstudio@gmail.com', status: 'VERIFIED' },
              { time: '13:40:02 UTC', event: 'COPILOT_SSOT_PROMPT_SYNTHESIS', target: 'enterprise-cloud-portal', actor: 'gxqstudio@gmail.com', status: 'SUCCESS' },
              { time: '13:30:15 UTC', event: 'DB_POOL_IDLE_TIMEOUT_REPAIRED', target: 'fintech-edge-gateway', actor: 'Autonomous Daemon', status: 'REPAIRED' },
              { time: '13:15:00 UTC', event: 'OAUTH_SYNC_GOOGLE_WORKSPACE', target: 'All Fleet Repos', actor: 'gxqstudio@gmail.com', status: 'SYNCED' }
            ].map((log, i) => (
              <div key={i} className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">{log.time}</span>
                  <span className="text-cyan-300 font-bold">{log.event}</span>
                  <span className="text-slate-400">➔ {log.target}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Actor: {log.actor}</span>
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">{log.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

function ActivityIcon(props: any) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}
