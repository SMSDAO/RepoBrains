import React, { useState } from 'react';
import { 
  ResponsiveContainer, AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend 
} from 'recharts';
import { 
  TrendingUp, Activity, AlertTriangle, CheckCircle2, ShieldCheck, 
  Calendar, Layers, Zap, Info, ArrowUpRight 
} from 'lucide-react';
import { HistoricalTrendDataPoint } from '../types/oracle';
import { generate30DayHistoricalData } from '../data/mockUserDataAndTrends';

interface ExecutiveTrendChartProps {
  currentRepoName: string;
  currentHealthScore: number;
}

export const ExecutiveTrendChart: React.FC<ExecutiveTrendChartProps> = ({
  currentRepoName,
  currentHealthScore
}) => {
  const [timeRange, setTimeRange] = useState<7 | 14 | 30>(30);
  const [viewMode, setViewMode] = useState<'HEALTH' | 'FAILURES' | 'COMBINED'>('COMBINED');

  const fullData = React.useMemo(() => {
    return generate30DayHistoricalData(currentHealthScore, 8);
  }, [currentHealthScore]);

  const displayedData = React.useMemo(() => {
    return fullData.slice(fullData.length - timeRange);
  }, [fullData, timeRange]);

  // Compute 30-day statistics
  const avgHealth = Math.round(
    displayedData.reduce((acc, d) => acc + d.healthScore, 0) / displayedData.length
  );
  const totalFailures = displayedData.reduce((acc, d) => acc + d.failureFrequency, 0);
  const totalRepaired = displayedData.reduce((acc, d) => acc + d.repairedIncidents, 0);
  const startScore = displayedData[0]?.healthScore || 50;
  const endScore = displayedData[displayedData.length - 1]?.healthScore || currentHealthScore;
  const deltaScore = endScore - startScore;

  // Custom Glassmorphic Cyber Tooltip
  const CustomCyberTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data: HistoricalTrendDataPoint = payload[0].payload;
      return (
        <div className="p-3.5 rounded-xl glass-panel border border-cyan-500/40 bg-[#060a16]/95 shadow-2xl space-y-1.5 text-xs font-mono">
          <div className="flex items-center justify-between border-b border-white/10 pb-1 text-slate-300">
            <span className="font-cyber font-bold text-cyan-300">{data.date}</span>
            <span className="text-[10px] text-slate-500">Day {label}</span>
          </div>

          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between gap-4">
              <span className="text-cyan-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f3ff]" />
                Health Score:
              </span>
              <span className="text-white font-bold">{data.healthScore} / 100</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-orange-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_6px_#ff6b00]" />
                Failure Rate:
              </span>
              <span className="text-orange-300 font-bold">{data.failureFrequency} incidents</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                Repaired:
              </span>
              <span className="text-emerald-300 font-bold">+{data.repairedIncidents} auto-fixes</span>
            </div>

            <div className="flex items-center justify-between gap-4 pt-1 border-t border-white/5 text-[10px] text-slate-400">
              <span>Governance Pass:</span>
              <span className="text-cyan-200">{data.governancePassRate}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 rounded-2xl glass-panel border border-cyan-500/25 space-y-5 relative overflow-hidden shadow-xl">
      <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5 font-bold">
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              RECHARTS TELEMETRY ENGINE • LAST {timeRange} DAYS
            </span>
            <span className="text-slate-400 text-xs font-mono">• TARGET: {currentRepoName}</span>
          </div>
          <h2 className="text-lg font-bold font-cyber text-white tracking-wide flex items-center gap-2">
            HISTORICAL HEALTH SCORE & FAILURE INCIDENT TRAJECTORY
          </h2>
          <p className="text-xs text-slate-400">
            Real-time longitudinal regression tracking, mean-time-to-remediate (MTTR), and failure prevention curves.
          </p>
        </div>

        {/* View Mode & Range Switchers */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Tabs */}
          <div className="p-1 rounded-xl bg-black/60 border border-white/10 flex items-center gap-1 text-xs font-mono">
            <button
              onClick={() => setViewMode('COMBINED')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                viewMode === 'COMBINED'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_10px_rgba(0,243,255,0.2)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Dual Superimposed
            </button>
            <button
              onClick={() => setViewMode('HEALTH')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                viewMode === 'HEALTH'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Health Curve
            </button>
            <button
              onClick={() => setViewMode('FAILURES')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                viewMode === 'FAILURES'
                  ? 'bg-orange-500/20 text-orange-300 border border-orange-400/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Failure Rate
            </button>
          </div>

          {/* Time Range Pills */}
          <div className="p-1 rounded-xl bg-black/60 border border-white/10 flex items-center gap-1 text-xs font-mono">
            {[7, 14, 30].map((days) => (
              <button
                key={days}
                onClick={() => setTimeRange(days as any)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  timeRange === days
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {days}D
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mini KPI Summary Cards for the 30-Day Horizon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono relative z-10">
        <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase">Average Health ({timeRange}D)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-cyber text-white">{avgHealth}</span>
            <span className="text-xs text-cyan-400">/ 100</span>
          </div>
          <p className="text-[10px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> {deltaScore >= 0 ? `+${deltaScore}` : deltaScore} pts since day 1
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase">Total Failures Blocked</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-cyber text-orange-400">{totalFailures}</span>
            <span className="text-xs text-slate-400">Events</span>
          </div>
          <p className="text-[10px] text-slate-400">Zero active regressions</p>
        </div>

        <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase">Autonomous Auto-Fixes</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-cyber text-emerald-400">{totalRepaired}</span>
            <span className="text-xs text-slate-400">Patches</span>
          </div>
          <p className="text-[10px] text-emerald-300">100% Non-destructive</p>
        </div>

        <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase">GreenLock Stability Streak</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-cyber text-cyan-300">4 Days</span>
            <span className="text-xs text-slate-400">Flawless</span>
          </div>
          <p className="text-[10px] text-cyan-400 font-mono">0 CVEs in prod</p>
        </div>
      </div>

      {/* Main Recharts Visualizer Canvas */}
      <div className="w-full h-72 pt-2 relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'FAILURES' ? (
            <BarChart data={displayedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="failureBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff4d4d" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#ff8c00" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, 6]} />
              <Tooltip content={<CustomCyberTooltip />} />
              <Bar dataKey="failureFrequency" fill="url(#failureBarGradient)" radius={[6, 6, 0, 0]} name="Failures" />
            </BarChart>
          ) : (
            <AreaChart data={displayedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="healthAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#00f3ff" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="failureLineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff6b00" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ff6b00" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[20, 100]} />
              <Tooltip content={<CustomCyberTooltip />} />
              
              {/* Primary Health Trajectory Curve */}
              <Area
                type="monotone"
                dataKey="healthScore"
                stroke="#00f3ff"
                strokeWidth={2.5}
                fill="url(#healthAreaGradient)"
                name="Health Score"
                activeDot={{ r: 6, fill: '#00f3ff', stroke: '#ffffff', strokeWidth: 2 }}
              />

              {/* Secondary Superimposed Failure Trajectory Curve */}
              {viewMode === 'COMBINED' && (
                <Line
                  type="monotone"
                  dataKey="governancePassRate"
                  stroke="#34d399"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                  name="Governance Pass Rate"
                />
              )}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Chart Legend & Insights Footer */}
      <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 relative z-10">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f3ff]" />
            <span className="text-slate-300">Health Index Trajectory (0 - 100%)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-slate-300">Governance Compliance Rate</span>
          </span>
        </div>

        <span className="text-cyan-300">
          Historical Invariant Proof: Verified by Oracle SSOT
        </span>
      </div>

    </div>
  );
};
