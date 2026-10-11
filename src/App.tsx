import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { KnifePrepStation } from './components/KnifePrepStation.tsx';
import { IngredientInput } from './components/IngredientInput.tsx';
import { DietaryFilters } from './components/DietaryFilters.tsx';
import { CulinarySphere } from './components/CulinarySphere.tsx';
import { RecipeGrid } from './components/RecipeGrid.tsx';
import { RecipeModal } from './components/RecipeModal.tsx';
import { CookingModeModal } from './components/CookingModeModal.tsx';
import { PantryView } from './components/PantryView.tsx';
import { ShoppingListView } from './components/ShoppingListView.tsx';
import { FavoritesView } from './components/FavoritesView.tsx';
import { AiAssistantModal } from './components/AiAssistantModal.tsx';
import { ShaderBackground } from './components/ShaderBackground.tsx';
import { motion, AnimatePresence } from 'framer-motion';
import {
  fetchRecipes,
  suggestRecipes,
  fetchFavorites,
  addFavorite,
  removeFavorite,
  fetchShoppingList,
  fetchPantry,
} from './api/client.ts';
import { RecipeRecord, MatchedRecipe, MatchFilter } from './types/recipe.ts';
import { UtensilsCrossed, Sparkles, Heart, Leaf, ShieldCheck, Database, RefreshCw, Rotate3d, LayoutGrid } from 'lucide-react';
import { useLanguage } from './context/LanguageContext.tsx';

export function App() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'discover' | 'pantry' | 'shopping' | 'favorites'>('discover');
  
  // Theme state: default to luxury Dark Theme with instant user toggle
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pantrypal_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'dark'; // Luxury Dark Mode as default
  });

  const isDark = theme === 'dark';

  const handleToggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('pantrypal_theme', next);
      return next;
    });
  };

  // Kitchen ingredients & Filters
  const [ingredients, setIngredients] = useState<string[]>(['Tomato', 'Onion']);
  const [filters, setFilters] = useState<MatchFilter>({
    diet: 'all',
    cuisine: 'All',
    maxPrepTime: 90,
    difficulty: 'All',
    minMatch: 0,
  });

  // View Mode: 3D Orbit Sphere vs Classic Grid
  const [viewMode, setViewMode] = useState<'sphere' | 'grid'>('sphere');

  // Recipes & Discovery Data
  const [recipes, setRecipes] = useState<(MatchedRecipe | RecipeRecord)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // User Data State
  const [favorites, setFavorites] = useState<string[]>([]);
  const [shoppingCount, setShoppingCount] = useState(0);
  const [pantryItemNames, setPantryItemNames] = useState<string[]>([]);

  // Modals
  const [selectedRecipe, setSelectedRecipe] = useState<MatchedRecipe | RecipeRecord | null>(null);
  const [cookingRecipe, setCookingRecipe] = useState<RecipeRecord | null>(null);
  const [isAiOpen, setIsAiOpen] = useState(false);

  // Initial Data Load
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      
      // Load all recipes
      const allRecipes = await fetchRecipes();
      setRecipes(allRecipes);

      // Load favorites
      const favs = await fetchFavorites();
      setFavorites(favs.map((f) => f.id));

      // Load shopping list count
      const shopping = await fetchShoppingList();
      setShoppingCount(shopping.filter((i) => i.checked === 0).length);

      // Load pantry items
      const pantry = await fetchPantry();
      setPantryItemNames(pantry.map((p) => p.name));
    } catch (err) {
      console.error('Error loading initial data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Perform Recipe Discovery Search
  const handleFindRecipes = async (
    customIngredients = ingredients,
    customFilters = filters
  ) => {
    setIsLoading(true);
    setHasSearched(true);

    try {
      if (customIngredients.length === 0) {
        // If no ingredients, show all filtered recipes
        const all = await fetchRecipes();
        let filtered = all;
        if (customFilters.diet && customFilters.diet !== 'all') {
          filtered = filtered.filter((r) =>
            r.dietaryTags.some((t) => t.toLowerCase() === customFilters.diet!.toLowerCase())
          );
        }
        if (customFilters.cuisine && customFilters.cuisine !== 'All') {
          filtered = filtered.filter((r) => r.cuisine.toLowerCase() === customFilters.cuisine!.toLowerCase());
        }
        if (customFilters.difficulty && customFilters.difficulty !== 'All') {
          filtered = filtered.filter((r) => r.difficulty.toLowerCase() === customFilters.difficulty!.toLowerCase());
        }
        if (customFilters.maxPrepTime && customFilters.maxPrepTime < 90) {
          filtered = filtered.filter((r) => r.prepTime <= customFilters.maxPrepTime!);
        }
        setRecipes(filtered);
      } else {
        const response = await suggestRecipes(customIngredients, customFilters);
        setRecipes(response.recipes);
      }

      // Smooth scroll to results
      setTimeout(() => {
        const resultsEl = document.getElementById('recipe-results-section');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err) {
      console.error('Error searching recipes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Find Recipe Click from Hero / Navbar
  const handleFindRecipeCta = () => {
    setActiveTab('discover');
    setTimeout(() => {
      const el = document.getElementById('ingredient-search-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  // Explore all recipes
  const handleExploreRecipes = async () => {
    setActiveTab('discover');
    setIsLoading(true);
    try {
      const all = await fetchRecipes();
      setRecipes(all);
      setHasSearched(false);
      setTimeout(() => {
        const resultsEl = document.getElementById('recipe-results-section');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Cook From Pantry Action
  const handleCookFromPantry = (pantryIngredients: string[]) => {
    setIngredients(pantryIngredients);
    setActiveTab('discover');
    handleFindRecipes(pantryIngredients, filters);
  };

  // Favorite Toggle
  const handleToggleFavorite = async (e: React.MouseEvent | null, recipeId: string) => {
    if (e) e.stopPropagation();
    const isFav = favorites.includes(recipeId);

    try {
      if (isFav) {
        await removeFavorite(recipeId);
        setFavorites((prev) => prev.filter((id) => id !== recipeId));
      } else {
        await addFavorite(recipeId);
        setFavorites((prev) => [...prev, recipeId]);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const handleShoppingListUpdated = async () => {
    try {
      const shopping = await fetchShoppingList();
      setShoppingCount(shopping.filter((i) => i.checked === 0).length);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`min-h-screen relative flex flex-col font-sans transition-colors duration-300 ${
      isDark
        ? 'dark bg-[#0B0F0D] text-[#F3F4F6] selection:bg-emerald-500 selection:text-black'
        : 'light bg-[#FAF8F2] text-[#202820] selection:bg-[#E6F0E6] selection:text-[#315C43]'
    }`}>
      
      {/* Interactive WebGL Liquid Shader Background */}
      <ShaderBackground isDark={isDark} />

      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAi={() => setIsAiOpen(true)}
        onFindRecipeClick={handleFindRecipeCta}
        shoppingCount={shoppingCount}
        favoritesCount={favorites.length}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'discover' && (
            <motion.div
              key="discover"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Hero Section with Looping Culinary Video */}
              <Hero
                onFindRecipeClick={handleFindRecipeCta}
                onExploreRecipesClick={handleExploreRecipes}
                isDark={isDark}
              />

              {/* Kinetic Cutting & Vegetable Prep Station */}
              <KnifePrepStation
                activeIngredients={ingredients}
                onAddIngredient={(name) => {
                  if (!ingredients.map((i) => i.toLowerCase()).includes(name.toLowerCase())) {
                    setIngredients((prev) => [...prev, name]);
                  }
                }}
                isDark={isDark}
              />

              {/* Kitchen Ingredient Input Section with Autocomplete, Guidance & Masalas */}
              <IngredientInput
                ingredients={ingredients}
                setIngredients={setIngredients}
                onFindRecipes={() => handleFindRecipes(ingredients, filters)}
                isLoading={isLoading}
                isDark={isDark}
              />

              {/* Recipe Results & Filter Section */}
              <section id="recipe-results-section" className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                      {hasSearched ? t('curatedForKitchen', 'Curated Dishes For Your Kitchen') : t('exploreFeatured', 'Explore Featured Culinary Creations')}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#737B72] dark:text-[#9CA3AF] mt-1">
                      {hasSearched
                        ? `Found ${recipes.length} ${t('matchesFound', 'recipe matches based on your available ingredients.')}`
                        : t('browseAllSubtitle', 'Browse through our handcrafted collection of recipes with instant pantry matching.')}
                    </p>
                  </div>

                  {/* View Mode Switcher Pill */}
                  <div className={`flex items-center gap-1.5 p-1 rounded-2xl border shadow-xs self-start sm:self-auto ${
                    isDark ? 'bg-[#141A16] border-[#243328]' : 'bg-white border-[#E8E5DC]'
                  }`}>
                    <button
                      type="button"
                      onClick={() => setViewMode('sphere')}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        viewMode === 'sphere'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : isDark
                            ? 'text-[#9CA3AF] hover:text-white'
                            : 'text-[#737B72] hover:text-[#202820]'
                      }`}
                    >
                      <Rotate3d className="w-4 h-4 text-emerald-400" />
                      <span>{t('orbitView', '3D Orbit')} ({recipes.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setViewMode('grid')}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        viewMode === 'grid'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : isDark
                            ? 'text-[#9CA3AF] hover:text-white'
                            : 'text-[#737B72] hover:text-[#202820]'
                      }`}
                    >
                      <LayoutGrid className="w-4 h-4 text-emerald-400" />
                      <span>{t('cardGrid', 'Card Grid')}</span>
                    </button>
                  </div>
                </div>

                <DietaryFilters
                  filters={filters}
                  setFilters={setFilters}
                  onFilterChange={(newFilters) => handleFindRecipes(ingredients, newFilters)}
                  isDark={isDark}
                />

                {viewMode === 'sphere' && !isLoading ? (
                  <div className={`mt-8 rounded-3xl border shadow-lg overflow-hidden ${
                    isDark ? 'bg-[#111713]/80 border-[#243328]' : 'bg-white/70 border-[#E8E5DC]'
                  }`}>
                    <CulinarySphere
                      recipes={recipes}
                      onSelectRecipe={(r) => setSelectedRecipe(r)}
                      onSwitchToGrid={() => setViewMode('grid')}
                      isDark={isDark}
                    />
                  </div>
                ) : (
                  <RecipeGrid
                    recipes={recipes}
                    favorites={favorites}
                    onToggleFavorite={(e, id) => handleToggleFavorite(e, id)}
                    onSelectRecipe={(r) => setSelectedRecipe(r)}
                    isLoading={isLoading}
                    hasSearched={hasSearched}
                    onClearFilters={() => {
                      const resetFilters = { diet: 'all', cuisine: 'All', maxPrepTime: 90, difficulty: 'All', minMatch: 0 };
                      setFilters(resetFilters);
                      handleFindRecipes(ingredients, resetFilters);
                    }}
                    isDark={isDark}
                  />
                )}
              </section>
            </motion.div>
          )}

          {activeTab === 'pantry' && (
            <motion.div
              key="pantry"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <PantryView onCookFromPantry={handleCookFromPantry} />
            </motion.div>
          )}

          {activeTab === 'shopping' && (
            <motion.div
              key="shopping"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <ShoppingListView onListChange={handleShoppingListUpdated} />
            </motion.div>
          )}

          {activeTab === 'favorites' && (
            <motion.div
              key="favorites"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <FavoritesView
                onSelectRecipe={(r) => setSelectedRecipe(r)}
                onFavoritesChange={async () => {
                  const favs = await fetchFavorites();
                  setFavorites(favs.map((f) => f.id));
                }}
                onExploreRecipes={handleExploreRecipes}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Recipe Detail Modal with Animated Preparation Steps */}
      <RecipeModal
        recipe={selectedRecipe}
        isOpen={Boolean(selectedRecipe)}
        onClose={() => setSelectedRecipe(null)}
        isFavorite={selectedRecipe ? favorites.includes(selectedRecipe.id) : false}
        onToggleFavorite={(id) => handleToggleFavorite(null, id)}
        onStartCooking={(r) => {
          setSelectedRecipe(null);
          setCookingRecipe(r);
        }}
        onShoppingListUpdated={handleShoppingListUpdated}
        isDark={isDark}
      />

      {/* Interactive Cooking Mode Modal */}
      <CookingModeModal
        recipe={cookingRecipe}
        isOpen={Boolean(cookingRecipe)}
        onClose={() => setCookingRecipe(null)}
      />

      {/* Ask PantryPal AI Assistant Drawer/Modal */}
      <AiAssistantModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        pantryItems={pantryItemNames}
        currentRecipeName={selectedRecipe?.name}
        isDark={isDark}
      />

      {/* Footer */}
      <footer className={`border-t py-12 transition-colors ${
        isDark
          ? 'bg-[#0E1310] border-[#233328] text-white'
          : 'bg-white border-[#E8E5DC] text-[#202820]'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pb-8 border-b border-black/10 dark:border-white/10">
            <div className="md:col-span-5 space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <span className="text-xl font-bold font-sans">
                  PantryPal <span className="text-emerald-500">AI</span>
                </span>
              </div>
              <p className="text-xs text-[#737B72] dark:text-[#9CA3AF] max-w-sm">
                Your kitchen. Your ingredients. Endless possibilities. Smart pantry-to-plate recipe matching designed to curb food waste and make home cooking effortless.
              </p>
            </div>

            <div className="md:col-span-4 flex flex-wrap gap-4 text-xs font-semibold text-[#737B72] dark:text-[#9CA3AF]">
              <button onClick={() => setActiveTab('discover')} className="hover:text-emerald-400">
                {t('navDiscover', 'Discover Recipes')}
              </button>
              <button onClick={() => setActiveTab('pantry')} className="hover:text-emerald-400">
                {t('navPantry', 'My Pantry')}
              </button>
              <button onClick={() => setActiveTab('shopping')} className="hover:text-emerald-400">
                {t('navShopping', 'Shopping List')}
              </button>
              <button onClick={() => setActiveTab('favorites')} className="hover:text-emerald-400">
                {t('navFavorites', 'Favorites')}
              </button>
              <button onClick={() => setIsAiOpen(true)} className="hover:text-emerald-400 text-emerald-400 flex items-center gap-1 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                {t('navAskAi', 'Ask PantryPal')}
              </button>
            </div>

            <div className="md:col-span-3 text-left md:text-right space-y-1">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
                isDark ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30' : 'bg-[#E6F0E6] text-[#315C43]'
              }`}>
                <Database className="w-3.5 h-3.5" /> SQLite & Express Powered
              </span>
              <p className="text-[11px] text-[#737B72] dark:text-[#9CA3AF]">100% Functional Full-Stack Platform</p>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#737B72] dark:text-[#9CA3AF] gap-2">
            <p>© {new Date().getFullYear()} PantryPal AI. Designed for culinary joy.</p>
            <p className="text-[11px]">Nutritional estimates are for information only. Cook responsibly.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
