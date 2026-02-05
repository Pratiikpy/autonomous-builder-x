# 🎬 Demo Examples

This document shows real examples of what Autonomous Builder X can generate.

## Example 1: DAO Treasury Manager

### Input Prompt
```
Build a Solana agent that manages a DAO treasury with automated 
yield farming. It should monitor treasury balance, automatically 
stake SOL when idle, and rebalance between different DeFi protocols 
to maximize yield.
```

### Generated Output

**Agent Name:** `dao-treasury-manager`

**Anchor Program Includes:**
- `initialize_treasury` - Set up the DAO treasury account
- `deposit_funds` - Add SOL to the treasury
- `stake_idle_funds` - Automatically stake unused SOL
- `rebalance_portfolio` - Optimize across protocols
- `withdraw_yield` - Claim earnings
- `emergency_withdraw` - Admin rescue function

**State Accounts:**
```rust
pub struct Treasury {
    pub authority: Pubkey,
    pub total_balance: u64,
    pub staked_amount: u64,
    pub last_rebalance: i64,
    pub yield_earned: u64,
}
```

**Frontend Features:**
- Treasury balance dashboard
- Staking position overview
- Yield performance charts
- Manual rebalance button
- Emergency controls

**Documentation:**
```markdown
# DAO Treasury Manager

Autonomous treasury management with yield optimization.

## Program Instructions
1. **initialize_treasury** - Create treasury PDA
2. **deposit_funds** - Add SOL to be managed
3. **stake_idle_funds** - Auto-stake idle balance
4. **rebalance_portfolio** - Optimize yield
5. **withdraw_yield** - Claim earnings

## Security
- Multi-sig authority support
- Emergency pause mechanism
- Rate limiting on withdrawals
```

---

## Example 2: NFT Minting Agent

### Input Prompt
```
Create a Solana agent that mints NFTs with dynamic rarity traits. 
The agent should automatically generate trait combinations, calculate 
rarity scores, set royalties, and list on Magic Eden.
```

### Generated Output

**Agent Name:** `nft-minting-agent`

**Anchor Program Includes:**
- `initialize_collection` - Create NFT collection
- `mint_nft` - Mint with auto-generated traits
- `calculate_rarity` - Determine rarity score
- `set_royalties` - Configure creator fees
- `list_for_sale` - Auto-list on marketplace

**State Accounts:**
```rust
pub struct Collection {
    pub authority: Pubkey,
    pub name: String,
    pub total_supply: u32,
    pub minted_count: u32,
    pub base_uri: String,
}

pub struct NFTMetadata {
    pub mint: Pubkey,
    pub traits: Vec<Trait>,
    pub rarity_score: u16,
    pub royalty_bps: u16,
}
```

**Frontend Features:**
- Collection dashboard
- Mint button with preview
- Rarity distribution chart
- Trait editor
- Marketplace listing interface

---

## Example 3: DeFi Arbitrage Bot

### Input Prompt
```
Build a DeFi arbitrage bot that monitors prices across Solana DEXes 
(Jupiter, Raydium, Orca) and executes profitable swaps automatically 
when opportunities arise.
```

### Generated Output

**Agent Name:** `defi-arbitrage-bot`

**Anchor Program Includes:**
- `initialize_bot` - Set up bot configuration
- `monitor_prices` - Track DEX prices
- `calculate_opportunity` - Find arbitrage paths
- `execute_arbitrage` - Perform multi-hop swaps
- `withdraw_profits` - Claim earnings

**State Accounts:**
```rust
pub struct ArbitrageBot {
    pub authority: Pubkey,
    pub capital: u64,
    pub profit_earned: u64,
    pub trades_executed: u32,
    pub last_trade: i64,
    pub min_profit_bps: u16,
}
```

**Frontend Features:**
- Real-time price monitoring
- Arbitrage opportunity alerts
- Trade history log
- Profit tracking
- Bot configuration panel

---

## Example 4: Wallet Monitor & Alerts

### Input Prompt
```
Create an agent that monitors Solana wallets for large transactions 
and suspicious activity. Send alerts when thresholds are exceeded.
```

### Generated Output

**Agent Name:** `wallet-monitor-agent`

**Anchor Program Includes:**
- `register_wallet` - Add wallet to watch list
- `set_alert_rules` - Configure thresholds
- `check_transaction` - Analyze new transactions
- `trigger_alert` - Send notification
- `remove_wallet` - Stop monitoring

**State Accounts:**
```rust
pub struct WalletMonitor {
    pub owner: Pubkey,
    pub watched_wallet: Pubkey,
    pub threshold_sol: u64,
    pub alert_count: u32,
    pub last_alert: i64,
}
```

**Frontend Features:**
- Wallet input form
- Alert rule configuration
- Real-time activity feed
- Alert history
- Statistics dashboard

---

## Example 5: Token Vesting Manager

### Input Prompt
```
Build an agent that manages token vesting schedules. It should 
support cliff periods, linear vesting, and automated releases.
```

### Generated Output

**Agent Name:** `token-vesting-manager`

**Anchor Program Includes:**
- `create_vesting_schedule` - Set up vesting plan
- `claim_vested_tokens` - Release available tokens
- `revoke_vesting` - Cancel vesting (admin)
- `query_vested_amount` - Check available balance
- `update_beneficiary` - Change recipient

**State Accounts:**
```rust
pub struct VestingSchedule {
    pub beneficiary: Pubkey,
    pub mint: Pubkey,
    pub total_amount: u64,
    pub claimed_amount: u64,
    pub start_time: i64,
    pub cliff_time: i64,
    pub end_time: i64,
}
```

**Frontend Features:**
- Vesting schedule creator
- Claim button
- Vesting progress bar
- Timeline visualization
- Beneficiary management

---

## Common Generated Components

### Every Generated Agent Includes:

**1. Anchor Program (Rust)**
- Complete `lib.rs` with all instructions
- Proper error handling
- PDA (Program Derived Address) usage
- Event emission for important actions
- Security checks (signer validation, overflow protection)

**2. TypeScript SDK**
```typescript
export class AgentSDK {
  constructor(connection: Connection, wallet: Wallet);
  async instruction1(...args): Promise<TransactionSignature>;
  async instruction2(...args): Promise<TransactionSignature>;
  // ... more methods
}
```

**3. Next.js Frontend**
- Wallet connection integration
- UI for every program instruction
- Transaction status feedback
- Tailwind CSS styling
- Responsive design

**4. Configuration Files**
- `Anchor.toml` - Anchor config
- `Cargo.toml` - Rust dependencies
- `package.json` - Node.js dependencies
- `tsconfig.json` - TypeScript config

**5. Documentation**
- README with overview
- API reference
- Deployment instructions
- Security considerations

## Build Time

Typical generation times:
- Simple agents: ~2 minutes
- Medium complexity: ~3-4 minutes
- Complex agents: ~5-6 minutes

**Steps:**
1. Analyze prompt: ~20 seconds
2. Generate code: ~30-60 seconds
3. Build Anchor program: ~60-90 seconds
4. Generate frontend: ~20-30 seconds
5. Documentation: ~10-20 seconds
6. Deploy: ~30-60 seconds

## Try It Yourself

Visit the deployed app and try these prompts:

```
1. Build a Solana agent that manages subscription payments

2. Create an agent for automated liquidity provision on Raydium

3. Build a governance voting agent with delegation support

4. Create a recurring payment scheduler for payroll

5. Build an escrow agent for peer-to-peer trades
```

Each prompt will generate a complete, deployable Solana agent with:
- ✅ Working Anchor program
- ✅ Deployed to devnet
- ✅ TypeScript SDK
- ✅ Next.js frontend
- ✅ Full documentation

---

**The future of Solana development: Describe what you want, get deployed code.**
