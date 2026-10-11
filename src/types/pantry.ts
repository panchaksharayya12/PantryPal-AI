export interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  expiry_date?: string | null;
  created_at?: string;
}

export type PantryCategory =
  | 'All'
  | 'Vegetables'
  | 'Dairy & Eggs'
  | 'Grains & Pasta'
  | 'Meat & Poultry'
  | 'Spices & Condiments'
  | 'General';

