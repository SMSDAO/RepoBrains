import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { 
  Database, ArrowRight, ShieldCheck, AlertTriangle, CheckCircle2, 
  ExternalLink, Layers, GitPullRequest, Activity, Cpu, Sparkles,
  Play, Pause, SkipForward, SkipBack, RefreshCw, Lock, Eye,
  Check, Info, ChevronRight, Share2, Compass, Zap, ZoomIn, ZoomOut, Maximize2, X
} from 'lucide-react';
import { OracleRegistry } from '../../types/oracle';

interface KnowledgeGraphViewProps {
  currentRepo: OracleRegistry;
}

export interface D3Node extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  type: 'repo' | 'framework' | 'dependency' | 'vulnerability' | 'fix' | 'pr' | 'outcome';
  severity?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  cvss?: number;
  package?: string;
  version?: string;
  remediationPlan?: {
    cve: string;
    title: string;
    affectedModule: string;
    blastRadius: string;
    patchDiff: string;
    recommendedVersion: string;
    autoRemediable: boolean;
  };
  cluster?: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface D3Link extends d3.SimulationLinkDatum<D3Node> {
  source: string | D3Node;
  target: string | D3Node;
  relationship: string;
}

const GRAPH_NODES: D3Node[] = [
  // Root Repository Node
  { id: 'repo-root', label: 'SolanaRemix/CyberAi', type: 'repo', x: 400, y: 300 },
  
  // Framework Nodes
  { id: 'fw-anchor', label: 'Anchor v0.29.0', type: 'framework', cluster: 'solana-stack' },
  { id: 'fw-nextjs', label: 'Next.js v14.2.0', type: 'framework', cluster: 'web-stack' },

  // Dependency Nodes
  { id: 'dep-spl-token', label: 'spl-token-swap v4.0.0', type: 'dependency', package: 'spl-token-swap', version: '4.0.0', cluster: 'solana-stack' },
  { id: 'dep-axios', label: 'axios v1.6.8', type: 'dependency', package: 'axios', version: '1.6.8', cluster: 'web-stack' },
  { id: 'dep-solana-web3', label: '@solana/web3.js v1.91.0', type: 'dependency', package: '@solana/web3.js', version: '1.91.0', cluster: 'solana-stack' },
  { id: 'dep-tokio', label: 'tokio-util v0.7.11', type: 'dependency', package: 'tokio-util', version: '0.7.11', cluster: 'rust-stack' },

  // Red-Highlighted Vulnerability Clusters
  { 
    id: 'vuln-cve-2024-34351', 
    label: 'CVE-2024-34351 (SSRF)', 
    type: 'vulnerability', 
    severity: 'CRITICAL', 
    cvss: 9.1,
    cluster: 'red-vuln-cluster',
    remediationPlan: {
      cve: 'CVE-2024-34351',
      title: 'Next.js Server Actions Server-Side Request Forgery (SSRF)',
      affectedModule: 'src/app/actions/solanaBridge.ts',
      blastRadius: 'Multi-Cluster RPC Gateway',
      patchDiff: `diff --git a/src/app/actions/solanaBridge.ts b/src/app/actions/solanaBridge.ts\nindex a1b2..c3d4 100644\n--- a/src/app/actions/solanaBridge.ts\n+++ b/src/app/actions/solanaBridge.ts\n@@ -12,3 +12,5 @@ export async function bridgeTokens(url: string) {\n-  return fetch(url);\n+  const parsedUrl = new URL(url);\n+  if (!['solana.com', 'rpc.mainnet.solana.com'].includes(parsedUrl.hostname)) {\n+    throw new Error("Invalid destination host");\n+  }\n+  return fetch(parsedUrl.href);`,
      recommendedVersion: '14.2.7',
      autoRemediable: true
    }
  },
  { 
    id: 'vuln-cve-2024-8199', 
    label: 'CVE-2024-8199 (Signer Bypass)', 
    type: 'vulnerability', 
    severity: 'CRITICAL', 
    cvss: 8.8,
    cluster: 'red-vuln-cluster',
    remediationPlan: {
      cve: 'CVE-2024-8199',
      title: 'Anchor Missing Account Authority Signer Check',
      affectedModule: 'programs/cyber-ai/src/lib.rs',
      blastRadius: 'Anchor PDA Vault Program',
      patchDiff: `diff --git a/programs/cyber-ai/src/lib.rs b/programs/cyber-ai/src/lib.rs\nindex 8e9f..1a2b 100644\n--- a/programs/cyber-ai/src/lib.rs\n+++ b/programs/cyber-ai/src/lib.rs\n@@ -45,2 +45,4 @@ pub fn execute_swap(ctx: Context<ExecuteSwap>) -> Result<()> {\n+    require_keys_eq!(ctx.accounts.authority.key(), ctx.accounts.vault.authority);\n+    require!(ctx.accounts.authority.is_signer, ErrorCode::UnauthorizedSigner);\n     Ok(())`,
      recommendedVersion: 'Anchor 0.30.0',
      autoRemediable: true
    }
  },
  { 
    id: 'vuln-cve-2024-4112', 
    label: 'CVE-2024-4112 (Memory Leak)', 
    type: 'vulnerability', 
    severity: 'HIGH', 
    cvss: 7.5,
    cluster: 'red-vuln-cluster',
    remediationPlan: {
      cve: 'CVE-2024-4112',
      title: 'Tokio Async Channel Buffer Allocation Latency',
      affectedModule: 'src/services/solanaRpc.ts',
      blastRadius: 'WebSocket Connection Pool',
      patchDiff: `diff --git a/src/services/solanaRpc.ts b/src/services/solanaRpc.ts\nindex 3b4c..9d0e 100644\n--- a/src/services/solanaRpc.ts\n+++ b/src/services/solanaRpc.ts\n@@ -20,2 +20,4 @@ export class SolanaRpcPool {\n-  this.channel = new Channel({ capacity: 100000 });\n+  this.channel = new BoundedChannel({ capacity: 1024, dropPolicy: DropPolicy.Oldest });`,
      recommendedVersion: 'tokio-util 0.7.12',
      autoRemediable: true
    }
  },

  // Surgeon Fix Nodes
  { id: 'fix-ast-patch-1', label: 'Patch #108: SSRF Guard', type: 'fix' },
  { id: 'fix-ast-patch-2', label: 'Patch #109: Anchor Signer', type: 'fix' },
  { id: 'fix-ast-patch-3', label: 'Patch #110: Bounded Queue', type: 'fix' },

  // Outcomes & PR Nodes
  { id: 'pr-github-108', label: 'PR #108 (CVE Auto-Fix)', type: 'pr' },
  { id: 'outcome-cert', label: '100% GreenLock Certified', type: 'outcome' }
];

const GRAPH_LINKS: D3Link[] = [
  { source: 'repo-root', target: 'fw-anchor', relationship: 'USES_FRAMEWORK' },
  { source: 'repo-root', target: 'fw-nextjs', relationship: 'USES_FRAMEWORK' },
  { source: 'fw-anchor', target: 'dep-spl-token', relationship: 'DEPENDS_ON' },
  { source: 'fw-anchor', target: 'dep-solana-web3', relationship: 'DEPENDS_ON' },
  { source: 'fw-nextjs', target: 'dep-axios', relationship: 'DEPENDS_ON' },
  { source: 'repo-root', target: 'dep-tokio', relationship: 'DEPENDS_ON' },

  // Dependency to Vulnerabilities
  { source: 'dep-axios', target: 'vuln-cve-2024-34351', relationship: 'EXPOSES' },
  { source: 'dep-spl-token', target: 'vuln-cve-2024-8199', relationship: 'EXPOSES' },
  { source: 'dep-tokio', target: 'vuln-cve-2024-4112', relationship: 'EXPOSES' },

  // Vulnerability to Fixes
  { source: 'vuln-cve-2024-34351', target: 'fix-ast-patch-1', relationship: 'REMEDIATED_BY' },
  { source: 'vuln-cve-2024-8199', target: 'fix-ast-patch-2', relationship: 'REMEDIATED_BY' },
  { source: 'vuln-cve-2024-4112', target: 'fix-ast-patch-3', relationship: 'REMEDIATED_BY' },

  // Fixes to PR & Outcome
  { source: 'fix-ast-patch-1', target: 'pr-github-108', relationship: 'DISPATCHES_PR' },
  { source: 'fix-ast-patch-2', target: 'pr-github-108', relationship: 'DISPATCHES_PR' },
  { source: 'fix-ast-patch-3', target: 'pr-github-108', relationship: 'DISPATCHES_PR' },
  { source: 'pr-github-108', target: 'outcome-cert', relationship: 'YIELDS' }
];

export const KnowledgeGraphView: React.FC<KnowledgeGraphViewProps> = ({ currentRepo }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedNode, setSelectedNode] = useState<D3Node | null>(GRAPH_NODES[0]);
  const [remediationModalNode, setRemediationModalNode] = useState<D3Node | null>(null);
  const [appliedRemediations, setAppliedRemediations] = useState<string[]>([]);
  const [isAppliedSuccess, setIsAppliedSuccess] = useState(false);

  // Force simulation initializer
  useEffect(() => {
    if (!svgRef.current) return;

    const width = 850;
    const height = 550;

    // Clear previous elements
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('cursor', 'grab');

    // Container group for Zoom/Pan
    const container = svg.append('g');

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.4, 2.5])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
      });

    svg.call(zoom as any);

    // Deep clones of nodes and links for simulation
    const nodesData: D3Node[] = JSON.parse(JSON.stringify(GRAPH_NODES));
    const linksData: D3Link[] = JSON.parse(JSON.stringify(GRAPH_LINKS));

    // Force simulation setup
    const simulation = d3.forceSimulation<D3Node>(nodesData)
      .force('link', d3.forceLink<D3Node, D3Link>(linksData).id(d => d.id).distance(110))
      .force('charge', d3.forceManyBody().strength(-280))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(45));

    // Glow Filters
    const defs = svg.append('defs');

    // Red Vulnerability Glow Filter
    const redGlow = defs.append('filter').attr('id', 'red-glow').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
    redGlow.append('feGaussianBlur').attr('stdDeviation', '6').attr('result', 'coloredBlur');
    const redMerge = redGlow.append('feMerge');
    redMerge.append('feMergeNode').attr('in', 'coloredBlur');
    redMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Cyan Glow Filter
    const cyanGlow = defs.append('filter').attr('id', 'cyan-glow').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
    cyanGlow.append('feGaussianBlur').attr('stdDeviation', '6').attr('result', 'coloredBlur');
    const cyanMerge = cyanGlow.append('feMerge');
    cyanMerge.append('feMergeNode').attr('in', 'coloredBlur');
    cyanMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Draw Links
    const link = container.append('g')
      .selectAll('line')
      .data(linksData)
      .enter()
      .append('line')
      .attr('stroke', (d: any) => {
        if (d.target.type === 'vulnerability' || d.source.type === 'vulnerability') return '#ef4444';
        return '#00f3ff';
      })
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', (d: any) => (d.target.type === 'vulnerability' ? 2 : 1.5))
      .attr('stroke-dasharray', (d: any) => (d.target.type === 'vulnerability' ? '4 2' : 'none'));

    // Link Labels
    const linkText = container.append('g')
      .selectAll('text')
      .data(linksData)
      .enter()
      .append('text')
      .attr('font-size', '8px')
      .attr('font-family', 'monospace')
      .attr('fill', '#94a3b8')
      .attr('text-anchor', 'middle')
      .text(d => d.relationship);

    // Red Vulnerability Cluster Background Overlay
    const vulnCluster = container.append('g')
      .append('circle')
      .attr('r', 110)
      .attr('fill', '#ef4444')
      .attr('fill-opacity', 0.08)
      .attr('stroke', '#ef4444')
      .attr('stroke-opacity', 0.3)
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '6 3')
      .attr('filter', 'url(#red-glow)');

    // Draw Nodes
    const node = container.append('g')
      .selectAll('g')
      .data(nodesData)
      .enter()
      .append('g')
      .style('cursor', 'pointer')
      .call(d3.drag<SVGGElement, D3Node>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      );

    // Node Circles
    node.append('circle')
      .attr('r', (d) => {
        if (d.type === 'repo') return 26;
        if (d.type === 'vulnerability') return 22;
        return 18;
      })
      .attr('fill', (d) => {
        if (d.type === 'repo') return '#00f3ff';
        if (d.type === 'vulnerability') return '#ef4444';
        if (d.type === 'fix') return '#10b981';
        if (d.type === 'framework') return '#6366f1';
        if (d.type === 'dependency') return '#3b82f6';
        if (d.type === 'pr') return '#f59e0b';
        return '#14b8a6';
      })
      .attr('fill-opacity', 0.85)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', (d) => (d.type === 'vulnerability' ? 2.5 : 1.5))
      .attr('filter', (d) => {
        if (d.type === 'vulnerability') return 'url(#red-glow)';
        if (d.type === 'repo') return 'url(#cyan-glow)';
        return null;
      });

    // Node Labels
    node.append('text')
      .attr('dy', 34)
      .attr('font-size', '10px')
      .attr('font-family', 'monospace')
      .attr('font-weight', 'bold')
      .attr('fill', '#ffffff')
      .attr('text-anchor', 'middle')
      .text(d => d.label);

    // Node Click Handlers
    node.on('click', (event, d) => {
      setSelectedNode(d);
      if (d.type === 'vulnerability' || d.type === 'fix' || d.remediationPlan) {
        setRemediationModalNode(d);
      }
    });

    // Tick update loop
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      linkText
        .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
        .attr('y', (d: any) => (d.source.y + d.target.y) / 2);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);

      // Update vulnerability cluster centroid position
      const vulns = nodesData.filter(n => n.type === 'vulnerability');
      if (vulns.length > 0) {
        const avgX = d3.mean(vulns, v => v.x || 0) || width / 2;
        const avgY = d3.mean(vulns, v => v.y || 0) || height / 2;
        vulnCluster.attr('cx', avgX).attr('cy', avgY);
      }
    });

    return () => {
      simulation.stop();
    };
  }, []);

  const handleApplyRemediation = (node: D3Node) => {
    if (!appliedRemediations.includes(node.id)) {
      setAppliedRemediations(prev => [...prev, node.id]);
    }
    setIsAppliedSuccess(true);
    setTimeout(() => {
      setIsAppliedSuccess(false);
      setRemediationModalNode(null);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
              D3.JS FORCE-DIRECTED KNOWLEDGE GRAPH
            </span>
            <span className="text-slate-400 text-xs font-mono">• RED VULNERABILITY CLUSTERS</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white font-cyber tracking-tight">
            DEPENDENCY & VULNERABILITY KNOWLEDGE GRAPH
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Interactive graph topology visualizing package dependencies, <strong className="text-red-400">red-highlighted vulnerability clusters</strong>, and AST remediation plans. Click any vulnerability node to view and apply fixes.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Root Repo
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-300 border border-red-500/40 font-bold flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping" /> Vulnerability Cluster
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Surgeon Patch
          </span>
        </div>
      </div>

      {/* Main Interactive D3 Canvas */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 relative overflow-hidden space-y-4">
        
        {/* Graph Header Controls */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-300 font-bold">PHYSICS SIMULATION: ACTIVE</span>
            <span className="text-slate-500">| Drag nodes to reposition • Scroll to zoom</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Cluster Status:</span>
            <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40 font-bold">
              3 Active CVE Vulnerabilities Isolated
            </span>
          </div>
        </div>

        {/* SVG D3 Force Graph Element */}
        <div className="w-full bg-[#02050b] rounded-xl border border-cyan-500/20 relative min-h-[550px] flex items-center justify-center">
          <svg ref={svgRef} className="w-full h-[550px]" />

          {/* Graph Hint Overlay */}
          <div className="absolute bottom-4 left-4 p-3 rounded-xl bg-black/80 border border-white/10 backdrop-blur text-[11px] font-mono text-slate-300 space-y-1 pointer-events-none">
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
              <Info className="w-3.5 h-3.5" /> Interactive Graph Controls
            </div>
            <p>• Click any <span className="text-red-400 font-bold">Red Vulnerability Node</span> to open remediation plan.</p>
            <p>• Click and drag any node to test structural graph forces.</p>
          </div>
        </div>

      </div>

      {/* Selected Node Details & Active Remediation Status */}
      {selectedNode && (
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 font-mono">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="text-sm font-cyber font-bold text-white">SELECTED NODE INSPECTOR</h3>
                <p className="text-xs text-cyan-300 font-bold">{selectedNode.label}</p>
              </div>
            </div>

            <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${
              selectedNode.type === 'vulnerability' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
              selectedNode.type === 'fix' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
              'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
            }`}>
              Node Type: {selectedNode.type}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3 rounded-xl bg-black/50 border border-white/5 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase">Node Identifier</span>
              <p className="text-white font-bold">{selectedNode.id}</p>
            </div>

            <div className="p-3 rounded-xl bg-black/50 border border-white/5 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase">Severity Rating</span>
              <p className={`font-bold ${
                selectedNode.severity === 'CRITICAL' ? 'text-red-400' : 'text-cyan-300'
              }`}>
                {selectedNode.severity || 'STANDARD (CLEAN)'} {selectedNode.cvss ? `(${selectedNode.cvss} CVSS)` : ''}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-black/50 border border-white/5 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase">Remediation Status</span>
              <p className={`font-bold ${
                appliedRemediations.includes(selectedNode.id) ? 'text-emerald-400' : 'text-yellow-300'
              }`}>
                {appliedRemediations.includes(selectedNode.id) ? 'REMEDIATED (100% GREENLOCK)' : 'ACTION REQUIRED'}
              </p>
            </div>
          </div>

          {(selectedNode.type === 'vulnerability' || selectedNode.remediationPlan) && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setRemediationModalNode(selectedNode)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-400 hover:to-amber-400 text-black font-cyber font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all"
              >
                <Zap className="w-4 h-4 fill-black" />
                <span>Inspect Remediation Plan for {selectedNode.label}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Remediation Plan Modal */}
      {remediationModalNode && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl glass-panel border-2 border-red-500/50 bg-[#070e1c] rounded-3xl p-6 shadow-[0_0_80px_rgba(239,68,68,0.3)] space-y-5 relative overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400">
                  <AlertTriangle className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/20 text-red-300 border border-red-500/40">
                    CVSS {remediationModalNode.cvss || '9.1'} CRITICAL ADVISORY
                  </span>
                  <h2 className="text-xl font-cyber font-bold text-white mt-0.5">
                    {remediationModalNode.remediationPlan?.title || `Remediation Plan for ${remediationModalNode.label}`}
                  </h2>
                </div>
              </div>

              <button
                onClick={() => setRemediationModalNode(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Advisory Information */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase">Affected Code Module</span>
                <p className="text-cyan-300 font-bold truncate">
                  {remediationModalNode.remediationPlan?.affectedModule || 'src/app/actions/solanaBridge.ts'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase">Recommended Version</span>
                <p className="text-emerald-400 font-bold">
                  {remediationModalNode.remediationPlan?.recommendedVersion || '14.2.7'}
                </p>
              </div>
            </div>

            {/* Patch Diff Code Preview */}
            <div className="space-y-1 font-mono text-xs">
              <span className="text-slate-300 font-bold block">AST Surgeon Patch Preview:</span>
              <pre className="p-4 rounded-xl bg-black border border-cyan-500/30 text-cyan-200 text-[11px] overflow-x-auto leading-relaxed max-h-48 whitespace-pre-wrap">
                {remediationModalNode.remediationPlan?.patchDiff || `// AST Surgery Patch Applied\n+ enforce_invariant_authority_check();`}
              </pre>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => setRemediationModalNode(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono font-bold"
              >
                Close Inspector
              </button>

              <button
                onClick={() => handleApplyRemediation(remediationModalNode)}
                disabled={isAppliedSuccess}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-cyber font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(52,211,153,0.4)] transition-all"
              >
                {isAppliedSuccess ? <CheckCircle2 className="w-4 h-4 text-black" /> : <Zap className="w-4 h-4 fill-black" />}
                <span>{isAppliedSuccess ? 'Remediation Patch Applied!' : 'Apply Remediation & Dispatch PR'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
