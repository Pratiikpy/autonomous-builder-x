'use client';

import { useEffect, useState } from 'react';

interface WalletData {
  address: string;
  balance: number;
  programId: string;
  recentTxs: Array<{
    signature: string;
    timestamp: string;
    type: string;
  }>;
}

export default function AgentWallet() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const response = await fetch('/api/wallet');
      if (!response.ok) throw new Error('Failed to fetch wallet data');
      const data = await response.json();
      setWallet(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-green-400">⚡ Agent Wallet</h1>
          <div className="animate-pulse">
            <div className="h-32 bg-gray-800 rounded-lg mb-4"></div>
            <div className="h-64 bg-gray-800 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !wallet) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-green-400">⚡ Agent Wallet</h1>
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-6">
            <p className="text-red-400">Error: {error || 'Failed to load wallet'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <a href="/" className="text-gray-400 hover:text-green-400 transition-colors">
            ← Back to Dashboard
          </a>
        </div>

        <h1 className="text-4xl font-bold mb-8 text-green-400">⚡ Agent Wallet</h1>

        {/* Wallet Overview */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6 border border-green-500/30">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">Wallet Overview</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm">Address</label>
              <div className="flex items-center gap-2 mt-1">
                <code className="text-green-400 font-mono bg-black px-3 py-2 rounded flex-1 text-sm">
                  {wallet.address}
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(wallet.address)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm">Balance</label>
                <div className="text-2xl font-bold text-green-400 mt-1">
                  {wallet.balance.toFixed(6)} SOL
                </div>
                <div className="text-gray-500 text-sm">≈ ${(wallet.balance * 100).toFixed(2)} USD</div>
              </div>

              <div>
                <label className="text-gray-400 text-sm">Network</label>
                <div className="text-xl font-semibold mt-1">Devnet</div>
                <div className="text-gray-500 text-sm">Solana Test Network</div>
              </div>
            </div>
          </div>
        </div>

        {/* Controlled Program */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6 border border-green-500/30">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">Deployed Program</h2>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-gray-400 text-sm">LiveForge Logger</label>
              <code className="block text-green-400 font-mono bg-black px-3 py-2 rounded mt-1 text-sm">
                {wallet.programId}
              </code>
            </div>
            <a
              href={`https://explorer.solana.com/address/${wallet.programId}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded transition-colors"
            >
              View on Explorer ↗
            </a>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-gray-900 rounded-lg p-6 border border-green-500/30">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">Recent Transactions</h2>
          
          <div className="space-y-3">
            {wallet.recentTxs.length === 0 ? (
              <p className="text-gray-500">No recent transactions</p>
            ) : (
              wallet.recentTxs.map((tx, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-black p-4 rounded border border-gray-800 hover:border-green-500/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-green-400 font-semibold">{tx.type}</span>
                      <span className="text-gray-500 text-sm">{tx.timestamp}</span>
                    </div>
                    <code className="text-gray-400 text-xs font-mono mt-1 block">
                      {tx.signature.substring(0, 32)}...{tx.signature.substring(tx.signature.length - 8)}
                    </code>
                  </div>
                  <a
                    href={`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm transition-colors"
                  >
                    View ↗
                  </a>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex gap-4">
          <a
            href={`https://explorer.solana.com/address/${wallet.address}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded font-semibold transition-colors"
          >
            View Full History on Explorer ↗
          </a>
          <button
            onClick={fetchWalletData}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded font-semibold transition-colors"
          >
            🔄 Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
