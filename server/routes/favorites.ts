import { Router, Request, Response } from 'express';
import { getDb } from '../database/db';

const router = Router();

// GET /api/favorites - get all favorite recipes
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDb();
    const rows = await db.all(`
      SELECT r.*, f.created_at as favorited_at
      FROM favorites f
      JOIN recipes r ON f.recipe_id = r.id
      ORDER BY f.created_at DESC
    `);

    const formatted = rows.map(row => ({
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
      fiber: row.fiber,
      favoritedAt: row.favorited_at
    }));

    res.json(formatted);
  } catch (error: any) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Failed to retrieve favorites' });
  }
});

// POST /api/favorites - add to favorites
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { recipeId } = req.body;
    if (!recipeId) {
      res.status(400).json({ error: 'Recipe ID is required' });
      return;
    }

    const db = await getDb();
    const recipe = await db.get('SELECT id FROM recipes WHERE id = ?', recipeId);
    if (!recipe) {
      res.status(404).json({ error: 'Recipe not found' });
      return;
    }

    const id = 'fav-' + Date.now();
    await db.run(
      'INSERT OR IGNORE INTO favorites (id, recipe_id) VALUES (?, ?)',
      [id, recipeId]
    );

    res.status(201).json({ success: true, recipeId });
  } catch (error: any) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
});

// DELETE /api/favorites/:recipeId - remove from favorites
router.delete('/:recipeId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { recipeId } = req.params;
    const db = await getDb();
    const result = await db.run('DELETE FROM favorites WHERE recipe_id = ?', recipeId);
    if (result.changes === 0) {
      res.status(404).json({ error: 'Favorite not found' });
      return;
    }
    res.json({ success: true, message: 'Removed from favorites' });
  } catch (error: any) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});

export default router;

