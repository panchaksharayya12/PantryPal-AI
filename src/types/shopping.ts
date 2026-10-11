export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  checked: number; // 0 or 1
  recipe_id?: string | null;
  created_at?: string;
}

