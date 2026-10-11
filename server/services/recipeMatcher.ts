import { RecipeRecord, RecipeIngredient } from '../database/recipesData';

export interface MatchFilter {
  diet?: string;
  cuisine?: string;
  maxPrepTime?: number;
  difficulty?: string;
  minMatch?: number;
}

export interface MatchedRecipe extends RecipeRecord {
  matchedIngredients: string[];
  missingIngredients: RecipeIngredient[];
  matchPercentage: number;
  isReadyToCook: boolean;
}

// Common ingredient synonyms and stems for intelligent matching
const STEM_MAP: Record<string, string> = {
  tomatoes: 'tomato',
  potatoes: 'potato',
  onions: 'onion',
  eggs: 'egg',
  chilies: 'chili',
  chilli: 'chili',
  chillies: 'chili',
  peppers: 'pepper',
  carrots: 'carrot',
  cloves: 'clove',
  leaves: 'leaf',
  peas: 'pea',
  peanuts: 'peanut',
  haldi: 'turmeric',
  jeera: 'cumin',
  dhania: 'coriander',
  rai: 'mustard',
  sasive: 'mustard',
  elaichi: 'cardamom',
  dalchini: 'cinnamon',
  garammasala: 'garam masala',
  mirch: 'chilli',
  curryleaves: 'curry leaves',
  karibevu: 'curry leaves',
  karimenasu: 'pepper',
  kalimirch: 'pepper',
  kasurimethi: 'kasuri methi',
  chaatmasala: 'chaat masala',
  aaloo: 'potato',
  alugadde: 'potato',
  pyaaz: 'onion',
  eerulli: 'onion',
  lehsun: 'garlic',
  bellulli: 'garlic',
  adrak: 'ginger',
  shunti: 'ginger'
};

// Core defining proteins & main bases. If a recipe's title requires one of these,
// user must have that ingredient (or synonym) to be recommended.
const CORE_PROTEINS = [
  { key: 'egg', matches: ['egg', 'eggs'] },
  { key: 'omelette', matches: ['egg', 'eggs'] },
  { key: 'omelet', matches: ['egg', 'eggs'] },
  { key: 'shakshuka', matches: ['egg', 'eggs'] },
  { key: 'chicken', matches: ['chicken'] },
  { key: 'fish', matches: ['fish', 'salmon', 'prawn', 'shrimp'] },
  { key: 'salmon', matches: ['salmon', 'fish'] },
  { key: 'prawn', matches: ['prawn', 'prawns', 'shrimp'] },
  { key: 'paneer', matches: ['paneer'] },
  { key: 'tofu', matches: ['tofu'] },
  { key: 'mushroom', matches: ['mushroom', 'mushrooms'] }
];

function normalizeIngredientName(name: string): string {
  let cleaned = name.toLowerCase()
    .replace(/\(.*?\)/g, '') // remove parentheticals like (boiled)
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim();

  // Replace plural words
  const words = cleaned.split(/\s+/).map(w => STEM_MAP[w] || w);
  return words.join(' ');
}

export function isIngredientMatch(userIng: string, recipeIngName: string): boolean {
  const normUser = normalizeIngredientName(userIng);
  const normRecipe = normalizeIngredientName(recipeIngName);

  if (!normUser || !normRecipe) return false;

  // Exact match
  if (normUser === normRecipe) return true;

  // Substring check (e.g., "rice" in "basmati rice", "egg" in "hard boiled eggs", "tomato" in "ripe tomato")
  if (normRecipe.includes(normUser) || normUser.includes(normRecipe)) {
    return true;
  }

  // Word-level overlap (e.g. "pasta" matches "pasta spaghetti")
  const userWords = normUser.split(' ');
  const recipeWords = normRecipe.split(' ');
  return userWords.some(w => w.length > 2 && recipeWords.includes(w));
}

export function matchRecipes(
  recipes: RecipeRecord[],
  userIngredients: string[],
  filters: MatchFilter = {}
): MatchedRecipe[] {
  const normalizedUserList = userIngredients.map(i => i.trim()).filter(Boolean);

  const results: MatchedRecipe[] = [];

  for (const recipe of recipes) {
    // 1. Dietary filter check
    if (filters.diet && filters.diet.toLowerCase() !== 'all') {
      const targetDiet = filters.diet.toLowerCase();
      const hasDiet = recipe.dietaryTags.some(tag => tag.toLowerCase() === targetDiet);
      if (!hasDiet) continue;
    }

    // 2. Cuisine filter
    if (filters.cuisine && filters.cuisine.toLowerCase() !== 'all') {
      if (recipe.cuisine.toLowerCase() !== filters.cuisine.toLowerCase()) {
        continue;
      }
    }

    // 3. Max prep time filter
    if (filters.maxPrepTime && filters.maxPrepTime > 0) {
      if (recipe.prepTime > filters.maxPrepTime) {
        continue;
      }
    }

    // 4. Difficulty filter
    if (filters.difficulty && filters.difficulty.toLowerCase() !== 'all') {
      if (recipe.difficulty.toLowerCase() !== filters.difficulty.toLowerCase()) {
        continue;
      }
    }

    // 5. Calculate ingredient matches
    const matchedNames: string[] = [];
    const missing: RecipeIngredient[] = [];

    for (const ing of recipe.ingredients) {
      const matchFound = normalizedUserList.some(userIng => isIngredientMatch(userIng, ing.name));
      if (matchFound) {
        matchedNames.push(ing.name);
      } else {
        missing.push(ing);
      }
    }

    const totalIngredients = recipe.ingredients.length;
    const matchCount = matchedNames.length;
    const matchPercentage = totalIngredients > 0
      ? Math.round((matchCount / totalIngredients) * 100)
      : 0;

    // If user provided ingredients, strictly only suggest dishes containing their ingredients
    if (normalizedUserList.length > 0 && matchCount === 0) {
      continue;
    }

    // If recipe's defining protein/core is missing and user provided custom ingredients, skip it
    if (normalizedUserList.length > 0) {
      const lowerName = recipe.name.toLowerCase();
      const isMissingRequiredCore = CORE_PROTEINS.some(core => {
        if (!lowerName.includes(core.key)) return false;
        const userHasCore = normalizedUserList.some(userIng =>
          core.matches.some(m => isIngredientMatch(userIng, m))
        );
        return !userHasCore;
      });

      if (isMissingRequiredCore) {
        continue;
      }
    }

    // Minimum match filter
    if (filters.minMatch !== undefined && filters.minMatch > 0) {
      if (matchPercentage < filters.minMatch) {
        continue;
      }
    }

    results.push({
      ...recipe,
      matchedIngredients: matchedNames,
      missingIngredients: missing,
      matchPercentage,
      isReadyToCook: missing.length === 0
    });
  }

  // Sort: highest match % first, then fewest missing ingredients, then fastest prep time
  results.sort((a, b) => {
    if (b.matchPercentage !== a.matchPercentage) {
      return b.matchPercentage - a.matchPercentage;
    }
    if (a.missingIngredients.length !== b.missingIngredients.length) {
      return a.missingIngredients.length - b.missingIngredients.length;
    }
    return a.prepTime - b.prepTime;
  });

  return results;
}

