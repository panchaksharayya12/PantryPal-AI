export interface RecipeIngredient {
  name: string;
  quantity: string;
  unit: string;
  notes?: string;
}

export interface RecipeRecord {
  id: string;
  name: string;
  description: string;
  cuisine: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  imageUrl: string;
  dietaryTags: string[];
  ingredients: RecipeIngredient[];
  instructions: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface MatchedRecipe extends RecipeRecord {
  matchedIngredients: string[];
  missingIngredients: RecipeIngredient[];
  matchPercentage: number;
  isReadyToCook: boolean;
}

export interface MatchFilter {
  diet?: string;
  cuisine?: string;
  maxPrepTime?: number;
  difficulty?: string;
  minMatch?: number;
}

