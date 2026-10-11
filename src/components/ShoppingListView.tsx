import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Plus,
  Trash2,
  Check,
  Copy,
  CheckCircle2,
  CheckSquare,
  Square,
  Sparkles
} from 'lucide-react';
import { ShoppingItem } from '../types/shopping.ts';
import {
  fetchShoppingList,
  addShoppingItem,
  toggleShoppingItem,
  deleteShoppingItem,
  clearCompletedShoppingList,
} from '../api/client.ts';

interface ShoppingListViewProps {
  onListChange?: () => void;
}

export const ShoppingListView: React.FC<ShoppingListViewProps> = ({ onListChange }) => {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [newName, setNewName] = useState('');
  const [newQty, setNewQty] = useState('1');
  const [newUnit, setNewUnit] = useState('item');
  const [isLoading, setIsLoading] = useState(true);
  const [copyNotice, setCopyNotice] = useState(false);

  const loadList = async () => {
    try {
      setIsLoading(true);
      const data = await fetchShoppingList();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      const added = await addShoppingItem({
        name: newName.trim(),
        quantity: parseFloat(newQty) || 1,
        unit: newUnit.trim(),
      });
      setItems((prev) => [added, ...prev]);
      setNewName('');
      setNewQty('1');
      setNewUnit('item');
      if (onListChange) onListChange();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = async (item: ShoppingItem) => {
    const nextChecked = item.checked === 1 ? false : true;
    try {
      const updated = await toggleShoppingItem(item.id, nextChecked);
      setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
      if (onListChange) onListChange();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteShoppingItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      if (onListChange) onListChange();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearCompleted = async () => {
    try {
      await clearCompletedShoppingList();
      setItems((prev) => prev.filter((i) => i.checked === 0));
      if (onListChange) onListChange();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyList = () => {
    if (items.length === 0) return;

    const unpurchased = items.filter((i) => i.checked === 0);
    const purchased = items.filter((i) => i.checked === 1);

    let text = `🛒 PantryPal AI Shopping List\n\n`;

    if (unpurchased.length > 0) {
      text += `TO BUY (${unpurchased.length}):\n`;
      unpurchased.forEach((i) => {
        text += `• [ ] ${i.name} — ${i.quantity} ${i.unit}\n`;
      });
    }

    if (purchased.length > 0) {
      text += `\nPURCHASED:\n`;
      purchased.forEach((i) => {
        text += `• [x] ${i.name} — ${i.quantity} ${i.unit}\n`;
      });
    }

    navigator.clipboard.writeText(text);
    setCopyNotice(true);
    setTimeout(() => setCopyNotice(false), 3000);
  };

  const remainingCount = items.filter((i) => i.checked === 0).length;
  const completedCount = items.filter((i) => i.checked === 1).length;

  return (
    <div className="py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E5DC] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F0E6] text-[#315C43] text-xs font-bold mb-2">
            <ShoppingBag className="w-4 h-4" />
            <span>Kitchen Groceries</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#202820]">Shopping List</h2>
          <p className="text-sm text-[#737B72] mt-1">
            {remainingCount} item{remainingCount === 1 ? '' : 's'} left to buy
            {completedCount > 0 ? ` • ${completedCount} completed` : ''}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleCopyList}
            disabled={items.length === 0}
            className="px-4 py-2.5 rounded-2xl bg-[#FAF8F2] hover:bg-[#E6F0E6] disabled:opacity-40 text-[#315C43] border border-[#315C43]/30 text-sm font-bold shadow-xs transition-all flex items-center gap-2 active:scale-95"
            title="Copy entire list to clipboard"
          >
            {copyNotice ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Shopping List</span>
              </>
            )}
          </button>

          {completedCount > 0 && (
            <button
              onClick={handleClearCompleted}
              className="px-4 py-2.5 rounded-2xl bg-white hover:bg-red-50 text-red-600 border border-red-200 text-sm font-semibold transition-all"
            >
              Clear Purchased
            </button>
          )}
        </div>
      </div>

      {/* Quick Add Form */}
      <form
        onSubmit={handleAddItem}
        className="bg-[#FAF8F2] p-4 sm:p-5 rounded-3xl border border-[#E8E5DC] flex flex-col sm:flex-row gap-3 items-center"
      >
        <input
          type="text"
          required
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Add an item to buy (e.g. Olive Oil, Garlic, Basil)..."
          className="flex-1 w-full px-4 py-3 rounded-2xl bg-white border border-[#E8E5DC] focus:border-[#315C43] outline-none text-sm font-medium"
        />

        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="number"
            min="0.1"
            step="any"
            value={newQty}
            onChange={(e) => setNewQty(e.target.value)}
            className="w-20 px-3 py-3 rounded-2xl bg-white border border-[#E8E5DC] focus:border-[#315C43] outline-none text-sm font-medium text-center"
          />

          <input
            type="text"
            value={newUnit}
            onChange={(e) => setNewUnit(e.target.value)}
            placeholder="unit"
            className="w-24 px-3 py-3 rounded-2xl bg-white border border-[#E8E5DC] focus:border-[#315C43] outline-none text-sm font-medium"
          />

          <button
            type="submit"
            className="px-5 py-3 rounded-2xl bg-[#315C43] hover:bg-[#244733] text-white font-bold text-sm shadow-sm transition-all flex items-center gap-1.5 shrink-0 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </form>

      {/* Items List */}
      <div className="bg-white rounded-3xl border border-[#E8E5DC] overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-12 text-center text-sm text-[#737B72]">
            Loading shopping list...
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingBag className="w-12 h-12 text-[#737B72] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#202820]">Your shopping list is empty</h3>
            <p className="text-sm text-[#737B72] mt-1 max-w-sm mx-auto">
              When viewing recipes, click "Add Missing Ingredients" to automatically populate items here, or add items using the form above.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#E8E5DC]">
            {items.map((item) => {
              const isChecked = item.checked === 1;
              return (
                <div
                  key={item.id}
                  className={`p-4 sm:p-5 flex items-center justify-between transition-colors ${
                    isChecked ? 'bg-[#FAF8F2]/60' : 'hover:bg-[#FAF8F2]/30'
                  }`}
                >
                  <div
                    onClick={() => handleToggle(item)}
                    className="flex items-center gap-3.5 cursor-pointer flex-1 select-none"
                  >
                    <button
                      type="button"
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                        isChecked
                          ? 'bg-[#315C43] text-white'
                          : 'border-2 border-[#C1C9C1] hover:border-[#315C43]'
                      }`}
                    >
                      {isChecked && <Check className="w-4 h-4" />}
                    </button>

                    <div>
                      <span
                        className={`text-base font-bold transition-all ${
                          isChecked
                            ? 'line-through text-[#737B72]'
                            : 'text-[#202820]'
                        }`}
                      >
                        {item.name}
                      </span>
                      <span className="text-xs text-[#737B72] font-semibold ml-2">
                        ({item.quantity} {item.unit})
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-xl text-[#737B72] hover:bg-red-50 hover:text-red-600 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

