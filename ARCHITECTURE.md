# HealthAI Nigeria - System Architecture

## 📁 Project Structure

```
healthai-nigeria/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/chat/route.ts    # AI Chat API endpoint
│   │   ├── chat/page.tsx        # Chat interface
│   │   ├── page.tsx             # Landing page
│   │   ├── layout.tsx           # Root layout
│   │   └── globals.css          # Global styles
│   │
│   ├── components/              # Reusable UI components
│   │   └── LocationRequest.tsx  # GPS/Manual location picker
│   │
│   ├── lib/                     # Core business logic
│   │   ├── hospital-recommender.ts  # Hospital matching algorithm
│   │   ├── response-filter.ts       # AI safety filters
│   │   ├── offline-emergency.ts     # Emergency fallback
│   │   ├── follow-up-handler.ts     # Conversation context
│   │   └── geolocation.ts           # Distance calculations
│   │
│   └── types/                   # TypeScript definitions
│       └── chat.ts              # Message types
│
├── docs/                        # Documentation
│   ├── COMPLETE_GUIDE.md       # Full guide
│   ├── TECHNICAL_DETAILS.md    # Tech specs
│   └── QUICK_START.md          # Setup guide
│
├── public/                      # Static assets
│   └── team/                    # Team photos
│
└── Configuration files
    ├── .env.local              # API keys (not in git)
    ├── .env.example            # Template
    ├── package.json            # Dependencies
    ├── tsconfig.json           # TypeScript config
    └── next.config.ts          # Next.js config
```

## 🔄 System Flow

### **1. User Request Flow**
```
User Input → Chat Page → API Route → AI Processing → Response
                ↓                          ↓
         Session Storage          Safety Filters
                                        ↓
                                  Hospital Matching
                                        ↓
                                  Emergency Detection
```

### **2. AI Processing Pipeline**
```
1. Receive Message
   ↓
2. Load Conversation History (last 8 messages)
   ↓
3. Detect Emergency Type
   ├─ cardiac → Heart-related
   ├─ trauma → Injuries/bleeding
   ├─ pediatric → Child emergencies
   └─ general → Other emergencies
   ↓
4. Generate AI Response
   ├─ Try: gemini-2.0-flash-lite
   ├─ Fallback: gemini-2.0-flash
   └─ Emergency Fallback: Pre-written responses
   ↓
5. Apply Safety Filters
   ├─ Block dangerous advice
   ├─ Add disclaimers
   ├─ Fix grammar
   └─ Ensure 112 contact
   ↓
6. Match Hospitals (if needed)
   ├─ Filter by emergency type
   ├─ Filter by location
   ├─ Sort by distance (if GPS)
   └─ Return top 3
   ↓
7. Return Response + Hospitals
```

### **3. Location Request Flow**
```
User asks for hospitals
   ↓
No location provided?
   ↓
Show LocationRequest Component
   ├─ GPS Option → navigator.geolocation
   │   ↓
   │   Get lat/lon → Find nearest hospitals
   │
   └─ Manual Option → User types city
       ↓
       Match city name → Filter hospitals
```

## 🛡️ Safety Architecture

### **Layer 1: Response Filtering**
```typescript
// Blocks dangerous patterns
const dangerousPatterns = [
  "you definitely have",
  "don't see a doctor",
  "no need to visit"
]

// Adds safety disclaimers
if (!response.includes("see a doctor")) {
  response += "\n\nPlease see a doctor for proper diagnosis."
}
```

### **Layer 2: Emergency Detection**
```typescript
// Detects critical symptoms
if (message.includes("chest pain")) {
  return {
    isEmergency: true,
    emergencyType: "cardiac",
    hospitals: getNearestCardiacHospitals()
  }
}
```

### **Layer 3: Fallback System**
```typescript
// If AI fails during emergency
if (aiError && isEmergency) {
  return preWrittenEmergencyResponse(emergencyType, language)
}
```

## 🏥 Hospital Matching Algorithm

```typescript
function recommendHospitals(
  emergencyType: 'cardiac' | 'trauma' | 'general',
  userLat?: number,
  userLon?: number,
  locationQuery?: string
) {
  // Step 1: Filter by specialty
  let hospitals = ALL_HOSPITALS.filter(h => 
    h.specialties.includes(emergencyType)
  )
  
  // Step 2: Filter by location (if provided)
  if (locationQuery) {
    hospitals = hospitals.filter(h =>
      h.address.includes(locationQuery)
    )
  }
  
  // Step 3: Sort by distance (if GPS)
  if (userLat && userLon) {
    hospitals = hospitals
      .map(h => ({
        ...h,
        distance: calculateDistance(userLat, userLon, h.lat, h.lon)
      }))
      .sort((a, b) => a.distance - b.distance)
  }
  
  // Step 4: Return top 3
  return hospitals.slice(0, 3)
}
```

## 🌍 Location Mapping

```typescript
// Maps local areas to main cities
const locationMap = {
  'umudike': 'umuahia',
  'aba': 'aba',
  'ohafia': 'aba',
  'bende': 'umuahia',
  // ... all Abia LGAs
}

// Extracts location from message
function extractLocation(message: string) {
  const cities = ['lagos', 'abuja', 'umuahia', 'aba', ...]
  
  for (const city of cities) {
    if (message.includes(city)) {
      return locationMap[city] || city
    }
  }
  
  return null
}
```

## 💾 Data Storage

### **Session Storage (Client-Side)**
```typescript
// Stores in browser
sessionStorage.setItem('healthai-messages', JSON.stringify(messages))
sessionStorage.setItem('healthai-language', language)
sessionStorage.setItem('healthai-terms-accepted', 'true')

// Persists during session only
// Cleared when browser closes
```

### **No Server Storage**
- No database
- No user accounts
- No conversation logs
- Privacy-first approach

## 🔌 API Integration

### **Google Gemini API**
```typescript
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const model = genAI.getGenerativeModel({ 
  model: 'gemini-2.0-flash-lite',
  generationConfig: {
    temperature: 0.7,  // Balanced creativity
    topP: 0.8,         // Focused responses
    topK: 40,          // Diverse vocabulary
  }
})

const result = await model.generateContent(prompt)
```

### **Rate Limits**
- Free tier: 15 requests/minute
- Handles gracefully with fallbacks
- Shows error message if exceeded

## 🎨 UI/UX Architecture

### **Design System**
```css
/* Color Palette */
--bg-primary: #000000      /* Black background */
--bg-secondary: #18181b    /* Zinc-900 */
--accent: #16a34a          /* Green-600 */
--text-primary: #ffffff    /* White */
--text-secondary: #9ca3af  /* Gray-400 */
--border: rgba(255,255,255,0.1)

/* Spacing Scale */
--space-xs: 0.5rem   /* 8px */
--space-sm: 0.75rem  /* 12px */
--space-md: 1rem     /* 16px */
--space-lg: 1.5rem   /* 24px */
--space-xl: 2rem     /* 32px */
```

### **Component Hierarchy**
```
ChatPage
├── Header (sticky)
│   ├── Logo
│   ├── Status Indicator
│   └── Back Button
│
├── Messages (scrollable)
│   ├── AI Message
│   │   ├── Avatar
│   │   ├── Content (Markdown)
│   │   ├── Hospital Cards (if any)
│   │   └── Actions (Reply, Copy)
│   │
│   ├── User Message
│   │   ├── Content
│   │   └── Edit Button
│   │
│   └── Location Request (if needed)
│       ├── GPS Button
│       ├── Manual Input
│       └── Cancel
│
└── Input Bar (fixed bottom)
    ├── Language Toggle
    ├── Text Input
    └── Send/Stop Button
```

## 🔐 Security Measures

### **Environment Variables**
```bash
# Never committed to git
GEMINI_API_KEY=your_secret_key

# Template in .env.example
GEMINI_API_KEY=get_from_https://ai.google.dev
```

### **Input Validation**
```typescript
// Sanitize user input
if (!message || typeof message !== 'string') {
  return error('Invalid message')
}

// Limit message length
if (message.length > 1000) {
  return error('Message too long')
}
```

### **API Protection**
```typescript
// Server-side only
export async function POST(req: NextRequest) {
  // API key never exposed to client
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  // ...
}
```

## 📊 Performance Optimizations

### **Code Splitting**
- Automatic by Next.js
- Each page loads only needed code
- Faster initial load

### **Image Optimization**
- Next.js Image component
- Automatic WebP conversion
- Lazy loading

### **Caching Strategy**
```typescript
// Session storage for messages
// No server caching (privacy)
// Static assets cached by CDN
```

## 🚀 Deployment Architecture

```
GitHub Repository
    ↓
Vercel Platform
    ↓
Build Process
    ├─ Install dependencies
    ├─ TypeScript compilation
    ├─ Next.js build
    └─ Optimize assets
    ↓
Deploy to Edge Network
    ├─ Global CDN
    ├─ Automatic HTTPS
    └─ Environment variables
    ↓
Live at: healthai-nigeria.vercel.app
```

## 🔄 State Management

### **React State**
```typescript
// Local component state
const [messages, setMessages] = useState<Message[]>([])
const [loading, setLoading] = useState(false)
const [language, setLanguage] = useState('auto')

// Persisted to sessionStorage
useEffect(() => {
  sessionStorage.setItem('messages', JSON.stringify(messages))
}, [messages])
```

### **No Global State**
- No Redux/Zustand needed
- Simple useState + useEffect
- Session storage for persistence

## 📱 Responsive Design

```typescript
// Mobile-first breakpoints
sm: '640px'   // Small tablets
md: '768px'   // Tablets
lg: '1024px'  // Laptops
xl: '1280px'  // Desktops

// Adaptive UI
<div className="text-sm sm:text-base md:text-lg">
  {/* Scales with screen size */}
</div>
```

## 🧪 Error Handling

```typescript
try {
  // AI request
  const response = await fetch('/api/chat', {...})
  const data = await response.json()
} catch (error) {
  if (error.name === 'AbortError') {
    // User stopped response
    return
  }
  
  // Network error
  showErrorMessage("Connection failed. Please try again.")
}
```

## 📈 Scalability Considerations

### **Current Limits**
- 15 requests/minute (free API)
- No database (session storage only)
- Single region deployment

### **To Scale to 1M Users**
```
1. Upgrade to paid Gemini API ($$$)
2. Add Redis for caching
3. Implement rate limiting per user
4. Multi-region deployment
5. Load balancing
6. Database for analytics (optional)
```

---

## 🎯 Key Takeaways

1. **Clean Separation**: UI → API → Business Logic → AI
2. **Safety First**: Multiple layers of protection
3. **Privacy Focused**: No data storage
4. **Scalable Design**: Easy to upgrade components
5. **Production Ready**: Proper error handling, fallbacks, security

This architecture is **solid, maintainable, and ready for demo**.
