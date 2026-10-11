# PantryPal AI 🍲

> **Your Kitchen. Your Ingredients. Endless Possibilities.**  
> An intelligent, sensory-rich zero-waste culinary platform with 3D Fibonacci spatial visualization, interactive tactical knife prep physics, indigenous Indian multilingual voice guidance (Kannada, Hindi, Tamil, Telugu), and real-time pantry recipe matching.

[![Live Deployment](https://img.shields.io/badge/Vercel-Live%20App-10b981?style=for-the-badge&logo=vercel&logoColor=white)](https://pantrypal-ai-snowy.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/panchaksharayya12/PantryPal-AI)
[![React](https://img.shields.io/badge/React-19.3-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.4-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.3-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

---

## 🚀 Direct Links & Live Deployment

| Resource | Direct Link | Description |
|---|---|---|
| 🌐 **Live Website** | [**pantrypal-ai-snowy.vercel.app**](https://pantrypal-ai-snowy.vercel.app) | Production application deployed on Vercel Cloud |
| 📊 **PowerPoint Presentation (.pptx)** | [**Download PPTX**](https://github.com/panchaksharayya12/PantryPal-AI/raw/main/docs/PantryPal-AI-Presentation.pptx) | Complete 12-slide presentation deck |
| 📑 **Presentation (Direct Web Preview)** | [**View Slides on GitHub**](./docs/PantryPal-AI-Presentation.md) | Formatted markdown slides viewable directly in browser |
| 📘 **Word Project Report (.docx)** | [**Download Word Report**](https://github.com/panchaksharayya12/PantryPal-AI/raw/main/docs/PantryPal-AI-Project-Report.docx) | Full engineering report in Microsoft Word format |
| 📄 **Project Report (Direct Web Preview)** | [**View Report on GitHub**](./docs/PantryPal-AI-Project-Report.md) | Comprehensive engineering documentation in markdown |

---

## 🌟 Key Features

### 1. 3D Fibonacci Culinary Orbit
- Interactive 3D spatial spherical manifold distributing 28+ handcrafted authentic recipes using the golden-ratio Fibonacci algorithm.
- Momentum drag physics, variable depth wash shading, and specular glare reflections.

### 2. Tactical Knife Prep Station with Sound Physics
- Gamified butcher cutting board with authentic wood-grain finish.
- Slicing vegetables (Tomato, Onion, Capsicum, Ginger, Garlic, Carrot, Avocado, Spinach) triggers a dynamic laser blade slash, splits the vegetable into tilted halves, and synthesizes a realistic chef blade cutting audio sound.
- Sliced produce is automatically injected into the active recipe matching filter with combo multiplier rewards.

### 3. Native Indian Multilingual & Voice Guidance
- **Full UI & Step-by-Step Translation** into **Kannada (`kn`)**, **Hindi (`hi`)**, **Tamil (`ta`)**, **Telugu (`te`)**, and **English (`en`)**.
- Natural, authentic culinary phrasing (e.g., Step 6 of *Indian Masala Omelette*):
  > *"ಆಮ್ಲೆಟ್ ಅನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ತಿರುಗಿಸಿ ಮತ್ತು ಇನ್ನೊಂದು ಬದಿಯನ್ನು 1-2 ನಿಮಿಷಗಳ ಕಾಲ ಬೇಯಿಸಿ."*
- **Hands-Free Cooking Readout**: Integrated Web Speech synthesis reads instructions aloud in native dialects (`kn-IN`, `hi-IN`, `en-IN`).
- **Voice Search**: Speak in any Indian language in the culinary assistant chat drawer.

### 4. Zero-Waste Recipe Matching Engine
- Calculates exact and partial match percentages based on available kitchen staples.
- Categorizes recipes as *Ready to Cook (100% Match)* or highlights missing items.
- Avoids irrelevant suggestions (e.g., will never suggest egg dishes if you only input tomato and onion).

### 5. Cinema Focus Cooking Mode
- Full-screen high-contrast distraction-free UI tailored for kitchen cooking.
- Integrated quick kitchen timers (1m, 3m, 5m, 10m).
- Step completion tracking with dual-burst multi-color confetti fireworks celebration upon finishing.

### 6. Dynamic Shopping List & Pantry Inventory
- Missing ingredients from any recipe can be added to the shopping list with a single click.
- Persistent pantry tracking with expiration alerts and one-click transfer to recipe search.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       CLIENT TIER                           │
│  React 19 • TypeScript • Vite 6 • Tailwind CSS v4          │
│  Framer Motion • Web Audio API • Web Speech API             │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON
┌──────────────────────────────▼──────────────────────────────┐
│                       SERVER TIER                           │
│  Node.js • Express.js REST API • Vercel Serverless Function  │
│  Modular Routers: /recipes, /pantry, /shopping, /ai         │
└──────────────────────────────┬──────────────────────────────┘
                               │ SQLite Driver / In-Memory Store
┌──────────────────────────────▼──────────────────────────────┐
│                      DATABASE & AI                          │
│  SQLite (WAL Mode) • 31 Seeded Recipes                      │
│  OpenAI GPT-4o-mini Integration (with offline fallback)     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite 6, Tailwind CSS v4, Framer Motion, Lucide Icons, Canvas Confetti.
- **Backend**: Express.js, TypeScript, Multer, Cors, Dotenv, esbuild.
- **Database**: SQLite with Write-Ahead Logging (WAL) and resilient in-memory serverless store.
- **Sensory & Audio**: Web Audio API (procedural bandpass-filtered noise synthesis) and HTML5 Audio.
- **Speech**: Web Speech Recognition & SpeechSynthesisUtterance.
- **Cloud Deployment**: Vercel Serverless Edge Platform.

---

## 📡 RESTful API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check endpoint returning status and recipe count |
| `GET` | `/api/recipes` | Fetch all 31 curated recipes |
| `GET` | `/api/recipes/:id` | Fetch specific recipe detail by ID |
| `POST` | `/api/recipes/suggest` | Calculate matched recipes based on ingredients & filters |
| `GET` | `/api/pantry` | Retrieve user kitchen inventory |
| `POST` | `/api/pantry` | Add pantry staple |
| `DELETE` | `/api/pantry/:id` | Remove pantry staple |
| `GET` | `/api/shopping-list` | Fetch active shopping list |
| `POST` | `/api/shopping-list` | Add single or bulk missing ingredients |
| `PATCH` | `/api/shopping-list/:id` | Toggle item checked status |
| `DELETE` | `/api/shopping-list/:id` | Remove item or completed items |
| `POST` | `/api/ai/chat` | Multilingual AI culinary consultation |
| `GET` | `/api/ai/status` | Get AI model status and connectivity |

---

## 💻 Local Setup & Development

### 1. Clone the Repository
```bash
git clone https://github.com/panchaksharayya12/PantryPal-AI.git
cd PantryPal-AI
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
- Frontend will be available at: `http://localhost:5173`
- Backend API will be available at: `http://localhost:5000`

### 4. Build for Production
```bash
npm run build
```

---

## 📄 Documentation Deliverables

All documentation files are included in the [`docs/`](./docs) directory:
- [📊 **PantryPal-AI-Presentation.pptx**](./docs/PantryPal-AI-Presentation.pptx) — Professional PowerPoint deck.
- [📑 **PantryPal-AI-Presentation.md**](./docs/PantryPal-AI-Presentation.md) — Web-viewable presentation slides.
- [📘 **PantryPal-AI-Project-Report.docx**](./docs/PantryPal-AI-Project-Report.docx) — Formal engineering project report in Word format.
- [📄 **PantryPal-AI-Project-Report.md**](./docs/PantryPal-AI-Project-Report.md) — Web-viewable engineering report.

---

## 👤 Author & Acknowledgments

- **Developed by**: **Panchaksharayya**
- **GitHub**: [@panchaksharayya12](https://github.com/panchaksharayya12)
- **Repository**: [https://github.com/panchaksharayya12/PantryPal-AI](https://github.com/panchaksharayya12/PantryPal-AI)
- **Live URL**: [https://pantrypal-ai-snowy.vercel.app](https://pantrypal-ai-snowy.vercel.app)

---

## 📜 License

This project is licensed under the ISC License.
