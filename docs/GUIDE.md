# HealthAI Nigeria - Complete Guide

## 🚀 Quick Start

### What's Built (100%)
- ✅ Landing page with all sections
- ✅ Chat UI with message persistence
- ✅ Hospital data (6 Nigerian hospitals)
- ✅ Error handling
- ✅ Team section

### What's Needed (Hackathon)
- 🔄 Backend API (`src/app/api/chat/route.ts`)
- 🔄 Gemini API integration
- 🔄 Deploy to Vercel

## 📂 Project Structure

```
healthai-nigeria/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── chat/page.tsx         # Chat UI (complete)
│   │   ├── api/chat/route.ts     # Backend (build this)
│   │   ├── layout.tsx
│   │   └── globals.css
│   └── lib/
│       ├── hospital-recommender.ts  # Hospital logic
│       └── google-maps-integration.ts
├── public/
│   ├── team/                     # Team photos
│   └── hospitals/                # Hospital photos (optional)
├── docs/
│   └── GUIDE.md                  # This file
└── README.md
```

## 🛠️ Build Backend (2 Hours)

### Step 1: Get API Key (5 mins)
```bash
# Visit https://ai.google.dev/
# Create project, enable Gemini API
# Copy API key
# Add to .env.local:
GEMINI_API_KEY=your_key_here
```

### Step 2: Install Dependencies (2 mins)
```bash
npm install @google/generative-ai
```

### Step 3: Create Backend (1 hour)
Create `src/app/api/chat/route.ts`:

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'
import { recommendHospitals, detectEmergencyType, shouldSuggestOnlineDoctor } from '@/lib/hospital-recommender'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const conversationHistory = new Map<string, any[]>()

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId } = await req.json()
    
    // Get or create conversation history
    let history = conversationHistory.get(sessionId) || []
    
    // Build prompt
    const systemPrompt = `You are HealthAI, a medical assistant for Nigerian communities. 
- Respond in English or Nigerian Pidgin based on user's language
- Detect emergencies (chest pain, severe bleeding, difficulty breathing)
- Provide clear, simple medical advice
- Always recommend seeing a doctor for serious issues
- Be empathetic and culturally aware`

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    const chat = model.startChat({
      history: history,
      generationConfig: { maxOutputTokens: 500 }
    })

    const result = await chat.sendMessage(systemPrompt + '\n\nUser: ' + message)
    const response = result.response.text()

    // Detect emergency
    const emergencyType = detectEmergencyType(message)
    const isEmergency = emergencyType !== 'general'
    
    // Get hospitals if emergency
    const hospitals = isEmergency ? recommendHospitals(emergencyType).slice(0, 3) : undefined
    
    // Suggest online doctors for minor issues
    const onlineDoctors = shouldSuggestOnlineDoctor(message)

    // Update history
    history.push(
      { role: 'user', parts: [{ text: message }] },
      { role: 'model', parts: [{ text: response }] }
    )
    conversationHistory.set(sessionId, history)

    return NextResponse.json({
      response,
      isEmergency,
      hospitals,
      onlineDoctors
    })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}
```

### Step 4: Test (30 mins)
```bash
npm run dev
# Open http://localhost:3000/chat
# Test: "I have chest pain" (should show emergency + hospitals)
# Test: "I have headache" (should show advice)
# Test: "Abeg I get fever" (should respond in Pidgin)
```

### Step 5: Deploy (30 mins)
```bash
# Push to GitHub
git add .
git commit -m "Add backend API"
git push origin main

# Deploy on Vercel
# 1. Go to vercel.com
# 2. Import GitHub repo
# 3. Add GEMINI_API_KEY in environment variables
# 4. Deploy
```

## 💾 Data Storage

### Hospital Data
**Location:** `src/lib/hospital-recommender.ts`
**Type:** Hardcoded array
**Why:** Fast, reliable, works offline

### Chat Messages
**Location:** Browser sessionStorage
**Type:** Temporary (clears on browser close)
**Why:** Privacy-focused, no database needed

### AI Context
**Location:** Server memory Map
**Type:** Temporary (clears on server restart)
**Why:** Conversation memory during session

### Photos
**Location:** `public/team/` and `public/hospitals/`
**Type:** Static files
**How to add:**
1. Download image
2. Resize to 800x600px
3. Compress at tinypng.com
4. Save in public folder
5. Reference in code

## 🎯 Features Explained

### Landing Page
- Hero with problem statement
- Chat preview (matches actual chat UI)
- Hospital network (6 real hospitals)
- Team section (3 members)
- Safety disclaimer
- Tech stack

### Chat UI
- Message persistence (sessionStorage)
- Auto-growing textarea (no scrollbar)
- Scroll-to-bottom button
- Timestamps on messages
- Feedback buttons (thumbs up/down)
- Emergency badge styling
- Hospital cards with call/directions
- Online doctor suggestions
- Character counter (0/500)

### Backend (To Build)
- Gemini AI integration
- Conversation memory
- Emergency detection
- Hospital recommendations
- Language detection (English/Pidgin)
- Error handling

## 🔧 Common Issues

### Chat disappears on navigation
**Fixed:** Uses sessionStorage to persist messages

### Textarea shows scrollbar
**Fixed:** `overflow: hidden` + auto-grow logic

### Session ID not persisting
**Fixed:** Saved to sessionStorage on creation

### Name not updating
**Fixed:** Changed to "Mayor Ugochukwu C." in team section

## 📱 Testing Checklist

- [ ] Landing page loads
- [ ] All sections visible
- [ ] Chat opens from nav
- [ ] Messages persist on navigation
- [ ] Textarea grows without scrollbar
- [ ] Scroll button appears after scrolling
- [ ] Emergency detection works
- [ ] Hospital cards display
- [ ] Feedback buttons work
- [ ] Timestamps show
- [ ] Mobile responsive

## 🏆 Demo Script

1. **Show Problem** (30 sec)
   - 60% live 5km+ from hospitals
   - Language barriers
   - Night emergencies

2. **Demo Chat** (2 min)
   - Type: "I have chest pain"
   - Show emergency detection
   - Show hospital recommendations
   - Show call/directions buttons

3. **Show Features** (1 min)
   - Pidgin support
   - Message persistence
   - Privacy (no storage)
   - Adaptive AI

4. **Highlight Impact** (30 sec)
   - UN SDG 3
   - Nigerian communities
   - 24/7 availability
   - Free, no registration

## 🎓 Team Roles

### Mayor (Full Stack)
- ✅ Landing page (done)
- ✅ Chat UI (done)
- 🔄 Backend API (hackathon)
- 🔄 Deployment (hackathon)

### Victor (Backend)
- 🔄 Gemini integration (hackathon)
- 🔄 Emergency detection (hackathon)
- 🔄 Testing (hackathon)

### Comfort (Documentation)
- ✅ Project docs (done)
- 🔄 User guides (hackathon)
- 🔄 Testing (hackathon)

## 📞 Quick Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production

# Git
git add .
git commit -m "message"
git push origin main

# Testing
http://localhost:3000         # Landing page
http://localhost:3000/chat    # Chat interface
```

## ✅ Ready to Push

Everything is organized and ready. Just build the backend during hackathon!

**Good luck! 🚀🇳🇬**
