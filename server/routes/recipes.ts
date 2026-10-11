import { Router, Request, Response } from 'express';
import { getDb } from '../database/db';
import { matchRecipes, MatchFilter } from '../services/recipeMatcher';
import { RecipeRecord } from '../database/recipesData';

const router = Router();

function formatDbRecipe(row: any): RecipeRecord {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    cuisine: row.cuisine,
    prepTime: row.prep_time,
    cookTime: row.cook_time,
    servings: row.servings,
    difficulty: row.difficulty,
    imageUrl: row.image_url,
    dietaryTags: JSON.parse(row.dietary_tags || '[]'),
    ingredients: JSON.parse(row.ingredients || '[]'),
    instructions: JSON.parse(row.instructions || '[]'),
    calories: row.calories,
    protein: row.protein,
    carbs: row.carbs,
    fat: row.fat,
    fiber: row.fiber
  };
}

// GET /api/recipes - list all recipes
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDb();
    const rows = await db.all('SELECT * FROM recipes ORDER BY name ASC');
    const recipes = rows.map(formatDbRecipe);
    res.json(recipes);
  } catch (error: any) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Failed to retrieve recipes' });
  }
});

// GET /api/recipes/:id - get recipe details
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDb();
    const row = await db.get('SELECT * FROM recipes WHERE id = ?', req.params.id);
    if (!row) {
      res.status(404).json({ error: 'Recipe not found' });
      return;
    }
    res.json(formatDbRecipe(row));
  } catch (error: any) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ error: 'Failed to retrieve recipe' });
  }
});

// POST /api/recipes/suggest - match recipes with user ingredients and filters
router.post('/suggest', async (req: Request, res: Response): Promise<void> => {
  try {
    const { ingredients = [], filters = {} } = req.body;

    if (!Array.isArray(ingredients)) {
      res.status(400).json({ error: 'Ingredients must be provided as an array of strings' });
      return;
    }

    const db = await getDb();
    const rows = await db.all('SELECT * FROM recipes');
    const allRecipes = rows.map(formatDbRecipe);

    const matches = matchRecipes(allRecipes, ingredients, filters as MatchFilter);
    res.json({
      total: matches.length,
      recipes: matches
    });
  } catch (error: any) {
    console.error('Error suggesting recipes:', error);
    res.status(500).json({ error: 'Failed to match recipes' });
  }
});

export default router;

