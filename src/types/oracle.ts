export type HealthStatus = 'CRITICAL' | 'POOR' | 'STABLE' | 'HEALTHY' | 'ORACLE_GRADE';

export type BlastRadius = 'Isolated' | 'Module-Wide' | 'Fleet-Wide' | 'Critical';

export type SupportedFramework =
  | 'Next.js'
  | 'React'
  | 'Vite'
  | 'Astro'
  | 'Remix'
  | 'SvelteKit'
  | 'Nuxt'
  | 'Vue'
  | 'Node'
  | 'FastAPI'
  | 'Flask'
  | 'Go'
  | 'Fiber'
  | 'Echo'
  | 'Rust'
  | 'Axum'
  | 'Actix'
  | 'Spring Boot'
  | 'Solidity'
  | 'Foundry'
  | 'Hardhat'
  | 'Solana'
  | 'Anchor';

export interface Vulnerability {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  package: string;
  cve?: string;
  issue: string;
  fixedIn?: string;
  autoRemediable: boolean;
}

export interface OracleRegistry {
  repo: {
    id: string;
    name: string;
    owner: string;
    branch: string;
    framework: SupportedFramework;
    language: string;
    deployment: string;
    commitHash: string;
    totalFiles: number;
    linesOfCode: number;
  };
  health: {
    score: number; // 0 - 100
    status: HealthStatus;
  };
  security: {
    score: number; // 0 - 100
    vulnerabilities: Vulnerability[];
    critical: number;
  };
  governance: {
    score: number; // 0 - 100
    drift: string;
    policyViolations: string[];
  };
  ci: {
    score: number; // 0 - 100
    passing: boolean;
    buildDuration: string;
    failedStep?: string;
  };
  risk: {
    score: number; // 0 - 100
    probability_failure: number; // 0 - 1
    blast_radius: BlastRadius;
    dependency_risk: number;
    supply_chain_risk: number;
    deployment_risk: number;
    security_risk: number;
  };
  forecast: {
    next_failure: string;
    confidence: number;
    failure_category: string;
    root_cause_prediction: string;
  };
  fleet: {
    total_repositories: number;
    fleet_health: number;
  };
  last_scan: string;
  last_repair: string;
  last_verification: string;
  lock_state: 'unprotected' | 'pending_verification' | 'protected';
  cryptographic_seal?: {
    signer: string;
    signature: string;
    timestamp: string;
    greenlockId: string;
  };
}

export interface AgentContract {
  id: string;
  name: string;
  role: string;
  permissions: {
    read: string[];
    write: string[];
    prohibited: string[];
    requires: string[];
  };
  activeStatus: 'STANDBY' | 'EXECUTING' | 'VERIFIED' | 'VIOLATION_HALT';
}

export interface PipelineStep {
  id: string;
  name: string;
  module: string;
  description: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'HALTED' | 'SKIPPED';
  outputKey: string;
  durationMs?: number;
  dataSnippet?: any;
}

export interface RepairPlanItem {
  id: string;
  title: string;
  targetFile: string;
  category: 'dependency' | 'ci' | 'config' | 'build' | 'deployment';
  riskReduction: string;
  status: 'QUEUED' | 'PATCH_READY' | 'APPLIED' | 'VERIFIED' | 'REJECTED';
  diff: string;
  originalSnippet: string;
  remediatedSnippet: string;
  governanceApproval: boolean;
}

export interface KnowledgeGraphNode {
  id: string;
  label: string;
  type: 'repo' | 'framework' | 'dependencies' | 'vulnerabilities' | 'fixes' | 'pull_requests' | 'outcomes' | 'health' | 'forecasts';
  status: 'optimal' | 'warning' | 'critical' | 'neutral';
  meta: Record<string, any>;
}

export interface KnowledgeGraphEdge {
  id: string;
  source: string;
  target: string;
  relationship: string;
  verified: boolean;
}

export interface CryptoWalletState {
  connected: boolean;
  address: string | null;
  publicKey: string | null;
  privateKey: string | null; // For generated sovereign key
  mnemonic?: string;
  walletType: 'GENERATED_SOVEREIGN' | 'METAMASK' | 'PHANTOM' | 'HARDWARE' | null;
  governanceRole: 'ORACLE_CORE_OPERATOR' | 'SECURITY_COUNCIL' | 'READ_ONLY_AUDITOR';
  nonce: number;
}

export type RepoConnectionStatus = 'Connected' | 'Syncing' | 'Disconnected';

export interface EnterprisePlugin {
  id: string;
  name: string;
  category: 'SECURITY' | 'CI_CD' | 'APM_METRICS' | 'COMMUNICATION' | 'KMS_VAULT' | 'DATABASE';
  iconName: string;
  version: string;
  enabled: boolean;
  status: 'ACTIVE' | 'DEGRADED' | 'CONFIG_REQUIRED' | 'DISABLED';
  description: string;
  endpoint?: string;
  syncFrequency: string;
  lastSync: string;
  configKeys: Record<string, string>;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  provider: 'google' | 'github' | 'guest';
  syncedReposCount: number;
  enterpriseRole: 'Super Admin (Root Authority)' | 'Principal Architect' | 'Security Lead' | 'Staff Engineer' | 'DevOps Lead' | 'Executive Lead';
  isSuperAdmin?: boolean;
  githubUsername?: string;
  activeOrg: string;
  token?: string;
}

export interface HistoricalTrendDataPoint {
  day: string;
  date: string;
  healthScore: number;
  failureFrequency: number;
  cveCount: number;
  repairedIncidents: number;
  governancePassRate: number;
}

export interface ProductionWireupRepair {
  id: string;
  targetService: string;
  wireupType: 'DATABASE' | 'SDK' | 'API' | 'UI';
  issueDescription: string;
  connectionStatus: 'DISCONNECTED_ERROR' | 'DRIFT_DETECTED' | 'REPAIR_READY' | 'SYNCHRONIZED';
  envVarsRequired: string[];
  repairedCodeSnippet: string;
  productionScoring: {
    before: number;
    after: number;
    latencyReduction: string;
    reliabilityGain: string;
  };
}

export interface EnterpriseTimelineEvent {
  id: string;
  developerName: string;
  developerAvatar: string;
  developerRole: string;
  repoName: string;
  actionType: 'REPAIR_SURGERY' | 'GREENLOCK_SEAL' | 'ADMISSION_SCAN' | 'WIREUP_SYNC' | 'PR_MERGED';
  summary: string;
  healthShift: {
    before: number;
    after: number;
  };
  timestamp: string;
  productionImpact: string;
  verified: boolean;
}

