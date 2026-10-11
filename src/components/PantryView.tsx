import React, { useState, useEffect } from 'react';
import {
  Refrigerator,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  AlertCircle,
  Search,
  Sparkles,
  Check,
  X,
  AlertTriangle,
  Info
} from 'lucide-react';
import { PantryItem, PantryCategory } from '../types/pantry.ts';
import {
  fetchPantry,
  addPantryItem,
  updatePantryItem,
  deletePantryItem,
} from '../api/client.ts';

interface PantryViewProps {
  onCookFromPantry: (ingredients: string[]) => void;
}

const CATEGORIES: PantryCategory[] = [
  'All',
  'Vegetables',
  'Dairy & Eggs',
  'Grains & Pasta',
  'Meat & Poultry',
  'Spices & Condiments',
  'General',
];

export const PantryView: React.FC<PantryViewProps> = ({ onCookFromPantry }) => {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PantryCategory>('All');
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formQty, setFormQty] = useState('1');
  const [formUnit, setFormUnit] = useState('pieces');
  const [formCategory, setFormCategory] = useState('Vegetables');
  const [formExpiry, setFormExpiry] = useState('');

  const loadPantry = async () => {
    try {
      setIsLoading(true);
      const data = await fetchPantry();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPantry();
  }, []);

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    try {
      if (editingId) {
        // Update
        await updatePantryItem(editingId, {
          name: formName.trim(),
          quantity: parseFloat(formQty) || 1,
          unit: formUnit.trim(),
          category: formCategory,
          expiry_date: formExpiry || null,
        });
      } else {
        // Create
        await addPantryItem({
          name: formName.trim(),
          quantity: parseFloat(formQty) || 1,
          unit: formUnit.trim(),
          category: formCategory,
          expiry_date: formExpiry || null,
        });
      }
      resetForm();
      loadPantry();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (item: PantryItem) => {
    setEditingId(item.id);
    setFormName(item.name);
    setFormQty(String(item.quantity));
    setFormUnit(item.unit);
    setFormCategory(item.category || 'General');
    setFormExpiry(item.expiry_date || '');
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePantryItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormName('');
    setFormQty('1');
    setFormUnit('pieces');
    setFormCategory('Vegetables');
    setFormExpiry('');
    setIsAdding(false);
  };

  // Check expiry urgency
  const getExpiryStatus = (dateStr?: string | null) => {
    if (!dateStr) return null;
    const exp = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = exp.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { status: 'expired', label: `Expired ${Math.abs(diffDays)}d ago`, color: 'text-red-700 bg-red-50 border-red-200' };
    }
    if (diffDays <= 3) {
      return { status: 'urgent', label: `Expires in ${diffDays} day${diffDays === 1 ? '' : 's'}`, color: 'text-amber-700 bg-amber-50 border-amber-200' };
    }
    return { status: 'ok', label: `Fresh for ${diffDays} days`, color: 'text-[#315C43] bg-[#E6F0E6] border-[#cee2ce]' };
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E5DC] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F0E6] text-[#315C43] text-xs font-bold mb-2">
            <Refrigerator className="w-4 h-4" />
            <span>Virtual Kitchen Storage</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#202820]">My Pantry</h2>
          <p className="text-sm text-[#737B72] mt-1 max-w-xl">
            Track ingredients currently in your fridge, cabinets, and pantry shelves. Generate recipes directly from what you have before food spoils.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => {
              resetForm();
              setIsAdding(true);
            }}
            className="px-5 py-3 rounded-2xl bg-[#315C43] hover:bg-[#244733] text-white text-sm font-bold shadow-sm transition-all flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Pantry Item</span>
          </button>

          {items.length > 0 && (
            <button
              onClick={() => onCookFromPantry(items.map((i) => i.name))}
              className="px-5 py-3 rounded-2xl bg-[#FAF8F2] hover:bg-[#E6F0E6] text-[#315C43] border border-[#315C43]/30 text-sm font-extrabold shadow-xs transition-all flex items-center gap-2 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-[#315C43]" />
              <span>Find Recipes from Pantry</span>
            </button>
          )}
        </div>
      </div>

      {/* Add / Edit Form Modal or Accordion */}
      {isAdding && (
        <div className="bg-[#FAF8F2] rounded-3xl p-6 border border-[#315C43]/30 shadow-md animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#202820]">
              {editingId ? 'Edit Pantry Item' : 'Add New Pantry Item'}
            </h3>
            <button
              onClick={resetForm}
              className="p-1.5 rounded-full hover:bg-[#E8E5DC] text-[#737B72]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSaveItem} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <label className="text-xs font-bold text-[#737B72] uppercase block mb-1">
                Ingredient Name *
              </label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Tomatoes, Basmati Rice, Milk"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E8E5DC] focus:border-[#315C43] outline-none text-sm font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#737B72] uppercase block mb-1">
                Quantity & Unit
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="any"
                  min="0.1"
                  value={formQty}
                  onChange={(e) => setFormQty(e.target.value)}
                  className="w-20 px-3 py-2.5 rounded-xl bg-white border border-[#E8E5DC] focus:border-[#315C43] outline-none text-sm font-medium"
                />
                <input
                  type="text"
                  value={formUnit}
                  onChange={(e) => setFormUnit(e.target.value)}
                  placeholder="pieces, kg, ml"
                  className="flex-1 px-3 py-2.5 rounded-xl bg-white border border-[#E8E5DC] focus:border-[#315C43] outline-none text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#737B72] uppercase block mb-1">
                Category
              </label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#E8E5DC] focus:border-[#315C43] outline-none text-sm font-medium"
              >
                {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#737B72] uppercase block mb-1">
                Optional Expiry Date
              </label>
              <input
                type="date"
                value={formExpiry}
                onChange={(e) => setFormExpiry(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#E8E5DC] focus:border-[#315C43] outline-none text-sm font-medium"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-5 flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-gray-100 text-[#737B72] font-semibold text-sm border border-[#E8E5DC]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#315C43] hover:bg-[#244733] text-white font-bold text-sm shadow-sm"
              >
                {editingId ? 'Update Item' : 'Add Item'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search & Category Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#737B72] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pantry..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#E8E5DC] text-sm focus:border-[#315C43] outline-none"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#315C43] text-white shadow-xs'
                  : 'bg-white text-[#202820] border border-[#E8E5DC] hover:bg-[#E6F0E6]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Pantry Items List / Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-sm text-[#737B72]">
          Loading pantry items...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E8E5DC]">
          <Refrigerator className="w-12 h-12 text-[#737B72] mx-auto mb-3" />
          <h3 className="text-lg font-bold text-[#202820]">No pantry items found</h3>
          <p className="text-sm text-[#737B72] mt-1 max-w-sm mx-auto">
            {searchQuery || selectedCategory !== 'All'
              ? 'No items match your active search or category filters.'
              : 'Your pantry is currently empty. Add your groceries to start getting personalized recipes!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const exp = getExpiryStatus(item.expiry_date);
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 border border-[#E8E5DC] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#737B72] block">
                        {item.category || 'General'}
                      </span>
                      <h4 className="text-base font-bold text-[#202820] mt-0.5">
                        {item.name}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-1.5 rounded-lg text-[#737B72] hover:bg-[#FAF8F2] hover:text-[#315C43] transition-colors"
                        title="Edit Item"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg text-[#737B72] hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Delete Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-extrabold text-[#315C43] bg-[#E6F0E6] px-2.5 py-1 rounded-lg">
                      {item.quantity} {item.unit}
                    </span>

                    {exp && (
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${exp.color}`}>
                        {exp.label}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Safety Notice */}
      <div className="p-4 rounded-2xl bg-white border border-[#E8E5DC] flex items-start gap-2.5 text-xs text-[#737B72]">
        <Info className="w-4 h-4 text-[#737B72] shrink-0 mt-0.5" />
        <span>
          <strong>Food Safety Notice:</strong> Expiry dates are recorded for user planning purposes and do not substitute for sensory checks or manufacturer guidelines. Always inspect food condition prior to cooking.
        </span>
      </div>

    </div>
  );
};

