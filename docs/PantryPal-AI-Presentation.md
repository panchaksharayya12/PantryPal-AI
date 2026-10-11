# PantryPal AI — Presentation Slide Deck 🍳

> **Next-Generation Zero-Waste Culinary Platform & Multilingual Kitchen Assistant**  
> **Author**: Panchaksharayya  
> **GitHub Repository**: [https://github.com/panchaksharayya12/PantryPal-AI](https://github.com/panchaksharayya12/PantryPal-AI)  
> **PowerPoint Download**: [📥 Download PantryPal-AI-Presentation.pptx](./PantryPal-AI-Presentation.pptx)

---

## Slide 1: Title Slide
### **PantryPal AI**
#### *Your Kitchen. Your Ingredients. Endless Possibilities.*
- **Tagline**: The Next-Generation Zero-Waste Culinary Engine.
- **Key Highlights**:
  - 3D Fibonacci Culinary Orbit Visualization
  - Real-Time Interactive Chef Blade Cutting Station
  - Multilingual Regional Indian Voice Synthesis (Kannada, Hindi, Tamil, Telugu, English)
  - Zero-Waste Pantry Matching Algorithm (Exact & Partial %)
- **Author**: Panchaksharayya (`panchaksharayya12`)

---

## Slide 2: The Problem Statement
### **The Global Challenge: Kitchen Food Waste & Friction**
1. **1.3 Billion Tons of Food Wasted Annually**:
   - Up to 30% of household perishable groceries are discarded.
   - Economic cost exceeds \$1 Trillion globally.
2. **Decision Fatigue ("Fridge Blindness")**:
   - Cooking inspiration paralysis leads to unnecessary takeaway ordering.
   - Traditional recipe sites demand buying 10+ new ingredients for a single meal.
3. **Regional Language Barrier**:
   - Over 90% of culinary knowledge is spoken and understood in native regional languages.
   - Traditional apps remain strictly in English, alienating millions of regional home cooks.

---

## Slide 3: The Solution
### **The PantryPal AI Solution: Smart, Sensory & Multilingual**
- **Zero-Waste Pantry Matching**:
  - Calculates exact match percentage and highlights missing ingredients.
  - One-click bulk addition to synchronized shopping list.
- **3D Fibonacci Culinary Orbit**:
  - Interactive spatial sphere displaying 28+ handcrafted authentic dishes.
  - Realistic depth wash shading, momentum drag, and specular light reflections.
- **Interactive Knife Prep Station**:
  - Gamified butcher board with splitting vegetables and blade slash audio physics.
- **Native Multilingual Voice Engine**:
  - Full Kannada, Hindi, Tamil, Telugu, and English localization with Web Speech API voice synthesis.

---

## Slide 4: System Architecture
### **Full-Stack Technology Stack & Architecture Flow**
```
┌─────────────────────────────────────────────────────────────┐
│                       CLIENT TIER                           │
│  React 19 • TypeScript • Vite 6 • Tailwind CSS v4          │
│  Framer Motion • Web Audio API • Web Speech API             │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON
┌──────────────────────────────▼──────────────────────────────┐
│                       SERVER TIER                           │
│  Node.js • Express.js REST API • Multer                     │
│  Modular Routers: /recipes, /pantry, /shopping, /ai         │
└──────────────────────────────┬──────────────────────────────┘
                               │ SQLite Driver
┌──────────────────────────────▼──────────────────────────────┐
│                      DATABASE & AI                          │
│  SQLite (WAL Mode) • 31 Seeded Recipes                      │
│  OpenAI GPT-4o-mini Integration (with offline fallback)     │
└─────────────────────────────────────────────────────────────┘
```

---

## Slide 5: Multi-Lingual Regional Language Engine
### **Native Culinary Localization in Action**
- **Supported Languages**:
  - Kannada (`kn-IN`)
  - Hindi (`hi-IN`)
  - Tamil (`ta-IN`)
  - Telugu (`te-IN`)
  - English (`en-IN`)
- **Example Translation (Indian Masala Omelette - Step 6)**:
  - **English**: *"Carefully flip the omelette and cook the other side for another 1-2 minutes."*
  - **Kannada**: *"ಆಮ್ಲೆಟ್ ಅನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ತಿರುಗಿಸಿ ಮತ್ತು ಇನ್ನೊಂದು ಬದಿಯನ್ನು 1-2 ನಿಮಿಷಗಳ ಕಾಲ ಬೇಯಿಸಿ."*
  - **Hindi**: *"आमलेट को सावधानी से पलटें और दूसरी तरफ 1-2 मिनट और पकाएं।"*
- **Hands-Free Cooking**:
  - Voice readout reads each step aloud in the selected native dialect.

---

## Slide 6: Interactive UI & Sensory Physics
### **Sensory Cooking: Audio Synthesis & Motion Physics**
- **Knife Cutting Station**:
  - Butcher block with authentic wood-grain styling.
  - Vegetable splits into two tilted halves with laser slash flash.
  - Cutting sound generated via HTML5 audio with procedural Web Audio API noise synthesizer fallback.
- **Cinema Focus Mode**:
  - Distraction-free high-contrast full-screen view for the kitchen.
  - Step timer presets (1 min, 3 min, 5 min, 10 min).
  - Multi-burst confetti fireworks fanfare upon completing a recipe.

---

## Slide 7: Database Schema
### **Relational Data Storage with SQLite**
- **`recipes`**: Stores id, name, description, cuisine, timing, nutrition metrics, and JSON ingredients/instructions.
- **`pantry`**: User kitchen inventory with quantity, unit, and expiration date.
- **`shopping_list`**: Missing ingredients auto-populated from recipe views.
- **`favorites`**: Saved recipe bookmarks.

---

## Slide 8: RESTful API Specifications
| Endpoint | Method | Description |
|---|---|---|
| `/api/recipes` | GET | List all curated recipes |
| `/api/recipes/:id` | GET | Single recipe details |
| `/api/recipes/suggest` | POST | Match recipes based on user ingredients |
| `/api/pantry` | GET, POST, DELETE | Manage pantry inventory |
| `/api/shopping-list` | GET, POST, DELETE | Manage grocery items & bulk recipe additions |
| `/api/ingredients/identify` | POST | AI Vision photo ingredient identification |
| `/api/ai/chat` | POST | Multilingual culinary assistant |

---

## Slide 9: Testing & Verification
- **Vite 6 Production Build**: 2,351 modules transformed, 0 lint/compilation errors.
- **Cross-Language Test Suite**: Verified step resolution in Kannada and Hindi.
- **Audio Reliability**: Tested Web Audio synthesizer across Chrome, Edge, and mobile browsers.

---

## Slide 10: Cloud Deployment
- **Platform**: Vercel Cloud Platform (Serverless Edge CDN).
- **Repository**: GitHub ([panchaksharayya12/PantryPal-AI](https://github.com/panchaksharayya12/PantryPal-AI)).
- **Performance**: High Lighthouse score, sub-second TTFB, edge-cached static assets.

---

## Slide 11: Future Roadmap
1. **Multi-Item Real-Time Camera Scanner**: Stream smartphone camera to detect all ingredients in fridge simultaneously.
2. **Smart Fridge IoT Sync**: Automatically sync inventory via barcode and load-cell sensor APIs.
3. **Personalized AI Meal Planner**: Generate weekly zero-waste grocery schedules tailored to family dietary goals.

---

## Slide 12: Conclusion & Q&A
- **Summary**: PantryPal AI eliminates kitchen food waste, breaks language barriers, and brings delight back to daily home cooking.
- **Links**:
  - 🌐 Live Web App: Deployed on Vercel
  - 💻 GitHub: [panchaksharayya12/PantryPal-AI](https://github.com/panchaksharayya12/PantryPal-AI)
  - 📑 Project Report: [`PantryPal-AI-Project-Report.docx`](./PantryPal-AI-Project-Report.docx)
  - 📊 Slides: [`PantryPal-AI-Presentation.pptx`](./PantryPal-AI-Presentation.pptx)

