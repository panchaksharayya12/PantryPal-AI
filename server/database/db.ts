import path from 'path';
import fs from 'fs';
import { SEED_RECIPES } from './recipesData';

let dbInstance: any = null;

export async function getDb(): Promise<any> {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    const sqlite3Module = await import('sqlite3');
    const sqliteModule = await import('sqlite');
    const sqlite3 = sqlite3Module.default || sqlite3Module;
    const { open } = sqliteModule;

    const dbDir = process.env.VERCEL ? '/tmp' : path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    const dbPath = process.env.DATABASE_PATH || path.join(dbDir, 'pantrypal.db');

    dbInstance = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // Enable WAL mode and foreign keys for performance and safety
    await dbInstance.run('PRAGMA foreign_keys = ON;');

    await initSchema(dbInstance);
    await seedInitialData(dbInstance);

    return dbInstance;
  } catch (err) {
    console.warn('Native sqlite3 unavailable or failed, falling back to in-memory store:', err);
    dbInstance = createMockDb();
    return dbInstance;
  }
}

async function initSchema(db: any) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS recipes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      cuisine TEXT NOT NULL,
      prep_time INTEGER NOT NULL,
      cook_time INTEGER NOT NULL,
      servings INTEGER NOT NULL,
      difficulty TEXT NOT NULL,
      image_url TEXT NOT NULL,
      dietary_tags TEXT NOT NULL,
      ingredients TEXT NOT NULL,
      instructions TEXT NOT NULL,
      calories INTEGER NOT NULL,
      protein INTEGER NOT NULL,
      carbs INTEGER NOT NULL,
      fat INTEGER NOT NULL,
      fiber INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS pantry_items (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      quantity REAL NOT NULL DEFAULT 1,
      unit TEXT NOT NULL DEFAULT 'piece',
      category TEXT NOT NULL DEFAULT 'General',
      expiry_date TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS shopping_list_items (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      quantity REAL NOT NULL DEFAULT 1,
      unit TEXT NOT NULL DEFAULT 'item',
      checked INTEGER NOT NULL DEFAULT 0,
      recipe_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS favorites (
      id TEXT PRIMARY KEY,
      recipe_id TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
    );
  `);
}

async function seedInitialData(db: any) {
  const countRow = await db.get('SELECT COUNT(*) as count FROM recipes');
  if (!countRow || countRow.count < SEED_RECIPES.length) {
    console.log(`Syncing database with ${SEED_RECIPES.length} recipes...`);
    const insertStmt = await db.prepare(`
      INSERT OR REPLACE INTO recipes (
        id, name, description, cuisine, prep_time, cook_time, servings, difficulty,
        image_url, dietary_tags, ingredients, instructions, calories, protein, carbs, fat, fiber
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const r of SEED_RECIPES) {
      await insertStmt.run(
        r.id,
        r.name,
        r.description,
        r.cuisine,
        r.prepTime,
        r.cookTime,
        r.servings,
        r.difficulty,
        r.imageUrl,
        JSON.stringify(r.dietaryTags),
        JSON.stringify(r.ingredients),
        JSON.stringify(r.instructions),
        r.calories,
        r.protein,
        r.carbs,
        r.fat,
        r.fiber
      );
    }
    await insertStmt.finalize();
    console.log('Seeding completed successfully!');
  }

  const pantryCount = await db.get('SELECT COUNT(*) as count FROM pantry_items');
  if (pantryCount && pantryCount.count === 0) {
    const today = new Date();
    const addDays = (days: number) => {
      const d = new Date(today);
      d.setDate(d.getDate() + days);
      return d.toISOString().split('T')[0];
    };

    const initialPantry = [
      { id: 'p-1', name: 'Tomato', quantity: 4, unit: 'pieces', category: 'Vegetables', expiry_date: addDays(4) },
      { id: 'p-2', name: 'Onion', quantity: 3, unit: 'pieces', category: 'Vegetables', expiry_date: addDays(10) },
      { id: 'p-3', name: 'Eggs', quantity: 6, unit: 'pieces', category: 'Dairy & Eggs', expiry_date: addDays(7) },
      { id: 'p-4', name: 'Rice', quantity: 1, unit: 'kg', category: 'Grains & Pasta', expiry_date: addDays(60) },
      { id: 'p-5', name: 'Garlic', quantity: 1, unit: 'head', category: 'Vegetables', expiry_date: addDays(14) }
    ];

    const insertPantry = await db.prepare(`
      INSERT INTO pantry_items (id, name, quantity, unit, category, expiry_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    for (const p of initialPantry) {
      await insertPantry.run(p.id, p.name, p.quantity, p.unit, p.category, p.expiry_date);
    }
    await insertPantry.finalize();
  }
}

// In-memory fallback mock for serverless/edge environments
function createMockDb() {
  const recipesStore = SEED_RECIPES.map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    cuisine: r.cuisine,
    prep_time: r.prepTime,
    cook_time: r.cookTime,
    servings: r.servings,
    difficulty: r.difficulty,
    image_url: r.imageUrl,
    dietary_tags: JSON.stringify(r.dietaryTags),
    ingredients: JSON.stringify(r.ingredients),
    instructions: JSON.stringify(r.instructions),
    calories: r.calories,
    protein: r.protein,
    carbs: r.carbs,
    fat: r.fat,
    fiber: r.fiber
  }));

  let pantryStore: any[] = [
    { id: 'p-1', name: 'Tomato', quantity: 4, unit: 'pieces', category: 'Vegetables', expiry_date: '2026-10-20' },
    { id: 'p-2', name: 'Onion', quantity: 3, unit: 'pieces', category: 'Vegetables', expiry_date: '2026-10-25' },
    { id: 'p-3', name: 'Eggs', quantity: 6, unit: 'pieces', category: 'Dairy & Eggs', expiry_date: '2026-10-18' },
    { id: 'p-4', name: 'Rice', quantity: 1, unit: 'kg', category: 'Grains & Pasta', expiry_date: '2026-12-01' },
    { id: 'p-5', name: 'Garlic', quantity: 1, unit: 'head', category: 'Vegetables', expiry_date: '2026-10-30' }
  ];

  let shoppingStore: any[] = [];
  let favoritesStore: any[] = [];

  return {
    async all(query: string, ...params: any[]) {
      const q = query.toLowerCase();
      if (q.includes('from recipes')) {
        return recipesStore;
      }
      if (q.includes('from pantry_items')) {
        return pantryStore;
      }
      if (q.includes('from shopping_list_items')) {
        return shoppingStore;
      }
      if (q.includes('from favorites')) {
        return favoritesStore.map((f) => {
          const rec = recipesStore.find((r) => r.id === f.recipe_id);
          return rec ? { ...rec, favorite_id: f.id } : null;
        }).filter(Boolean);
      }
      return [];
    },
    async get(query: string, ...params: any[]) {
      const q = query.toLowerCase();
      if (q.includes('from recipes where id')) {
        const id = params[0];
        return recipesStore.find((r) => r.id === id) || null;
      }
      if (q.includes('from pantry_items where id')) {
        const id = params[0];
        return pantryStore.find((p) => p.id === id) || null;
      }
      if (q.includes('from shopping_list_items where id')) {
        const id = params[0];
        return shoppingStore.find((s) => s.id === id) || null;
      }
      if (q.includes('count(*) as count from recipes')) {
        return { count: recipesStore.length };
      }
      if (q.includes('count(*) as count from pantry_items')) {
        return { count: pantryStore.length };
      }
      return null;
    },
    async run(query: string, ...params: any[]) {
      const q = query.toLowerCase();
      if (q.includes('insert into pantry_items')) {
        pantryStore.push({
          id: params[0] || `p-${Date.now()}`,
          name: params[1],
          quantity: params[2],
          unit: params[3],
          category: params[4],
          expiry_date: params[5]
        });
      } else if (q.includes('delete from pantry_items where id')) {
        pantryStore = pantryStore.filter((p) => p.id !== params[0]);
      } else if (q.includes('insert into shopping_list_items')) {
        shoppingStore.push({
          id: params[0] || `s-${Date.now()}`,
          name: params[1],
          quantity: params[2],
          unit: params[3],
          checked: 0,
          recipe_id: params[4]
        });
      } else if (q.includes('delete from shopping_list_items where id')) {
        shoppingStore = shoppingStore.filter((s) => s.id !== params[0]);
      } else if (q.includes('delete from shopping_list_items where checked = 1')) {
        shoppingStore = shoppingStore.filter((s) => !s.checked);
      } else if (q.includes('update shopping_list_items set checked')) {
        const sItem = shoppingStore.find((s) => s.id === params[1]);
        if (sItem) sItem.checked = params[0];
      } else if (q.includes('insert into favorites')) {
        favoritesStore.push({ id: params[0] || `f-${Date.now()}`, recipe_id: params[1] });
      } else if (q.includes('delete from favorites where recipe_id')) {
        favoritesStore = favoritesStore.filter((f) => f.recipe_id !== params[0]);
      }
      return { lastID: 1, changes: 1 };
    },
    async exec(query: string) {
      return;
    },
    async prepare(query: string) {
      return {
        async run(...params: any[]) {
          return;
        },
        async finalize() {
          return;
        }
      };
    }
  };
}
