# 🏥 HealthAI Nigeria - Hackathon Build Guide

## 🎯 What We're Building

An **adaptive AI medical assistant** that:
- Understands context (remembers what you said before)
- Learns your language preference (English or Pidgin)
- Detects emergencies automatically
- Gets smarter during the conversation
- **NOT** a simple recommender that just matches symptoms to responses

---

## 🔑 STEP 0: Get Gemini API Key (DO THIS FIRST!)

**⏰ Time: 5 minutes | 👤 Who: Mayor (then share with team)**

### Why We Need This:
Google Gemini is the AI brain that powers our chat. Without this key, the chat won't work.

### How to Get It:

1. **Visit:** https://aistudio.google.com/app/apikey
2. **Sign in** with any Google account (Gmail)
3. **Click** "Create API Key" → "Create API key in new project"
4. **Copy** the key (looks like `AIzaSyD...`)
5. **In your project folder**, create a file named `.env.local`
6. **Paste this inside:**
   ```
   GEMINI_API_KEY=AIzaSyD_your_actual_key_here
   ```
7. **Save** and close

### ✅ Test It Works:
```bash
npm run dev
```
If no errors about GEMINI_API_KEY appear, you're good!

### 📤 Share with Team:
Send the API key to Victor and Comfort via WhatsApp/email so they can test locally.

**Important:** 
- Free tier = 15 requests/min, 1500/day (enough for hackathon)
- No credit card needed
- Keep it secret (don't post on GitHub)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          ← Backend API (Mayor + Victor)
│   └── chat/
│       └── page.tsx               ← Chat UI (Mayor + Comfort)
├── lib/
│   ├── gemini.ts                  ← AI setup (Victor)
│   ├── adaptive-ai.ts             ← Smart logic (Mayor + Victor)
│   └── emergency-detector.ts      ← Emergency detection (Victor)
```

---

## 👥 Team Roles & Tasks

### 🟢 Mayor Christopher - Full Stack Developer

**Your Tasks:**
1. ✅ Landing page (DONE)
2. Chat UI (Step 5) - 40 mins
3. Help Victor with backend (Steps 2, 4) - 30 mins
4. Deploy to Vercel - 10 mins

**Skills Needed:**
- React/Next.js (you already know this from landing page)
- TypeScript basics
- API calls with fetch

---

### 🔵 Victor - Backend Developer

**Your Tasks:**
1. Gemini API setup (Step 1) - 10 mins
2. Adaptive AI logic (Step 2) - 30 mins with Mayor
3. Emergency detector (Step 3) - 20 mins
4. API route (Step 4) - 20 mins with Mayor

**Skills Needed:**
- TypeScript/JavaScript
- Understanding APIs
- Basic logic (if/else, loops)

**What You'll Learn:**
- How to use Google Gemini API
- How to build "smart" AI (not just pattern matching)
- How to handle sessions without a database

---

### 🟣 Comfort - Documentation & Frontend

**Your Tasks:**
1. Help Mayor with Chat UI styling (Step 5) - 20 mins
2. Test the chat thoroughly - 20 mins
3. Write project documentation - 30 mins
4. Create user guide/README updates - 20 mins

**Skills Needed:**
- Basic HTML/CSS understanding
- Attention to detail
- Good writing skills

**What You'll Learn:**
- React components basics
- Tailwind CSS styling
- How to test AI applications

---

## 🚀 Build Steps (2 Hours Total)

### STEP 1: Setup Gemini API (10 mins)
**👤 Who: Victor**

**What This Does:** Connects our app to Google's AI

**Create file:** `src/lib/gemini.ts`

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'

// Check if API key exists
if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set')
}

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// Function to get AI response
export async function getGeminiResponse(systemPrompt: string, userMessage: string) {
  try {
    // Create model with settings
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash', // Fast and free
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_NONE' // Allow medical content
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_NONE'
        }
      ]
    })
    
    // Combine system instructions with user message
    const fullPrompt = `${systemPrompt}\n\nUser: ${userMessage}`
    
    // Get AI response
    const result = await model.generateContent(fullPrompt)
    
    if (!result.response) {
      throw new Error('No response from Gemini')
    }
    
    return result.response.text()
    
  } catch (error: any) {
    console.error('Gemini API error:', error)
    
    // Handle different error types
    if (error.message?.includes('429')) {
      throw new Error('Too many requests. Please wait a moment.')
    }
    
    if (error.message?.includes('SAFETY')) {
      throw new Error('Message blocked for safety reasons.')
    }
    
    throw new Error('Failed to get AI response. Please try again.')
  }
}
```

**Victor's Checklist:**
- [ ] Create `src/lib/` folder if it doesn't exist
- [ ] Create `gemini.ts` file
- [ ] Copy code above
- [ ] Save file
- [ ] Test: Run `npm run dev` - should see no errors

---

### STEP 2: Adaptive AI Layer (30 mins)
**👤 Who: Mayor + Victor (pair programming)**

**What This Does:** Makes the AI "smart" - remembers conversation, detects language, tracks symptoms

**Why It's NOT a Recommender:**
- Recommender: "headache" → always same response
- Adaptive AI: Remembers you said "headache yesterday", asks "is it better today?"

**Create file:** `src/lib/adaptive-ai.ts`

```typescript
export class AdaptiveAI {
  // Store conversation history
  private conversationContext: string[] = []
  
  // Store user profile (learns during chat)
  private userProfile: {
    language: 'english' | 'pidgin'
    symptoms: string[]
    urgencyLevel: number
  }

  constructor() {
    // Start with defaults
    this.userProfile = {
      language: 'english',
      symptoms: [],
      urgencyLevel: 0
    }
  }

  // Add message to conversation memory
  addToContext(message: string, isUser: boolean) {
    this.conversationContext.push(`${isUser ? 'User' : 'AI'}: ${message}`)
    
    // Learn language preference
    if (isUser && this.detectPidgin(message)) {
      this.userProfile.language = 'pidgin'
    }
    
    // Extract and remember symptoms
    const symptoms = this.extractSymptoms(message)
    this.userProfile.symptoms.push(...symptoms)
  }

  // Build smart prompt for Gemini
  buildPrompt(userMessage: string): string {
    // Get last 6 messages for context
    const recentHistory = this.conversationContext.slice(-6).join('\n')
    
    // Build symptoms context
    const symptomsContext = this.userProfile.symptoms.length > 0 
      ? `Previous symptoms mentioned: ${this.userProfile.symptoms.join(', ')}.` 
      : ''
    
    // Create system prompt with context
    const systemPrompt = `You are HealthAI, a medical assistant for Nigerian communities.

Language: ${this.userProfile.language === 'pidgin' ? 'Respond in Nigerian Pidgin (e.g., "How you dey feel now?")' : 'Respond in clear English'}.

${symptomsContext}

Recent conversation:
${recentHistory}

IMPORTANT RULES:
1. Be warm and conversational, like talking to a friend
2. Ask ONE follow-up question based on what they just said
3. If you detect emergency symptoms (chest pain, can't breathe, severe bleeding), immediately tell them to call 112
4. NEVER diagnose conditions or prescribe medication
5. Suggest home remedies for minor issues (rest, hydration, paracetamol)
6. If unsure, recommend visiting a doctor
7. Keep responses short (2-3 sentences max)

Respond to this message naturally:`

    return systemPrompt
  }

  // Detect if user is speaking Pidgin
  private detectPidgin(text: string): boolean {
    const pidginWords = ['wetin', 'dey', 'abeg', 'oga', 'wahala', 'no', 'fit']
    return pidginWords.some(word => text.toLowerCase().includes(word))
  }

  // Extract symptoms from message
  private extractSymptoms(text: string): string[] {
    const symptoms = ['headache', 'fever', 'cough', 'pain', 'bleeding', 'vomiting', 'dizzy', 'nausea']
    return symptoms.filter(s => text.toLowerCase().includes(s))
  }

  // Get conversation history
  getContext() {
    return this.conversationContext
  }
}
```

**Team Checklist:**
- [ ] Mayor creates file structure
- [ ] Victor explains how AdaptiveAI class works
- [ ] Mayor types code while Victor reviews
- [ ] Both understand: detectPidgin(), extractSymptoms(), buildPrompt()
- [ ] Save file

---

### STEP 3: Emergency Detector (20 mins)
**👤 Who: Victor**

**What This Does:** Detects life-threatening symptoms and triggers immediate response

**Create file:** `src/lib/emergency-detector.ts`

```typescript
// Check if message contains emergency keywords
export function detectEmergency(message: string): {
  isEmergency: boolean
  reason?: string
} {
  const emergencyKeywords = [
    'chest pain', 'can\'t breathe', 'severe bleeding', 'unconscious',
    'seizure', 'stroke', 'heart attack', 'suicide', 'overdose',
    'not breathing', 'choking', 'severe burn'
  ]

  const lowerMessage = message.toLowerCase()
  
  // Check each keyword
  for (const keyword of emergencyKeywords) {
    if (lowerMessage.includes(keyword)) {
      return {
        isEmergency: true,
        reason: keyword
      }
    }
  }

  return { isEmergency: false }
}

// Get emergency response message
export function getEmergencyResponse(): string {
  return `🚨 EMERGENCY DETECTED

This requires immediate medical attention!

1. Call 112 (Nigeria Emergency Line) NOW
2. Go to the nearest hospital immediately
3. Do not wait for symptoms to worsen

Would you like me to show you nearby hospitals?`
}
```

**Victor's Checklist:**
- [ ] Create `emergency-detector.ts` file
- [ ] Copy code
- [ ] Add more emergency keywords if you think of any
- [ ] Save file

---

### STEP 4: API Route (20 mins)
**👤 Who: Mayor + Victor**

**What This Does:** Backend endpoint that receives messages, processes them, returns AI responses

**Create folder:** `src/app/api/chat/`
**Create file:** `src/app/api/chat/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getGeminiResponse } from '@/lib/gemini'
import { AdaptiveAI } from '@/lib/adaptive-ai'
import { detectEmergency, getEmergencyResponse } from '@/lib/emergency-detector'

// Store user sessions in memory (no database needed)
const sessions = new Map<string, AdaptiveAI>()

// Clean up old sessions every 30 minutes to prevent memory leak
setInterval(() => {
  if (sessions.size > 100) {
    const entries = Array.from(sessions.entries())
    const toDelete = entries.slice(0, 50)
    toDelete.forEach(([key]) => sessions.delete(key))
    console.log(`Cleaned up ${toDelete.length} old sessions`)
  }
}, 30 * 60 * 1000)

// Handle POST requests to /api/chat
export async function POST(req: NextRequest) {
  try {
    // Get message and sessionId from request
    const { message, sessionId } = await req.json()

    // Get or create AI session for this user
    let ai = sessions.get(sessionId)
    if (!ai) {
      ai = new AdaptiveAI()
      sessions.set(sessionId, ai)
    }

    // Check for emergency first
    const emergency = detectEmergency(message)
    if (emergency.isEmergency) {
      return NextResponse.json({
        response: getEmergencyResponse(),
        isEmergency: true
      })
    }

    // Add user message to conversation context
    ai.addToContext(message, true)

    // Build adaptive prompt with context
    const systemPrompt = ai.buildPrompt(message)

    // Get AI response from Gemini
    const response = await getGeminiResponse(systemPrompt, message)

    // Add AI response to conversation context
    ai.addToContext(response, false)

    // Return response to frontend
    return NextResponse.json({
      response,
      isEmergency: false
    })

  } catch (error: any) {
    console.error('Chat error:', error)
    
    // Return error message to user
    return NextResponse.json(
      { 
        response: error.message || 'Sorry, something went wrong. Please try again.',
        isEmergency: false 
      },
      { status: 200 } // Return 200 so frontend shows error message
    )
  }
}
```

**Team Checklist:**
- [ ] Mayor creates `src/app/api/chat/` folder
- [ ] Create `route.ts` file
- [ ] Victor explains the flow: receive → check emergency → get AI response → return
- [ ] Mayor types code
- [ ] Both understand: sessions Map, error handling
- [ ] Save file

---

### STEP 5: Chat UI (40 mins)
**👤 Who: Mayor + Comfort**

**What This Does:** The chat interface users see and interact with

**Replace file:** `src/app/chat/page.tsx`

```typescript
'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

// Message type definition
type Message = {
  role: 'user' | 'ai'
  content: string
  isEmergency?: boolean
}

export default function ChatPage() {
  // State management
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'Wetin dey worry you? Tell me your symptoms.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId] = useState(() => Math.random().toString(36)) // Unique session ID
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new message arrives
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(scrollToBottom, [messages])

  // Send message to backend
  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      // Call API
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, sessionId })
      })

      const data = await res.json()
      
      // Add AI response to messages
      setMessages(prev => [...prev, {
        role: 'ai',
        content: data.response,
        isEmergency: data.isEmergency
      }])
    } catch (error) {
      // Show error message
      setMessages(prev => [...prev, {
        role: 'ai',
        content: 'Sorry, something went wrong. Please try again.'
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-white/10 p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">HealthAI Chat</h1>
            <p className="text-xs text-gray-500">Adaptive AI • Not a recommender</p>
          </div>
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
            ← Home
          </Link>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
            >
              {msg.role === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex-shrink-0" />
              )}
              <div
                className={`rounded-2xl px-4 py-3 max-w-[80%] ${
                  msg.role === 'user'
                    ? 'bg-green-500/20 border border-green-500/30'
                    : msg.isEmergency
                    ? 'bg-red-500/20 border border-red-500/30'
                    : 'bg-white/5 border border-white/10'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-white/10 flex-shrink-0" />
              )}
            </div>
          ))}
          
          {/* Loading indicator */}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600" />
              <div className="bg-white/5 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}} />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-white/10 p-4">
        <div className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Describe your symptoms..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-green-500/50 transition-colors"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
```

**Mayor + Comfort Checklist:**
- [ ] Mayor explains React hooks: useState, useEffect, useRef
- [ ] Comfort helps with styling adjustments
- [ ] Test: Type message, click Send
- [ ] Test: Try "chest pain" (should show emergency)
- [ ] Test: Try "wetin dey worry me" (should respond in Pidgin)
- [ ] Comfort documents any bugs found

---

## ✅ Testing Checklist

**Everyone tests together:**

- [ ] Chat sends and receives messages
- [ ] Emergency detection works (try "chest pain")
- [ ] Pidgin detection works (try "wetin dey worry me")
- [ ] Context memory works (ask follow-up: "is it better?")
- [ ] UI looks good on mobile (use browser dev tools)
- [ ] Loading indicator shows while waiting
- [ ] Error messages display properly
- [ ] Multiple conversations work (open in 2 tabs)

---

## 📝 Comfort's Documentation Tasks

**After chat is working:**

1. **Update README.md** with:
   - How to use the chat
   - Example conversations
   - Troubleshooting section

2. **Create USER_GUIDE.md** with:
   - Screenshots of chat
   - Step-by-step usage
   - What to do in emergencies

3. **Document bugs/issues** in a file called `KNOWN_ISSUES.md`

4. **Test and document:**
   - What works well
   - What needs improvement
   - Edge cases found

---

## 🚀 Deployment (Mayor)

**After everything works locally:**

1. Push to GitHub:
   ```bash
   git add .
   git commit -m "Complete adaptive AI chat implementation"
   git push origin main
   ```

2. Deploy to Vercel:
   - Go to vercel.com
   - Import GitHub repo
   - Add environment variable: `GEMINI_API_KEY`
   - Click Deploy

3. Share live URL with team!

---

## 🎯 What Makes This "Adaptive" Not "Recommender"

| Feature | Recommender System | Our Adaptive AI |
|---------|-------------------|-----------------|
| Memory | None | Remembers conversation |
| Language | Fixed | Detects and adapts |
| Responses | Template-based | Context-aware |
| Learning | Static | Learns during session |
| Follow-ups | Generic | Based on previous answers |

---

## 💡 Tips for Success

**For Victor:**
- Test each file as you create it
- Use `console.log()` to debug
- Ask Mayor if stuck on TypeScript

**For Mayor:**
- Explain code to Comfort as you write
- Test API with Postman/Thunder Client first
- Keep UI simple, focus on functionality

**For Comfort:**
- Take notes while they code
- Ask questions when confused
- Test thoroughly - find bugs early!

**For Everyone:**
- Communicate constantly
- Help each other
- Don't panic if something breaks
- Google is your friend!

---

## 🆘 Common Issues & Solutions

**"GEMINI_API_KEY is not set"**
- Check `.env.local` file exists
- Restart dev server: `npm run dev`

**"429 error"**
- Hit rate limit, wait 1 minute
- Reduce testing frequency

**"Module not found"**
- Run `npm install`
- Check file paths are correct

**Chat not responding**
- Check browser console for errors
- Check terminal for backend errors
- Verify API key is valid

---

## 🏆 Success Criteria

You're done when:
- [ ] Chat sends/receives messages
- [ ] Emergency detection works
- [ ] Pidgin support works
- [ ] Context memory works
- [ ] Deployed to Vercel
- [ ] Documentation complete
- [ ] Team can explain how it works

**Good luck! You got this! 🚀**
