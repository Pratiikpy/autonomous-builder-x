'use client';

import { useEffect, useState } from 'react';

interface AutonomousActivity {
  timestamp: string;
  action: string;
  status: 'success' | 'pending' | 'failed';
  buildId?: string;
}

interface DashboardData {
  isActive: boolean;
  nextScheduledBuild: string;
  last24hActivity: AutonomousActivity[];
  stats: {
    totalBuilds: number;
    successRate: number;
    avgBuildTime: string;
    onChainProofs: number;
  };
}

export default function AutonomousDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/autonomous');
      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('Failed to fetch autonomous data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTimeUntilNext = (nextBuild: string) => {
    const diff = new Date(nextBuild).getTime() - Date.now();
    if (diff < 0) return 'Starting soon...';
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-green-400">🤖 Autonomous Operations</h1>
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-800 rounded-lg"></div>
            <div className="h-64 bg-gray-800 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <a href="/" className="text-gray-400 hover:text-green-400 transition-colors">
            ← Back to Dashboard
          </a>
        </div>

        <h1 className="text-4xl font-bold mb-8 text-green-400">🤖 Autonomous Operations</h1>

        {/* Status Banner */}
        <div className={`rounded-lg p-6 mb-6 border-2 ${data.isActive ? 'bg-green-900/20 border-green-500' : 'bg-gray-900 border-gray-700'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-4 h-4 rounded-full ${data.isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`}></div>
              <div>
                <h2 className="text-2xl font-semibold">
                  {data.isActive ? 'Agent Active' : 'Agent Idle'}
                </h2>
                <p className="text-gray-400">
                  {data.isActive ? 'Monitoring for build opportunities' : 'Waiting for next scheduled run'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <label className="text-gray-400 text-sm">Next Build In</label>
              <div className="text-3xl font-bold text-green-400">
                {getTimeUntilNext(data.nextScheduledBuild)}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900 rounded-lg p-6 border border-green-500/30">
            <div className="text-gray-400 text-sm mb-2">Total Builds</div>
            <div className="text-3xl font-bold text-green-400">{data.stats.totalBuilds}</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 border border-green-500/30">
            <div className="text-gray-400 text-sm mb-2">Success Rate</div>
            <div className="text-3xl font-bold text-green-400">{data.stats.successRate}%</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 border border-green-500/30">
            <div className="text-gray-400 text-sm mb-2">Avg Build Time</div>
            <div className="text-3xl font-bold text-green-400">{data.stats.avgBuildTime}</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 border border-green-500/30">
            <div className="text-gray-400 text-sm mb-2">On-Chain Proofs</div>
            <div className="text-3xl font-bold text-green-400">{data.stats.onChainProofs}</div>
          </div>
        </div>

        {/* 24h Activity Chart */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6 border border-green-500/30">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">24h Activity Timeline</h2>
          
          <div className="space-y-4">
            {data.last24hActivity.map((activity, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-24 text-gray-400 text-sm pt-1">
                  {activity.timestamp}
                </div>
                <div className="flex-shrink-0">
                  <div className={`w-3 h-3 rounded-full mt-1.5 ${
                    activity.status === 'success' ? 'bg-green-400' :
                    activity.status === 'pending' ? 'bg-yellow-400 animate-pulse' :
                    'bg-red-400'
                  }`}></div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{activity.action}</span>
                    {activity.buildId && (
                      <a 
                        href={`/history?id=${activity.buildId}`}
                        className="text-xs text-blue-400 hover:text-blue-300"
                      >
                        View →
                      </a>
                    )}
                  </div>
                  <div className={`text-sm ${
                    activity.status === 'success' ? 'text-green-400' :
                    activity.status === 'pending' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {activity.status === 'success' ? '✓ Completed' :
                     activity.status === 'pending' ? '⏳ In Progress' :
                     '✗ Failed'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Visualization */}
        <div className="bg-gray-900 rounded-lg p-6 border border-green-500/30">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Build Frequency (Last 24h)</h2>
          
          <div className="flex items-end gap-2 h-40">
            {Array.from({ length: 24 }).map((_, hour) => {
              const buildsInHour = data.last24hActivity.filter(a => {
                const activityHour = parseInt(a.timestamp.split(':')[0]);
                return activityHour === (new Date().getHours() - (23 - hour) + 24) % 24;
              }).length;
              
              const heightPercent = buildsInHour > 0 ? Math.max(20, (buildsInHour / 3) * 100) : 10;
              
              return (
                <div key={hour} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className={`w-full rounded-t transition-all ${
                      buildsInHour > 0 ? 'bg-green-500' : 'bg-gray-700'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                    title={`${buildsInHour} builds`}
                  />
                  <div className="text-xs text-gray-500">
                    {((new Date().getHours() - (23 - hour) + 24) % 24).toString().padStart(2, '0')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* System Info */}
        <div className="mt-6 bg-gray-900/50 rounded-lg p-4 border border-gray-800">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">
              Autonomous mode enables the agent to continuously build, test, and deploy Solana programs without human intervention.
            </span>
            <span className="text-green-400 font-mono">v1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
