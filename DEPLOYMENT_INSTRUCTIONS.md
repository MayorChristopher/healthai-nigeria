# Deployment Instructions

## Before You Deploy - CRITICAL CHECKLIST

### ✅ Required Steps

1. **Get Gemini API Key**
   - Go to https://ai.google.dev/
   - Create account and get API key
   - Understand free tier limits: 15 req/min, 1M tokens/day

2. **Set Environment Variable**
   ```bash
   # Create .env.local file
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Test Locally First**
   ```bash
   npm install
   npm run dev
   ```
   - Open http://localhost:3000
   - Test chat functionality
   - Try emergency detection
   - Test Pidgin support

4. **Understand Costs**
   - Free tier is limited
   - Beyond limits, YOU pay per request
   - Monitor usage at https://ai.google.dev/

### 🚀 Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Add environment variable: `GEMINI_API_KEY`
   - Deploy

3. **After Deployment**
   - Test all features on production URL
   - Monitor API usage
   - Check error logs

### ⚠️ IMPORTANT WARNINGS

**API Costs**
- If you get traffic, you WILL pay for API usage
- Set up billing alerts in Google Cloud
- Consider rate limiting if traffic spikes

**Legal Protection**
- Terms of service is basic, not lawyer-reviewed
- Consider getting actual legal review
- Add more disclaimers if needed

**Medical Liability**
- You are NOT protected from lawsuits
- Consider taking it down after hackathon
- OR: Add "Demo Only - Not for Real Use" banner

### 📊 Monitoring

**Check These Regularly:**
- Vercel Analytics (traffic)
- Google AI Studio (API usage)
- Error logs (Vercel dashboard)

**Set Alerts:**
- API usage approaching limits
- Error rate spikes
- Unusual traffic patterns

### 🛑 When to Take It Down

Consider shutting down if:
- API costs exceed your budget
- You receive legal threats
- Someone reports medical harm
- You can't maintain it properly

**It's okay to shut down a prototype. Better safe than sorry.**

### 🎯 For Hackathon Demo

**Best Practice:**
1. Deploy for hackathon weekend only
2. Take down after judging
3. Keep GitHub repo public
4. Add "Demo - Not Active" to README

**This protects you from:**
- Unexpected API costs
- Legal liability
- Maintenance burden
- Medical incidents

### 📝 Post-Hackathon Options

**Option 1: Keep It Down**
- Safest option
- Keep code on GitHub
- Add "Archived Demo" badge
- No ongoing costs or liability

**Option 2: Make It Open Source**
- Remove your API key
- Make users provide their own
- Add "Self-Host Only" instructions
- No liability for you

**Option 3: Build It Properly**
- Get medical advisors
- Get legal review
- Get funding
- Launch in 6-12 months

**Don't leave a half-built medical app running indefinitely.**

---

## Quick Deploy Commands

```bash
# Install dependencies
npm install

# Test locally
npm run dev

# Build for production
npm run build

# Deploy to Vercel (if CLI installed)
vercel --prod
```

## Environment Variables Needed

```
GEMINI_API_KEY=your_key_here
```

That's it. Keep it simple.

---

**Remember: You built a great demo. Don't let it become a liability.**
