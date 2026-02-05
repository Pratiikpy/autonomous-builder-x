'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/live');
  }, [router]);

  return null;
}

function HomeOld() {
  const [prompt, setPrompt] = useState('');
  const [building, setBuilding] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const buildAgent = async () => {
    if (!prompt.trim()) return;

    setBuilding(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Build failed');
      }

      setResult(data.agent);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBuilding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Autonomous Builder X
          </h1>
          <p className="text-2xl text-gray-300 mb-2">
            The Meta-Agent Factory
          </p>
          <p className="text-lg text-gray-400">
            Describe an agent → Get deployed Solana code + frontend
          </p>
        </div>

        {/* Main Interface */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-purple-500/30">
            <label className="block text-lg font-semibold mb-3">
              What agent do you want to build?
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Example: Build a Solana agent that manages a DAO treasury with automated yield farming and rebalancing..."
              className="w-full h-40 bg-black/30 border border-purple-500/50 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              disabled={building}
            />

            <button
              onClick={buildAgent}
              disabled={building || !prompt.trim()}
              className="mt-6 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
            >
              {building ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Building Agent...
                </span>
              ) : (
                '🚀 Build Agent'
              )}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-8 bg-red-500/20 border border-red-500 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-2">❌ Build Failed</h3>
              <p className="text-red-200">{error}</p>
            </div>
          )}

          {/* Success Display */}
          {result && (
            <div className="mt-8 bg-green-500/20 border border-green-500 rounded-xl p-8">
              <h3 className="text-3xl font-bold mb-6">✅ Agent Built Successfully!</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 uppercase tracking-wide">Agent Name</label>
                  <p className="text-xl font-mono bg-black/30 rounded p-3 mt-1">{result.name}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-400 uppercase tracking-wide">Program ID (Devnet)</label>
                  <p className="text-sm font-mono bg-black/30 rounded p-3 mt-1 break-all">{result.programId}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-400 uppercase tracking-wide">Frontend URL</label>
                  <a 
                    href={result.frontendUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-blue-400 hover:text-blue-300 underline bg-black/30 rounded p-3 mt-1"
                  >
                    {result.frontendUrl}
                  </a>
                </div>

                <div>
                  <label className="text-sm text-gray-400 uppercase tracking-wide">Repository Path</label>
                  <p className="text-sm font-mono bg-black/30 rounded p-3 mt-1">{result.repoPath}</p>
                </div>

                <details className="mt-4">
                  <summary className="cursor-pointer text-lg font-semibold hover:text-purple-400">
                    📝 Documentation
                  </summary>
                  <div className="mt-4 bg-black/30 rounded-xl p-6 max-h-96 overflow-y-auto">
                    <pre className="text-sm whitespace-pre-wrap">{result.documentation}</pre>
                  </div>
                </details>

                <details className="mt-4">
                  <summary className="cursor-pointer text-lg font-semibold hover:text-purple-400">
                    🔨 Build Log
                  </summary>
                  <div className="mt-4 bg-black/30 rounded-xl p-6 max-h-96 overflow-y-auto">
                    <pre className="text-sm font-mono text-green-400">
                      {result.buildLog.join('\n')}
                    </pre>
                  </div>
                </details>
              </div>
            </div>
          )}

          {/* How It Works */}
          <div className="mt-16 grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-purple-500/20">
              <h3 className="text-xl font-bold mb-4">🧠 How It Works</h3>
              <ol className="space-y-3 text-gray-300">
                <li><strong>1.</strong> Analyze your prompt with Claude</li>
                <li><strong>2.</strong> Generate Anchor program (Rust)</li>
                <li><strong>3.</strong> Build & deploy to Solana devnet</li>
                <li><strong>4.</strong> Generate TypeScript SDK</li>
                <li><strong>5.</strong> Create Next.js frontend</li>
                <li><strong>6.</strong> Document everything</li>
              </ol>
            </div>

            <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-purple-500/20">
              <h3 className="text-xl font-bold mb-4">🏆 Why This Wins</h3>
              <ul className="space-y-3 text-gray-300">
                <li>✨ <strong>Most Agentic:</strong> An agent that builds agents</li>
                <li>⚡ <strong>Full Autonomy:</strong> Prompt → deployed code</li>
                <li>🔗 <strong>Complete Chain:</strong> Code → deploy → test → docs</li>
                <li>🎯 <strong>Real Solana:</strong> Actual Anchor programs on devnet</li>
                <li>📚 <strong>Self-documenting:</strong> Generates its own docs</li>
              </ul>
            </div>
          </div>

          {/* Example Prompts */}
          <div className="mt-12 bg-white/5 backdrop-blur rounded-xl p-6 border border-purple-500/20">
            <h3 className="text-xl font-bold mb-4">💡 Example Prompts</h3>
            <div className="space-y-2">
              {[
                'Build a Solana agent that manages a DAO treasury with automated yield farming',
                'Create an agent that monitors wallet activity and sends alerts for large transactions',
                'Build an NFT minting agent with rarity traits and royalty management',
                'Create a DeFi arbitrage bot that finds opportunities across Solana DEXes',
              ].map((example, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(example)}
                  className="block w-full text-left text-sm bg-black/20 hover:bg-black/40 rounded p-3 transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-400 text-sm">
          <p>Built for <strong>Solana Agent Hackathon</strong> • Targeting <strong>Most Agentic Prize</strong></p>
          <p className="mt-2">An agent that builds agents is the ultimate meta.</p>
        </div>
      </div>
    </div>
  );
}
