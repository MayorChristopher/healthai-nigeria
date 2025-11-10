# Backend Implementation Guide (For You to Code)

## 1. Create API Route: `/api/chat/route.ts`

### File Location
```
src/app/api/chat/route.ts
```

### What This Does
Handles chat requests, calls Gemini API, detects emergencies, recommends hospitals.

### Step-by-Step Implementation

#### Step 1: Create the file structure
```bash
mkdir src\app\api
mkdir src\app\api\chat
```

#### Step 2: Install Gemini SDK
```bash
npm install @google/generative-ai
```

#### Step 3: Add environment variable
Create `.env.local`:
```
GEMINI_API_KEY=your_key_here
```

#### Step 4: Basic Route Structure
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
  try {
    // 1. Get message from request
    const { message, sessionId } = await request.json()
    
    // 2. Validate input
    if (!message || message.length > 500) {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 })
    }
    
    // 3. Call Gemini API
    // 4. Detect emergency
    // 5. Recommend hospitals
    // 6. Return response
    
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
```

#### Step 5: Gemini API Integration
```typescript
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

const prompt = `You are a medical assistant for rural Nigeria. 
User symptoms: ${message}

Provide:
1. Brief explanation of possible causes
2. Severity level (mild/moderate/severe)
3. Immediate actions to take
4. When to see a doctor

Be conservative. Always recommend seeing a doctor for serious symptoms.
Respond in simple English or Nigerian Pidgin if user uses Pidgin.`

const result = await model.generateContent(prompt)
const response = result.response.text()
```

#### Step 6: Emergency Detection Logic
```typescript
function detectEmergency(message: string, aiResponse: string): boolean {
  const emergencyKeywords = [
    'chest pain', 'difficulty breathing', 'severe bleeding',
    'unconscious', 'seizure', 'stroke', 'heart attack',
    'suicide', 'overdose', 'severe burn', 'broken bone',
    'head injury', 'poisoning', 'allergic reaction'
  ]
  
  const combined = (message + ' ' + aiResponse).toLowerCase()
  
  return emergencyKeywords.some(keyword => combined.includes(keyword))
}
```

#### Step 7: Hospital Recommendation
```typescript
function recommendHospitals(isEmergency: boolean) {
  // Import from lib/hospital-recommender.ts
  const hospitals = [
    {
      name: "University College Hospital (UCH)",
      phone: "+234 2 241 3545",
      address: "Queen Elizabeth Road, Ibadan, Oyo State",
      coords: "7.3775,3.9470"
    },
    // Add more hospitals
  ]
  
  // Return top 3 if emergency, top 1 otherwise
  return isEmergency ? hospitals.slice(0, 3) : hospitals.slice(0, 1)
}
```

#### Step 8: Complete Response
```typescript
return NextResponse.json({
  response: aiResponse,
  isEmergency: isEmergency,
  hospitals: hospitals,
  onlineDoctors: !isEmergency,
  timestamp: new Date().toISOString()
})
```

---

## 2. Response Validation Layer

### File: `src/lib/response-validator.ts`

### Purpose
Check Gemini responses for dangerous advice before showing to users.

### Implementation Steps

```typescript
export function validateResponse(response: string): {
  isValid: boolean
  warnings: string[]
  shouldBlock: boolean
} {
  const warnings: string[] = []
  let shouldBlock = false
  
  // Check 1: No diagnosis claims
  const diagnosisWords = ['you have', 'you are diagnosed', 'this is definitely']
  if (diagnosisWords.some(word => response.toLowerCase().includes(word))) {
    warnings.push('Response contains diagnosis language')
  }
  
  // Check 2: No medication recommendations without disclaimer
  const medicationWords = ['take this drug', 'use this medication', 'prescription']
  if (medicationWords.some(word => response.toLowerCase().includes(word))) {
    if (!response.includes('consult a doctor')) {
      warnings.push('Medication mentioned without doctor consultation')
      shouldBlock = true
    }
  }
  
  // Check 3: Emergency symptoms must recommend hospital
  const emergencySymptoms = ['chest pain', 'difficulty breathing', 'severe bleeding']
  const hasEmergency = emergencySymptoms.some(s => response.toLowerCase().includes(s))
  const recommendsHospital = response.toLowerCase().includes('hospital') || 
                             response.toLowerCase().includes('emergency')
  
  if (hasEmergency && !recommendsHospital) {
    warnings.push('Emergency symptom without hospital recommendation')
    shouldBlock = true
  }
  
  return {
    isValid: !shouldBlock,
    warnings,
    shouldBlock
  }
}
```

### How to Use
```typescript
// In your API route
const validation = validateResponse(aiResponse)

if (validation.shouldBlock) {
  return NextResponse.json({
    response: "I'm not confident about this response. Please call 112 or visit a hospital immediately.",
    isEmergency: true,
    hospitals: getAllHospitals()
  })
}
```

---

## 3. Usage Analytics

### File: `src/lib/analytics.ts`

### Purpose
Track usage without storing personal data.

### Implementation (Simple Version)

```typescript
// Store in memory (resets on server restart)
let stats = {
  totalChats: 0,
  emergenciesDetected: 0,
  hospitalsRecommended: 0,
  lastReset: new Date()
}

export function trackChat(isEmergency: boolean, hospitalsCount: number) {
  stats.totalChats++
  if (isEmergency) stats.emergenciesDetected++
  if (hospitalsCount > 0) stats.hospitalsRecommended++
}

export function getStats() {
  return stats
}
```

### API Route: `/api/stats/route.ts`
```typescript
import { NextResponse } from 'next/server'
import { getStats } from '@/lib/analytics'

export async function GET() {
  return NextResponse.json(getStats())
}
```

### Display on Homepage
```typescript
// In page.tsx
const [stats, setStats] = useState(null)

useEffect(() => {
  fetch('/api/stats')
    .then(r => r.json())
    .then(setStats)
}, [])

// Show: "Helped {stats.totalChats} users, detected {stats.emergenciesDetected} emergencies"
```

---

## 4. Rate Limiting

### File: `src/lib/rate-limiter.ts`

### Purpose
Prevent API abuse and control costs.

### Implementation

```typescript
const rateLimits = new Map<string, { count: number, resetTime: number }>()

export function checkRateLimit(sessionId: string): boolean {
  const now = Date.now()
  const limit = rateLimits.get(sessionId)
  
  // 10 requests per hour
  const MAX_REQUESTS = 10
  const WINDOW = 60 * 60 * 1000 // 1 hour
  
  if (!limit || now > limit.resetTime) {
    rateLimits.set(sessionId, { count: 1, resetTime: now + WINDOW })
    return true
  }
  
  if (limit.count >= MAX_REQUESTS) {
    return false
  }
  
  limit.count++
  return true
}
```

### Use in API Route
```typescript
if (!checkRateLimit(sessionId)) {
  return NextResponse.json(
    { error: 'Too many requests. Please wait before trying again.' },
    { status: 429 }
  )
}
```

---

## 5. Error Handling

### Best Practices

```typescript
try {
  // API call
} catch (error) {
  console.error('Gemini API error:', error)
  
  // Check error type
  if (error.message.includes('quota')) {
    return NextResponse.json({
      response: "We're experiencing high traffic. Please try again in a few minutes.",
      isEmergency: false
    })
  }
  
  if (error.message.includes('network')) {
    return NextResponse.json({
      response: "Connection issue. Please check your internet and try again.",
      isEmergency: false
    })
  }
  
  // Generic error
  return NextResponse.json({
    response: "Something went wrong. For emergencies, call 112 immediately.",
    isEmergency: false
  }, { status: 500 })
}
```

---

## Testing Checklist

### Manual Tests
- [ ] Send normal symptom (headache)
- [ ] Send emergency symptom (chest pain)
- [ ] Send Pidgin message
- [ ] Send very long message (>500 chars)
- [ ] Send empty message
- [ ] Send 11 messages in a row (rate limit)
- [ ] Disconnect internet and send message
- [ ] Send message with invalid API key

### Expected Behaviors
- Normal: Get advice + 1 hospital
- Emergency: Get urgent advice + 3 hospitals + emergency flag
- Pidgin: Response in Pidgin
- Long message: Error 400
- Empty: Error 400
- Rate limit: Error 429
- No internet: Error message
- Invalid key: Error 500

---

## Deployment Checklist

- [ ] Add GEMINI_API_KEY to Vercel environment variables
- [ ] Test API route locally first
- [ ] Deploy to Vercel
- [ ] Test production API
- [ ] Monitor Gemini API usage/costs
- [ ] Set up error logging

---

## Cost Management

### Gemini API Pricing
- Free tier: 60 requests/minute
- After free tier: ~$0.00025 per request

### Estimated Costs
- 1,000 users/day = ~$0.25/day = ~$7.50/month
- 10,000 users/day = ~$2.50/day = ~$75/month

### Cost Reduction Strategies
1. Cache common responses
2. Rate limiting (already implemented)
3. Use shorter prompts
4. Implement response templates for common symptoms

---

## Next Steps

1. Create `src/app/api/chat/route.ts`
2. Implement basic Gemini integration
3. Test with Postman or curl
4. Add emergency detection
5. Add validation layer
6. Add rate limiting
7. Deploy and test

**Practice explaining each part. Judges will ask "how does this work?"**
