import { Router, Request, Response } from 'express';
import { getDb } from '../database/db';

const router = Router();

// GET /api/shopping-list - list all shopping items
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDb();
    const items = await db.all('SELECT * FROM shopping_list_items ORDER BY checked ASC, created_at DESC');
    res.json(items);
  } catch (error: any) {
    console.error('Error fetching shopping list:', error);
    res.status(500).json({ error: 'Failed to retrieve shopping list' });
  }
});

// POST /api/shopping-list - add single or multiple items
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDb();
    const payload = req.body;

    // Check if bulk insert (e.g. from recipe missing ingredients)
    if (Array.isArray(payload)) {
      const inserted = [];
      const stmt = await db.prepare(
        `INSERT INTO shopping_list_items (id, name, quantity, unit, checked, recipe_id)
         VALUES (?, ?, ?, ?, 0, ?)`
      );

      for (const item of payload) {
        if (!item.name || !item.name.trim()) continue;
        const id = 'shop-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
        await stmt.run(
          id,
          item.name.trim(),
          Number(item.quantity) || 1,
          (item.unit || 'item').trim(),
          item.recipeId || null
        );
        inserted.push({ id, ...item, checked: 0 });
      }
      await stmt.finalize();

      const all = await db.all('SELECT * FROM shopping_list_items ORDER BY checked ASC, created_at DESC');
      res.status(201).json(all);
      return;
    }

    const { name, quantity = 1, unit = 'item', recipeId = null } = payload;
    if (!name || typeof name !== 'string' || !name.trim()) {
      res.status(400).json({ error: 'Item name is required' });
      return;
    }

    const id = 'shop-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
    await db.run(
      `INSERT INTO shopping_list_items (id, name, quantity, unit, checked, recipe_id)
       VALUES (?, ?, ?, ?, 0, ?)`,
      [id, name.trim(), Number(quantity) || 1, unit.trim(), recipeId]
    );

    const created = await db.get('SELECT * FROM shopping_list_items WHERE id = ?', id);
    res.status(201).json(created);
  } catch (error: any) {
    console.error('Error adding to shopping list:', error);
    res.status(500).json({ error: 'Failed to add item to shopping list' });
  }
});

// PATCH /api/shopping-list/:id - toggle checked or update
router.patch('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { checked, quantity, unit, name } = req.body;
    const db = await getDb();

    const existing = await db.get('SELECT * FROM shopping_list_items WHERE id = ?', id);
    if (!existing) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }

    const newChecked = checked !== undefined ? (checked ? 1 : 0) : existing.checked;
    const newQty = quantity !== undefined ? Number(quantity) : existing.quantity;
    const newUnit = unit !== undefined ? String(unit).trim() : existing.unit;
    const newName = name !== undefined ? String(name).trim() : existing.name;

    await db.run(
      `UPDATE shopping_list_items
       SET checked = ?, quantity = ?, unit = ?, name = ?
       WHERE id = ?`,
      [newChecked, newQty, newUnit, newName, id]
    );

    const updated = await db.get('SELECT * FROM shopping_list_items WHERE id = ?', id);
    res.json(updated);
  } catch (error: any) {
    console.error('Error updating shopping list item:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// DELETE /api/shopping-list/:id - delete item
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const db = await getDb();

    // Special query support: DELETE /api/shopping-list/completed to clear checked
    if (id === 'completed' || id === 'clear-completed') {
      await db.run('DELETE FROM shopping_list_items WHERE checked = 1');
      res.json({ success: true, message: 'Cleared completed items' });
      return;
    }

    const result = await db.run('DELETE FROM shopping_list_items WHERE id = ?', id);
    if (result.changes === 0) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    res.json({ success: true, message: 'Item deleted' });
  } catch (error: any) {
    console.error('Error deleting shopping item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// DELETE /api/shopping-list - clear completed or all
router.delete('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { mode } = req.query;
    const db = await getDb();
    if (mode === 'all') {
      await db.run('DELETE FROM shopping_list_items');
    } else {
      await db.run('DELETE FROM shopping_list_items WHERE checked = 1');
    }
    res.json({ success: true, message: 'Shopping list updated' });
  } catch (error: any) {
    console.error('Error clearing shopping list:', error);
    res.status(500).json({ error: 'Failed to clear shopping list' });
  }
});

export default router;

