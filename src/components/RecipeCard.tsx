import React, { useState, useRef } from 'react';
import { Clock, Flame, ChefHat, Heart, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { MatchedRecipe, RecipeRecord } from '../types/recipe.ts';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { sounds } from '../utils/soundEffects.ts';
import { useLanguage } from '../context/LanguageContext.tsx';
import {
  getLocalizedRecipeName,
  getLocalizedRecipeDescription,
} from '../utils/localizedRecipes.ts';

interface RecipeCardProps {
  recipe: MatchedRecipe | RecipeRecord;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent, recipeId: string) => void;
  onSelectRecipe: (recipe: MatchedRecipe | RecipeRecord) => void;
  index?: number;
  isDark?: boolean;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  isFavorite,
  onToggleFavorite,
  onSelectRecipe,
  index = 0,
  isDark = true,
}) => {
  const { t, language } = useLanguage();
  const localizedName = getLocalizedRecipeName(recipe, language);
  const localizedDescription = getLocalizedRecipeDescription(recipe, language);
  const [imageError, setImageError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Tilt Physics using framer-motion springs
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7deg', '-7deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7deg', '7deg']);
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // If this card is a MatchedRecipe, extract match info
  const matched = recipe as Partial<MatchedRecipe>;
  const matchPercentage = matched.matchPercentage ?? 0;
  const missingCount = matched.missingIngredients ? matched.missingIngredients.length : 0;
  const isReadyToCook = matched.isReadyToCook ?? false;

  const fallbackImage =
    "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400' fill='%23141A16'%3E%3Crect width='100%25' height='100%25' fill='%23141A16'/%3E%3Ccircle cx='300' cy='180' r='80' fill='%231C2620'/%3E%3Ctext x='50%25' y='190' font-size='48' text-anchor='middle' fill='%2310B981'%3E🍲%3C/text%3E%3Ctext x='50%25' y='300' font-family='sans-serif' font-size='20' font-weight='bold' text-anchor='middle' fill='%239CA3AF'%3EPantryPal Kitchen%3C/text%3E%3C/svg%3E";

  const handleCardClick = () => {
    sounds.playSwoosh();
    onSelectRecipe(recipe);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.4), ease: [0.22, 1, 0.36, 1] }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.98 }}
      className={`relative group backdrop-blur-sm rounded-3xl overflow-hidden border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
        isDark
          ? 'bg-[#141A16] border-[#243328] hover:border-emerald-500/60 shadow-lg hover:shadow-[0_0_25px_rgba(16,185,129,0.2)] text-white'
          : 'bg-white/95 border-[#E8E5DC] hover:border-[#315C43]/50 shadow-sm hover:shadow-2xl text-[#202820]'
      }`}
    >
      {/* Specular glare dynamic reflection */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl z-30"
        style={{
          background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 60%)`,
        }}
      />

      <div>
        {/* Card Header & Image */}
        <div className="relative aspect-16/10 overflow-hidden bg-black/40">
          <img
            src={imageError ? fallbackImage : recipe.imageUrl}
            alt={localizedName || recipe.name}
            onError={() => setImageError(true)}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20">
            {matchPercentage > 0 ? (
              isReadyToCook ? (
                <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-lg backdrop-blur-xs animate-pulse">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t('readyToCook', 'Ready to Cook')}</span>
                </span>
              ) : (
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5 backdrop-blur-md ${
                  isDark ? 'bg-black/80 text-white border border-white/10' : 'bg-white/95 text-[#202820]'
                }`}>
                  <span className="text-emerald-400 font-black">{matchPercentage}% {t('match', 'Match')}</span>
                  {missingCount > 0 && (
                    <span className="text-amber-400 text-[11px] font-bold">
                      ({missingCount} {t('need', 'need')})
                    </span>
                  )}
                </span>
              )
            ) : (
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold shadow-xs backdrop-blur-md ${
                isDark ? 'bg-black/70 text-emerald-300 border border-emerald-500/30' : 'bg-white/90 text-[#315C43]'
              }`}>
                {recipe.cuisine}
              </span>
            )}

            {/* Favorite Button */}
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                sounds.playPop();
                onToggleFavorite(e, recipe.id);
              }}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all backdrop-blur-md shadow-md z-30 ${
                isFavorite
                  ? 'bg-rose-500 text-white hover:bg-rose-600 scale-105'
                  : isDark
                    ? 'bg-black/60 text-white hover:bg-rose-500'
                    : 'bg-white/85 text-[#202820] hover:bg-white hover:text-rose-500'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </motion.button>
          </div>

          {/* Dietary Pills at Bottom of Image */}
          <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1 z-20">
            {recipe.dietaryTags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold tracking-wide shadow-xs border border-white/10"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              {recipe.cuisine} Cuisine
            </span>
            <span className="text-xs font-semibold text-[#737B72] dark:text-[#9CA3AF] flex items-center gap-1">
              <ChefHat className="w-3.5 h-3.5 text-emerald-400" />
              {recipe.difficulty}
            </span>
          </div>

          <h3 className="text-lg font-bold group-hover:text-emerald-400 transition-colors line-clamp-1">
            {localizedName || recipe.name}
          </h3>

          <p className="mt-1 text-xs text-[#737B72] dark:text-[#9CA3AF] line-clamp-2 leading-relaxed">
            {localizedDescription || recipe.description}
          </p>

          {/* Meta Info Bar */}
          <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs font-semibold ${
            isDark ? 'border-white/5 text-[#9CA3AF]' : 'border-[#E8E5DC] text-[#737B72]'
          }`}>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              {recipe.prepTime + recipe.cookTime} {t('minutesShort', 'mins')}
            </span>

            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              {recipe.calories} kcal
            </span>

            <span>
              {recipe.ingredients.length} {t('itemsShort', 'items')}
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer Status */}
      <div className="px-5 pb-4">
        {matchPercentage > 0 && missingCount > 0 ? (
          <div className={`text-[11px] font-semibold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${
            isDark
              ? 'bg-amber-950/20 text-amber-400 border-amber-500/20'
              : 'text-[#B45309] bg-amber-50/80 border-amber-200/60'
          }`}>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="truncate">{t('missing', 'Missing')}: {missingCount}</span>
          </div>
        ) : matchPercentage > 0 && isReadyToCook ? (
          <div className={`text-[11px] font-semibold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${
            isDark
              ? 'bg-emerald-950/30 text-emerald-300 border-emerald-500/30'
              : 'text-emerald-800 bg-emerald-50 border-emerald-200/60'
          }`}>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{t('readyToCookNow', 'Ready to cook right now!')}</span>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
};
