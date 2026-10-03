import { HistoricalTrendDataPoint, ProductionWireupRepair, EnterpriseTimelineEvent, UserProfile, EnterprisePlugin } from '../types/oracle';

export const INITIAL_USER_PROFILES: UserProfile[] = [
  {
    id: 'user-google-01',
    name: 'GXQ Studio Lead (Super Admin)',
    email: 'gxqstudio@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    provider: 'google',
    syncedReposCount: 18,
    enterpriseRole: 'Super Admin (Root Authority)',
    isSuperAdmin: true,
    activeOrg: 'GXQ Sovereign Labs (Root Super Admin Node)',
    token: 'ya29.a0AfH6SM_SUPER_ADMIN_MASTER_KEY_ROOT'
  },
  {
    id: 'user-github-02',
    name: 'Quantum Dev Core',
    email: 'dev@quantum-labs.io',
    githubUsername: 'quantum-core-dev',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    provider: 'github',
    syncedReposCount: 14,
    enterpriseRole: 'Staff Engineer',
    isSuperAdmin: false,
    activeOrg: 'MegaCorp Tech Fleet'
  },
  {
    id: 'user-guest-03',
    name: 'Security Officer (Audit Mode)',
    email: 'sec-audit@enterprise-oracle.internal',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    provider: 'guest',
    syncedReposCount: 14,
    enterpriseRole: 'Security Lead',
    isSuperAdmin: false,
    activeOrg: 'Global Security Council'
  }
];

export const INITIAL_ENTERPRISE_PLUGINS: EnterprisePlugin[] = [
  {
    id: 'plugin-github-app',
    name: 'GitHub Enterprise Autonomous App',
    category: 'CI_CD',
    iconName: 'GitPullRequest',
    version: 'v2.4.1',
    enabled: true,
    status: 'ACTIVE',
    description: 'Bi-directional webhook sync for branch protections, automated PR remediation, and GreenLock commit status checks.',
    endpoint: 'https://api.github.com/app/installations/gxq-enterprise',
    syncFrequency: 'Real-time WebSocket (0-drift)',
    lastSync: 'Just now',
    configKeys: { AppId: 'app-94821', ClientId: 'Iv1.82736192', WebhookSecret: '••••••••••••••••' }
  },
  {
    id: 'plugin-vault-kms',
    name: 'HashiCorp Vault & Cloud KMS',
    category: 'KMS_VAULT',
    iconName: 'Lock',
    version: 'v1.14.3',
    enabled: true,
    status: 'ACTIVE',
    description: 'Hardware Security Module (HSM) key rotation and sovereign private key storage for GreenLock sha256 sealing.',
    endpoint: 'https://vault.internal.gxqlabs.io/v1/transit',
    syncFrequency: 'Hourly rotation check',
    lastSync: '12m ago',
    configKeys: { Engine: 'transit/greenlock', KeyType: 'rsa-4096-pss', LeaseTTL: '86400s' }
  },
  {
    id: 'plugin-datadog-sentry',
    name: 'Datadog & Sentry APM Radar',
    category: 'APM_METRICS',
    iconName: 'Activity',
    version: 'v3.2.0',
    enabled: true,
    status: 'ACTIVE',
    description: 'Correlates code-level AST diagnostics with production error crash rates, p99 latency regressions, and SSRF anomalies.',
    endpoint: 'https://api.datadoghq.com/api/v2/monitors',
    syncFrequency: 'Every 30 seconds',
    lastSync: '30s ago',
    configKeys: { Environment: 'production', SampleRate: '1.0', TraceRetention: '30d' }
  },
  {
    id: 'plugin-linear-jira',
    name: 'Linear & Jira Enterprise Bridge',
    category: 'SECURITY',
    iconName: 'Layers',
    version: 'v2.1.0',
    enabled: true,
    status: 'ACTIVE',
    description: 'Automatically creates, assigns, and resolves triage tickets for critical security vulnerabilities and test failures.',
    endpoint: 'https://api.linear.app/graphql',
    syncFrequency: 'Event triggered',
    lastSync: '4m ago',
    configKeys: { Project: 'GXQ-REPOS', DefaultAssignee: 'gxqstudio@gmail.com', Priority: 'Urgent' }
  },
  {
    id: 'plugin-slack-discord',
    name: 'Slack & Discord SecOps Bot',
    category: 'COMMUNICATION',
    iconName: 'Radio',
    version: 'v1.9.4',
    enabled: true,
    status: 'ACTIVE',
    description: 'Broadcasts instant notifications when autonomous surgeries complete, GreenLocks are signed, or CVE regressions occur.',
    endpoint: 'https://hooks.slack.com/services/T00/B00/XXXX',
    syncFrequency: 'Real-time push',
    lastSync: '1m ago',
    configKeys: { Channel: '#oracle-secops-live', BroadcastRole: '@security-council' }
  },
  {
    id: 'plugin-postgres-redis',
    name: 'PostgreSQL Pool & Redis Cluster',
    category: 'DATABASE',
    iconName: 'Database',
    version: 'v5.1.2',
    enabled: true,
    status: 'ACTIVE',
    description: 'Monitors database connection pooling health, active transactions, query latency SLAs, and cache hit ratios.',
    endpoint: 'postgres://master-pool.gxqlabs.internal:5432/production',
    syncFrequency: 'Continuous ping',
    lastSync: 'Real-time',
    configKeys: { PoolSize: '50', IdleTimeout: '10000ms', SSLMode: 'require' }
  }
];

export function generate30DayHistoricalData(baseScore: number = 85, volatility: number = 10): HistoricalTrendDataPoint[] {
  const points: HistoricalTrendDataPoint[] = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dayLabel = `${d.getMonth() + 1}/${d.getDate()}`;
    const dateStr = d.toISOString().split('T')[0];

    // Progressive improvement trajectory simulation
    const progressFactor = (30 - i) / 30;
    const wave = Math.sin(i * 0.45) * volatility;
    
    // Simulate initial drop when critical CVE was found around day 12-18, then steep rise after autonomous surgery
    let health = Math.min(100, Math.max(30, Math.round(baseScore - (1 - progressFactor) * 25 + wave)));
    let failures = Math.max(0, Math.round(5 - progressFactor * 4 + (i % 4 === 0 ? 1 : 0)));
    let cves = Math.max(0, Math.round(4 - progressFactor * 3.5));
    let repaired = Math.round(1 + progressFactor * 4);
    let govRate = Math.min(100, Math.round(80 + progressFactor * 18));

    // Special spike for recent days when PR repairs were merged
    if (i <= 3) {
      health = Math.min(100, 94 + (3 - i) * 2);
      failures = 0;
      cves = 0;
      repaired = 5;
      govRate = 99;
    }

    points.push({
      day: dayLabel,
      date: dateStr,
      healthScore: health,
      failureFrequency: failures,
      cveCount: cves,
      repairedIncidents: repaired,
      governancePassRate: govRate
    });
  }

  return points;
}

export const INITIAL_PRODUCTION_WIREUP_REPAIRS: ProductionWireupRepair[] = [
  {
    id: 'WIRE-DB-001',
    targetService: 'PostgreSQL Database & Connection Pool',
    wireupType: 'DATABASE',
    issueDescription: 'Connection pool starvation during cold starts. Missing max_lifetime and idle connection eviction in Drizzle/Prisma config.',
    connectionStatus: 'REPAIR_READY',
    envVarsRequired: ['DATABASE_URL', 'PG_POOL_MAX=20', 'PG_IDLE_TIMEOUT_MS=10000'],
    repairedCodeSnippet: `// [ORACLE PRODUCTION WIREUP REPAIR]
import { Pool } from 'pg';
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 2000,
  ssl: { rejectUnauthorized: true }
});`,
    productionScoring: {
      before: 54,
      after: 99,
      latencyReduction: '-48ms p99',
      reliabilityGain: '+99.98% uptime'
    }
  },
  {
    id: 'WIRE-SDK-002',
    targetService: 'AWS S3 & Cloud Storage SDK Client',
    wireupType: 'SDK',
    issueDescription: 'Deprecated v2 AWS-SDK initialization blocking streaming multipart uploads on edge workers.',
    connectionStatus: 'REPAIR_READY',
    envVarsRequired: ['AWS_REGION=us-east-1', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY'],
    repairedCodeSnippet: `// [ORACLE PRODUCTION WIREUP REPAIR]
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
export const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  maxAttempts: 3
});`,
    productionScoring: {
      before: 62,
      after: 98,
      latencyReduction: '-120ms upload init',
      reliabilityGain: 'Zero chunk aborts'
    }
  },
  {
    id: 'WIRE-API-003',
    targetService: 'Stripe Payment Gateway API & Webhook Invariant',
    wireupType: 'API',
    issueDescription: 'Missing idempotent header on retry transactions, causing potential duplicate payment authorizations.',
    connectionStatus: 'SYNCHRONIZED',
    envVarsRequired: ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'],
    repairedCodeSnippet: `// [ORACLE PRODUCTION WIREUP REPAIR]
import Stripe from 'stripe';
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
  maxNetworkRetries: 2
});`,
    productionScoring: {
      before: 71,
      after: 100,
      latencyReduction: '-15ms idempotency check',
      reliabilityGain: 'Zero duplicate auths'
    }
  },
  {
    id: 'WIRE-UI-004',
    targetService: 'GraphQL Apollo Client & WebSocket Subscription Gateway',
    wireupType: 'UI',
    issueDescription: 'Unterminated WebSocket connection pool causing UI render lag and memory leak on unmount.',
    connectionStatus: 'REPAIR_READY',
    envVarsRequired: ['VITE_GRAPHQL_ENDPOINT', 'VITE_WS_ENDPOINT'],
    repairedCodeSnippet: `// [ORACLE PRODUCTION WIREUP REPAIR]
import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

const wsLink = new GraphQLWsLink(createClient({
  url: import.meta.env.VITE_WS_ENDPOINT,
  retryAttempts: 5,
  keepAlive: 10000
}));`,
    productionScoring: {
      before: 48,
      after: 96,
      latencyReduction: '-210ms UI sync',
      reliabilityGain: 'Zero UI memory leaks'
    }
  }
];

export const INITIAL_ENTERPRISE_STREAM_EVENTS: EnterpriseTimelineEvent[] = [
  {
    id: 'STREAM-EV-01',
    developerName: 'Sarah Jenkins',
    developerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    developerRole: 'Staff Security Engineer',
    repoName: 'hyperliquid-vault-core',
    actionType: 'GREENLOCK_SEAL',
    summary: 'Applied cryptographic GreenLock seal GLOCK-AXUM-992 following 100% verification pass.',
    healthShift: { before: 88, after: 99 },
    timestamp: '2 mins ago',
    productionImpact: 'Zero-downtime invariant achieved across 412 microservice files.',
    verified: true
  },
  {
    id: 'STREAM-EV-02',
    developerName: 'Alex Thorne',
    developerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    developerRole: 'Lead Backend Architect',
    repoName: 'enterprise-cloud-portal',
    actionType: 'PR_MERGED',
    summary: 'Merged Consolidated PR #108: remediated CVE-2024-34351 SSRF and consolidated duplicate utils.',
    healthShift: { before: 38, after: 98 },
    timestamp: '8 mins ago',
    productionImpact: 'Prevented critical SSRF vector and reduced CI build time by 4m 20s.',
    verified: true
  },
  {
    id: 'STREAM-EV-03',
    developerName: 'DevOps Autonomous Agent',
    developerAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    developerRole: 'Oracle Daemon v4.9',
    repoName: 'solana-amm-dex-router',
    actionType: 'REPAIR_SURGERY',
    summary: 'Synthesized Anchor PDA constraint assertion patch preventing cross-swap route bypass.',
    healthShift: { before: 72, after: 96 },
    timestamp: '19 mins ago',
    productionImpact: 'Protected $420,000 liquidity pool from unchecked route authority calls.',
    verified: true
  },
  {
    id: 'STREAM-EV-04',
    developerName: 'Marcus Vance',
    developerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    developerRole: 'Principal Cloud Architect',
    repoName: 'fintech-edge-gateway',
    actionType: 'WIREUP_SYNC',
    summary: 'Synchronized PostgreSQL connection pool & Redis cluster client with failover clustering.',
    healthShift: { before: 82, after: 97 },
    timestamp: '34 mins ago',
    productionImpact: 'Reduced p99 query latency by 48ms under 50k rps load spikes.',
    verified: true
  },
  {
    id: 'STREAM-EV-05',
    developerName: 'Elena Rostova',
    developerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    developerRole: 'Audit & Governance Officer',
    repoName: 'web3-dao-governance',
    actionType: 'ADMISSION_SCAN',
    summary: 'Admitted Solidity Foundry multi-sig repository: 0 critical vulnerabilities detected.',
    healthShift: { before: 91, after: 95 },
    timestamp: '1 hour ago',
    productionImpact: 'Verified SOC2 Type-II compliance and immutable governance rules.',
    verified: true
  }
];
