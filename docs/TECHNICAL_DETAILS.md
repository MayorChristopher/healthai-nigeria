# Technical Implementation Details

## 🏗️ **Architecture**

```
Frontend (Next.js 14)
├── Landing Page (responsive showcase)
├── Chat Interface (WhatsApp-like design)
├── Terms Modal (legal protection)
└── Hospital Network (interactive cards)

Backend (API Routes)
├── /api/chat (Gemini AI integration)
├── Response Filter (safety layer)
├── Emergency Detection (keyword matching)
└── Hospital Recommender (geographic data)

Safety Systems
├── Multiple AI Models (fallback)
├── Response Filtering (dangerous advice blocking)
├── Emergency Fallbacks (pre-written responses)
└── Grammar Correction (medical terms)
```

## 🔧 **Key Files**

### **Core Components:**
- `src/app/page.tsx` - Landing page with hospital network
- `src/app/chat/page.tsx` - Chat interface with safety features
- `src/app/api/chat/route.ts` - AI backend with filtering
- `src/lib/response-filter.ts` - Safety validation system
- `src/lib/hospital-recommender.ts` - Hospital database & emergency detection

### **Safety Features:**
```javascript
// Response filtering (automatic)
- Blocks dangerous phrases
- Adds safety disclaimers
- Corrects medical grammar
- Forces emergency contact info

// Emergency fallback (when AI fails)
- Pre-written emergency responses
- Language-appropriate guidance
- Hospital recommendations
- 112 contact information
```

## 📱 **Responsive Breakpoints**

```css
Mobile: 320px-640px (stack everything)
Tablet: 640px-1024px (2-column layout)
Desktop: 1024px+ (3-column layout)
Ultra-wide: 1920px+ (max-width containers)
```

## 🛡️ **Safety Implementation**

### **Response Filter Pipeline:**
1. AI generates response
2. Check for dangerous phrases
3. Add safety disclaimers if missing
4. Correct grammar/spelling
5. Validate medical scope
6. Send filtered response

### **Emergency Detection:**
```javascript
Keywords: chest pain, bleeding, unconscious, 
         difficulty breathing, severe, emergency
Action: Red alert + hospital list + 112 contact
Fallback: Works even if AI completely fails
```

## 🏥 **Hospital Database**

### **Coverage:**
- 20+ major hospitals
- All 6 geopolitical zones
- National, Teaching, Federal types
- Phone numbers + coordinates

### **Features:**
- One-click calling
- Google Maps integration
- Collapsible sections
- Emergency-only display

## 🔑 **Environment Setup**

```bash
# Required
GEMINI_API_KEY=your_google_ai_key

# Optional
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=maps_key
```

## 📊 **Performance**

- **Load Time**: <1s (cached)
- **AI Response**: 5-10s (Gemini processing)
- **Bundle Size**: ~500KB (optimized)
- **Lighthouse Score**: 95+ (all metrics)

## 🔄 **Session Management**

```javascript
// Stored in sessionStorage (privacy-first)
- All chat messages
- Language preference  
- Terms acceptance
- User feedback

// Cleared on browser close
// No server-side storage
```

## 🌍 **Deployment**

### **Vercel (Recommended):**
1. Connect GitHub repo
2. Add environment variables
3. Auto-deploy on push

### **Manual:**
```bash
npm run build
npm start
# Runs on port 3000
```

## 🚨 **Error Handling**

- API failures → Emergency fallback responses
- Network issues → Retry with user guidance
- Invalid input → Redirect to health topics
- Rate limits → Queue with user notification

## 📈 **Scalability**

### **Current Limits:**
- 15 AI requests/minute (free tier)
- ~100 concurrent users max
- Session storage only

### **Scale Requirements:**
- Paid Gemini API ($0.25/1K tokens)
- Redis for caching
- Database for user accounts
- Load balancer for traffic

---

**This covers all technical implementation details you need to understand and explain.**