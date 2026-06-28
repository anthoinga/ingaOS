# Anthony's Portfolio

A modern, AI-powered portfolio showcasing design and engineering work with an intelligent chat interface.

🇵🇪 **HECHO EN PERU**

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://vercel.com)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

## ✨ Features

### 🤖 AI-Powered Chat Interface
- **Intent Detection Framework** - Intelligently routes queries (greetings, tech inquiries, process questions, project details)
- **Conversation Memory** - Tracks recent responses to avoid repetition
- **Anti-Hallucination System** - Prevents AI from inventing project details
- **Human-Sounding Responses** - Sounds like a colleague, not a chatbot
- **Bilingual Support** - English and Spanish responses

### 🎨 Project Showcase
- **Masonry Grid Layout** - 3-column responsive project display
- **Rich Project Metadata** - Frameworks, tools, platforms, skills, client context
- **Intelligent Filtering** - Search by technology, platform, skill, or tool
- **Project Context** - Detailed client info, challenges, outcomes, and role descriptions

### 🎵 Spotify Integration
- **Now Playing Widget** - Live Spotify playback display
- **Album Art & Gradient** - Dynamic colors from album artwork
- **Track Progress** - Real-time playback status

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React** - UI components

### AI & Backend
- **Claude (Anthropic)** - Intent-aware chat responses
- **Haiku Model** - Fast, cost-effective AI inference
- **Conversation Memory** - In-memory response tracking
- **Rate Limiting** - Protection against abuse (5 req/min chat, 10 req/min Spotify)

### Security
- **Security Headers** - CSP, X-Frame-Options, XSS Protection
- **Input Validation** - Query sanitization and length limits
- **Error Sanitization** - Prevents API detail leakage

### Deployment
- **Vercel** - Serverless deployment with auto-deploy on push
- **Environment Variables** - Secure API key management

## 📁 Project Structure

```
portfolio/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/
│   │   │   │   ├── route.ts           # AI chat endpoint
│   │   │   │   ├── intents.ts         # Intent detection
│   │   │   │   └── systemPrompt.ts    # AI prompt builder
│   │   │   └── spotify/
│   │   │       └── route.ts            # Spotify Now Playing API
│   │   ├── data/
│   │   │   ├── projects.ts             # Project metadata
│   │   │   └── filterPatterns.ts       # Search keywords
│   │   ├── utils/
│   │   │   └── filterEngine.ts         # Project filtering logic
│   │   ├── types/
│   │   │   └── index.ts                # TypeScript definitions
│   │   └── components/                 # React components
│   └── middleware.ts                   # Security headers
├── public/
│   └── images/                         # Project images
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Anthropic API key
- Spotify API credentials (for Now Playing widget)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/anthoinga/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Add your API keys:
   ```env
   ANTHROPIC_API_KEY=your_anthropic_key
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   SPOTIFY_REFRESH_TOKEN=your_refresh_token
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🧪 Testing

### Test AI Chat
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "query": "react projects",
    "language": "en",
    "matchedProjects": [],
    "allProjectsCount": 10
  }'
```

### Build for Production
```bash
npm run build
```

## 📊 AI Response System

### Intent Detection
The chat system detects 7 intent types:
- **greeting** - Ultra-brief intro (10-15 words)
- **technology_inquiry** - Experience with frameworks/tools
- **process_methodology** - Design approach and workflow
- **project_specific** - Details about specific projects
- **capability_browse** - Overview of work
- **elaboration** - Deeper context on previous responses
- **comparison** - Tech comparisons (React vs Vue, etc.)

### Response Guidelines
- **40-60 words max** - Concise, scannable responses
- **No counting** - Never says "Found 3 projects"
- **Context-aware** - Uses actual project metadata
- **Persona enforcement** - Maintains first-person voice as Anthony
- **No AI language** - Avoids "Sure, I can help" and similar phrases

## 🔧 Recent Updates

### v1.2.0 (Feb 2026)
- ✅ Added AI RSVP Reader project
- ✅ Implemented intent detection framework
- ✅ Added conversation memory
- ✅ Enhanced anti-hallucination rules
- ✅ Fixed metadata recognition (Salesforce, Claude, Cursor, etc.)
- ✅ Added ProjectContext interface
- ✅ Strengthened anti-counting rules
- ✅ Complete metadata visibility in AI responses

## 📝 Adding New Projects

Edit `src/app/data/projects.ts`:

```typescript
{
  id: 'project-id',
  size: 'large', // or 'small'
  imageUrl: '/images/project.png',
  imageAlt: 'Project Name',
  url: 'https://project-url.com',
  title: 'Project Title',
  date: '2026',
  metadata: {
    frameworks: ['React', 'Next.js'],
    tools: ['Figma', 'TypeScript'],
    platform: ['Web'],
    skills: ['UI/UX Design', 'Frontend Development'],
    projectType: 'Web App',
    year: '2026',
  },
  context: {
    client: 'Client Name',
    industry: 'Industry',
    role: 'Your Role',
    challenge: 'Problem statement',
    outcome: 'Result achieved',
  },
}
```

## 🌐 Deployment

### Vercel (Recommended)
1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push to `main`

### Manual Deploy
```bash
vercel --prod
```

## 📈 Performance

- **Build Time:** ~30-45 seconds
- **First Load JS:** ~87 KB
- **AI Response Time:** 500ms - 2s
- **API Cost:** ~$3-5/month (1,000 queries)

## 🤝 Contributing

This is a personal portfolio, but feedback and suggestions are welcome!

## 📄 License

© 2026 Anthony Inga. All rights reserved.

## 🔗 Links

- **Portfolio:** [Live Site]
- **GitHub:** https://github.com/anthoinga/portfolio
- **LinkedIn:** [Your LinkedIn]

---

Built with ❤️ using Claude Code
