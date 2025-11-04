# Hackathon Build Guide - Adaptive AI Chat

## 🎯 Goal
Build an **adaptive AI chat** (not a simple recommender) that understands context, learns within conversations, and provides intelligent health guidance.

## 📁 File Structure to Create

```
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # API endpoint for chat
│   └── chat/
│       └── page.tsx               # Chat UI (already exists)
├── lib/
│   ├── gemini.ts                  # Gemini AI setup
│   ├── adaptive-ai.ts             # Adaptive logic layer
│   └── emergency-detector.ts      # Emergency detection
└── types/
    └── chat.ts                    # TypeScript types
```

## 🚀 Step-by-Step Build Order

### Step 1: Setup Gemini API (10 mins)
**File:** `src/lib/gemini.ts`

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set')
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function getGeminiResponse(systemPrompt: string, userMessage: string) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_NONE'
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_NONE'
        }
      ]
    })
    
    const fullPrompt = `${systemPrompt}\n\nUser: ${userMessage}`
    const result = await model.generateContent(fullPrompt)
    
    if (!result.response) {
      throw new Error('No response from Gemini')
    }
    
    return result.response.text()
  } catch (error: any) {
    console.error('Gemini API error:', error)
    
    // Handle rate limiting
    if (error.message?.includes('429')) {
      throw new Error('Too many requests. Please wait a moment.')
    }
    
    // Handle safety blocks
    if (error.message?.includes('SAFETY')) {
      throw new Error('Message blocked for safety reasons.')
    }
    
    throw new Error('Failed to get AI response. Please try again.')
  }
}
```

### Step 2: Adaptive AI Layer (30 mins)
**File:** `src/lib/adaptive-ai.ts`

This is what makes it NOT a recommender - it adapts based on conversation context.

```typescript
export class AdaptiveAI {
  private conversationContext: string[] = []
  private userProfile: {
    language: 'english' | 'pidgin'
    symptoms: string[]
    urgencyLevel: number
  }

  constructor() {
    this.userProfile = {
      language: 'english',
      symptoms: [],
      urgencyLevel: 0
    }
  }

  // Learns from conversation
  addToContext(message: string, isUser: boolean) {
    this.conversationContext.push(`${isUser ? 'User' : 'AI'}: ${message}`)
    
    // Adapt language detection
    if (isUser && this.detectPidgin(message)) {
      this.userProfile.language = 'pidgin'
    }
    
    // Extract symptoms
    const symptoms = this.extractSymptoms(message)
    this.userProfile.symptoms.push(...symptoms)
  }

  // Build adaptive prompt
  buildPrompt(userMessage: string): string {
    const recentHistory = this.conversationContext.slice(-6).join('\n')
    const symptomsContext = this.userProfile.symptoms.length > 0 
      ? `Previous symptoms mentioned: ${this.userProfile.symptoms.join(', ')}.` 
      : ''
    
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

  private detectPidgin(text: string): boolean {
    const pidginWords = ['wetin', 'dey', 'abeg', 'oga', 'wahala', 'no', 'fit']
    return pidginWords.some(word => text.toLowerCase().includes(word))
  }

  private extractSymptoms(text: string): string[] {
    const symptoms = ['headache', 'fever', 'cough', 'pain', 'bleeding', 'vomiting']
    return symptoms.filter(s => text.toLowerCase().includes(s))
  }

  getContext() {
    return this.conversationContext
  }
}
```

### Step 3: Emergency Detector (20 mins)
**File:** `src/lib/emergency-detector.ts`

```typescript
export function detectEmergency(message: string): {
  isEmergency: boolean
  reason?: string
} {
  const emergencyKeywords = [
    'chest pain', 'can\'t breathe', 'severe bleeding', 'unconscious',
    'seizure', 'stroke', 'heart attack', 'suicide', 'overdose'
  ]

  const lowerMessage = message.toLowerCase()
  
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

export function getEmergencyResponse(): string {
  return `🚨 EMERGENCY DETECTED

This requires immediate medical attention!

1. Call 112 (Nigeria Emergency Line) NOW
2. Go to the nearest hospital immediately
3. Do not wait for symptoms to worsen

Would you like me to show you nearby hospitals?`
}
```

### Step 4: API Route (20 mins)
**File:** `src/app/api/chat/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getGeminiResponse } from '@/lib/gemini'
import { AdaptiveAI } from '@/lib/adaptive-ai'
import { detectEmergency, getEmergencyResponse } from '@/lib/emergency-detector'

// Store sessions in memory (no database needed)
const sessions = new Map<string, AdaptiveAI>()

// Clean up old sessions every 30 minutes
setInterval(() => {
  if (sessions.size > 100) {
    const entries = Array.from(sessions.entries())
    const toDelete = entries.slice(0, 50)
    toDelete.forEach(([key]) => sessions.delete(key))
    console.log(`Cleaned up ${toDelete.length} old sessions`)
  }
}, 30 * 60 * 1000)

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId } = await req.json()

    // Get or create adaptive AI session
    let ai = sessions.get(sessionId)
    if (!ai) {
      ai = new AdaptiveAI()
      sessions.set(sessionId, ai)
    }

    // Check for emergency
    const emergency = detectEmergency(message)
    if (emergency.isEmergency) {
      return NextResponse.json({
        response: getEmergencyResponse(),
        isEmergency: true
      })
    }

    // Add user message to context
    ai.addToContext(message, true)

    // Build adaptive prompt
    const systemPrompt = ai.buildPrompt(message)

    // Get AI response
    const response = await getGeminiResponse(systemPrompt, message)

    // Add AI response to context
    ai.addToContext(response, false)

    return NextResponse.json({
      response,
      isEmergency: false
    })

  } catch (error: any) {
    console.error('Chat error:', error)
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

### Step 5: Chat UI (40 mins)
**File:** `src/app/chat/page.tsx` (replace existing)

```typescript
'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

type Message = {
  role: 'user' | 'ai'
  content: string
  isEmergency?: boolean
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'Wetin dey worry you? Tell me your symptoms.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId] = useState(() => Math.random().toString(36))
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(scrollToBottom, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, sessionId })
      })

      const data = await res.json()
      
      setMessages(prev => [...prev, {
        role: 'ai',
        content: data.response,
        isEmergency: data.isEmergency
      }])
    } catch (error) {
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
          <Link href="/" className="text-sm text-gray-400 hover:text-white">
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
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600" />
              <div className="bg-white/5 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
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
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-green-500/50"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
```

## ⏱️ Time Breakdown (2 hours total)

1. **Setup Gemini** (10 mins) - Victor
2. **Adaptive AI Layer** (30 mins) - Mayor + Victor
3. **Emergency Detector** (20 mins) - Victor
4. **API Route** (20 mins) - Mayor + Victor
5. **Chat UI** (40 mins) - Mayor + Comfort

## 🎯 What Makes This "Adaptive" Not "Recommender"

1. **Context Memory** - Remembers conversation, adapts responses
2. **Language Detection** - Switches to Pidgin automatically
3. **Symptom Tracking** - Builds profile during conversation
4. **Follow-up Questions** - Based on previous answers
5. **Session Learning** - Gets smarter within conversation

## 🚨 Testing Checklist

- [ ] Chat sends/receives messages
- [ ] Emergency detection works (try "chest pain")
- [ ] Pidgin detection works (try "wetin dey worry me")
- [ ] Context memory works (ask follow-up questions)
- [ ] UI is responsive on mobile

## 📝 Notes

- No database needed - sessions stored in memory
- Privacy-safe - no permanent storage
- Can handle multiple users (different sessionIds)
- Gemini API key must be in `.env.local`
