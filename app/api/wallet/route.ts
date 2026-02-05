import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey } from '@solana/web3.js';

const AGENT_WALLET = 'GSkmpvBGmfDwKN2TV7xbqgVfnaNdyZexN3N88bqGaEf4';
const PROGRAM_ID = 'GUyhK2AvkPcVwt4Q1ABmMsQTGvZphiAMaAnDWLSyZoSK';

export async function GET(request: NextRequest) {
  try {
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    const publicKey = new PublicKey(AGENT_WALLET);
    
    // Fetch balance
    const balanceLamports = await connection.getBalance(publicKey);
    const balance = balanceLamports / 1e9;
    
    // Fetch recent transactions
    const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 10 });
    
    const recentTxs = signatures.map(sig => {
      const date = new Date((sig.blockTime || 0) * 1000);
      return {
        signature: sig.signature,
        timestamp: date.toLocaleString(),
        type: sig.err ? 'Failed' : 'Success',
      };
    });
    
    return NextResponse.json({
      address: AGENT_WALLET,
      balance,
      programId: PROGRAM_ID,
      recentTxs,
    });
  } catch (error: any) {
    console.error('Wallet API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch wallet data' },
      { status: 500 }
    );
  }
}
