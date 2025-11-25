# Contributing to HealthAI Nigeria

## 🎯 Project Status

This is a **hackathon prototype** built for Nigeria National AI Hackathon 2025. While we welcome contributions, please understand this is not production-ready medical software.

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/healthai-nigeria.git`
3. Install dependencies: `npm install`
4. Create `.env.local` with your Gemini API key
5. Run dev server: `npm run dev`

## 📁 Code Structure

### **src/app/** - Pages & API Routes
- `page.tsx` - Landing page
- `chat/page.tsx` - Chat interface
- `api/chat/route.ts` - AI chat endpoint

### **src/components/** - Reusable UI
- `LocationRequest.tsx` - GPS/Manual location picker

### **src/lib/** - Business Logic
- `hospital-recommender.ts` - Hospital matching algorithm
- `response-filter.ts` - AI safety filters
- `offline-emergency.ts` - Emergency fallback responses
- `follow-up-handler.ts` - Conversation context
- `geolocation.ts` - Distance calculations

### **src/types/** - TypeScript Definitions
- `chat.ts` - Message and hospital types

## 🛠️ Development Guidelines

### **Code Style**
- Use TypeScript for all new code
- Follow existing naming conventions
- Use Tailwind CSS for styling
- Keep components small and focused

### **Safety First**
- Never remove safety disclaimers
- Always include emergency contact (112)
- Test emergency detection thoroughly
- Validate all user inputs

### **Testing**
```bash
# Run type checking
npm run type-check

# Build for production
npm run build

# Test locally
npm run dev
```

## 🏥 Adding Hospitals

Edit `src/lib/hospital-recommender.ts`:

```typescript
const HOSPITALS = [
  {
    name: "Hospital Name",
    phone: "+234 XX XXX XXXX",
    address: "City, State",
    coords: "lat,lon",
    lat: 0.0000,
    lon: 0.0000,
    specialties: ["emergency", "general"]
  },
  // ...
]
```

## 🌍 Adding Locations

Edit `src/app/api/chat/route.ts`:

```typescript
const cities = ['lagos', 'abuja', 'your-city', ...]

const locationMap = {
  'local-area': 'main-city',
  // ...
}
```

## 🛡️ Safety Filters

Edit `src/lib/response-filter.ts`:

```typescript
// Add dangerous patterns to block
const dangerousPatterns = [
  "pattern to block",
  // ...
]

// Add required disclaimers
if (!response.includes("disclaimer")) {
  response += "\n\nDisclaimer text"
}
```

## 📝 Commit Guidelines

```bash
# Format: type(scope): description

feat(chat): add voice input support
fix(api): handle rate limit errors
docs(readme): update installation steps
style(ui): improve mobile responsiveness
refactor(lib): simplify hospital matching
```

## 🚫 What NOT to Contribute

- ❌ Removing safety disclaimers
- ❌ Medical advice without professional validation
- ❌ Features that bypass emergency detection
- ❌ Storing user health data
- ❌ Removing "prototype" warnings

## ✅ What TO Contribute

- ✅ Bug fixes
- ✅ UI/UX improvements
- ✅ More hospital data
- ✅ Better error handling
- ✅ Documentation improvements
- ✅ Accessibility enhancements
- ✅ Performance optimizations

## 🔒 Security

If you find a security vulnerability:
1. **DO NOT** open a public issue
2. Email: mayoru24@gmail.com
3. Include: description, steps to reproduce, impact

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## 🤝 Code of Conduct

- Be respectful and professional
- Focus on constructive feedback
- Remember this is a healthcare project - safety first
- Help others learn and grow

## 📧 Questions?

- Open an issue for bugs/features
- Email mayoru24@gmail.com for other questions
- Check [ARCHITECTURE.md](ARCHITECTURE.md) for system design

---

Thank you for contributing to HealthAI Nigeria! 🇳🇬
