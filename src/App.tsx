/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { OracleRegistry, RepairPlanItem, CryptoWalletState, SupportedFramework, UserProfile, RepoConnectionStatus } from './types/oracle';
import { INITIAL_REPOSITORIES, INITIAL_REPAIR_PLANS } from './data/mockRepositories';
import { INITIAL_WALLET } from './services/cryptoWallet';
import { INITIAL_USER_PROFILES } from './data/mockUserDataAndTrends';

// Navigation & Modals
import { Navbar } from './components/Navbar';
import { UserGuideModal } from './components/UserGuideModal';
import { WalletModal } from './components/WalletModal';
import { PipelineRunnerModal } from './components/PipelineRunnerModal';
import { UserAuthSyncModal } from './components/UserAuthSyncModal';
import { SmartAssistantBubble } from './components/SmartAssistantBubble';
import { TelemetryValidationBanner } from './components/TelemetryValidationBanner';
import { GitHubWebhookMonitor } from './components/GitHubWebhookMonitor';

// Dashboards
import { ExecutiveDashboard } from './components/dashboards/ExecutiveDashboard';
import { SuperAdminEnterpriseDashboard } from './components/dashboards/SuperAdminEnterpriseDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { SurgeryDashboard } from './components/dashboards/SurgeryDashboard';
import { PublicDashboard } from './components/dashboards/PublicDashboard';
import { KnowledgeGraphView } from './components/dashboards/KnowledgeGraphView';
import { VitalsDashboard } from './components/dashboards/VitalsDashboard';
import { AiGuardDashboard } from './components/dashboards/AiGuardDashboard';
import { FleetDashboard } from './components/dashboards/FleetDashboard';
import { RepoAdmissionPrBox } from './components/dashboards/RepoAdmissionPrBox';
import { ProductionWireupStudio } from './components/dashboards/ProductionWireupStudio';
import { EnterpriseStreamTimeline } from './components/dashboards/EnterpriseStreamTimeline';
import { RepoPromptStudio } from './components/dashboards/RepoPromptStudio';

export default function App() {
  const [repositories, setRepositories] = useState<OracleRegistry[]>(INITIAL_REPOSITORIES);
  // Default to repo-003 ('enterprise-cloud-portal') which starts in Critical state with rich SSRF issues to demonstrate autonomous surgery!
  const [currentRepoId, setCurrentRepoId] = useState<string>('repo-003');
  const [activeTab, setActiveTab] = useState<string>('executive');
  const [repairPlans, setRepairPlans] = useState<Record<string, RepairPlanItem[]>>(INITIAL_REPAIR_PLANS);
  const [wallet, setWallet] = useState<CryptoWalletState>(INITIAL_WALLET);
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USER_PROFILES[0]);
  const [repoConnectionStatus, setRepoConnectionStatus] = useState<RepoConnectionStatus>('Connected');
  const [dataFreshness, setDataFreshness] = useState<string>('Live 0-drift');

  // Modals state
  const [isUserGuideOpen, setIsUserGuideOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isPipelineModalOpen, setIsPipelineModalOpen] = useState(false);
  const [isUserAuthModalOpen, setIsUserAuthModalOpen] = useState(false);

  // Manual Re-sync from Navbar indicator
  const handleManualSyncRepo = () => {
    setRepoConnectionStatus('Syncing');
    setDataFreshness('Syncing Webhooks...');
    setTimeout(() => {
      setRepoConnectionStatus('Connected');
      setDataFreshness('Just now (0-drift)');
    }, 1200);
  };

  // Active target repository
  const currentRepo = repositories.find(r => r.repo.id === currentRepoId) || repositories[0];
  const currentRepoRepairs = repairPlans[currentRepo.repo.id] || [];

  // Switch active repository
  const handleSelectRepo = (repo: OracleRegistry) => {
    setCurrentRepoId(repo.repo.id);
  };

  const handleSelectRepoByName = (name: string) => {
    const found = repositories.find(r => r.repo.name.toLowerCase() === name.toLowerCase());
    if (found) {
      setCurrentRepoId(found.repo.id);
    }
  };

  // Sync repositories from Google or GitHub
  const handleSyncRepositories = (provider: 'google' | 'github') => {
    setCurrentUser(prev => ({
      ...prev,
      provider,
      syncedReposCount: repositories.length
    }));
  };

  // Update repository state
  const handleUpdateRepo = (updated: OracleRegistry) => {
    setRepositories(prev => prev.map(r => r.repo.id === updated.repo.id ? updated : r));
  };

  // Apply a specific surgery repair plan item
  const handleApplyRepair = (repairId: string) => {
    setRepairPlans(prev => {
      const list = prev[currentRepo.repo.id] || [];
      return {
        ...prev,
        [currentRepo.repo.id]: list.map(item => item.id === repairId ? { ...item, status: 'APPLIED' } : item)
      };
    });
  };

  // Add custom repository to SSOT Registry
  const handleAddCustomRepo = (name: string, framework: SupportedFramework, branch: string) => {
    const newRepo: OracleRegistry = {
      repo: {
        id: `repo-${Date.now().toString().slice(-4)}`,
        name,
        owner: 'sovereign-org',
        branch,
        framework,
        language: framework === 'Axum' || framework === 'Rust' ? 'Rust' : framework === 'Go' || framework === 'Fiber' ? 'Go' : 'TypeScript',
        deployment: 'Cloud Run / Kubernetes',
        commitHash: Math.random().toString(16).slice(2, 9),
        totalFiles: 140,
        linesOfCode: 24500
      },
      health: { score: 75, status: 'STABLE' },
      security: {
        score: 72,
        vulnerabilities: [
          {
            id: `VULN-${Date.now().toString().slice(-3)}`,
            severity: 'MEDIUM',
            package: 'dependency-drift',
            cve: 'CVE-2024-PENDING',
            issue: 'Outdated build toolchain configuration',
            autoRemediable: true
          }
        ],
        critical: 0
      },
      governance: { score: 80, drift: '1.2% minor drift', policyViolations: [] },
      ci: { score: 85, passing: true, buildDuration: '2m 04s' },
      risk: {
        score: 35,
        probability_failure: 0.18,
        blast_radius: 'Isolated',
        dependency_risk: 30,
        supply_chain_risk: 25,
        deployment_risk: 32,
        security_risk: 28
      },
      forecast: {
        next_failure: 'Normal operations expected',
        confidence: 0.85,
        failure_category: 'Standard Operations',
        root_cause_prediction: 'None'
      },
      fleet: {
        total_repositories: repositories.length + 1,
        fleet_health: 88
      },
      last_scan: new Date().toISOString(),
      last_repair: new Date().toISOString(),
      last_verification: new Date().toISOString(),
      lock_state: 'pending_verification'
    };

    setRepositories(prev => [newRepo, ...prev]);
    setCurrentRepoId(newRepo.repo.id);
  };

  // Fleet-wide autonomous remediation
  const handleBulkRemediation = () => {
    setRepositories(prev => prev.map(r => ({
      ...r,
      health: { score: Math.max(92, r.health.score + 25), status: 'ORACLE_GRADE' },
      security: { score: Math.max(94, r.security.score + 22), critical: 0, vulnerabilities: [] },
      ci: { ...r.ci, passing: true },
      risk: { ...r.risk, score: Math.min(12, r.risk.score), blast_radius: 'Isolated' },
      lock_state: 'protected'
    })));
  };

  // Sign GreenLock seal
  const handleSignGreenlock = (signature: string, signer: string) => {
    const updated: OracleRegistry = {
      ...currentRepo,
      lock_state: 'protected',
      cryptographic_seal: {
        signer,
        signature,
        timestamp: new Date().toISOString(),
        greenlockId: `GLOCK-${currentRepo.repo.framework.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`
      }
    };
    handleUpdateRepo(updated);
  };

  return (
    <div className="min-h-screen bg-[#04060b] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-300">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentRepo={currentRepo}
        repositories={repositories}
        onSelectRepo={handleSelectRepo}
        wallet={wallet}
        currentUser={currentUser}
        repoConnectionStatus={repoConnectionStatus}
        dataFreshness={dataFreshness}
        onManualSyncRepo={handleManualSyncRepo}
        onOpenUserAuthModal={() => setIsUserAuthModalOpen(true)}
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
        onOpenUserGuide={() => setIsUserGuideOpen(true)}
        onOpenPipelineModal={() => setIsPipelineModalOpen(true)}
      />

      {/* Main App Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 xl:pb-12 space-y-6">
        
        {/* Oracle Registry Mandatory Telemetry Audit Banner */}
        <TelemetryValidationBanner
          currentRepo={currentRepo}
          onSyncGithub={handleManualSyncRepo}
          onOpenSurgery={() => setActiveTab('surgery')}
        />

        {activeTab === 'executive' && (
          <ExecutiveDashboard
            currentRepo={currentRepo}
            fleetRepos={repositories}
            repairQueue={currentRepoRepairs}
            onOpenPipeline={() => setIsPipelineModalOpen(true)}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'superadmin' && (
          <SuperAdminEnterpriseDashboard
            currentUser={currentUser}
            repositories={repositories}
            onUpdateRepo={handleUpdateRepo}
            onOpenPipeline={() => setIsPipelineModalOpen(true)}
          />
        )}

        {activeTab === 'repoprompt' && (
          <RepoPromptStudio
            currentRepo={currentRepo}
            onUpdateRepo={handleUpdateRepo}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'admission' && (
          <RepoAdmissionPrBox
            currentRepo={currentRepo}
            onUpdateRepo={handleUpdateRepo}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'wireups' && (
          <ProductionWireupStudio
            currentRepo={currentRepo}
            onUpdateRepo={handleUpdateRepo}
          />
        )}

        {activeTab === 'timeline' && (
          <EnterpriseStreamTimeline
            currentRepo={currentRepo}
            onSelectRepoByName={handleSelectRepoByName}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            currentRepo={currentRepo}
            repositories={repositories}
            onSelectRepo={handleSelectRepo}
            onOpenPipeline={() => setIsPipelineModalOpen(true)}
            onAddCustomRepo={handleAddCustomRepo}
          />
        )}

        {activeTab === 'surgery' && (
          <SurgeryDashboard
            currentRepo={currentRepo}
            repairPlans={currentRepoRepairs}
            onApplyRepair={handleApplyRepair}
            onUpdateRepo={handleUpdateRepo}
            onOpenPipeline={() => setIsPipelineModalOpen(true)}
          />
        )}

        {activeTab === 'public' && (
          <PublicDashboard currentRepo={currentRepo} />
        )}

        {activeTab === 'graph' && (
          <KnowledgeGraphView currentRepo={currentRepo} />
        )}

        {activeTab === 'vitals' && (
          <VitalsDashboard currentRepo={currentRepo} />
        )}

        {activeTab === 'fleet' && (
          <FleetDashboard
            repositories={repositories}
            onSelectRepo={handleSelectRepo}
            onOpenPipeline={() => setIsPipelineModalOpen(true)}
            onBulkRemediation={handleBulkRemediation}
          />
        )}

        {activeTab === 'aiguard' && (
          <AiGuardDashboard currentRepo={currentRepo} />
        )}

        {activeTab === 'wireups' && (
          <GitHubWebhookMonitor
            currentRepo={currentRepo}
            onRepoUpdatedByWebhook={handleUpdateRepo}
          />
        )}
      </main>

      {/* Independent User Authentication & Sync Modal */}
      <UserAuthSyncModal
        isOpen={isUserAuthModalOpen}
        onClose={() => setIsUserAuthModalOpen(false)}
        currentUser={currentUser}
        onSwitchUser={setCurrentUser}
        repositories={repositories}
        onSyncRepositories={handleSyncRepositories}
      />

      {/* Full User Guide Modal */}
      <UserGuideModal
        isOpen={isUserGuideOpen}
        onClose={() => setIsUserGuideOpen(false)}
      />

      {/* Sovereign Crypto Wallet & GreenLock Signer Modal */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        wallet={wallet}
        setWallet={setWallet}
        onSignGreenlock={handleSignGreenlock}
      />

      {/* 17-Step Autonomous Pipeline Runner Modal */}
      <PipelineRunnerModal
        isOpen={isPipelineModalOpen}
        onClose={() => setIsPipelineModalOpen(false)}
        targetRepo={currentRepo}
        onPipelineComplete={handleUpdateRepo}
      />

      {/* Context-Aware Smart Assistant Floating Chat Bubble */}
      <SmartAssistantBubble
        activeTab={activeTab}
        currentRepo={currentRepo}
        onNavigateTab={setActiveTab}
      />

    </div>
  );
}
