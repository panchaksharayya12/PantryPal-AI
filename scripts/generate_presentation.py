import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_pantrypal_presentation(output_path="docs/PantryPal-AI-Presentation.pptx"):
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Brand Colors
    BG_DARK = RGBColor(15, 23, 42)       # Slate 900
    BG_CARD = RGBColor(30, 41, 59)       # Slate 800
    EMERALD = RGBColor(16, 185, 129)     # Emerald 500
    EMERALD_LIGHT = RGBColor(52, 211, 153) # Emerald 400
    TEXT_LIGHT = RGBColor(248, 250, 252) # Slate 50
    TEXT_MUTED = RGBColor(148, 163, 184) # Slate 400
    AMBER = RGBColor(245, 158, 11)       # Amber 500

    def add_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_DARK
        bg.line.fill.background()

    def add_header(slide, title_text, category_text="PANTRYPAL AI • TECHNICAL SPECIFICATION"):
        # Category pill
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11), Inches(0.4))
        tf_cat = cat_box.text_frame
        tf_cat.word_wrap = True
        p_cat = tf_cat.paragraphs[0]
        p_cat.text = category_text.upper()
        p_cat.font.size = Pt(11)
        p_cat.font.bold = True
        p_cat.font.color.rgb = EMERALD

        # Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.85), Inches(11.5), Inches(0.8))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        p_title = tf_title.paragraphs[0]
        p_title.text = title_text
        p_title.font.size = Pt(28)
        p_title.font.bold = True
        p_title.font.color.rgb = TEXT_LIGHT

    def add_card(slide, left, top, width, height, title, points, accent_color=EMERALD):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = BG_CARD
        card.line.color.rgb = accent_color
        card.line.width = Pt(1.5)

        tx_box = slide.shapes.add_textbox(left + Inches(0.25), top + Inches(0.2), width - Inches(0.5), height - Inches(0.4))
        tf = tx_box.text_frame
        tf.word_wrap = True

        p_t = tf.paragraphs[0]
        p_t.text = title
        p_t.font.size = Pt(18)
        p_t.font.bold = True
        p_t.font.color.rgb = accent_color

        for pt in points:
            p = tf.add_paragraph()
            p.text = "• " + pt
            p.font.size = Pt(13)
            p.font.color.rgb = TEXT_LIGHT
            p.space_before = Pt(8)

    # -------------------------------------------------------------
    # SLIDE 1: TITLE SLIDE
    # -------------------------------------------------------------
    slide1 = prs.slides.add_slide(blank_layout)
    add_background(slide1)

    t_box = slide1.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(11.3), Inches(4.5))
    tf1 = t_box.text_frame
    tf1.word_wrap = True

    p_badge = tf1.paragraphs[0]
    p_badge.text = "NEXT-GENERATION ZERO-WASTE CULINARY ENGINE"
    p_badge.font.size = Pt(14)
    p_badge.font.bold = True
    p_badge.font.color.rgb = EMERALD

    p_main = tf1.add_paragraph()
    p_main.text = "PantryPal AI"
    p_main.font.size = Pt(56)
    p_main.font.bold = True
    p_main.font.color.rgb = TEXT_LIGHT
    p_main.space_before = Pt(10)

    p_sub = tf1.add_paragraph()
    p_sub.text = "Your Kitchen. Your Ingredients. Endless Possibilities."
    p_sub.font.size = Pt(22)
    p_sub.font.italic = True
    p_sub.font.color.rgb = EMERALD_LIGHT
    p_sub.space_before = Pt(5)

    p_desc = tf1.add_paragraph()
    p_desc.text = "An intelligent culinary platform featuring 3D Fibonacci Orbit visualization, real-time tactical knife cutting station, dynamic multi-lingual Indian voice synthesis, and zero-waste pantry recipe matching."
    p_desc.font.size = Pt(15)
    p_desc.font.color.rgb = TEXT_MUTED
    p_desc.space_before = Pt(18)

    p_auth = tf1.add_paragraph()
    p_auth.text = "Presented by: Panchaksharayya | GitHub: panchaksharayya12/PantryPal-AI"
    p_auth.font.size = Pt(14)
    p_auth.font.bold = True
    p_auth.font.color.rgb = AMBER
    p_auth.space_before = Pt(24)

    # -------------------------------------------------------------
    # SLIDE 2: THE PROBLEM STATEMENT
    # -------------------------------------------------------------
    slide2 = prs.slides.add_slide(blank_layout)
    add_background(slide2)
    add_header(slide2, "The Global Challenge: Kitchen Food Waste & Friction")

    add_card(slide2, Inches(0.8), Inches(1.8), Inches(3.6), Inches(5.0),
             "1. Food Waste Crisis", [
                 "Over 1.3 billion tons of edible food is discarded globally every year.",
                 "Average households waste 20-30% of perishable groceries.",
                 "Ingredients expire simply because users don't know what to cook with leftover items."
             ], AMBER)

    add_card(slide2, Inches(4.8), Inches(1.8), Inches(3.6), Inches(5.0),
             "2. Cooking Decision Fatigue", [
                 "Endless recipe scroll leads to frustration and takeaway ordering.",
                 "Traditional recipe sites require buying 10+ new ingredients for 1 meal.",
                 "Lack of ingredient substitution and percentage matching intelligence."
             ], EMERALD_LIGHT)

    add_card(slide2, Inches(8.8), Inches(1.8), Inches(3.6), Inches(5.0),
             "3. Regional Language Barrier", [
                 "Culinary terminology is deeply rooted in regional native languages.",
                 "Existing cooking apps strictly cater to English, alienating millions of regional cooks.",
                 "Hands-busy cooking requires hands-free, voice-guided instructions."
             ], EMERALD)

    # -------------------------------------------------------------
    # SLIDE 3: THE PANTRYPAL AI SOLUTION
    # -------------------------------------------------------------
    slide3 = prs.slides.add_slide(blank_layout)
    add_background(slide3)
    add_header(slide3, "The PantryPal AI Solution: Smart, Sensory & Multilingual")

    add_card(slide3, Inches(0.8), Inches(1.8), Inches(5.6), Inches(2.4),
             "Smart Ingredient Matching Engine", [
                 "Calculates exact and partial match percentages based on on-hand staples.",
                 "Intelligent masala integration prevents unnecessary grocery runs."
             ], EMERALD)

    add_card(slide3, Inches(6.8), Inches(1.8), Inches(5.6), Inches(2.4),
             "3D Fibonacci Culinary Orbit", [
                 "Interactive 3D spatial sphere displaying 28+ handcrafted authentic dishes.",
                 "Realistic specular lighting and drag-physics exploration."
             ], EMERALD_LIGHT)

    add_card(slide3, Inches(0.8), Inches(4.5), Inches(5.6), Inches(2.4),
             "Interactive Knife Prep Station", [
                 "Gamified cutting board with blade slice physics and authentic chop sound synthesis.",
                 "Instant one-click addition of chopped produce to the active recipe finder."
             ], AMBER)

    add_card(slide3, Inches(6.8), Inches(4.5), Inches(5.6), Inches(2.4),
             "Native Multi-Lingual Voice Guidance", [
                 "Full coverage in Kannada, Hindi, Tamil, Telugu, and English.",
                 "Hands-free voice recognition and native Web Speech synthesis for step-by-step cooking."
             ], EMERALD)

    # -------------------------------------------------------------
    # SLIDE 4: SYSTEM ARCHITECTURE
    # -------------------------------------------------------------
    slide4 = prs.slides.add_slide(blank_layout)
    add_background(slide4)
    add_header(slide4, "Full-Stack System Architecture & Technology Flow")

    add_card(slide4, Inches(0.8), Inches(1.8), Inches(3.6), Inches(5.0),
             "Frontend Layer", [
                 "React 19 + TypeScript for blazing speed and strict typing.",
                 "Vite 6 for lightning-fast HMR and optimized minified bundling.",
                 "Tailwind CSS v4 for modern fluid aesthetic styling.",
                 "Framer Motion for 3D physics, tilts, and fluid transitions.",
                 "Web Audio API & Web Speech API for auditory and voice features."
             ], EMERALD)

    add_card(slide4, Inches(4.8), Inches(1.8), Inches(3.6), Inches(5.0),
             "Backend Services Layer", [
                 "Node.js & Express.js REST API server.",
                 "Multer image processing for visual ingredient upload.",
                 "Modular routers for recipes, pantry, shopping list, and AI chat.",
                 "Serverless Vercel function endpoints for zero-maintenance cloud scale."
             ], EMERALD_LIGHT)

    add_card(slide4, Inches(8.8), Inches(1.8), Inches(3.6), Inches(5.0),
             "Database & AI Layer", [
                 "SQLite relational database with WAL (Write-Ahead Logging) mode.",
                 "31 fully seeded authentic Indian & World recipes with nutritional metrics.",
                 "OpenAI GPT-4o-mini engine integration with robust deterministic offline fallback."
             ], AMBER)

    # -------------------------------------------------------------
    # SLIDE 5: MULTI-LINGUAL REGIONAL LANGUAGE ENGINE
    # -------------------------------------------------------------
    slide5 = prs.slides.add_slide(blank_layout)
    add_background(slide5)
    add_header(slide5, "Localized Culinary Engine: Kannada, Hindi & Regional Languages")

    add_card(slide5, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0),
             "Dynamic Localization Matrix", [
                 "31 complete authentic recipes translated with high grammatical precision.",
                 "Translates recipe titles, descriptions, metrics, and every cooking step.",
                 "Translates 40+ pantry staples (ಉದಾಹರಣೆಗೆ: ಟೊಮೇಟೊ, ಈರುಳ್ಳಿ, ಪಾಲಕ್, ಮಸಾಲೆಗಳು).",
                 "Example (Indian Masala Omelette Step 6):",
                 "  EN: 'Carefully flip the omelette and cook the other side for another 1-2 minutes.'",
                 "  KN: 'ಆಮ್ಲೆಟ್ ಅನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ತಿರುಗಿಸಿ ಮತ್ತು ಇನ್ನೊಂದು ಬದಿಯನ್ನು 1-2 ನಿಮಿಷಗಳ ಕಾಲ ಬೇಯಿಸಿ.'",
                 "  HI: 'आमलेट को सावधानी से पलटें और दूसरी तरफ 1-2 मिनट और पकाएं।'"
             ], EMERALD)

    add_card(slide5, Inches(6.8), Inches(1.8), Inches(5.6), Inches(5.0),
             "Speech & Voice Accessibility", [
                 "Web Speech Recognition API with automatic language dialect detection (kn-IN, hi-IN, ta-IN, te-IN).",
                 "Integrated SpeechSynthesisUtterance for full step-by-step hands-free cooking audio guidance.",
                 "Voice readout speed and pitch optimized for ambient kitchen environments.",
                 "Microphone voice search in Pantry AI Assistant chat drawer for seamless question-answering."
             ], EMERALD_LIGHT)

    # -------------------------------------------------------------
    # SLIDE 6: INTERACTIVE UI & SENSORY PHYSICS
    # -------------------------------------------------------------
    slide6 = prs.slides.add_slide(blank_layout)
    add_background(slide6)
    add_header(slide6, "Sensory Cooking: Audio Synthesis & Motion Physics")

    add_card(slide6, Inches(0.8), Inches(1.8), Inches(3.6), Inches(5.0),
             "Knife Prep Station", [
                 "Interactive butcher block with authentic wood-grain texture.",
                 "Dual-half splitting vegetable animation on knife slash.",
                 "Dynamic laser blade particle flash effect.",
                 "Combo multipliers reward quick prep."
             ], AMBER)

    add_card(slide6, Inches(4.8), Inches(1.8), Inches(3.6), Inches(5.0),
             "Dual Audio System", [
                 "Native audio element playing clean blade slash sound.",
                 "Procedural Web Audio API bandpass-filtered noise synthesizer as instant fallback.",
                 "Subtle chimes and zero-irritation tactile pop feedback."
             ], EMERALD)

    add_card(slide6, Inches(8.8), Inches(1.8), Inches(3.6), Inches(5.0),
             "Cinema Cooking Mode", [
                 "Distraction-free high-contrast full-screen UI for cooking in kitchen.",
                 "Integrated quick-set timers (1m, 3m, 5m, 10m).",
                 "Celebratory dual-burst multi-color confetti upon recipe completion."
             ], EMERALD_LIGHT)

    # -------------------------------------------------------------
    # SLIDE 7: DATABASE SCHEMA & SEED DATA
    # -------------------------------------------------------------
    slide7 = prs.slides.add_slide(blank_layout)
    add_background(slide7)
    add_header(slide7, "Database Architecture: Relational SQLite & Seed Store")

    add_card(slide7, Inches(0.8), Inches(1.8), Inches(3.6), Inches(5.0),
             "Recipes Table", [
                 "Primary key: id (TEXT)",
                 "Meta: name, cuisine, difficulty, image_url",
                 "Timing: prep_time, cook_time, servings",
                 "Nutrition: calories, protein, carbs, fat, fiber",
                 "JSON payload: dietary_tags, ingredients, instructions"
             ], EMERALD)

    add_card(slide7, Inches(4.8), Inches(1.8), Inches(3.6), Inches(5.0),
             "Pantry & Shopping Tables", [
                 "Pantry Table: tracks user kitchen inventory with quantity, unit, expiry date.",
                 "Shopping List Table: automatically populated with missing ingredients from recipe views.",
                 "Bulk addition endpoint for one-click recipe grocery list generation."
             ], EMERALD_LIGHT)

    add_card(slide7, Inches(8.8), Inches(1.8), Inches(3.6), Inches(5.0),
             "Favorites & AI Log", [
                 "Favorites Table: links user favorite recipe bookmarks.",
                 "AI Context Cache: enables intelligent leftover recipe prompts based on active pantry items.",
                 "Foreign key constraints and WAL mode enabled."
             ], AMBER)

    # -------------------------------------------------------------
    # SLIDE 8: API SPECIFICATIONS
    # -------------------------------------------------------------
    slide8 = prs.slides.add_slide(blank_layout)
    add_background(slide8)
    add_header(slide8, "RESTful API Endpoints & Request/Response Flow")

    add_card(slide8, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0),
             "Recipe & Pantry Services", [
                 "GET /api/recipes - Fetch all curated recipes.",
                 "GET /api/recipes/:id - Retrieve specific recipe record.",
                 "POST /api/recipes/suggest - Match recipes based on ingredients & filters.",
                 "GET /api/pantry - Fetch user pantry items.",
                 "POST /api/pantry - Add new item to pantry.",
                 "DELETE /api/pantry/:id - Remove pantry item."
             ], EMERALD)

    add_card(slide8, Inches(6.8), Inches(1.8), Inches(5.6), Inches(5.0),
             "Shopping & AI Culinary Services", [
                 "GET /api/shopping-list - Fetch current grocery list.",
                 "POST /api/shopping-list - Add single or bulk missing ingredients.",
                 "PATCH /api/shopping-list/:id - Toggle bought status.",
                 "POST /api/ingredients/identify - Vision photo identification.",
                 "POST /api/ai/chat - Culinary Q&A with OpenAI or rule-based fallback."
             ], EMERALD_LIGHT)

    # -------------------------------------------------------------
    # SLIDE 9: VERIFICATION & TESTING
    # -------------------------------------------------------------
    slide9 = prs.slides.add_slide(blank_layout)
    add_background(slide9)
    add_header(slide9, "Quality Assurance, Testing & Build Verification")

    add_card(slide9, Inches(0.8), Inches(1.8), Inches(3.6), Inches(5.0),
             "Zero-Error Compilation", [
                 "Full TypeScript type safety verified across client and server.",
                 "2,351 modules transformed cleanly with Vite 6.",
                 "Zero lint errors and zero bundle breakages."
             ], EMERALD)

    add_card(slide9, Inches(4.8), Inches(1.8), Inches(3.6), Inches(5.0),
             "Cross-Language Validation", [
                 "All 31 recipes verified in Kannada, Hindi, Tamil, Telugu, and English.",
                 "Verified dynamic step text rendering in both Cinema Mode and Recipe Detail Modal.",
                 "SpeechSynthesis verified with correct Indian language codes."
             ], EMERALD_LIGHT)

    add_card(slide9, Inches(8.8), Inches(1.8), Inches(3.6), Inches(5.0),
             "Audio & Physics Tests", [
                 "Blade slice sound verified with Web Audio API fallback.",
                 "Tested responsive 3D card orbit on desktop, tablet, and mobile.",
                 "Vite dev server (port 5173) and Express (port 5000) verified active."
             ], AMBER)

    # -------------------------------------------------------------
    # SLIDE 10: DEPLOYMENT & HOSTING
    # -------------------------------------------------------------
    slide10 = prs.slides.add_slide(blank_layout)
    add_background(slide10)
    add_header(slide10, "Cloud Deployment & Production Architecture")

    add_card(slide10, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0),
             "Vercel Cloud Edge Hosting", [
                 "Frontend statically pre-rendered and distributed across global edge CDN nodes.",
                 "Serverless API functions handle backend requests with microsecond latency.",
                 "Automatic continuous deployment linked to GitHub repository.",
                 "Optimized asset caching for 3D textures, WebP images, and sound effects."
             ], EMERALD)

    add_card(slide10, Inches(6.8), Inches(1.8), Inches(5.6), Inches(5.0),
             "GitHub Source Repository", [
                 "Full source code committed to https://github.com/panchaksharayya12/PantryPal-AI.git.",
                 "Includes complete documentation, PowerPoint presentation, and Word project report.",
                 "Direct links in README for immediate one-click document inspection."
             ], EMERALD_LIGHT)

    # -------------------------------------------------------------
    # SLIDE 11: FUTURE ROADMAP
    # -------------------------------------------------------------
    slide11 = prs.slides.add_slide(blank_layout)
    add_background(slide11)
    add_header(slide11, "Future Roadmap: AI Vision & Smart Kitchen IoT")

    add_card(slide11, Inches(0.8), Inches(1.8), Inches(3.6), Inches(5.0),
             "1. Multi-Item Vision Scanner", [
                 "Real-time webcam scanning to detect multiple vegetables and pantry staples simultaneously in video stream.",
                 "Automatic bounding box visualization and freshness estimation."
             ], EMERALD)

    add_card(slide11, Inches(4.8), Inches(1.8), Inches(3.6), Inches(5.0),
             "2. Smart Fridge IoT Sync", [
                 "Integration with smart refrigerators via barcode and weight sensor APIs.",
                 "Automated shelf-life alerts and push notifications for expiring groceries."
             ], AMBER)

    add_card(slide11, Inches(8.8), Inches(1.8), Inches(3.6), Inches(5.0),
             "3. Community & Meal Plans", [
                 "Weekly personalized zero-waste meal planners based on family size and dietary goals.",
                 "Community recipe submissions with peer ratings and video guides."
             ], EMERALD_LIGHT)

    # -------------------------------------------------------------
    # SLIDE 12: CONCLUSION
    # -------------------------------------------------------------
    slide12 = prs.slides.add_slide(blank_layout)
    add_background(slide12)

    c_box = slide12.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(11.3), Inches(4.5))
    tf12 = c_box.text_frame
    tf12.word_wrap = True

    p_cbadge = tf12.paragraphs[0]
    p_cbadge.text = "SUMMARY & CONCLUSION"
    p_cbadge.font.size = Pt(14)
    p_cbadge.font.bold = True
    p_cbadge.font.color.rgb = EMERALD

    p_ctitle = tf12.add_paragraph()
    p_ctitle.text = "Thank You!"
    p_ctitle.font.size = Pt(50)
    p_ctitle.font.bold = True
    p_ctitle.font.color.rgb = TEXT_LIGHT
    p_ctitle.space_before = Pt(10)

    p_csub = tf12.add_paragraph()
    p_csub.text = "PantryPal AI is ready to eliminate kitchen food waste, break regional language barriers, and make everyday cooking engaging, accessible, and delightful."
    p_csub.font.size = Pt(18)
    p_csub.font.color.rgb = TEXT_MUTED
    p_csub.space_before = Pt(15)

    p_clinks = tf12.add_paragraph()
    p_clinks.text = "GitHub Repository: https://github.com/panchaksharayya12/PantryPal-AI\nLive App: Deployed on Vercel\nDocumentation & Presentation: Included in repository /docs"
    p_clinks.font.size = Pt(15)
    p_clinks.font.bold = True
    p_clinks.font.color.rgb = EMERALD_LIGHT
    p_clinks.space_before = Pt(25)

    prs.save(output_path)
    print(f"Successfully generated PowerPoint presentation at: {output_path}")

if __name__ == "__main__":
    out = sys.argv[1] if len(sys.argv) > 1 else "docs/PantryPal-AI-Presentation.pptx"
    create_pantrypal_presentation(out)

