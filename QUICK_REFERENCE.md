# Quick Reference Guide

## 🚀 Common Tasks

### Start Development
```bash
npm run dev
```
Open http://localhost:3000

### Deploy
```bash
git add .
git commit -m "Your message"
git push
```
Vercel auto-deploys

### Add Environment Variable
Edit `.env.local`:
```
GEMINI_API_KEY=your_key_here
```

---

## 📂 File Locations

### Modify Landing Page
`src/app/page.tsx`

### Modify Chat Interface
`src/app/chat/page.tsx`

### Modify AI Logic
`src/app/api/chat/route.ts`

### Add New Component
`src/components/YourComponent.tsx`

### Add New Utility
`src/lib/your-utility.ts`

### Modify PWA Settings
`public/manifest.json`

### Modify Offline Page
`public/offline.html`

---

## 🎨 Key Features

### Urgency Indicators
File: `src/lib/urgency-detector.ts`
- 🚨 Emergency (Red)
- 🔴 High (Orange)
- 🟡 Medium (Yellow)
- 🟢 Low (Green)

### Loading Tips
File: `src/lib/health-tips.ts`
Add tips to `HEALTH_TIPS` array

### Hospital Finder
File: `src/lib/hospital-recommender.ts`
Add hospitals to `HOSPITALS` array

### PWA Install
Component: `src/components/InstallPrompt.tsx`

---

## 🔧 Configuration Files

- `next.config.ts` - Next.js config
- `tsconfig.json` - TypeScript config
- `tailwind.config.ts` - Tailwind config
- `package.json` - Dependencies
- `.env.local` - Environment variables

---

## 📱 Testing

### Test Emergency Detection
Type: "chest pain", "severe bleeding"

### Test Urgency Levels
- Emergency: "chest pain"
- High: "severe fever"
- Medium: "headache"
- Low: "general health"

### Test Pidgin
Type: "My body dey hot"

### Test Offline
1. Turn off network
2. Refresh page
3. See offline page

### Test PWA
1. Deploy to Vercel
2. Open on phone
3. Look for install prompt

---

## 🐛 Troubleshooting

### AI Not Responding
Check `.env.local` has `GEMINI_API_KEY`

### PWA Not Installing
- Must be on HTTPS (deploy to Vercel)
- Check `manifest.json` exists
- Check `sw.js` exists

### Offline Page Not Showing
- Service worker needs HTTPS
- Clear cache and reload

### Build Errors
```bash
npm install
npm run build
```

---

## 📊 Project Stats

- **Pages:** 3 (Landing, Chat, Pitch)
- **Components:** 2 (LocationRequest, InstallPrompt)
- **API Routes:** 1 (Chat)
- **Utilities:** 8 (Hospital, Urgency, Tips, etc.)
- **Documentation:** 6 files

---

## 🎯 Hackathon Checklist

- [ ] Test all features
- [ ] Create app icons (192px, 512px)
- [ ] Test on mobile
- [ ] Test offline mode
- [ ] Test PWA install
- [ ] Practice demo
- [ ] Prepare pitch slides
- [ ] Test emergency detection
- [ ] Test Pidgin language
- [ ] Deploy to Vercel

---

## 📞 Emergency Contacts (In App)

- Nigeria: 112
- National Hospital Abuja: +234 9 461 2200
- LUTH Lagos: +234 1 263 2626
- UCH Ibadan: +234 2 241 3545

---

**Quick Access:**
- Main Docs: `README.md`
- Architecture: `ARCHITECTURE.md`
- Features: `HACKATHON_FEATURES.md`
- Structure: `PROJECT_STRUCTURE.md`
