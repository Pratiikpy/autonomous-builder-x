'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

type BuildEvent = 
  | { type: 'status'; message: string }
  | { type: 'thinking'; message: string }
  | { type: 'code'; file: string; content: string }
  | { type: 'terminal'; output: string }
  | { type: 'progress'; step: number; total: number; description: string }
  | { type: 'chain_log'; txHash: string; stepNumber: number }
  | { type: 'complete'; result: any }
  | { type: 'error'; error: string };

const PROGRAM_ADDRESS = 'GUyhK2AvkPcVwt4Q1ABmMsQTGvZphiAMaAnDWLSyZoSK';

const EXAMPLE_PROMPTS = [
  "Build a Solana NFT minting program",
  "Build a DAO treasury manager",
  "Build a DeFi token swap program",
  "Build a Solana payment splitter",
  "Build an escrow program for freelancers",
  "Build a staking rewards distributor"
];

export default function LiveForgePage() {
  const [prompt, setPrompt] = useState('');
  const [building, setBuilding] = useState(false);
  const [events, setEvents] = useState<BuildEvent[]>([]);
  const [progress, setProgress] = useState({ step: 0, total: 8, description: '' });
  const [currentThinking, setCurrentThinking] = useState('');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [chainLogs, setChainLogs] = useState<Array<{step: number; tx: string}>>([]);
  const [codePreview, setCodePreview] = useState<{file: string; content: string} | null>(null);
  const [result, setResult] = useState<any>(null);
  
  const terminalRef = useRef<HTMLDivElement>(null);

  const startBuild = async () => {
    if (!prompt.trim()) return;

    setBuilding(true);
    setEvents([]);
    setTerminalOutput([]);
    setChainLogs([]);
    setCodePreview(null);
    setResult(null);
    setProgress({ step: 0, total: 8, description: 'Starting...' });

    try {
      const response = await fetch('/api/live-build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(l => l.trim());

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const event: BuildEvent = JSON.parse(line.substring(6));
                setEvents(prev => [...prev, event]);

                // Update specific UI elements based on event type
                if (event.type === 'progress') {
                  setProgress({
                    step: event.step,
                    total: event.total,
                    description: event.description
                  });
                } else if (event.type === 'thinking') {
                  setCurrentThinking(event.message);
                } else if (event.type === 'terminal') {
                  setTerminalOutput(prev => [...prev, event.output]);
                } else if (event.type === 'code') {
                  setCodePreview({ file: event.file, content: event.content });
                } else if (event.type === 'chain_log') {
                  setChainLogs(prev => [...prev, { step: event.stepNumber, tx: event.txHash }]);
                } else if (event.type === 'complete') {
                  setResult(event.result);
                  setBuilding(false);
                } else if (event.type === 'error') {
                  setBuilding(false);
                }
              } catch (e) {
                console.error('Failed to parse event:', e);
              }
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Build error:', error);
      setBuilding(false);
    }
  };

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      {/* Header with Navigation */}
      <div className="border-b border-green-500/30 bg-black/50 backdrop-blur px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-green-400">
            ⚡ LiveForge <span className="text-green-600 text-sm ml-2">// Watch AI Build, Live</span>
          </h1>
          <nav className="flex gap-4 text-sm">
            <Link 
              href="/"
              className="text-green-600 hover:text-green-400 transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/live"
              className="text-green-400 border-b border-green-400"
            >
              Live Build
            </Link>
            <Link 
              href="/history"
              className="text-green-600 hover:text-green-400 transition-colors"
            >
              Build History
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Input Section */}
        {!building && !result && (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Example Prompts Library */}
            <div className="bg-green-950/20 border border-green-500/30 rounded-lg p-6">
              <h3 className="text-green-400 mb-3 flex items-center gap-2">
                <span>💡</span>
                <span>{'>'} EXAMPLE_PROMPTS:</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_PROMPTS.map((example, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(example)}
                    className="bg-gradient-to-r from-purple-900/40 to-green-900/40 hover:from-purple-800/60 hover:to-green-800/60 border border-purple-500/30 hover:border-purple-400/50 text-green-400 hover:text-green-300 px-4 py-2 rounded-full text-sm transition-all backdrop-blur"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-green-950/20 border border-green-500/30 rounded-lg p-6">
              <label className="block text-sm mb-2 text-green-400">
                {'>'} DESCRIBE_AGENT_TO_BUILD:
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Build a Solana DAO treasury manager with automated yield farming..."
                className="w-full h-32 bg-black border border-green-500/50 rounded p-4 text-green-300 placeholder-green-700 focus:outline-none focus:border-green-400 resize-none"
                disabled={building}
              />
              <button
                onClick={startBuild}
                disabled={building || !prompt.trim()}
                className="mt-4 w-full bg-green-600 hover:bg-green-500 disabled:bg-green-900 disabled:cursor-not-allowed text-black font-bold py-3 px-6 rounded transition-colors"
              >
                {'>'} START_BUILD()
              </button>
            </div>

            <div className="bg-green-950/20 border border-green-500/30 rounded-lg p-6">
              <h3 className="text-green-400 mb-3">{'>'} WHAT_HAPPENS:</h3>
              <ul className="space-y-2 text-sm text-green-500">
                <li>✓ AI analyzes your prompt in real-time</li>
                <li>✓ Generates Anchor program (Rust)</li>
                <li>✓ Compiles and deploys to Solana devnet</li>
                <li>✓ Creates TypeScript SDK</li>
                <li>✓ Generates Next.js frontend</li>
                <li>✓ Every step logged on-chain with SHA256</li>
                <li>✓ Watch the entire process unfold live</li>
              </ul>
            </div>
          </div>
        )}

        {/* Live Build View */}
        {building && (
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="bg-green-950/20 border border-green-500/30 rounded-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-green-400">
                  {'>'} PROGRESS: {progress.step}/{progress.total}
                </span>
                <span className="text-green-600 text-sm">
                  {progress.description}
                </span>
              </div>
              <div className="w-full bg-black rounded-full h-3 overflow-hidden border border-green-500/30">
                <div
                  className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-500 flex items-center justify-end pr-2"
                  style={{ width: `${(progress.step / progress.total) * 100}%` }}
                >
                  <span className="text-black text-xs font-bold">
                    {Math.round((progress.step / progress.total) * 100)}%
                  </span>
                </div>
              </div>
            </div>

            {/* AI Thinking Bubble */}
            {currentThinking && (
              <div className="bg-green-950/20 border border-green-500/30 rounded-lg p-4 animate-pulse">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🤖</span>
                  <div>
                    <div className="text-green-500 text-xs mb-1">AI_REASONING:</div>
                    <div className="text-green-300">{currentThinking}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {/* Terminal Output */}
              <div className="bg-black border border-green-500/30 rounded-lg overflow-hidden">
                <div className="bg-green-950/50 px-4 py-2 border-b border-green-500/30">
                  <span className="text-green-400 text-sm">{'>'} TERMINAL_OUTPUT</span>
                </div>
                <div
                  ref={terminalRef}
                  className="p-4 h-96 overflow-y-auto text-sm text-green-300 whitespace-pre-wrap"
                >
                  {terminalOutput.join('')}
                  {terminalOutput.length > 0 && (
                    <span className="inline-block w-2 h-4 bg-green-400 animate-pulse ml-1"></span>
                  )}
                </div>
              </div>

              {/* Code Preview */}
              <div className="bg-black border border-green-500/30 rounded-lg overflow-hidden">
                <div className="bg-green-950/50 px-4 py-2 border-b border-green-500/30">
                  <span className="text-green-400 text-sm">
                    {'>'} CODE_PREVIEW {codePreview && `// ${codePreview.file}`}
                  </span>
                </div>
                <div className="p-4 h-96 overflow-y-auto text-xs text-green-300">
                  {codePreview ? (
                    <pre className="whitespace-pre-wrap">{codePreview.content}</pre>
                  ) : (
                    <div className="text-green-700 italic">Waiting for code generation...</div>
                  )}
                </div>
              </div>
            </div>

            {/* On-Chain Verification Log */}
            {chainLogs.length > 0 && (
              <div className="bg-gradient-to-r from-purple-900/30 to-green-900/30 border border-green-500/30 rounded-lg p-6 backdrop-blur">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-green-400 flex items-center gap-2">
                    <span className="text-2xl">✓</span>
                    <span className="text-xl font-bold">VERIFIED_ON_SOLANA</span>
                  </h3>
                  <a
                    href={`https://explorer.solana.com/address/${PROGRAM_ADDRESS}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded transition-colors text-sm flex items-center gap-2"
                  >
                    View Program ↗
                  </a>
                </div>
                
                <div className="mb-4 pb-4 border-b border-green-500/20">
                  <div className="text-green-700 text-xs mb-1">PROGRAM_ID:</div>
                  <code className="text-green-500 text-xs bg-black/40 px-2 py-1 rounded">
                    {PROGRAM_ADDRESS}
                  </code>
                </div>

                <div className="space-y-2">
                  <div className="text-green-600 text-sm mb-2">SHA256_VERIFICATION_HASHES:</div>
                  {chainLogs.map((log, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm bg-black/40 rounded p-3 hover:bg-black/60 transition-colors group">
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-2 h-2 bg-green-400 rounded-full shadow-lg shadow-green-400/50"></span>
                        <span className="text-green-600">Step {log.step}:</span>
                      </div>
                      <code className="text-green-300 text-xs flex-1 truncate">
                        SHA256: {log.tx}
                      </code>
                      <a
                        href={`https://explorer.solana.com/tx/${log.tx}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-400 hover:text-green-300 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Verify ↗
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Result View */}
        {result && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-green-950/20 border border-green-500 rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-3xl font-bold text-green-400 mb-2">BUILD_COMPLETE</h2>
              <p className="text-green-600">Agent built and deployed to Solana devnet</p>
              
              {/* Verified Badge */}
              <div className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-purple-900/50 to-green-900/50 border border-green-500/50 rounded-full px-6 py-3">
                <span className="text-2xl">✓</span>
                <span className="text-green-400 font-bold">Verified on Solana</span>
              </div>
            </div>

            <div className="bg-black border border-green-500/30 rounded-lg p-6 space-y-4">
              <div>
                <div className="text-green-600 text-xs mb-1">AGENT_NAME:</div>
                <div className="text-green-300 font-bold">{result.agentName}</div>
              </div>

              <div>
                <div className="text-green-600 text-xs mb-1">PROGRAM_ID:</div>
                <div className="flex items-center gap-2">
                  <code className="text-green-300 bg-green-950/30 px-3 py-2 rounded flex-1 break-all text-sm">
                    {result.programId}
                  </code>
                  <a
                    href={`https://explorer.solana.com/address/${result.programId}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300 whitespace-nowrap"
                  >
                    View ↗
                  </a>
                </div>
              </div>

              <div>
                <div className="text-green-600 text-xs mb-1">BUILD_ID:</div>
                <code className="text-green-300 bg-green-950/30 px-3 py-2 rounded block">
                  {result.buildId}
                </code>
              </div>

              {/* Enhanced On-Chain Proof */}
              <div className="bg-gradient-to-r from-purple-900/20 to-green-900/20 border border-purple-500/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-green-600 text-xs">ON_CHAIN_VERIFICATION ({result.chainProof.length} steps):</div>
                  <a
                    href={`https://explorer.solana.com/address/${PROGRAM_ADDRESS}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold py-1 px-3 rounded transition-colors"
                  >
                    Verify on Chain ↗
                  </a>
                </div>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {result.chainProof.map((proof: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-xs bg-black/40 px-3 py-2 rounded">
                      <span className="inline-block w-2 h-2 bg-green-400 rounded-full shadow-lg shadow-green-400/50"></span>
                      <span className="text-green-600">SHA256:</span>
                      <code className="text-green-500 flex-1">{proof}</code>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setResult(null);
                  setPrompt('');
                  setEvents([]);
                }}
                className="flex-1 bg-green-600 hover:bg-green-500 text-black font-bold py-3 px-6 rounded transition-colors"
              >
                {'>'} BUILD_ANOTHER_AGENT()
              </button>
              <Link
                href="/history"
                className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded transition-colors text-center"
              >
                View Build History →
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur border-t border-green-500/30 px-6 py-3 text-center text-xs text-green-600">
        <span>LiveForge v1.0 // Solana Agent Hackathon 2026 // Every action verified on-chain</span>
      </div>
    </div>
  );
}
