import React from 'react';
import { RecipeCard } from './RecipeCard.tsx';
import { MatchedRecipe, RecipeRecord } from '../types/recipe.ts';
import { Utensils, SearchX, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';

interface RecipeGridProps {
  recipes: (MatchedRecipe | RecipeRecord)[];
  favorites: string[];
  onToggleFavorite: (e: React.MouseEvent, recipeId: string) => void;
  onSelectRecipe: (recipe: MatchedRecipe | RecipeRecord) => void;
  isLoading: boolean;
  hasSearched: boolean;
  onClearFilters?: () => void;
  isDark?: boolean;
}

export const RecipeGrid: React.FC<RecipeGridProps> = ({
  recipes,
  favorites,
  onToggleFavorite,
  onSelectRecipe,
  isLoading,
  hasSearched,
  onClearFilters,
  isDark = true,
}) => {
  const { t } = useLanguage();
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className={`rounded-3xl overflow-hidden border p-4 space-y-4 animate-pulse ${
              isDark ? 'bg-[#141A16] border-[#243328]' : 'bg-white border-[#E8E5DC]'
            }`}
          >
            <div className={`w-full aspect-16/10 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-[#E6F0E6]'}`} />
            <div className={`h-4 rounded w-1/3 ${isDark ? 'bg-white/10' : 'bg-[#E5E7EB]'}`} />
            <div className={`h-6 rounded w-3/4 ${isDark ? 'bg-white/10' : 'bg-[#E5E7EB]'}`} />
            <div className={`h-3 rounded w-full ${isDark ? 'bg-white/5' : 'bg-[#E5E7EB]'}`} />
            <div className={`h-8 rounded-xl w-full ${isDark ? 'bg-white/5' : 'bg-[#FAF8F2]'}`} />
          </div>
        ))}
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className={`text-center py-16 px-4 rounded-3xl border max-w-2xl mx-auto shadow-xs ${
        isDark ? 'bg-[#141A16] border-[#243328] text-white' : 'bg-white border-[#E8E5DC] text-[#202820]'
      }`}>
        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 border ${
          isDark ? 'bg-white/5 text-[#9CA3AF] border-white/10' : 'bg-[#FAF8F2] text-[#737B72] border-[#E8E5DC]'
        }`}>
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold">
          {t('noMatchingRecipes', 'No matching recipes found')}
        </h3>
        <p className="mt-2 text-sm text-[#737B72] dark:text-[#9CA3AF] max-w-md mx-auto">
          {t('noMatchingSubtitle', "We couldn't find any recipes that match your current ingredients and filter criteria. Try adding more common pantry staples or loosening dietary and time restrictions.")}
        </p>
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="mt-6 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition-all shadow-sm"
          >
            {t('resetAllFilters', 'Reset All Filters')}
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-extrabold">
            {hasSearched ? t('recommendedRecipes', 'Recommended Recipes') : t('exploreAllDishes', 'Explore All Dishes')}
          </h3>
          <p className="text-xs text-[#737B72] dark:text-[#9CA3AF]">
            {recipes.length} {t('matchesFound', 'recipe matches')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {recipes.map((r, idx) => (
          <RecipeCard
            key={r.id}
            recipe={r}
            index={idx}
            isFavorite={favorites.includes(r.id)}
            onToggleFavorite={onToggleFavorite}
            onSelectRecipe={onSelectRecipe}
            isDark={isDark}
          />
        ))}
      </div>
    </div>
  );
};
