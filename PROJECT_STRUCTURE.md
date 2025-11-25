# HealthAI Nigeria - Project Structure

## 📁 Directory Organization

```
healthai-nigeria/
├── 📄 Root Configuration Files
│   ├── .env.local                    # Environment variables (API keys)
│   ├── .env.example                  # Example environment file
│   ├── .gitignore                    # Git ignore rules
│   ├── next.config.ts                # Next.js configuration
│   ├── tsconfig.json                 # TypeScript configuration
│   ├── postcss.config.mjs            # PostCSS configuration
│   ├── package.json                  # Dependencies
│   └── package-lock.json             # Locked dependencies
│
├── 📚 Documentation
│   ├── README.md                     # Main project documentation
│   ├── ARCHITECTURE.md               # System architecture
│   ├── HACKATHON_FEATURES.md         # New features for hackathon
│   ├── CONTRIBUTING.md               # Contribution guidelines
│   ├── LICENSE                       # Project license
│   └── docs/                         # Detailed documentation
│       ├── COMPLETE_GUIDE.md         # Full setup guide
│       ├── QUICK_START.md            # Quick start guide
│       ├── TECHNICAL_DETAILS.md      # Technical specifications
│       └── README.md                 # Docs index
│
├── 🎨 Public Assets
│   ├── manifest.json                 # PWA manifest
│   ├── sw.js                         # Service worker
│   ├── offline.html                  # Offline fallback page
│   ├── icon.svg                      # App icon (SVG)
│   ├── icon-192.png                  # PWA icon 192x192 (to create)
│   ├── icon-512.png                  # PWA icon 512x512 (to create)
│   ├── favicon.svg                   # Browser favicon
│   ├── ICONS_README.txt              # Icon generation guide
│   └── team/                         # Team member photos
│       ├── mayor.jpg
│       ├── victor.png
│       ├── comfort.jpg
│       └── README.md
│
└── 💻 Source Code (src/)
    │
    ├── 🎯 App Directory (src/app/)
    │   ├── layout.tsx                # Root layout with PWA setup
    │   ├── page.tsx                  # Landing page
    │   ├── globals.css               # Global styles
    │   ├── icon.tsx                  # Dynamic favicon
    │   ├── error.tsx                 # Error boundary
    │   ├── not-found.tsx             # 404 page
    │   │
    │   ├── api/                      # API Routes
    │   │   ├── chat/
    │   │   │   └── route.ts          # Main chat API endpoint
    │   │   └── test/
    │   │       └── route.ts          # Test endpoint
    │   │
    │   ├── chat/                     # Chat Page
    │   │   └── page.tsx              # Chat interface
    │   │
    │   └── pitch/                    # Pitch Presentation
    │       └── page.tsx              # Pitch slides
    │
    ├── 🧩 Components (src/components/)
    │   ├── LocationRequest.tsx       # Location sharing component
    │   └── InstallPrompt.tsx         # PWA install prompt
    │
    ├── 🛠️ Library/Utils (src/lib/)
    │   ├── hospital-recommender.ts   # Hospital finder logic
    │   ├── urgency-detector.ts       # Medical triage system
    │   ├── health-tips.ts            # Loading state tips
    │   ├── response-filter.ts        # AI response safety filter
    │   ├── offline-emergency.ts      # Offline fallback logic
    │   ├── follow-up-handler.ts      # Conversation follow-ups
    │   ├── geolocation.ts            # Location utilities
    │   └── google-maps-integration.ts # Maps integration
    │
    └── 📝 Types (src/types/)
        └── chat.ts                   # TypeScript type definitions
```

---

## 🎯 Key Files Explained

### Root Level
- **README.md** - Main documentation, setup instructions
- **ARCHITECTURE.md** - System design, flow diagrams
- **HACKATHON_FEATURES.md** - New features showcase
- **.env.local** - API keys (GEMINI_API_KEY)

### Public Assets
- **manifest.json** - PWA configuration
- **sw.js** - Service worker for offline mode
- **offline.html** - Shown when app is offline
- **icon-*.png** - App icons (need to create from icon.svg)

### Source Code

#### App Directory (`src/app/`)
- **layout.tsx** - Root layout, PWA metadata, service worker
- **page.tsx** - Landing page with features, hospitals, team
- **chat/page.tsx** - Main chat interface with AI
- **api/chat/route.ts** - Backend API for AI chat

#### Components (`src/components/`)
- **LocationRequest.tsx** - GPS/manual location input
- **InstallPrompt.tsx** - PWA installation prompt

#### Library (`src/lib/`)
- **hospital-recommender.ts** - Find nearest hospitals
- **urgency-detector.ts** - 🚨🔴🟡🟢 Triage system
- **health-tips.ts** - Loading state tips
- **response-filter.ts** - Safety filters for AI
- **offline-emergency.ts** - Offline emergency guidance

---

## 🔄 Data Flow

```
User Input → Chat Page → API Route → AI (Gemini)
                ↓           ↓            ↓
         Location    Emergency    Response
         Request     Detection    Filtering
                ↓           ↓            ↓
         Hospital    Urgency      Safe
         Finder      Indicator    Response
                ↓           ↓            ↓
              Display Results to User
```

---

## 🚀 Quick Navigation

### To modify UI:
- Landing page: `src/app/page.tsx`
- Chat interface: `src/app/chat/page.tsx`
- Components: `src/components/`

### To modify AI logic:
- Main API: `src/app/api/chat/route.ts`
- Response filtering: `src/lib/response-filter.ts`
- Emergency detection: `src/lib/hospital-recommender.ts`

### To modify features:
- Urgency indicators: `src/lib/urgency-detector.ts`
- Loading tips: `src/lib/health-tips.ts`
- Hospital finder: `src/lib/hospital-recommender.ts`

### To modify PWA:
- Manifest: `public/manifest.json`
- Service worker: `public/sw.js`
- Offline page: `public/offline.html`
- Layout: `src/app/layout.tsx`

---

## 📦 Dependencies

### Core
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

### AI & APIs
- **@google/generative-ai** - Gemini AI
- **react-markdown** - Markdown rendering

### Development
- **ESLint** - Code linting
- **PostCSS** - CSS processing

---

## 🎨 Styling System

- **Tailwind CSS** - Utility-first CSS
- **Custom Colors:**
  - Primary: Green (#16a34a)
  - Background: Black (#000000)
  - Emergency: Red (#ef4444)
  - Warning: Yellow (#eab308)

---

## 🔐 Environment Variables

Required in `.env.local`:
```
GEMINI_API_KEY=your_api_key_here
```

---

## 📱 PWA Files

1. **manifest.json** - App metadata
2. **sw.js** - Caches files for offline
3. **offline.html** - Fallback page
4. **icon-192.png** - Small icon (create)
5. **icon-512.png** - Large icon (create)

---

## 🧪 Testing Checklist

- [ ] Landing page loads
- [ ] Chat interface works
- [ ] AI responds correctly
- [ ] Emergency detection works
- [ ] Urgency indicators show
- [ ] Loading tips rotate
- [ ] Hospital finder works
- [ ] Location sharing works
- [ ] Pidgin language works
- [ ] Offline mode works
- [ ] PWA installs
- [ ] Service worker registers

---

## 🚀 Deployment

1. Push to GitHub
2. Connect to Vercel
3. Add GEMINI_API_KEY to Vercel environment
4. Deploy automatically

---

## 📝 Notes

- All medical logic in `src/lib/`
- All UI components in `src/components/`
- All pages in `src/app/`
- All public assets in `public/`
- All docs in root or `docs/`

---

**Last Updated:** January 2025
**Version:** 1.0.0
**Status:** Hackathon Ready ✅
