import React, { useState } from 'react';
import {
  X,
  Clock,
  Flame,
  ChefHat,
  Users,
  CheckCircle2,
  AlertTriangle,
  Heart,
  PlusCircle,
  Play,
  ShoppingCart,
  Sparkles,
  Info,
  ChevronRight,
  ChevronLeft,
  Check,
  RotateCcw
} from 'lucide-react';
import { MatchedRecipe, RecipeRecord, RecipeIngredient } from '../types/recipe.ts';
import { addBulkShoppingItems } from '../api/client.ts';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '../utils/soundEffects.ts';
import { useLanguage } from '../context/LanguageContext.tsx';
import {
  getLocalizedRecipeInstructions,
  getLocalizedRecipeName,
  getLocalizedRecipeDescription,
} from '../utils/localizedRecipes.ts';
import { getLocalizedIngredient } from '../utils/localizedIngredients.ts';

interface RecipeModalProps {
  recipe: MatchedRecipe | RecipeRecord | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (recipeId: string) => void;
  onStartCooking: (recipe: RecipeRecord) => void;
  onShoppingListUpdated: () => void;
  isDark?: boolean;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({
  recipe,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  onStartCooking,
  onShoppingListUpdated,
  isDark = true,
}) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'animated' | 'overview'>('animated');
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isAddingToShopping, setIsAddingToShopping] = useState(false);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  if (!isOpen || !recipe) return null;

  const localizedName = getLocalizedRecipeName(recipe, language);
  const localizedDescription = getLocalizedRecipeDescription(recipe, language);
  const localizedInstructions = getLocalizedRecipeInstructions(recipe, language);
  const instructionsList = localizedInstructions.length > 0 ? localizedInstructions : recipe.instructions;

  const matched = recipe as Partial<MatchedRecipe>;
  const missingList: RecipeIngredient[] = matched.missingIngredients || [];
  const matchedListNames: string[] = matched.matchedIngredients || [];

  const handleAddMissingToShopping = async () => {
    if (missingList.length === 0) return;

    setIsAddingToShopping(true);
    try {
      const itemsToAdd = missingList.map((m) => ({
        name: m.name,
        quantity: parseFloat(m.quantity) || 1,
        unit: m.unit || 'item',
        recipeId: recipe.id
      }));

      await addBulkShoppingItems(itemsToAdd);
      sounds.playChime();
      onShoppingListUpdated();
      setAddedNotice(`Added ${itemsToAdd.length} ingredient(s) to your Shopping List!`);
      setTimeout(() => setAddedNotice(null), 4000);
    } catch (err) {
      console.error(err);
      setAddedNotice('Failed to add items to shopping list.');
    } finally {
      setIsAddingToShopping(false);
    }
  };

  const handleNextStep = () => {
    sounds.playPop();
    if (currentStepIdx < instructionsList.length - 1) {
      setCurrentStepIdx((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    sounds.playPop();
    if (currentStepIdx > 0) {
      setCurrentStepIdx((prev) => prev - 1);
    }
  };

  const toggleStepCompleted = (idx: number) => {
    sounds.playChime();
    setCompletedSteps((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const progressPct = Math.round(
    ((currentStepIdx + 1) / instructionsList.length) * 100
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 lg:p-6"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className={`relative w-full max-w-4xl rounded-3xl shadow-2xl border overflow-hidden my-6 max-h-[92vh] flex flex-col transition-colors ${
            isDark
              ? 'bg-[#121714] border-[#243328] text-white'
              : 'bg-[#FAF8F2] border-[#E8E5DC] text-[#202820]'
          }`}
        >
          {/* Header Bar */}
          <div className={`flex items-center justify-between p-4 sm:p-5 border-b sticky top-0 z-20 ${
            isDark ? 'bg-[#151D18] border-[#243328]' : 'bg-white border-[#E8E5DC]'
          }`}>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wide border border-emerald-500/30">
                {recipe.cuisine}
              </span>
              <span className="text-xs font-semibold text-[#737B72] dark:text-[#9CA3AF]">•</span>
              <span className="text-xs font-semibold text-[#737B72] dark:text-[#9CA3AF] flex items-center gap-1">
                <ChefHat className="w-3.5 h-3.5 text-emerald-400" />
                {recipe.difficulty}
              </span>
            </div>

            {/* View Switcher Pills */}
            <div className={`flex items-center p-1 rounded-xl border ${
              isDark ? 'bg-[#1C2620] border-white/5' : 'bg-gray-100 border-gray-200'
            }`}>
              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  setActiveTab('animated');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'animated'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-[#737B72] dark:text-[#9CA3AF] hover:text-white'
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>{t('animatedPrepGuide', 'Animated Prep Guide')}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  setActiveTab('overview');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'overview'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-[#737B72] dark:text-[#9CA3AF] hover:text-white'
                }`}
              >
                <span>{t('fullRecipeNutrition', 'Full Recipe & Nutrition')}</span>
              </button>
            </div>

            {/* Favorite & Close */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  onToggleFavorite(recipe.id);
                }}
                className={`p-2.5 rounded-full transition-all ${
                  isFavorite
                    ? 'bg-rose-500/20 text-rose-400'
                    : isDark
                      ? 'bg-white/5 text-[#9CA3AF] hover:bg-white/10'
                      : 'bg-[#FAF8F2] text-[#737B72] hover:bg-[#E8E5DC]'
                }`}
                title={isFavorite ? 'Remove Favorite' : 'Save to Favorites'}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current text-rose-500' : ''}`} />
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  onClose();
                }}
                className={`p-2.5 rounded-full transition-colors ${
                  isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-[#FAF8F2] hover:bg-[#E8E5DC] text-[#202820]'
                }`}
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
            
            {/* Top Dish Card */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-6 rounded-2xl overflow-hidden shadow-xl aspect-4/3 relative group bg-black">
                <img
                  src={recipe.imageUrl}
                  alt={localizedName || recipe.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase">
                    {t('readyToCook', 'Ready to Cook')}
                  </span>
                  <p className="text-sm font-black truncate mt-1">{localizedName || recipe.name}</p>
                </div>
              </div>

              <div className="md:col-span-6 space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black leading-tight">
                  {localizedName || recipe.name}
                </h2>
                <p className="text-sm text-[#737B72] dark:text-[#9CA3AF] leading-relaxed">
                  {localizedDescription || recipe.description}
                </p>

                {/* Dietary Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {recipe.dietaryTags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold border shadow-2xs ${
                        isDark
                          ? 'bg-[#1A241E] border-emerald-500/30 text-emerald-300'
                          : 'bg-white border-[#E8E5DC] text-[#315C43]'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-4 gap-2 pt-1">
                  <div className={`p-3 rounded-2xl border text-center ${
                    isDark ? 'bg-[#18201B] border-white/5' : 'bg-white border-[#E8E5DC]'
                  }`}>
                    <Clock className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                    <p className="text-[10px] text-[#737B72] dark:text-[#9CA3AF] uppercase font-bold">{t('prepTimeMetric', 'Prep')}</p>
                    <p className="text-xs font-black">{recipe.prepTime}m</p>
                  </div>
                  <div className={`p-3 rounded-2xl border text-center ${
                    isDark ? 'bg-[#18201B] border-white/5' : 'bg-white border-[#E8E5DC]'
                  }`}>
                    <Clock className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                    <p className="text-[10px] text-[#737B72] dark:text-[#9CA3AF] uppercase font-bold">{t('cookTimeMetric', 'Cook')}</p>
                    <p className="text-xs font-black">{recipe.cookTime}m</p>
                  </div>
                  <div className={`p-3 rounded-2xl border text-center ${
                    isDark ? 'bg-[#18201B] border-white/5' : 'bg-white border-[#E8E5DC]'
                  }`}>
                    <Flame className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                    <p className="text-[10px] text-[#737B72] dark:text-[#9CA3AF] uppercase font-bold">{t('caloriesMetric', 'Calories')}</p>
                    <p className="text-xs font-black">{recipe.calories}</p>
                  </div>
                  <div className={`p-3 rounded-2xl border text-center ${
                    isDark ? 'bg-[#18201B] border-white/5' : 'bg-white border-[#E8E5DC]'
                  }`}>
                    <Users className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                    <p className="text-[10px] text-[#737B72] dark:text-[#9CA3AF] uppercase font-bold">{t('servingsMetric', 'Servings')}</p>
                    <p className="text-xs font-black">{recipe.servings}</p>
                  </div>
                </div>

                {/* Start Cooking Button */}
                <div className="pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      sounds.playChime();
                      onStartCooking(recipe);
                    }}
                    className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-current text-white" />
                    <span>{t('launchChefMode', 'Launch Full-Screen Chef Mode')}</span>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* TAB 1: ANIMATED STEP-BY-STEP PREPARATION VIEW */}
            {activeTab === 'animated' && (
              <div className={`p-6 sm:p-7 rounded-3xl border shadow-lg ${
                isDark ? 'bg-[#161F1A] border-[#2A3B30]' : 'bg-white border-[#E8E5DC]'
              }`}>
                {/* Progress bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-xs font-bold mb-2">
                    <span className="text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      {t('step', 'Step')} {currentStepIdx + 1} {t('of', 'of')} {instructionsList.length}
                    </span>
                    <span className="text-[#737B72] dark:text-[#9CA3AF]">
                      {progressPct}% {t('completed', 'Completed')}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full bg-emerald-500 rounded-full"
                      animate={{ width: `${progressPct}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                {/* Step Card with Animated Transition */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStepIdx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className={`p-6 rounded-2xl border mb-6 relative overflow-hidden ${
                      isDark ? 'bg-[#1A241E] border-emerald-500/20' : 'bg-[#FAF8F2] border-[#E8E5DC]'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-black font-black text-lg flex items-center justify-center shrink-0 shadow-md">
                        {currentStepIdx + 1}
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                            {t('chefAction', 'Chef Action')}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleStepCompleted(currentStepIdx)}
                            className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                              completedSteps.includes(currentStepIdx)
                                ? 'bg-emerald-500 text-black font-black'
                                : 'bg-white/10 text-white/70 hover:bg-white/20'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{completedSteps.includes(currentStepIdx) ? t('done', 'Done!') : t('markDone', 'Mark Done')}</span>
                          </button>
                        </div>

                        <p className="text-base sm:text-lg font-bold leading-relaxed pt-1">
                          {instructionsList[currentStepIdx]}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Controls */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    disabled={currentStepIdx === 0}
                    onClick={handlePrevStep}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold border border-white/10 disabled:opacity-40 hover:bg-white/5 transition-all flex items-center gap-1.5"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>{t('previousStep', 'Previous Step')}</span>
                  </button>

                  {/* Step dots */}
                  <div className="flex items-center gap-1.5">
                    {instructionsList.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          sounds.playPop();
                          setCurrentStepIdx(idx);
                        }}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          idx === currentStepIdx
                            ? 'w-6 bg-emerald-500'
                            : completedSteps.includes(idx)
                              ? 'bg-emerald-700'
                              : 'bg-white/20'
                        }`}
                        title={`Go to step ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    disabled={currentStepIdx === instructionsList.length - 1}
                    onClick={handleNextStep}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40 transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <span>{t('nextStep', 'Next Step')}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: FULL RECIPE & NUTRITION OVERVIEW */}
            {activeTab === 'overview' && (
              <>
                {/* Ingredients Breakdown */}
                <div className={`p-6 rounded-3xl border shadow-xs ${
                  isDark ? 'bg-[#161F1A] border-[#2A3B30]' : 'bg-white border-[#E8E5DC]'
                }`}>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-lg font-bold">
                        {t('requiredIngredients', 'Required Ingredients')} ({recipe.ingredients.length})
                      </h3>
                      <p className="text-xs text-[#737B72] dark:text-[#9CA3AF]">
                        Match against your pantry ingredients.
                      </p>
                    </div>

                    {missingList.length > 0 && (
                      <button
                        type="button"
                        disabled={isAddingToShopping}
                        onClick={handleAddMissingToShopping}
                        className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-extrabold transition-all flex items-center gap-1.5"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>{t('addMissingToShopping', 'Add Missing to Shopping List')} ({missingList.length})</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {recipe.ingredients.map((ing, idx) => {
                      const isMatched = matchedListNames.some(
                        (m) => m.toLowerCase() === ing.name.toLowerCase()
                      );

                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-2xl border flex items-center justify-between text-sm transition-all ${
                            isMatched
                              ? isDark
                                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                                : 'bg-[#F0F7F1] border-[#C8E4CF] text-[#1E4627]'
                              : isDark
                                ? 'bg-amber-950/20 border-amber-500/20 text-amber-300'
                                : 'bg-[#FFFBF7] border-[#F2E0D0] text-[#4A3225]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {isMatched ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                            )}
                            <div>
                              <span className="font-bold">{getLocalizedIngredient(ing.name, language)}</span>
                              {ing.notes && <span className="text-xs text-[#737B72] dark:text-[#9CA3AF] ml-1">({ing.notes})</span>}
                            </div>
                          </div>
                          <span className="font-black text-xs px-2.5 py-1 rounded-lg bg-black/20 border border-white/5">
                            {ing.quantity} {ing.unit}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Estimated Nutrition Breakdown */}
                <div className={`p-6 rounded-3xl border shadow-xs ${
                  isDark ? 'bg-[#161F1A] border-[#2A3B30]' : 'bg-white border-[#E8E5DC]'
                }`}>
                  <h3 className="text-lg font-bold mb-3">
                    {t('estimatedNutrition', 'Estimated Nutrition (Per Serving)')}
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                    <div className={`p-3.5 rounded-2xl border text-center ${
                      isDark ? 'bg-[#1C2620] border-white/5' : 'bg-[#FAF8F2] border-[#E8E5DC]'
                    }`}>
                      <span className="text-xs text-[#737B72] dark:text-[#9CA3AF] font-semibold block">Calories</span>
                      <span className="text-xl font-black mt-0.5 block">{recipe.calories}</span>
                      <span className="text-[10px] text-[#737B72] dark:text-[#9CA3AF]">kcal</span>
                    </div>
                    <div className={`p-3.5 rounded-2xl border text-center ${
                      isDark ? 'bg-[#1C2620] border-white/5' : 'bg-[#FAF8F2] border-[#E8E5DC]'
                    }`}>
                      <span className="text-xs text-[#737B72] dark:text-[#9CA3AF] font-semibold block">Protein</span>
                      <span className="text-xl font-black text-emerald-400 mt-0.5 block">{recipe.protein}g</span>
                      <span className="text-[10px] text-[#737B72] dark:text-[#9CA3AF]">muscle repair</span>
                    </div>
                    <div className={`p-3.5 rounded-2xl border text-center ${
                      isDark ? 'bg-[#1C2620] border-white/5' : 'bg-[#FAF8F2] border-[#E8E5DC]'
                    }`}>
                      <span className="text-xs text-[#737B72] dark:text-[#9CA3AF] font-semibold block">Carbs</span>
                      <span className="text-xl font-black mt-0.5 block">{recipe.carbs}g</span>
                      <span className="text-[10px] text-[#737B72] dark:text-[#9CA3AF]">energy</span>
                    </div>
                    <div className={`p-3.5 rounded-2xl border text-center ${
                      isDark ? 'bg-[#1C2620] border-white/5' : 'bg-[#FAF8F2] border-[#E8E5DC]'
                    }`}>
                      <span className="text-xs text-[#737B72] dark:text-[#9CA3AF] font-semibold block">Fat</span>
                      <span className="text-xl font-black mt-0.5 block">{recipe.fat}g</span>
                      <span className="text-[10px] text-[#737B72] dark:text-[#9CA3AF]">healthy lipids</span>
                    </div>
                    <div className={`p-3.5 rounded-2xl border text-center col-span-2 sm:col-span-1 ${
                      isDark ? 'bg-[#1C2620] border-white/5' : 'bg-[#FAF8F2] border-[#E8E5DC]'
                    }`}>
                      <span className="text-xs text-[#737B72] dark:text-[#9CA3AF] font-semibold block">Fiber</span>
                      <span className="text-xl font-black text-emerald-400 mt-0.5 block">{recipe.fiber}g</span>
                      <span className="text-[10px] text-[#737B72] dark:text-[#9CA3AF]">digestion</span>
                    </div>
                  </div>
                </div>

                {/* Full Recipe Steps Overview */}
                <div className={`p-6 rounded-3xl border shadow-xs ${
                  isDark ? 'bg-[#161F1A] border-[#2A3B30]' : 'bg-white border-[#E8E5DC]'
                }`}>
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <ChefHat className="w-5 h-5 text-emerald-400" />
                    <span>{t('step', 'Step')}-by-{t('step', 'Step')} {t('fullRecipeNutrition', 'Instructions')}</span>
                  </h3>

                  <div className="space-y-3 pt-1">
                    {instructionsList.map((stepText, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border flex items-start gap-3.5 text-sm transition-all ${
                          isDark ? 'bg-[#1C2620] border-white/5' : 'bg-[#FAF8F2] border-[#E8E5DC]'
                        }`}
                      >
                        <span className="w-7 h-7 rounded-xl bg-emerald-500 text-black font-black text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <p className="leading-relaxed font-semibold pt-0.5">
                          {stepText}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
