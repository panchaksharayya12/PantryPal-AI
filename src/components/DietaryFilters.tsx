import React from 'react';
import { Filter, RotateCcw, Clock, Globe2, ChefHat, Percent } from 'lucide-react';
import { MatchFilter } from '../types/recipe.ts';
import { useLanguage } from '../context/LanguageContext.tsx';

interface DietaryFiltersProps {
  filters: MatchFilter;
  setFilters: React.Dispatch<React.SetStateAction<MatchFilter>>;
  onFilterChange: (newFilters: MatchFilter) => void;
  isDark?: boolean;
}

const DIETARY_OPTIONS = [
  { id: 'all', key: 'dietAll', label: 'All Diets' },
  { id: 'vegetarian', key: 'dietVegetarian', label: 'Vegetarian' },
  { id: 'vegan', key: 'dietVegan', label: 'Vegan' },
  { id: 'high protein', key: 'dietHighProtein', label: 'High Protein' },
  { id: 'gluten-free', key: 'dietGlutenFree', label: 'Gluten-Free' },
  { id: 'dairy-free', key: 'dietDairyFree', label: 'Dairy-Free' },
  { id: 'egg-free', key: 'dietEggFree', label: 'Egg-Free' },
];

const CUISINE_OPTIONS = [
  { id: 'All', key: 'cuisineAll', label: 'All' },
  { id: 'Indian', key: 'cuisineIndian', label: 'Indian' },
  { id: 'Italian', key: 'cuisineItalian', label: 'Italian' },
  { id: 'Asian', key: 'cuisineAsian', label: 'Asian' },
  { id: 'Mexican', key: 'cuisineMexican', label: 'Mexican' },
  { id: 'Mediterranean', key: 'cuisineMediterranean', label: 'Mediterranean' },
  { id: 'Middle Eastern', key: 'cuisineMiddleEastern', label: 'Middle Eastern' },
  { id: 'American', key: 'cuisineAmerican', label: 'American' }
];

const TIME_OPTIONS = [
  { value: 90, key: 'timeAny', label: 'Any time' },
  { value: 10, key: 'timeUnder10', label: 'Under 10 mins' },
  { value: 15, key: 'timeUnder15', label: 'Under 15 mins' },
  { value: 20, key: 'timeUnder20', label: 'Under 20 mins' },
  { value: 30, key: 'timeUnder30', label: 'Under 30 mins' },
];

const DIFFICULTY_OPTIONS = [
  { id: 'All', key: 'diffAll', label: 'Any difficulty' },
  { id: 'Easy', key: 'diffEasy', label: 'Easy' },
  { id: 'Medium', key: 'diffMedium', label: 'Medium' },
  { id: 'Hard', key: 'diffHard', label: 'Hard' },
];

const MATCH_OPTIONS = [
  { value: 0, key: 'matchAny', label: 'Any Match (0%+)' },
  { value: 25, key: 'match25', label: 'At least 25% match' },
  { value: 50, key: 'match50', label: 'At least 50% match' },
  { value: 75, key: 'match75', label: 'At least 75% match' },
  { value: 100, key: 'match100', label: 'Ready to Cook (100% match)' },
];

export const DietaryFilters: React.FC<DietaryFiltersProps> = ({
  filters,
  setFilters,
  onFilterChange,
  isDark = true,
}) => {
  const { t } = useLanguage();
  const isAnyFilterActive =
    (filters.diet && filters.diet !== 'all') ||
    (filters.cuisine && filters.cuisine !== 'All') ||
    (filters.maxPrepTime && filters.maxPrepTime < 90) ||
    (filters.difficulty && filters.difficulty !== 'All') ||
    (filters.minMatch && filters.minMatch > 0);

  const handleDietSelect = (diet: string) => {
    const updated = { ...filters, diet };
    setFilters(updated);
    onFilterChange(updated);
  };

  const handleCuisineSelect = (cuisine: string) => {
    const updated = { ...filters, cuisine };
    setFilters(updated);
    onFilterChange(updated);
  };

  const handleTimeSelect = (minutes: number) => {
    const updated = { ...filters, maxPrepTime: minutes };
    setFilters(updated);
    onFilterChange(updated);
  };

  const handleDifficultySelect = (difficulty: string) => {
    const updated = { ...filters, difficulty };
    setFilters(updated);
    onFilterChange(updated);
  };

  const handleMinMatchSelect = (minMatch: number) => {
    const updated = { ...filters, minMatch };
    setFilters(updated);
    onFilterChange(updated);
  };

  const handleReset = () => {
    const resetFilters: MatchFilter = {
      diet: 'all',
      cuisine: 'All',
      maxPrepTime: 90,
      difficulty: 'All',
      minMatch: 0
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className={`rounded-3xl p-5 sm:p-6 mb-8 border shadow-xs transition-all ${
      isDark
        ? 'bg-[#141A16] border-[#243328] text-white'
        : 'bg-[#FAF8F2] border-[#E8E5DC] text-[#202820]'
    }`}>
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-black/10 dark:border-white/10">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-base">{t('filterTitle', 'Filter & Refine Dishes')}</h3>
        </div>

        {isAnyFilterActive && (
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#737B72] dark:text-[#9CA3AF] hover:text-emerald-400 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('resetFilters', 'Reset Filters')}</span>
          </button>
        )}
      </div>

      {/* Dietary Pills */}
      <div className="mt-4">
        <label className="text-xs font-bold text-[#737B72] dark:text-[#9CA3AF] uppercase tracking-wide block mb-2">
          {t('dietSuitability', 'Dietary Suitability')}
        </label>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {DIETARY_OPTIONS.map((opt) => {
            const isSelected = (filters.diet || 'all').toLowerCase() === opt.id.toLowerCase();
            return (
              <button
                key={opt.id}
                onClick={() => handleDietSelect(opt.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : isDark
                      ? 'bg-[#18201B] text-[#9CA3AF] border border-white/5 hover:bg-[#222E26] hover:text-white'
                      : 'bg-white text-[#202820] border border-[#E8E5DC] hover:bg-[#E6F0E6]'
                }`}
              >
                {t(opt.key, opt.label)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Dropdowns / Selectors */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Cuisine */}
        <div>
          <label className="text-xs font-bold text-[#737B72] dark:text-[#9CA3AF] uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
            <Globe2 className="w-3.5 h-3.5 text-emerald-400" /> {t('cuisineLabel', 'Cuisine')}
          </label>
          <select
            value={filters.cuisine || 'All'}
            onChange={(e) => handleCuisineSelect(e.target.value)}
            className={`w-full px-3 py-2 rounded-xl border text-sm font-medium outline-none transition-all cursor-pointer ${
              isDark
                ? 'bg-[#18201B] border-[#2A3B30] text-white focus:border-emerald-500'
                : 'bg-white border-[#E8E5DC] text-[#202820] focus:border-[#315C43]'
            }`}
          >
            {CUISINE_OPTIONS.map((c) => (
              <option key={c.id} value={c.id} className={isDark ? 'bg-[#18201B]' : 'bg-white'}>
                {t(c.key, c.label)}
              </option>
            ))}
          </select>
        </div>

        {/* Max Prep Time */}
        <div>
          <label className="text-xs font-bold text-[#737B72] dark:text-[#9CA3AF] uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-400" /> {t('maxPrepTimeLabel', 'Max Prep Time')}
          </label>
          <select
            value={filters.maxPrepTime || 90}
            onChange={(e) => handleTimeSelect(Number(e.target.value))}
            className={`w-full px-3 py-2 rounded-xl border text-sm font-medium outline-none transition-all cursor-pointer ${
              isDark
                ? 'bg-[#18201B] border-[#2A3B30] text-white focus:border-emerald-500'
                : 'bg-white border-[#E8E5DC] text-[#202820] focus:border-[#315C43]'
            }`}
          >
            {TIME_OPTIONS.map((tOpt) => (
              <option key={tOpt.value} value={tOpt.value} className={isDark ? 'bg-[#18201B]' : 'bg-white'}>
                {t(tOpt.key, tOpt.label)}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div>
          <label className="text-xs font-bold text-[#737B72] dark:text-[#9CA3AF] uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
            <ChefHat className="w-3.5 h-3.5 text-emerald-400" /> {t('difficultyLabel', 'Difficulty')}
          </label>
          <select
            value={filters.difficulty || 'All'}
            onChange={(e) => handleDifficultySelect(e.target.value)}
            className={`w-full px-3 py-2 rounded-xl border text-sm font-medium outline-none transition-all cursor-pointer ${
              isDark
                ? 'bg-[#18201B] border-[#2A3B30] text-white focus:border-emerald-500'
                : 'bg-white border-[#E8E5DC] text-[#202820] focus:border-[#315C43]'
            }`}
          >
            {DIFFICULTY_OPTIONS.map((dOpt) => (
              <option key={dOpt.id} value={dOpt.id} className={isDark ? 'bg-[#18201B]' : 'bg-white'}>
                {t(dOpt.key, dOpt.label)}
              </option>
            ))}
          </select>
        </div>

        {/* Minimum Match % */}
        <div>
          <label className="text-xs font-bold text-[#737B72] dark:text-[#9CA3AF] uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
            <Percent className="w-3.5 h-3.5 text-emerald-400" /> {t('minMatchLabel', 'Min Match %')}
          </label>
          <select
            value={filters.minMatch || 0}
            onChange={(e) => handleMinMatchSelect(Number(e.target.value))}
            className={`w-full px-3 py-2 rounded-xl border text-sm font-medium outline-none transition-all cursor-pointer ${
              isDark
                ? 'bg-[#18201B] border-[#2A3B30] text-white focus:border-emerald-500'
                : 'bg-white border-[#E8E5DC] text-[#202820] focus:border-[#315C43]'
            }`}
          >
            {MATCH_OPTIONS.map((mOpt) => (
              <option key={mOpt.value} value={mOpt.value} className={isDark ? 'bg-[#18201B]' : 'bg-white'}>
                {t(mOpt.key, mOpt.label)}
              </option>
            ))}
          </select>
        </div>

      </div>
    </div>
  );
};
