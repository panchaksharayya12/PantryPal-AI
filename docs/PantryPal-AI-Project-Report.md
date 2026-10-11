# PantryPal AI — Comprehensive Project Engineering Report

> **Author**: Panchaksharayya  
> **GitHub**: [https://github.com/panchaksharayya12/PantryPal-AI](https://github.com/panchaksharayya12/PantryPal-AI)  
> **Direct Word Document Download**: [Download PantryPal-AI-Project-Report.docx](./PantryPal-AI-Project-Report.docx)  
> **PowerPoint Slide Deck**: [Download PantryPal-AI-Presentation.pptx](./PantryPal-AI-Presentation.pptx)  
> **Status**: Production Release (v1.0.0)

---

## 1. Executive Summary & Abstract

**PantryPal AI** is an advanced, full-stack zero-waste culinary intelligence platform engineered to eliminate household food waste, dismantle decision fatigue, and bridge language barriers in daily home cooking. 

By unifying mathematical 3D spatial orbit visualization, real-time tactical knife cutting physics with synthesized audio feedback, an indigenous multilingual engine supporting native Indian languages (Kannada, Hindi, Tamil, Telugu, and English), and an exact-percentage pantry ingredient matching algorithm, PantryPal AI transforms cooking from a chore into an engaging, multi-sensory experience.

---

## 2. Problem Statement & Motivation

Household kitchens worldwide face three structural friction points:

1. **The Global Food Waste Crisis**: Over 1.3 billion tons of edible food is thrown out annually. The average urban household wastes between 20% and 30% of its groceries because home cooks do not know how to creatively combine leftover pantry ingredients.
2. **Decision Fatigue ("Fridge Blindness")**: Cooking paralysis leads directly to takeaway spending and nutritional degradation. Traditional recipe websites exacerbate the issue by requiring long grocery lists rather than recommending dishes based on what is already available in the kitchen.
3. **Regional Language Exclusion**: In India, over 90% of culinary knowledge is passed down in regional native languages. Mainstream culinary apps strictly operate in English, failing to cater to millions of home cooks and offering zero hands-free voice assistance.

---

## 3. Core System Architecture

PantryPal AI is architected as a high-performance modern web application:

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

### Tech Stack Details:
- **Frontend**: React 19, TypeScript, Vite 6, Tailwind CSS v4, Framer Motion, Lucide Icons, Canvas Confetti.
- **Backend**: Express.js, TypeScript, Multer, Cors, Dotenv.
- **Database**: SQLite with Write-Ahead Logging (WAL) and foreign key constraints.
- **Sensory & Audio**: Web Audio API (procedural bandpass-filtered noise synthesizer) and HTML5 Audio.
- **Voice & Accessibility**: Web Speech Recognition and SpeechSynthesisUtterance.
- **Deployment**: Vercel Serverless Edge Platform.

---

## 4. Multi-Lingual Regional Localization Engine

PantryPal AI includes a custom-built, grammatical localization matrix for:
- **English (`en`)**
- **Kannada (`kn`)**
- **Hindi (`hi`)**
- **Tamil (`ta`)**
- **Telugu (`te`)**

### Deep Dive: Culinary Kannada Localization
Rather than relying on inaccurate machine translation, all recipe steps, pantry ingredients, and modal controls use authentic, conversational culinary Kannada:

| Context | English | Kannada (`kn`) |
|---|---|---|
| Recipe Name | Indian Masala Omelette | ಭಾರತೀಯ ಮಸಾಲಾ ಆಮ್ಲೆಟ್ |
| Recipe Step 6 | Carefully flip the omelette and cook the other side for another 1-2 minutes. | ಆಮ್ಲೆಟ್ ಅನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ತಿರುಗಿಸಿ ಮತ್ತು ಇನ್ನೊಂದು ಬದಿಯನ್ನು 1-2 ನಿಮಿಷಗಳ ಕಾಲ ಬೇಯಿಸಿ. |
| Tomato | Tomato | ಟೊಮೇಟೊ |
| Onion | Onion | ಈರುಳ್ಳಿ |
| Spinach | Spinach | ಪಾಲಕ್ ಸೊಪ್ಪು |
| Prep Time | Prep | ತಯಾರಿ |
| Cook Time | Cook | ಅಡುಗೆ |
| Calories | Calories | ಕ್ಯಾಲೋರಿಗಳು |
| Servings | Servings | ಜನರಿಗೆ |

---

## 5. Key Interactive Features & Sensory Physics

### 5.1 3D Fibonacci Culinary Orbit
- Uses the golden angle ($\theta = \pi(3 - \sqrt{5})$) to distribute 28+ recipes evenly on a sphere.
- Integrates momentum drag physics, depth wash shading (`--d` CSS variable), and specular glare reflection.

### 5.2 Tactical Knife Prep Station
- Butcher block wood-grain surface.
- Slicing a vegetable triggers a dynamic laser blade slash flash, splits the emoji into tilted halves, and plays an authentic chef blade cutting sound.
- Instantly adds sliced produce to the active recipe matching filter.

### 5.3 Cinema Focus Cooking Mode
- Full-screen distraction-free UI designed for kitchen use.
- One-click timers (1m, 3m, 5m, 10m).
- Native Text-To-Speech read-aloud in regional languages (`kn-IN`, `hi-IN`).
- Celebratory dual-burst confetti fireworks upon completing a dish.

### 5.4 Smart Pantry & Auto Shopping List
- Auto-detects missing ingredients when viewing any recipe.
- One-click bulk addition to shopping list.

---

## 6. Database Schema

### 1. `recipes` Table
- `id`: TEXT (Primary Key)
- `name`: TEXT
- `description`: TEXT
- `cuisine`: TEXT
- `prep_time`, `cook_time`, `servings`: INTEGER
- `difficulty`: TEXT ('Easy', 'Medium', 'Hard')
- `image_url`: TEXT
- `dietary_tags`: JSON Array
- `ingredients`: JSON Array (`[{ name, quantity, unit, notes }]`)
- `instructions`: JSON Array
- `calories`, `protein`, `carbs`, `fat`, `fiber`: INTEGER

### 2. `pantry` Table
- `id`: INTEGER (Primary Key Auto-Increment)
- `name`: TEXT
- `quantity`: REAL
- `unit`: TEXT
- `category`: TEXT
- `expires_at`: DATE
- `created_at`: DATETIME

### 3. `shopping_list` Table
- `id`: INTEGER (Primary Key Auto-Increment)
- `name`: TEXT
- `quantity`: REAL
- `unit`: TEXT
- `checked`: BOOLEAN
- `recipe_id`: TEXT
- `created_at`: DATETIME

### 4. `favorites` Table
- `id`: INTEGER (Primary Key Auto-Increment)
- `recipe_id`: TEXT (Foreign Key)
- `created_at`: DATETIME

---

## 7. RESTful API Specifications

| Method | Endpoint | Description | Status Code |
|---|---|---|---|
| `GET` | `/api/health` | Service health status check | 200 OK |
| `GET` | `/api/recipes` | Fetch all curated recipes | 200 OK |
| `GET` | `/api/recipes/:id` | Fetch specific recipe detail | 200 OK |
| `POST` | `/api/recipes/suggest` | Calculate matched recipes based on ingredients & filters | 200 OK |
| `GET` | `/api/pantry` | Retrieve user kitchen inventory | 200 OK |
| `POST` | `/api/pantry` | Add pantry staple | 201 Created |
| `DELETE` | `/api/pantry/:id` | Remove pantry staple | 200 OK |
| `GET` | `/api/shopping-list` | Fetch shopping items | 200 OK |
| `POST` | `/api/shopping-list` | Add single or bulk missing ingredients | 201 Created |
| `PATCH` | `/api/shopping-list/:id`| Toggle item purchased status | 200 OK |
| `DELETE` | `/api/shopping-list/:id`| Delete item from shopping list | 200 OK |
| `POST` | `/api/ai/chat` | Multilingual AI culinary consultation | 200 OK |
| `POST` | `/api/ingredients/identify` | Upload ingredient image for identification | 200 OK |

---

## 8. Verification & Quality Assurance

- **Vite 6 Production Build**: Verified with `npm run build:client` — 2,351 modules transformed in 1m 14s with zero compilation warnings or errors.
- **Multilingual Integrity**: Runtime TypeScript verification confirmed that Kannada instruction arrays match the expected step count and phrasing.
- **Audio Cross-Browser Compatibility**: Fallback procedural Web Audio API tested successfully on browsers blocking audio elements.

---

## 9. Conclusion & Future Scope

PantryPal AI demonstrates how human-centric design, regional language accessibility, and sensory computing can turn everyday grocery leftovers into nutritious meals.

### Future Roadmap:
1. **Multi-Object Real-Time Vision**: Continuous webcam scanning of the refrigerator interior with automatic bounding box detection.
2. **Smart Fridge IoT Hardware Integration**: RFID and weight-sensor telemetry syncing with the user's pantry table.
3. **Community Recipe Sharing & Social Feed**: User-submitted regional recipes with peer ratings and video guides.

