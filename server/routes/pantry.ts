import { Router, Request, Response } from 'express';
import { getDb } from '../database/db';

const router = Router();

// GET /api/pantry - list pantry items
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDb();
    const items = await db.all('SELECT * FROM pantry_items ORDER BY created_at DESC');
    res.json(items);
  } catch (error: any) {
    console.error('Error fetching pantry:', error);
    res.status(500).json({ error: 'Failed to retrieve pantry items' });
  }
});

// POST /api/pantry - add item
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, quantity = 1, unit = 'piece', category = 'General', expiry_date = null } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      res.status(400).json({ error: 'Ingredient name is required' });
      return;
    }

    const id = 'pan-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
    const db = await getDb();

    await db.run(
      `INSERT INTO pantry_items (id, name, quantity, unit, category, expiry_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, name.trim(), Number(quantity) || 1, unit.trim(), category.trim(), expiry_date || null]
    );

    const created = await db.get('SELECT * FROM pantry_items WHERE id = ?', id);
    res.status(201).json(created);
  } catch (error: any) {
    console.error('Error adding pantry item:', error);
    res.status(500).json({ error: 'Failed to add pantry item' });
  }
});

// PUT /api/pantry/:id - update item
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, quantity, unit, category, expiry_date } = req.body;

    const db = await getDb();
    const existing = await db.get('SELECT * FROM pantry_items WHERE id = ?', id);
    if (!existing) {
      res.status(404).json({ error: 'Pantry item not found' });
      return;
    }

    const updatedName = name !== undefined ? String(name).trim() : existing.name;
    const updatedQty = quantity !== undefined ? Number(quantity) : existing.quantity;
    const updatedUnit = unit !== undefined ? String(unit).trim() : existing.unit;
    const updatedCat = category !== undefined ? String(category).trim() : existing.category;
    const updatedExp = expiry_date !== undefined ? expiry_date : existing.expiry_date;

    await db.run(
      `UPDATE pantry_items
       SET name = ?, quantity = ?, unit = ?, category = ?, expiry_date = ?
       WHERE id = ?`,
      [updatedName, updatedQty, updatedUnit, updatedCat, updatedExp, id]
    );

    const updated = await db.get('SELECT * FROM pantry_items WHERE id = ?', id);
    res.json(updated);
  } catch (error: any) {
    console.error('Error updating pantry item:', error);
    res.status(500).json({ error: 'Failed to update pantry item' });
  }
});

// DELETE /api/pantry/:id - remove item
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const db = await getDb();
    const result = await db.run('DELETE FROM pantry_items WHERE id = ?', id);
    if (result.changes === 0) {
      res.status(404).json({ error: 'Pantry item not found' });
      return;
    }
    res.json({ success: true, message: 'Pantry item deleted' });
  } catch (error: any) {
    console.error('Error deleting pantry item:', error);
    res.status(500).json({ error: 'Failed to delete pantry item' });
  }
});

export default router;

