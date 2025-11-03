# HealthAI Nigeria 🏥

AI-powered medical assistant providing symptom analysis and hospital finder for Nigerian communities. Built for **Nigeria National AI Hackathon 2025**.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)

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

## 📂 Project Structure

```
healthai-nigeria/
├── src/
│   └── app/
│       ├── page.tsx          # Landing page
│       ├── chat/             # Chat interface (coming soon)
│       ├── layout.tsx        # Root layout
│       └── globals.css       # Global styles
├── public/                   # Static assets
└── README.md
```

## 🏆 Hackathon Details

- **Event:** Nigeria National AI Hackathon 2025
- **Dates:** November 25-26, 2025
- **Category:** Healthcare / AI
- **UN SDG:** Goal 3 - Good Health and Well-being

## ⚠️ Disclaimer

HealthAI is NOT a replacement for professional medical care. This tool provides general health information only. For emergencies, always call **112** (Nigeria's emergency number) or visit the nearest hospital immediately.

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
