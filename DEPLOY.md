# 🚀 DEPLOY LIVEFORGE - QUICK REFERENCE

## ⚡ One-Command Deploy

```bash
cd /Users/prateektripathi/.openclaw/workspace/autonomous-builder-x
vercel --prod
```

## 🔑 Environment Variables (Set in Vercel)

```
ANTHROPIC_API_KEY=your_anthropic_key_here
SOLANA_RPC_URL=https://api.devnet.solana.com
```

## ✅ Pre-Deploy Checklist

- [ ] All code committed to GitHub
- [ ] Dependencies installed (`npm install`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] Environment variables ready

## 🧪 Test Locally First

```bash
npm install
npm run dev
# Visit http://localhost:3000/live
# Test with: "Build a simple Solana counter program"
```

## 📺 After Deploy

1. **Get URL** - Note the Vercel URL
2. **Test Live** - Visit /live and run a build
3. **Record Demo** - Screen record a full build (3-5 min)
4. **Update Project:**
   ```bash
   curl -X PUT https://agents.colosseum.com/api/my-project \
     -H "Authorization: Bearer 7028a73b83923c66a257f698f98864a6f98164fab1594bfacfc94a58842a51a5" \
     -H "Content-Type: application/json" \
     -d '{
       "technicalDemoLink": "https://your-vercel-url.vercel.app/live",
       "presentationLink": "https://youtube.com/your-demo-video"
     }'
   ```

## 🎬 Demo Video Checklist

- [ ] Record in 1080p or higher
- [ ] Show full prompt → deployed result flow
- [ ] Highlight live streaming UI
- [ ] Show on-chain verification
- [ ] Keep to 3-5 minutes
- [ ] Upload to YouTube/Vimeo
- [ ] Add to project presentation link

## 📝 Forum Update After Deploy

Post comment on your thread with:
```
✅ LiveForge is now LIVE!

Try it: [your-vercel-url]/live
Demo video: [your-video-url]

Watch an AI build Solana programs in real-time.
Every action visible. Every step verified on-chain.

Example prompts:
- "Build a Solana DAO treasury manager"
- "Create an NFT minting agent"
- "Build a DeFi arbitrage bot"

This is transparent autonomy. 🚀
```

## 🏆 Submit When Ready

**ONLY when you're satisfied with:**
- ✅ Live demo working
- ✅ Demo video recorded
- ✅ Forum engagement done
- ✅ Project details updated

**Then submit:**
```bash
curl -X POST https://agents.colosseum.com/api/my-project/submit \
  -H "Authorization: Bearer 7028a73b83923c66a257f698f98864a6f98164fab1594bfacfc94a58842a51a5"
```

⚠️ **WARNING:** Submission is ONE-WAY. Project locks after submit. Make sure everything is perfect first!

---

**Quick Links:**
- GitHub: https://github.com/Pratiikpy/autonomous-builder-x
- Forum: Post #1166
- Agent: #618
- Project: #302

**Credentials:** `/Users/prateektripathi/.openclaw/workspace/hackathon-agents/agent3-credentials.json`

**Status:** 🟢 READY TO DEPLOY

---

*Deploy → Test → Demo → Update → Engage → Submit → Win*
