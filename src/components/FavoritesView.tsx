import React, { useState, useEffect } from 'react';
import { Heart, SearchX, Sparkles, ChefHat } from 'lucide-react';
import { RecipeRecord, MatchedRecipe } from '../types/recipe.ts';
import { RecipeCard } from './RecipeCard.tsx';
import { fetchFavorites, removeFavorite } from '../api/client.ts';

interface FavoritesViewProps {
  onSelectRecipe: (recipe: RecipeRecord) => void;
  onFavoritesChange: () => void;
  onExploreRecipes: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  onSelectRecipe,
  onFavoritesChange,
  onExploreRecipes,
}) => {
  const [favorites, setFavorites] = useState<RecipeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      const data = await fetchFavorites();
      setFavorites(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleToggleFavorite = async (e: React.MouseEvent, recipeId: string) => {
    e.stopPropagation();
    try {
      await removeFavorite(recipeId);
      setFavorites((prev) => prev.filter((r) => r.id !== recipeId));
      onFavoritesChange();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E5DC] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold mb-2">
            <Heart className="w-4 h-4 fill-current" />
            <span>Saved Recipes</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#202820]">Your Favorites</h2>
          <p className="text-sm text-[#737B72] mt-1">
            {favorites.length} saved dish{favorites.length === 1 ? '' : 'es'} ready for quick cooking anytime.
          </p>
        </div>

        {favorites.length > 0 && (
          <button
            onClick={onExploreRecipes}
            className="px-5 py-2.5 rounded-2xl bg-[#FAF8F2] hover:bg-[#E6F0E6] text-[#315C43] border border-[#315C43]/30 text-sm font-bold shadow-xs transition-all flex items-center gap-2"
          >
            <ChefHat className="w-4 h-4" />
            <span>Discover More Recipes</span>
          </button>
        )}
      </div>

      {/* Grid of Favorites */}
      {isLoading ? (
        <div className="text-center py-12 text-sm text-[#737B72]">
          Loading favorites...
        </div>
      ) : favorites.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E8E5DC] max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-[#202820]">No favorite recipes saved yet</h3>
          <p className="text-sm text-[#737B72] mt-2 max-w-md mx-auto">
            Click the heart icon on any recipe card or details page to pin recipes here for fast access.
          </p>
          <button
            onClick={onExploreRecipes}
            className="mt-6 px-7 py-3 rounded-2xl bg-[#315C43] hover:bg-[#244733] text-white font-extrabold text-sm shadow-sm transition-all"
          >
            Explore Recipe Collection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((r, idx) => (
            <RecipeCard
              key={r.id}
              recipe={r}
              index={idx}
              isFavorite={true}
              onToggleFavorite={handleToggleFavorite}
              onSelectRecipe={onSelectRecipe}
            />
          ))}
        </div>
      )}

    </div>
  );
};

