import { OracleRegistry, RepairPlanItem, AgentContract, KnowledgeGraphNode, KnowledgeGraphEdge } from '../types/oracle';

export const INITIAL_REPOSITORIES: OracleRegistry[] = [
  {
    repo: {
      id: 'repo-001',
      name: 'hyperliquid-vault-core',
      owner: 'quantum-labs',
      branch: 'main',
      framework: 'Axum',
      language: 'Rust',
      deployment: 'Kubernetes (EKS)',
      commitHash: '7f9a2b4',
      totalFiles: 412,
      linesOfCode: 84320
    },
    health: {
      score: 96,
      status: 'ORACLE_GRADE'
    },
    security: {
      score: 94,
      vulnerabilities: [
        {
          id: 'VULN-RS-009',
          severity: 'LOW',
          package: 'tokio-util',
          cve: 'CVE-2024-4112',
          issue: 'Memory reclamation delay under extreme network congestion',
          fixedIn: '0.7.12',
          autoRemediable: true
        }
      ],
      critical: 0
    },
    governance: {
      score: 98,
      drift: '0.02% (Compliant with SOC2-Type-II)',
      policyViolations: []
    },
    ci: {
      score: 100,
      passing: true,
      buildDuration: '2m 14s'
    },
    risk: {
      score: 12,
      probability_failure: 0.04,
      blast_radius: 'Isolated',
      dependency_risk: 8,
      supply_chain_risk: 10,
      deployment_risk: 14,
      security_risk: 12
    },
    forecast: {
      next_failure: 'Memory pressure anomaly projected in 42 days under 10x traffic spike',
      confidence: 0.92,
      failure_category: 'Resource Contention',
      root_cause_prediction: 'Buffer allocation growth in websocket multiplexer thread pool'
    },
    fleet: {
      total_repositories: 14,
      fleet_health: 88
    },
    last_scan: '2026-10-03T05:30:00Z',
    last_repair: '2026-09-28T14:12:00Z',
    last_verification: '2026-10-03T05:32:00Z',
    lock_state: 'protected',
    cryptographic_seal: {
      signer: '0x8b32ff19ac210874e92a83bd7805ef981240a591',
      signature: '0x9924ac8fbc910384729104859a128e4091f0c294829e102830f8102938471b',
      timestamp: '2026-10-03T05:32:15Z',
      greenlockId: 'GLOCK-AXUM-992'
    }
  },
  {
    repo: {
      id: 'repo-002',
      name: 'solana-amm-dex-router',
      owner: 'sol-defi-protocol',
      branch: 'prod',
      framework: 'Anchor',
      language: 'Solana',
      deployment: 'Solana Mainnet-Beta',
      commitHash: '3e41c90',
      totalFiles: 184,
      linesOfCode: 32400
    },
    health: {
      score: 72,
      status: 'STABLE'
    },
    security: {
      score: 68,
      vulnerabilities: [
        {
          id: 'VULN-SOL-104',
          severity: 'HIGH',
          package: 'spl-token-swap',
          cve: 'CVE-2024-8199',
          issue: 'Missing account owner check in route cross-swap callback',
          fixedIn: '4.1.0',
          autoRemediable: true
        },
        {
          id: 'VULN-SOL-202',
          severity: 'MEDIUM',
          package: 'anchor-lang',
          cve: 'CVE-2024-9104',
          issue: 'Deprecated constraint syntax in PDA seeds validation',
          fixedIn: '0.30.1',
          autoRemediable: true
        }
      ],
      critical: 0
    },
    governance: {
      score: 75,
      drift: '4.8% configuration drift detected in anchor.toml program IDs',
      policyViolations: ['Direct deployment attempted without multisig signoff']
    },
    ci: {
      score: 80,
      passing: true,
      buildDuration: '4m 38s'
    },
    risk: {
      score: 48,
      probability_failure: 0.28,
      blast_radius: 'Fleet-Wide',
      dependency_risk: 42,
      supply_chain_risk: 38,
      deployment_risk: 60,
      security_risk: 52
    },
    forecast: {
      next_failure: 'Instruction timeout during epoch boundary cluster congestion',
      confidence: 0.84,
      failure_category: 'Compute Budget Exhaustion',
      root_cause_prediction: 'Heap limit exceeded when iterating unbonded liquidity positions'
    },
    fleet: {
      total_repositories: 14,
      fleet_health: 88
    },
    last_scan: '2026-10-03T04:10:00Z',
    last_repair: '2026-09-25T11:00:00Z',
    last_verification: '2026-10-03T04:15:00Z',
    lock_state: 'pending_verification'
  },
  {
    repo: {
      id: 'repo-003',
      name: 'enterprise-cloud-portal',
      owner: 'mega-corp-tech',
      branch: 'develop',
      framework: 'Next.js',
      language: 'TypeScript',
      deployment: 'Vercel Enterprise',
      commitHash: 'c90184e',
      totalFiles: 890,
      linesOfCode: 142100
    },
    health: {
      score: 38,
      status: 'CRITICAL'
    },
    security: {
      score: 42,
      vulnerabilities: [
        {
          id: 'VULN-NJS-001',
          severity: 'CRITICAL',
          package: 'next',
          cve: 'CVE-2024-34351',
          issue: 'Server-Side Request Forgery in Server Actions redirect handling',
          fixedIn: '14.2.7',
          autoRemediable: true
        },
        {
          id: 'VULN-NJS-019',
          severity: 'HIGH',
          package: 'axios',
          cve: 'CVE-2024-39338',
          issue: 'SSRF via forward slash in path parameter',
          fixedIn: '1.7.4',
          autoRemediable: true
        }
      ],
      critical: 1
    },
    governance: {
      score: 45,
      drift: '14.2% drift. 3 unauthorized PRs merged without CI green pass.',
      policyViolations: ['Unverified packages in package.json', 'Bypassed PR branch protections']
    },
    ci: {
      score: 25,
      passing: false,
      buildDuration: '6m 12s',
      failedStep: 'Next.js Turbopack typecheck & lint'
    },
    risk: {
      score: 84,
      probability_failure: 0.79,
      blast_radius: 'Fleet-Wide',
      dependency_risk: 88,
      supply_chain_risk: 76,
      deployment_risk: 92,
      security_risk: 82
    },
    forecast: {
      next_failure: 'Production container crash during cold start runtime initialization',
      confidence: 0.94,
      failure_category: 'Turbopack Chunk Hydration Mismatch',
      root_cause_prediction: 'Circular dependency between auth middleware and tenant routing resolver'
    },
    fleet: {
      total_repositories: 14,
      fleet_health: 88
    },
    last_scan: '2026-10-03T05:12:00Z',
    last_repair: '2026-09-18T10:00:00Z',
    last_verification: '2026-10-03T05:15:00Z',
    lock_state: 'unprotected'
  },
  {
    repo: {
      id: 'repo-004',
      name: 'fintech-edge-gateway',
      owner: 'fin-core',
      branch: 'main',
      framework: 'Fiber',
      language: 'Go',
      deployment: 'AWS ECS Fargate',
      commitHash: '88a31df',
      totalFiles: 320,
      linesOfCode: 52100
    },
    health: {
      score: 89,
      status: 'HEALTHY'
    },
    security: {
      score: 91,
      vulnerabilities: [
        {
          id: 'VULN-GO-088',
          severity: 'LOW',
          package: 'golang.org/x/crypto',
          cve: 'CVE-2024-24786',
          issue: 'Infinite loop in PBKDF2 with large iteration bounds',
          fixedIn: 'v0.24.0',
          autoRemediable: true
        }
      ],
      critical: 0
    },
    governance: {
      score: 92,
      drift: '0.8% - Automated sync active',
      policyViolations: []
    },
    ci: {
      score: 95,
      passing: true,
      buildDuration: '1m 45s'
    },
    risk: {
      score: 22,
      probability_failure: 0.09,
      blast_radius: 'Module-Wide',
      dependency_risk: 15,
      supply_chain_risk: 18,
      deployment_risk: 25,
      security_risk: 20
    },
    forecast: {
      next_failure: 'TCP socket leak under unhandled keep-alive client disconnects',
      confidence: 0.78,
      failure_category: 'Network Protocol Deadlock',
      root_cause_prediction: 'Fiber read timeout exceeds upstream load balancer keepalive idle duration'
    },
    fleet: {
      total_repositories: 14,
      fleet_health: 88
    },
    last_scan: '2026-10-03T03:50:00Z',
    last_repair: '2026-09-29T16:00:00Z',
    last_verification: '2026-10-03T03:55:00Z',
    lock_state: 'protected',
    cryptographic_seal: {
      signer: '0x71c8901a1829e0018fba8192a019284102941bca',
      signature: '0xaa18920194857102948019284019284719283748291038471029384710293841',
      timestamp: '2026-10-03T03:55:20Z',
      greenlockId: 'GLOCK-FIBER-881'
    }
  }
];

export const INITIAL_REPAIR_PLANS: Record<string, RepairPlanItem[]> = {
  'repo-003': [
    {
      id: 'REP-003-1',
      title: 'Upgrade Next.js to 14.2.7 (Remediate CVE-2024-34351 SSRF)',
      targetFile: 'package.json',
      category: 'dependency',
      riskReduction: '-38 Risk Points',
      status: 'QUEUED',
      governanceApproval: true,
      originalSnippet: '    "next": "14.1.0",\n    "axios": "1.6.8",',
      remediatedSnippet: '    "next": "14.2.7",\n    "axios": "1.7.4",',
      diff: `--- a/package.json\n+++ b/package.json\n@@ -24,8 +24,8 @@\n-    "next": "14.1.0",\n-    "axios": "1.6.8",\n+    "next": "14.2.7",\n+    "axios": "1.7.4",`
    },
    {
      id: 'REP-003-2',
      title: 'Configure SSOT Branch Protection & Lint Gate in GitHub Actions',
      targetFile: '.github/workflows/ci.yml',
      category: 'ci',
      riskReduction: '-22 Risk Points',
      status: 'PATCH_READY',
      governanceApproval: true,
      originalSnippet: '  build:\n    runs-on: ubuntu-latest\n    steps:\n      - run: npm run build',
      remediatedSnippet: '  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm ci\n      - run: npm run lint\n      - run: npm test\n      - run: npm run build',
      diff: `--- a/.github/workflows/ci.yml\n+++ b/.github/workflows/ci.yml\n@@ -10,3 +10,7 @@\n-      - run: npm run build\n+      - uses: actions/checkout@v4\n+      - run: npm ci\n+      - run: npm run lint\n+      - run: npm test\n+      - run: npm run build`
    },
    {
      id: 'REP-003-3',
      title: 'Normalize next.config.mjs Security Headers & CSP',
      targetFile: 'next.config.mjs',
      category: 'config',
      riskReduction: '-15 Risk Points',
      status: 'QUEUED',
      governanceApproval: false,
      originalSnippet: 'const nextConfig = {};\nexport default nextConfig;',
      remediatedSnippet: 'const nextConfig = {\n  poweredByHeader: false,\n  headers: async () => [\n    { source: "/(.*)", headers: [{ key: "X-Frame-Options", value: "DENY" }] }\n  ]\n};\nexport default nextConfig;',
      diff: `--- a/next.config.mjs\n+++ b/next.config.mjs\n@@ -1,2 +1,7 @@\n-const nextConfig = {};\n+const nextConfig = {\n+  poweredByHeader: false,\n+  headers: async () => [\n+    { source: "/(.*)", headers: [{ key: "X-Frame-Options", value: "DENY" }] }\n+  ]\n+};\n export default nextConfig;`
    }
  ],
  'repo-002': [
    {
      id: 'REP-002-1',
      title: 'Patch SPL Token Swap Cross-Route Owner Check',
      targetFile: 'programs/amm-router/src/lib.rs',
      category: 'build',
      riskReduction: '-26 Risk Points',
      status: 'PATCH_READY',
      governanceApproval: true,
      originalSnippet: 'pub fn route_swap(ctx: Context<RouteSwap>) -> Result<()> {\n    // unchecked account pass-through',
      remediatedSnippet: 'pub fn route_swap(ctx: Context<RouteSwap>) -> Result<()> {\n    require_keys_eq!(ctx.accounts.token_program.key(), spl_token::ID);\n    require!(ctx.accounts.authority.is_signer, ErrorCode::Unauthorized);',
      diff: `--- a/programs/amm-router/src/lib.rs\n+++ b/programs/amm-router/src/lib.rs\n@@ -45,2 +45,4 @@\n pub fn route_swap(ctx: Context<RouteSwap>) -> Result<()> {\n-    // unchecked account pass-through\n+    require_keys_eq!(ctx.accounts.token_program.key(), spl_token::ID);\n+    require!(ctx.accounts.authority.is_signer, ErrorCode::Unauthorized);`
    }
  ]
};

export const AGENT_CONTRACTS: AgentContract[] = [
  {
    id: 'oracle_core',
    name: 'Oracle Core',
    role: 'Supreme Deterministic Repository Governance Engine',
    permissions: {
      read: ['oracle/*', 'graph/*', 'registry/*', 'policies/*'],
      write: ['oracle_registry', 'vitals_report', 'oracle_summary'],
      prohibited: ['bypass_graph', 'invent_state'],
      requires: ['single_source_of_truth']
    },
    activeStatus: 'VERIFIED'
  },
  {
    id: 'hospital_agent',
    name: 'Hospital Agent',
    role: 'Full Repository Admission & Comprehensive Scan',
    permissions: {
      read: ['repo/filesystem', 'repo/workflows', 'repo/packages'],
      write: ['hospital_report.yaml'],
      prohibited: ['modify_repo_files', 'execute_patch'],
      requires: ['repo_access_token']
    },
    activeStatus: 'VERIFIED'
  },
  {
    id: 'detect_agent',
    name: 'Detect Agent',
    role: '23+ Framework & Stack Discovery Engine',
    permissions: {
      read: ['repo/configs', 'package.json', 'Cargo.toml', 'go.mod'],
      write: ['framework_profile.yaml'],
      prohibited: ['modify_dependencies'],
      requires: ['ast_analysis']
    },
    activeStatus: 'VERIFIED'
  },
  {
    id: 'surgeon_agent',
    name: 'Surgeon Agent',
    role: 'Autonomous Non-Destructive Repair Plan & Patch Generation',
    permissions: {
      read: ['oracle/*', 'graph/*', 'registry/*'],
      write: ['repair_plan.yaml', 'patch_generation.diff'],
      prohibited: ['direct_push', 'delete_repo', 'deploy_production'],
      requires: ['approval', 'verification', 'governance_pass']
    },
    activeStatus: 'VERIFIED'
  },
  {
    id: 'verify_agent',
    name: 'Verify Agent',
    role: 'Verification Layer (Build, Test, Lint, Security, Governance)',
    permissions: {
      read: ['patch_generation.diff', 'test_results'],
      write: ['verification_report.yaml'],
      prohibited: ['skip_tests', 'ignore_lint_errors'],
      requires: ['sandbox_runner']
    },
    activeStatus: 'VERIFIED'
  },
  {
    id: 'ai_guard_agent',
    name: 'AI-Guard Agent',
    role: 'LLM Security & Prompt Injection Enforcement',
    permissions: {
      read: ['prompts/*', 'agent_interactions/*', 'ai_workflow/*'],
      write: ['security_report.yaml'],
      prohibited: ['allow_unfiltered_llm_eval'],
      requires: ['adversarial_filter']
    },
    activeStatus: 'VERIFIED'
  },
  {
    id: 'firewall_agent',
    name: 'Firewall Agent',
    role: 'Governance Boundary Enforcement',
    permissions: {
      read: ['all_modifications/*'],
      write: ['firewall_report.yaml', 'blocked_events.log'],
      prohibited: ['bypass_production_boundary'],
      requires: ['immutable_rulebook']
    },
    activeStatus: 'VERIFIED'
  },
  {
    id: 'greenlock_agent',
    name: 'GreenLock Agent',
    role: 'Cryptographic Repository Lock & Immunity Sealer',
    permissions: {
      read: ['verification_report', 'governance_report', 'security_report'],
      write: ['lock_state: protected', 'cryptographic_seal'],
      prohibited: ['unlock_without_multisig'],
      requires: ['verification_pass', 'governance_pass', 'security_pass']
    },
    activeStatus: 'VERIFIED'
  }
];

export const INITIAL_KNOWLEDGE_GRAPH_NODES: KnowledgeGraphNode[] = [
  { id: 'node-repo', label: 'enterprise-cloud-portal', type: 'repo', status: 'critical', meta: { branch: 'develop', loc: 142100 } },
  { id: 'node-framework', label: 'Next.js 14.1.0', type: 'framework', status: 'warning', meta: { target: '14.2.7', compiler: 'Turbopack' } },
  { id: 'node-dep1', label: 'axios@1.6.8', type: 'dependencies', status: 'warning', meta: { version: '1.6.8', direct: true } },
  { id: 'node-dep2', label: 'next@14.1.0', type: 'dependencies', status: 'critical', meta: { version: '14.1.0', direct: true } },
  { id: 'node-vuln1', label: 'CVE-2024-34351 SSRF', type: 'vulnerabilities', status: 'critical', meta: { cvss: 9.1, vector: 'Server Actions' } },
  { id: 'node-vuln2', label: 'CVE-2024-39338 SSRF', type: 'vulnerabilities', status: 'warning', meta: { cvss: 7.5, vector: 'Path Param' } },
  { id: 'node-fix1', label: 'Patch: next@14.2.7', type: 'fixes', status: 'optimal', meta: { surgeonId: 'REP-003-1', approved: true } },
  { id: 'node-pr1', label: 'PR #108: Auto-Remediate CVEs', type: 'pull_requests', status: 'optimal', meta: { author: 'Oracle Surgeon', ci: 'Passing' } },
  { id: 'node-outcome', label: 'Zero Vulnerabilities Achieved', type: 'outcomes', status: 'optimal', meta: { testPassRate: '100%' } },
  { id: 'node-health', label: 'Health Shift: 38 -> 92', type: 'health', status: 'optimal', meta: { grade: 'Healthy' } },
  { id: 'node-forecast', label: '99.4% Stability Projected', type: 'forecasts', status: 'optimal', meta: { horizonDays: 60 } }
];

export const INITIAL_KNOWLEDGE_GRAPH_EDGES: KnowledgeGraphEdge[] = [
  { id: 'e1', source: 'node-repo', target: 'node-framework', relationship: 'DETECTS_FRAMEWORK', verified: true },
  { id: 'e2', source: 'node-framework', target: 'node-dep1', relationship: 'RESOLVES_DEPENDENCY', verified: true },
  { id: 'e3', source: 'node-framework', target: 'node-dep2', relationship: 'RESOLVES_DEPENDENCY', verified: true },
  { id: 'e4', source: 'node-dep2', target: 'node-vuln1', relationship: 'EXPOSES_VULNERABILITY', verified: true },
  { id: 'e5', source: 'node-dep1', target: 'node-vuln2', relationship: 'EXPOSES_VULNERABILITY', verified: true },
  { id: 'e6', source: 'node-vuln1', target: 'node-fix1', relationship: 'REPAIRS_WITH', verified: true },
  { id: 'e7', source: 'node-fix1', target: 'node-pr1', relationship: 'CREATES_PULL_REQUEST', verified: true },
  { id: 'e8', source: 'node-pr1', target: 'node-outcome', relationship: 'YIELDS_OUTCOME', verified: true },
  { id: 'e9', source: 'node-outcome', target: 'node-health', relationship: 'RESTORES_HEALTH', verified: true },
  { id: 'e10', source: 'node-health', target: 'node-forecast', relationship: 'PROJECTS_FORECAST', verified: true }
];
