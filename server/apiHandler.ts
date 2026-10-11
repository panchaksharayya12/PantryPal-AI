import { SEED_RECIPES, RecipeRecord } from './database/recipesData';
import { matchRecipes, MatchFilter } from './services/recipeMatcher';

// In-memory data store for serverless
let pantryStore: any[] = [
  { id: 'p-1', name: 'Tomato', quantity: 4, unit: 'pieces', category: 'Vegetables', expiry_date: '2026-10-20' },
  { id: 'p-2', name: 'Onion', quantity: 3, unit: 'pieces', category: 'Vegetables', expiry_date: '2026-10-25' },
  { id: 'p-3', name: 'Eggs', quantity: 6, unit: 'pieces', category: 'Dairy & Eggs', expiry_date: '2026-10-18' },
  { id: 'p-4', name: 'Rice', quantity: 1, unit: 'kg', category: 'Grains & Pasta', expiry_date: '2026-12-01' },
  { id: 'p-5', name: 'Garlic', quantity: 1, unit: 'head', category: 'Vegetables', expiry_date: '2026-10-30' }
];
let shoppingStore: any[] = [];
let favoritesStore: string[] = [];

function json(res: any, data: any, status = 200) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.end(JSON.stringify(data));
}

function parseBody(req: any): Promise<any> {
  return new Promise((resolve) => {
    if (req.body && typeof req.body === 'object') {
      return resolve(req.body);
    }
    let data = '';
    req.on('data', (chunk: any) => { data += chunk; });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        resolve({});
      }
    });
  });
}

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.end();
  }

  const url = new URL(req.url, 'http://localhost');
  const pathname = url.pathname.replace(/\/$/, '') || '/';

  // 1. Health check
  if (pathname === '/api/health') {
    return json(res, {
      status: 'ok',
      app: 'PantryPal AI',
      timestamp: new Date().toISOString(),
      recipesCount: SEED_RECIPES.length
    });
  }

  // 2. Recipes
  if (pathname === '/api/recipes' && req.method === 'GET') {
    return json(res, SEED_RECIPES);
  }

  if (pathname === '/api/recipes/suggest' && req.method === 'POST') {
    const body = await parseBody(req);
    const ingredients: string[] = body.ingredients || [];
    const filters: MatchFilter = body.filters || {};
    const matched = matchRecipes(SEED_RECIPES, ingredients, filters);
    return json(res, { total: matched.length, recipes: matched });
  }

  if (pathname.startsWith('/api/recipes/') && req.method === 'GET') {
    const id = pathname.replace('/api/recipes/', '');
    const found = SEED_RECIPES.find((r) => r.id === id);
    if (!found) return json(res, { error: 'Recipe not found' }, 404);
    return json(res, found);
  }

  // 3. Pantry
  if (pathname === '/api/pantry') {
    if (req.method === 'GET') {
      return json(res, pantryStore);
    }
    if (req.method === 'POST') {
      const body = await parseBody(req);
      const newItem = {
        id: `p-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: body.name || 'Ingredient',
        quantity: parseFloat(body.quantity) || 1,
        unit: body.unit || 'piece',
        category: body.category || 'General',
        expiry_date: body.expiry_date || null,
        created_at: new Date().toISOString()
      };
      pantryStore.push(newItem);
      return json(res, newItem, 201);
    }
  }

  if (pathname.startsWith('/api/pantry/') && req.method === 'DELETE') {
    const id = pathname.replace('/api/pantry/', '');
    pantryStore = pantryStore.filter((p) => p.id !== id);
    return json(res, { success: true });
  }

  // 4. Shopping List
  if (pathname === '/api/shopping-list') {
    if (req.method === 'GET') {
      return json(res, shoppingStore);
    }
    if (req.method === 'POST') {
      const body = await parseBody(req);
      if (Array.isArray(body)) {
        const added = body.map((item) => {
          const s = {
            id: `s-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            name: item.name,
            quantity: parseFloat(item.quantity) || 1,
            unit: item.unit || 'item',
            checked: false,
            recipe_id: item.recipeId || null,
            created_at: new Date().toISOString()
          };
          shoppingStore.push(s);
          return s;
        });
        return json(res, added, 201);
      }
      const newItem = {
        id: `s-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: body.name || 'Item',
        quantity: parseFloat(body.quantity) || 1,
        unit: body.unit || 'item',
        checked: false,
        recipe_id: body.recipeId || null,
        created_at: new Date().toISOString()
      };
      shoppingStore.push(newItem);
      return json(res, newItem, 201);
    }
  }

  if (pathname.startsWith('/api/shopping-list/') && req.method === 'PATCH') {
    const id = pathname.replace('/api/shopping-list/', '');
    const body = await parseBody(req);
    const item = shoppingStore.find((s) => s.id === id);
    if (item) item.checked = !!body.checked;
    return json(res, item || { error: 'Not found' });
  }

  if (pathname.startsWith('/api/shopping-list/') && req.method === 'DELETE') {
    const id = pathname.replace('/api/shopping-list/', '');
    if (id === 'completed') {
      shoppingStore = shoppingStore.filter((s) => !s.checked);
    } else {
      shoppingStore = shoppingStore.filter((s) => s.id !== id);
    }
    return json(res, { success: true });
  }

  // 5. Favorites
  if (pathname === '/api/favorites') {
    if (req.method === 'GET') {
      const favRecipes = favoritesStore
        .map((fId) => SEED_RECIPES.find((r) => r.id === fId))
        .filter(Boolean);
      return json(res, favRecipes);
    }
    if (req.method === 'POST') {
      const body = await parseBody(req);
      if (body.recipeId && !favoritesStore.includes(body.recipeId)) {
        favoritesStore.push(body.recipeId);
      }
      return json(res, { success: true });
    }
  }

  if (pathname.startsWith('/api/favorites/') && req.method === 'DELETE') {
    const id = pathname.replace('/api/favorites/', '');
    favoritesStore = favoritesStore.filter((fId) => fId !== id);
    return json(res, { success: true });
  }

  // 6. AI Status & Chat
  if (pathname === '/api/ai/status') {
    return json(res, { hasAiKey: false, model: 'gpt-4o-mini' });
  }

  if (pathname === '/api/ai/chat' && req.method === 'POST') {
    const body = await parseBody(req);
    const msg = (body.message || '').toLowerCase();
    let reply = "Here's a delicious recommendation: Try preparing an authentic Indian Masala Omelette or Vegetable Pulao with your available ingredients! Add fresh coriander, turmeric, and pinch of salt for rich flavor.";
    if (msg.includes('egg') || msg.includes('omlet') || msg.includes('omelette')) {
      reply = "With eggs and onions, you can make a wonderful Indian Masala Omelette! Beat 2 eggs with a pinch of turmeric, chopped onions, and chilies. Cook on medium heat for 2 minutes on each side.";
    } else if (msg.includes('rice') || msg.includes('chitranna') || msg.includes('lemon')) {
      reply = "For leftover rice, Lemon Rice (Chitranna) is ideal! Temper mustard seeds, curry leaves, and peanuts in oil, stir into cooled rice with fresh lemon juice and turmeric.";
    } else if (msg.includes('tomato') || msg.includes('onion')) {
      reply = "Tomato and onion make a fabulous Quick Chutney or Tamatar Pyaaz Sabzi! Sauté cumin seeds, add sliced onions till golden, toss diced tomatoes with chili powder, and simmer 5 minutes.";
    }
    return json(res, { response: reply, source: 'fallback' });
  }

  // Fallback 404
  return json(res, { error: 'Endpoint not found' }, 404);
}
