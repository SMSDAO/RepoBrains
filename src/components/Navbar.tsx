import React, { useState } from 'react';
import { 
  Shield, Cpu, BookOpen, Key, Zap, ChevronDown, 
  Menu, X, Activity, Server, Wrench, Eye, Database, 
  Flame, Lock, GitBranch, GitPullRequest, User, Radio, Globe, Sparkles
} from 'lucide-react';
import { OracleRegistry, CryptoWalletState, UserProfile, RepoConnectionStatus } from '../types/oracle';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentRepo: OracleRegistry;
  repositories: OracleRegistry[];
  onSelectRepo: (repo: OracleRegistry) => void;
  wallet: CryptoWalletState;
  currentUser: UserProfile;
  repoConnectionStatus?: RepoConnectionStatus;
  dataFreshness?: string;
  onManualSyncRepo?: () => void;
  onOpenUserAuthModal: () => void;
  onOpenWalletModal: () => void;
  onOpenUserGuide: () => void;
  onOpenPipelineModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentRepo,
  repositories,
  onSelectRepo,
  wallet,
  currentUser,
  repoConnectionStatus = 'Connected',
  dataFreshness = 'Live 0-drift',
  onManualSyncRepo,
  onOpenUserAuthModal,
  onOpenWalletModal,
  onOpenUserGuide,
  onOpenPipelineModal
}) => {
  const [isRepoDropdownOpen, setIsRepoDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'executive', label: 'Executive', icon: Activity },
    { id: 'superadmin', label: 'Super Admin', icon: Lock },
    { id: 'repoprompt', label: 'Repo Prompt', icon: Sparkles },
    { id: 'admission', label: 'PR Repair Box', icon: GitPullRequest },
    { id: 'wireups', label: 'Wire-up Studio', icon: Database },
    { id: 'timeline', label: 'Live Stream', icon: Radio },
    { id: 'surgery', label: 'Surgery', icon: Wrench },
    { id: 'graph', label: 'Knowledge Graph', icon: Database },
    { id: 'vitals', label: 'Vitals', icon: Cpu },
    { id: 'fleet', label: 'Fleet', icon: Shield },
    { id: 'admin', label: 'Admin Registry', icon: Server },
    { id: 'public', label: 'Public', icon: Eye },
    { id: 'aiguard', label: 'AI-Guard', icon: Flame },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-cyan-500/20 bg-[#05070e]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Brand Identity & SSOT status */}
          <div className="flex items-center gap-4">
            <div 
              onClick={() => setActiveTab('executive')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 p-0.5 shadow-[0_0_15px_rgba(0,243,255,0.4)] group-hover:shadow-[0_0_25px_rgba(0,243,255,0.7)] transition-all">
                <div className="w-full h-full bg-[#05070e] rounded-[10px] flex items-center justify-center">
                  <Shield className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-cyber font-black tracking-wider text-base text-white">
                    REPO-BRAIN
                  </span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    ENTERPRISE
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[9px] font-mono text-slate-400">
                  <span className="text-cyan-300 font-semibold">SSOT: AUTHORITATIVE</span>
                  <span>•</span>
                  <span>v4.9</span>
                </div>
              </div>
            </div>

            {/* Repository Quick-Switcher Dropdown */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsRepoDropdownOpen(!isRepoDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-xs font-mono text-slate-200 transition-colors"
              >
                <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-semibold text-white max-w-[130px] truncate">{currentRepo.repo.name}</span>
                <span className="px-1.5 py-0.2 rounded bg-cyan-950/60 text-cyan-300 text-[10px]">
                  {currentRepo.repo.framework}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isRepoDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 rounded-xl glass-panel border border-cyan-500/30 bg-[#080d1b] shadow-2xl z-50 p-1.5 animate-in fade-in">
                  <div className="p-2 text-[10px] font-mono text-slate-400 uppercase tracking-wider border-b border-white/10">
                    Select Target Repository
                  </div>
                  <div className="max-h-56 overflow-y-auto space-y-1 mt-1">
                    {repositories.map((repo) => (
                      <button
                        key={repo.repo.id}
                        onClick={() => {
                          onSelectRepo(repo);
                          setIsRepoDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2 rounded-lg text-xs font-mono flex items-center justify-between transition-colors ${
                          repo.repo.id === currentRepo.repo.id
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : 'hover:bg-white/5 text-slate-300'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <span className="font-cyber font-bold block">{repo.repo.name}</span>
                          <span className="text-[10px] text-slate-400">{repo.repo.framework} • {repo.repo.branch}</span>
                        </div>
                        <span className={`text-[10px] font-bold ${
                          repo.health.score >= 80 ? 'text-emerald-400' : 'text-orange-400'
                        }`}>
                          {repo.health.score}%
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Visual GitHub Repository Connection Status & Data Freshness Indicator */}
            <div 
              onClick={onManualSyncRepo}
              title="Click to trigger live GitHub repository sync"
              className={`hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-xl border text-[11px] font-mono cursor-pointer transition-all ${
                repoConnectionStatus === 'Connected'
                  ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300 hover:bg-emerald-950/50'
                  : repoConnectionStatus === 'Syncing'
                  ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300 hover:bg-cyan-950/60'
                  : 'bg-red-950/30 border-red-500/30 text-red-300 hover:bg-red-950/50'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  {repoConnectionStatus === 'Connected' && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  )}
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${
                    repoConnectionStatus === 'Connected'
                      ? 'bg-emerald-400'
                      : repoConnectionStatus === 'Syncing'
                      ? 'bg-cyan-400 animate-spin'
                      : 'bg-red-400'
                  }`}></span>
                </span>
                <span className="font-bold">
                  {repoConnectionStatus === 'Connected' ? 'GitHub: Connected' : repoConnectionStatus === 'Syncing' ? 'GitHub: Syncing...' : 'GitHub: Disconnected'}
                </span>
              </div>
              <span className="text-[9px] text-slate-400 border-l border-white/10 pl-1.5 font-sans">
                {dataFreshness}
              </span>
            </div>
          </div>

          {/* Center: Desktop Navigation Tabs */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium font-cyber tracking-wide transition-all ${
                    active
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(0,243,255,0.25)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right: Actions & Sovereign Crypto Wallet */}
          <div className="flex items-center gap-2">
            
            {/* Run 17-Step Pipeline button */}
            <button
              onClick={onOpenPipelineModal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 text-xs font-cyber font-bold transition-all shadow-[0_0_12px_rgba(0,243,255,0.2)]"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Pipeline</span>
            </button>

            {/* User Guide Button */}
            <button
              onClick={onOpenUserGuide}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel hover:bg-white/10 text-xs font-cyber text-slate-300 border border-white/10 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-orange-400" />
              <span className="hidden sm:inline">Guide</span>
            </button>

            {/* User Profile & Google/GitHub Sync Button */}
            <button
              onClick={onOpenUserAuthModal}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-cyan-500/30 bg-black/60 hover:bg-black/90 text-xs font-mono text-slate-200 transition-all shadow-[0_0_10px_rgba(0,243,255,0.15)]"
            >
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-5 h-5 rounded-full object-cover border border-cyan-400" 
              />
              <span className="hidden md:inline font-bold text-white max-w-[90px] truncate">{currentUser.name}</span>
              <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 uppercase">
                {currentUser.provider}
              </span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Organized Category Slider Bar: Easy to Understand & Quick Navigation */}
      <div className="border-t border-white/5 bg-[#060a16]/90 px-4 sm:px-6 lg:px-8 py-2 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 min-w-max">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold mr-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span> NAVIGATE:
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-cyber transition-all ${
                    active
                      ? 'bg-gradient-to-r from-cyan-500/25 to-blue-500/25 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(0,243,255,0.25)] scale-105'
                      : 'bg-black/40 text-slate-400 hover:text-white border border-white/5 hover:border-white/20'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.id === 'superadmin' && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 font-bold">
                      ROOT GOV
                    </span>
                  )}
                  {item.id === 'repoprompt' && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold animate-pulse">
                      COPILOT SSOT
                    </span>
                  )}
                  {item.id === 'admission' && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold">
                      PASTE BOX
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Professional Oracle Sovereign Crypto Wallet in Slider Menu */}
          <button
            onClick={onOpenWalletModal}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all shrink-0 ${
              wallet.connected
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/50 shadow-[0_0_15px_rgba(52,211,153,0.25)]'
                : 'bg-black/70 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/15 shadow-[0_0_10px_rgba(0,243,255,0.15)]'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold font-cyber">
              {wallet.connected 
                ? `${wallet.address?.slice(0, 6)}...${wallet.address?.slice(-4)}` 
                : 'Oracle Wallet'}
            </span>
            <span className={`w-1.5 h-1.5 rounded-full ${wallet.connected ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="xl:hidden border-t border-cyan-500/20 bg-[#060a16] p-4 space-y-3 animate-in slide-in-from-top-2">
          {/* Mobile Oracle Wallet Card */}
          <div
            onClick={() => {
              onOpenWalletModal();
              setIsMobileMenuOpen(false);
            }}
            className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between text-xs font-mono transition-all ${
              wallet.connected
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-black/60 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10'
            }`}
          >
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="font-bold block">Sovereign Oracle Wallet</span>
                <span className="text-[10px] text-slate-400">
                  {wallet.connected ? wallet.address : 'Click to generate / connect key'}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 uppercase">
              {wallet.connected ? 'Connected' : 'Connect'}
            </span>
          </div>

          {/* Mobile Repo Selector */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Target Repository:</span>
            <select
              value={currentRepo.repo.id}
              onChange={(e) => {
                const found = repositories.find(r => r.repo.id === e.target.value);
                if (found) onSelectRepo(found);
              }}
              className="w-full bg-black/60 border border-cyan-500/30 rounded-lg p-2 text-xs font-mono text-cyan-300 focus:outline-none"
            >
              {repositories.map(r => (
                <option key={r.repo.id} value={r.repo.id}>
                  {r.repo.name} ({r.repo.framework}) - {r.health.score}%
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-cyber ${
                    active ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400' : 'text-slate-300 bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex gap-2">
            <button
              onClick={() => {
                onOpenPipelineModal();
                setIsMobileMenuOpen(false);
              }}
              className="flex-1 py-2 rounded-lg bg-cyan-500 text-black font-cyber font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <Zap className="w-4 h-4 fill-black" /> Run 17-Step Pipeline
            </button>
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom Tab Bar */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#060913]/90 backdrop-blur-lg border-t border-cyan-500/20 py-2 px-3 flex items-center justify-around shadow-2xl">
        {[
          { id: 'executive', label: 'Executive', icon: Activity },
          { id: 'admission', label: 'PR Box', icon: GitPullRequest },
          { id: 'surgery', label: 'Surgery', icon: Wrench },
          { id: 'graph', label: 'Graph', icon: Database },
          { id: 'vitals', label: 'Vitals', icon: Cpu },
        ].map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 text-[10px] font-cyber transition-all ${
                active ? 'text-cyan-400 font-bold scale-105' : 'text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
