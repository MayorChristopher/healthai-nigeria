# HealthAI Nigeria 🏥

⚠️ **PROTOTYPE STATUS**: Hackathon demo - NOT production-ready medical software.

AI-powered medical assistant for Nigerian communities with symptom analysis, emergency detection, and hospital finder. Built for **Nigeria National AI Hackathon 2025**.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)
![Google Gemini](https://img.shields.io/badge/Gemini-AI-4285F4?logo=google)

## 🎯 Problem Statement

In rural Nigeria, over 60% of people live more than 5km from the nearest hospital. When medical emergencies happen at night, families don't know what to do. Language barriers, lack of information, and distance to healthcare facilities create life-threatening delays.

**HealthAI provides instant medical guidance 24/7, in English and Nigerian Pidgin.**

## ✨ Features

- 🤖 **AI Symptom Analysis** - Powered by Google Gemini API
- 🗣️ **Multilingual Support** - English and Nigerian Pidgin
- 🚨 **Emergency Detection** - Identifies critical symptoms automatically
- 🏥 **Hospital Finder** - 6 major Nigerian hospitals with directions
- 🔒 **Privacy First** - No data storage, no registration required
- 📱 **Mobile Responsive** - Works on all devices

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **AI:** Google Gemini API
- **Deployment:** Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Google Gemini API key ([Get one here](https://ai.google.dev/))
- **Important**: You will pay for API usage beyond free tier limits

### Installation

```bash
# Clone the repository
git clone https://github.com/MayorChristopher/healthai-nigeria.git
cd healthai-nigeria

# Install dependencies
npm install

# Create .env.local file
echo "GEMINI_API_KEY=your_api_key_here" > .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📚 Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Complete system architecture & flow diagrams
- **[docs/COMPLETE_GUIDE.md](docs/COMPLETE_GUIDE.md)** - Full guide for hackathon demo
- **[docs/TECHNICAL_DETAILS.md](docs/TECHNICAL_DETAILS.md)** - Technical specifications
- **[docs/QUICK_START.md](docs/QUICK_START.md)** - Quick setup guide

## 📂 Project Structure

```
healthai-nigeria/
├── src/
│   ├── app/              # Next.js pages & API routes
│   │   ├── api/chat/     # AI chat endpoint
│   │   ├── chat/         # Chat interface
│   │   └── page.tsx      # Landing page
│   ├── components/       # Reusable UI components
│   │   └── LocationRequest.tsx
│   ├── lib/              # Core business logic
│   │   ├── hospital-recommender.ts
│   │   ├── response-filter.ts
│   │   └── offline-emergency.ts
│   └── types/            # TypeScript definitions
├── docs/                 # Documentation
├── public/               # Static assets
└── ARCHITECTURE.md       # System architecture
```

## 🏆 Hackathon Details

- **Event:** Nigeria National AI Hackathon 2025
- **Dates:** November 25-26, 2025
- **Category:** Healthcare / AI
- **UN SDG:** Goal 3 - Good Health and Well-being
- **Status:** Prototype/Demo - Not production-ready

## ⚠️ CRITICAL DISCLAIMERS

**MEDICAL DISCLAIMER**: HealthAI is NOT a medical device, NOT a diagnostic tool, and NOT a replacement for professional medical care. This is an AI prototype that provides general health information only. The AI can make mistakes and give incorrect or dangerous advice.

**FOR EMERGENCIES**: Always call **112** (Nigeria's emergency number) or visit the nearest hospital immediately. Do not rely on this app for emergency medical decisions.

**NO LIABILITY**: The creators assume no liability for any harm resulting from use of this application. Use at your own risk.

**PROTOTYPE STATUS**: This was built in 48 hours for a hackathon. It has not been validated by medical professionals, has not undergone clinical trials, and is not approved for medical use.

## 🤝 Contributing

This is a hackathon project. Contributions, issues, and feature requests are welcome!

## 📧 Contact

**Ugochukwu Mayor Chukwuemeka**  
Email: mayoru24@gmail.com  
GitHub: [@MayorChristopher](https://github.com/MayorChristopher)

## 📄 License

This project uses the Google Gemini API and is not endorsed by Google.

---

Built with ❤️ for Nigerian communities
