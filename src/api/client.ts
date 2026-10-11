import { RecipeRecord, MatchedRecipe, MatchFilter } from '../types/recipe.ts';
import { PantryItem } from '../types/pantry.ts';
import { ShoppingItem } from '../types/shopping.ts';

const BASE_URL = '/api';

export async function checkHealth(): Promise<any> {
  const res = await fetch(`${BASE_URL}/health`);
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

export async function fetchRecipes(): Promise<RecipeRecord[]> {
  const res = await fetch(`${BASE_URL}/recipes`);
  if (!res.ok) throw new Error('Failed to load recipes');
  return res.json();
}

export async function fetchRecipeById(id: string): Promise<RecipeRecord> {
  const res = await fetch(`${BASE_URL}/recipes/${id}`);
  if (!res.ok) throw new Error('Failed to load recipe details');
  return res.json();
}

export async function suggestRecipes(
  ingredients: string[],
  filters?: MatchFilter
): Promise<{ total: number; recipes: MatchedRecipe[] }> {
  const res = await fetch(`${BASE_URL}/recipes/suggest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ingredients, filters })
  });
  if (!res.ok) throw new Error('Failed to search recipes');
  return res.json();
}

export async function uploadIngredientPhoto(
  file: File
): Promise<{ success: boolean; ingredients: string[]; confidenceScores?: Record<string, number>; message?: string }> {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${BASE_URL}/ingredients/identify`, {
    method: 'POST',
    body: formData
  });
  return res.json();
}

export async function fetchPantry(): Promise<PantryItem[]> {
  const res = await fetch(`${BASE_URL}/pantry`);
  if (!res.ok) throw new Error('Failed to load pantry items');
  return res.json();
}

export async function addPantryItem(
  item: Omit<PantryItem, 'id' | 'created_at'>
): Promise<PantryItem> {
  const res = await fetch(`${BASE_URL}/pantry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  });
  if (!res.ok) throw new Error('Failed to add pantry item');
  return res.json();
}

export async function updatePantryItem(
  id: string,
  item: Partial<PantryItem>
): Promise<PantryItem> {
  const res = await fetch(`${BASE_URL}/pantry/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  });
  if (!res.ok) throw new Error('Failed to update pantry item');
  return res.json();
}

export async function deletePantryItem(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/pantry/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete pantry item');
}

export async function fetchShoppingList(): Promise<ShoppingItem[]> {
  const res = await fetch(`${BASE_URL}/shopping-list`);
  if (!res.ok) throw new Error('Failed to load shopping list');
  return res.json();
}

export async function addShoppingItem(
  item: { name: string; quantity?: number; unit?: string; recipeId?: string }
): Promise<ShoppingItem> {
  const res = await fetch(`${BASE_URL}/shopping-list`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  });
  if (!res.ok) throw new Error('Failed to add item to shopping list');
  return res.json();
}

export async function addBulkShoppingItems(
  items: Array<{ name: string; quantity?: number | string; unit?: string; recipeId?: string }>
): Promise<ShoppingItem[]> {
  const res = await fetch(`${BASE_URL}/shopping-list`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(items)
  });
  if (!res.ok) throw new Error('Failed to add items to shopping list');
  return res.json();
}

export async function toggleShoppingItem(
  id: string,
  checked: boolean
): Promise<ShoppingItem> {
  const res = await fetch(`${BASE_URL}/shopping-list/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ checked })
  });
  if (!res.ok) throw new Error('Failed to update shopping item status');
  return res.json();
}

export async function deleteShoppingItem(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/shopping-list/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete item from shopping list');
}

export async function clearCompletedShoppingList(): Promise<void> {
  const res = await fetch(`${BASE_URL}/shopping-list/completed`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to clear completed items');
}

export async function fetchFavorites(): Promise<RecipeRecord[]> {
  const res = await fetch(`${BASE_URL}/favorites`);
  if (!res.ok) throw new Error('Failed to load favorite recipes');
  return res.json();
}

export async function addFavorite(recipeId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ recipeId })
  });
  if (!res.ok) throw new Error('Failed to add favorite');
}

export async function removeFavorite(recipeId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/favorites/${recipeId}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to remove favorite');
}

export async function sendAiChat(
  message: string,
  context?: { pantryItems?: string[]; currentRecipe?: string }
): Promise<{ response: string; source: 'openai' | 'fallback' }> {
  const res = await fetch(`${BASE_URL}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, context })
  });
  if (!res.ok) throw new Error('Failed to get answer from AI');
  return res.json();
}

export async function getAiStatus(): Promise<{ hasAiKey: boolean; model: string }> {
  try {
    const res = await fetch(`${BASE_URL}/ai/status`);
    if (res.ok) return res.json();
  } catch {}
  return { hasAiKey: false, model: 'gpt-4o-mini' };
}

