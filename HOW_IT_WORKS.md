# How HealthAI Nigeria Works - Complete Technical Explanation

## 🎯 Overview

HealthAI is a Next.js web application with two main parts:
1. **Landing Page** - Marketing site (already built)
2. **AI Chat** - Adaptive medical assistant (to be built at hackathon)

---

## 📱 Landing Page - How It Works

### 1. Navigation Bar
**File:** `src/app/page.tsx` (lines 35-54)

**What happens:**
- Fixed to top of screen
- Transparent initially
- When you scroll down 20px, becomes blurred with dark background
- Uses React `useState` and `useEffect` to track scroll position

**Code flow:**
```
User scrolls → handleScroll() runs → Updates scrolled state → Nav changes style
```

### 2. Scroll Animations
**Files:** `src/app/page.tsx` + `src/app/globals.css`

**What happens:**
- Sections start invisible and moved down 60px
- IntersectionObserver watches when section enters viewport
- When visible, adds `animate-in` class
- CSS transitions fade in and slide up over 0.8 seconds

**Code flow:**
```
Page loads → Observer watches .fade-in elements → Section enters view → Add animate-in class → CSS animates
```

### 3. Hospital Cards
**File:** `src/app/page.tsx` (lines 280-330)

**What happens:**
- Array of 6 hospitals with data (name, phone, coordinates)
- `.map()` loops through array, creates card for each
- Phone links use `tel:` protocol (click to call)
- Directions links open Google Maps with coordinates

**Code flow:**
```
hospitals array → .map() → Create card for each → Render to screen
```

### 4. Team Section
**File:** `src/app/page.tsx` (lines 420-480)

**What happens:**
- Shows 3 team members with roles
- Each has colored avatar circle with initial
- Lists responsibilities for hackathon

---

## 💬 Chat Interface - How It Will Work

### Visual Comparison:

**Landing Page Preview (Static Demo):**
- Shows example conversation
- Not interactive
- Fixed messages
- Decorative only

**Actual Chat Page (What You'll Build):**
- Fully functional
- Real AI responses
- Interactive input
- Same visual style but WORKS

### Differences:

| Feature | Landing Preview | Actual Chat |
|---------|----------------|-------------|
| Messages | Static HTML | Dynamic React state |
| Input | Disabled | Fully functional |
| AI | Fake example | Real Gemini API |
| Scrolling | Fixed height | Auto-scrolls to bottom |
| Loading | None | Animated dots |
| Emergency | Example only | Real detection |

---

## 🔄 Complete Data Flow - User Types Message

### Step-by-Step Journey:

**1. User Types & Clicks Send**
```
User types "I get headache" → Clicks Send button
↓
sendMessage() function runs (page.tsx)
```

**2. Frontend Processing**
```
Input validation (not empty?) → Clear input field → Add message to state
↓
messages array updates → React re-renders → Message appears on screen
↓
Set loading = true → Loading dots appear
```

**3. API Call**
```
fetch('/api/chat', { POST, body: { message, sessionId } })
↓
Request sent to backend
```

**4. Backend Receives Request**
```
route.ts receives POST request
↓
Extract message and sessionId from body
```

**5. Session Management**
```
Check if sessionId exists in sessions Map
↓
If NO: Create new AdaptiveAI instance, store in Map
If YES: Get existing AdaptiveAI instance
```

**6. Emergency Check**
```
detectEmergency(message) runs
↓
Checks message for keywords: "chest pain", "can't breathe", etc.
↓
If EMERGENCY: Return emergency response immediately, skip AI
If NOT: Continue to AI processing
```

**7. Adaptive AI Processing**
```
ai.addToContext(message, true) → Adds user message to conversation history
↓
ai.buildPrompt(message) → Creates smart prompt with:
  - Conversation history (last 6 messages)
  - Detected language (English or Pidgin)
  - Previous symptoms mentioned
  - Instructions for AI behavior
```

**8. Gemini API Call**
```
getGeminiResponse(systemPrompt, message)
↓
Sends to Google Gemini API
↓
Gemini processes with context
↓
Returns AI response
```

**9. Response Processing**
```
ai.addToContext(response, false) → Adds AI response to history
↓
Return JSON: { response: "...", isEmergency: false }
```

**10. Frontend Receives Response**
```
fetch() promise resolves
↓
Extract data.response
↓
Add to messages array
↓
React re-renders → AI message appears
↓
Set loading = false → Loading dots disappear
↓
Auto-scroll to bottom
```

---

## 🧠 Adaptive AI - How It Learns

### What Makes It "Adaptive"?

**1. Conversation Memory**
```typescript
conversationContext: string[] = []
```
Stores last 6 messages. Each new message adds to array.

**Example:**
```
User: "I get headache"
AI: "How long you don dey feel am?"
User: "Since yesterday"
AI: (Remembers you said headache yesterday, asks relevant follow-up)
```

**2. Language Detection**
```typescript
detectPidgin(text: string): boolean
```
Checks for Pidgin words: wetin, dey, abeg, oga, wahala, no, fit

**Example:**
```
User types: "Wetin dey worry me"
↓
detectPidgin() finds "wetin" and "dey"
↓
Sets language = 'pidgin'
↓
AI responds in Pidgin: "How you dey feel now?"
```

**3. Symptom Tracking**
```typescript
symptoms: string[] = []
```
Extracts symptoms from messages, remembers them.

**Example:**
```
Message 1: "I get headache"
↓
extractSymptoms() finds "headache"
↓
symptoms = ['headache']

Message 3: "Now I dey vomit"
↓
extractSymptoms() finds "vomit"
↓
symptoms = ['headache', 'vomit']
↓
AI knows both symptoms, gives better advice
```

---

## 🚨 Emergency Detection - How It Works

### Detection Process:

```typescript
const emergencyKeywords = [
  'chest pain', 'can\'t breathe', 'severe bleeding', 
  'unconscious', 'seizure', 'stroke', 'heart attack'
]
```

**Flow:**
```
User message → Convert to lowercase → Check each keyword
↓
If ANY keyword found → isEmergency = true
↓
Return emergency response immediately
↓
Skip AI processing (too urgent)
```

**Example:**
```
User: "I get chest pain"
↓
lowerMessage = "i get chest pain"
↓
Loop finds "chest pain"
↓
Return: {
  isEmergency: true,
  reason: "chest pain"
}
↓
Frontend shows red emergency message
```

---

## 💾 Session Management - No Database Needed

### How Sessions Work:

```typescript
const sessions = new Map<string, AdaptiveAI>()
```

**Map Structure:**
```
sessions = {
  "abc123": AdaptiveAI instance (User 1's conversation),
  "xyz789": AdaptiveAI instance (User 2's conversation),
  "def456": AdaptiveAI instance (User 3's conversation)
}
```

**Flow:**
```
User opens chat → Generate random sessionId → Store in React state
↓
First message → Backend checks Map → sessionId not found
↓
Create new AdaptiveAI() → Store in Map with sessionId as key
↓
Next messages → Backend checks Map → sessionId found
↓
Get existing AdaptiveAI → Has conversation history → Continues conversation
```

**Memory Cleanup:**
```
Every 30 minutes:
  If sessions.size > 100:
    Delete oldest 50 sessions
    Prevents memory leak
```

---

## 🎨 UI Components Breakdown

### Chat Message Component

**AI Message:**
```
┌─────────────────────────────────┐
│ [Green Avatar] [Message Bubble] │
│                                 │
│  "How you dey feel now?"        │
└─────────────────────────────────┘
```

**User Message:**
```
┌─────────────────────────────────┐
│ [Message Bubble] [Gray Avatar]  │
│                                 │
│  "I get headache"               │
└─────────────────────────────────┘
```

**Emergency Message:**
```
┌─────────────────────────────────┐
│ [Green Avatar] [RED Bubble]     │
│                                 │
│  🚨 EMERGENCY DETECTED          │
│  Call 112 NOW!                  │
└─────────────────────────────────┘
```

### Loading Indicator

```
[Green Avatar] [Bubble with 3 bouncing dots]
  ●  ●  ●  (animated)
```

---

## 🔐 Security & Privacy

### What We DON'T Store:
- ❌ User messages (deleted when session ends)
- ❌ Personal information
- ❌ Medical history
- ❌ User accounts
- ❌ Conversation logs

### What We DO Store (Temporarily):
- ✅ Session data in memory (deleted after 30 mins or when server restarts)
- ✅ Last 6 messages per session (for context only)

### API Key Security:
```
.env.local (NOT committed to GitHub)
↓
process.env.GEMINI_API_KEY (server-side only)
↓
Never exposed to browser
```

---

## 📊 Performance Optimizations

### 1. Efficient Re-renders
```typescript
const [messages, setMessages] = useState<Message[]>([])
```
Only messages array changes → Only message list re-renders → Header/input don't re-render

### 2. Auto-scroll Optimization
```typescript
useEffect(scrollToBottom, [messages])
```
Only runs when messages change → Not on every render

### 3. Session Cleanup
```typescript
setInterval(() => { /* cleanup */ }, 30 * 60 * 1000)
```
Prevents memory from growing infinitely

### 4. Gemini Model Choice
```typescript
model: 'gemini-1.5-flash'
```
Faster and cheaper than gemini-pro → Better for hackathon

---

## 🐛 Error Handling

### Frontend Errors:
```typescript
try {
  const res = await fetch('/api/chat', ...)
  const data = await res.json()
} catch (error) {
  // Show error message to user
  setMessages(prev => [...prev, {
    role: 'ai',
    content: 'Sorry, something went wrong.'
  }])
}
```

### Backend Errors:
```typescript
try {
  const response = await getGeminiResponse(...)
} catch (error) {
  if (error.message?.includes('429')) {
    return 'Too many requests. Wait a moment.'
  }
  if (error.message?.includes('SAFETY')) {
    return 'Message blocked for safety.'
  }
  return 'Failed to get AI response.'
}
```

---

## 🔄 Complete Request/Response Cycle

```
┌─────────────┐
│   Browser   │
│  (Frontend) │
└──────┬──────┘
       │ 1. User types message
       │ 2. Click Send
       ↓
┌──────────────┐
│  page.tsx    │
│  sendMessage │
└──────┬───────┘
       │ 3. fetch('/api/chat')
       ↓
┌──────────────┐
│  route.ts    │
│  POST handler│
└──────┬───────┘
       │ 4. Get/create session
       ↓
┌──────────────────┐
│ emergency-       │
│ detector.ts      │
└──────┬───────────┘
       │ 5. Check emergency
       ↓
┌──────────────────┐
│ adaptive-ai.ts   │
│ buildPrompt()    │
└──────┬───────────┘
       │ 6. Build context
       ↓
┌──────────────────┐
│ gemini.ts        │
│ getGeminiResponse│
└──────┬───────────┘
       │ 7. Call Google API
       ↓
┌──────────────────┐
│ Google Gemini    │
│ API              │
└──────┬───────────┘
       │ 8. AI response
       ↓
┌──────────────────┐
│ route.ts         │
│ Return JSON      │
└──────┬───────────┘
       │ 9. Send to frontend
       ↓
┌──────────────────┐
│ page.tsx         │
│ Update messages  │
└──────┬───────────┘
       │ 10. React re-renders
       ↓
┌──────────────────┐
│ Browser          │
│ Shows AI message │
└──────────────────┘
```

---

## 🎓 Key Concepts Explained

### React State
```typescript
const [messages, setMessages] = useState<Message[]>([])
```
- `messages` = current value
- `setMessages` = function to update value
- When updated → React re-renders component

### React useEffect
```typescript
useEffect(() => { /* code */ }, [dependency])
```
- Runs code when dependency changes
- Used for side effects (scroll, API calls, etc.)

### TypeScript Types
```typescript
type Message = {
  role: 'user' | 'ai'
  content: string
  isEmergency?: boolean
}
```
- Defines shape of data
- Prevents bugs
- Better autocomplete

### Async/Await
```typescript
const response = await getGeminiResponse(...)
```
- Waits for promise to resolve
- Makes async code look synchronous
- Easier to read than .then()

### Map Data Structure
```typescript
const sessions = new Map<string, AdaptiveAI>()
```
- Key-value pairs
- Fast lookups
- Better than object for dynamic keys

---

## 🚀 Deployment Process

### Local Development:
```
npm run dev → Next.js dev server → http://localhost:3000
```

### Production Deployment:
```
1. Push to GitHub
2. Vercel imports repo
3. Vercel builds: npm run build
4. Vercel deploys to CDN
5. Live at: healthai-nigeria.vercel.app
```

### Environment Variables:
```
Local: .env.local file
Production: Vercel dashboard → Settings → Environment Variables
```

---

## 📈 Scalability Considerations

### Current Limitations:
- Sessions stored in memory (lost on server restart)
- No persistent storage
- Single server instance

### For Production (Future):
- Use Redis for session storage
- Add database for conversation logs (with consent)
- Load balancer for multiple servers
- Rate limiting per user
- Caching for common queries

---

## 🎯 Success Metrics

### Technical Success:
- ✅ Chat sends/receives messages
- ✅ AI responds in <3 seconds
- ✅ Emergency detection works
- ✅ Pidgin language works
- ✅ Context memory works
- ✅ No crashes or errors

### User Experience Success:
- ✅ Easy to use
- ✅ Helpful responses
- ✅ Fast and responsive
- ✅ Works on mobile
- ✅ Clear emergency guidance

---

## 🔍 Debugging Tips

### Frontend Issues:
```
1. Open browser console (F12)
2. Check for errors
3. Look at Network tab for API calls
4. Use console.log() to debug
```

### Backend Issues:
```
1. Check terminal for errors
2. Add console.log() in route.ts
3. Verify .env.local exists
4. Test API with Postman
```

### Common Fixes:
```
- "Module not found" → npm install
- "API key not set" → Check .env.local
- "429 error" → Wait 1 minute (rate limit)
- "CORS error" → Restart dev server
```

---

**This document explains EVERYTHING about how HealthAI works, from user click to AI response!**
