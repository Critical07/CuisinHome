
import React, { useState, useMemo } from 'react';
import { ShoppingCart, Plus, CheckCircle2, Circle, X, ShoppingBag, Carrot, Beef, Pizza, Waves, ChefHat, Wallet, ArrowUpRight } from 'lucide-react';
import { ShoppingItem, IngredientCategory } from '../types';

interface Props {
  list: ShoppingItem[];
  setList: React.Dispatch<React.SetStateAction<ShoppingItem[]>>;
  onCheckItem: (name: string) => void;
  onAttemptAdd: (name: string, type: 'shopping', callback: () => void) => void;
}

const CATEGORY_META: { id: IngredientCategory; label: string; icon: React.ReactNode; color: string; bg: string }[] = [
  { id: 'Proteines', label: 'Boucherie / Poisson', icon: <Beef size={14}/>, color: 'text-red-500', bg: 'bg-red-500/10' },
  { id: 'Legumes', label: 'Fruits & Légumes', icon: <Carrot size={14}/>, color: 'text-wellness-sage', bg: 'bg-wellness-sage/10' },
  { id: 'Feculents', label: 'Épicerie Salée', icon: <Pizza size={14}/>, color: 'text-amber-600', bg: 'bg-amber-600/10' },
  { id: 'Laiterie', label: 'Produits Frais', icon: <Waves size={14}/>, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { id: 'Autres', label: 'Divers', icon: <ChefHat size={14}/>, color: 'text-purple-500', bg: 'bg-purple-500/10' },
];

const ShoppingListView: React.FC<Props> = ({ list, setList, onCheckItem, onAttemptAdd }) => {
  const [newItemName, setNewItemName] = useState('');

  const autoCategorize = (name: string): IngredientCategory => {
    const n = name.toLowerCase();
    if (/poulet|boeuf|oeuf|poisson|jambon|dinde|steak|thon|tofu|saumon/.test(n)) return 'Proteines';
    if (/tomate|courgette|carotte|oignon|pomme|banane|salade|avocat|poivron|haricot/.test(n)) return 'Legumes';
    if (/riz|pates|quinoa|pain|patate|farine|couscous|lentille/.test(n)) return 'Feculents';
    if (/lait|fromage|beurre|yaourt|creme|mozzarella|emmental/.test(n)) return 'Laiterie';
    return 'Autres';
  };

  const addItem = () => {
    if (newItemName.trim()) {
      const name = newItemName.trim();
      onAttemptAdd(name, 'shopping', () => {
        const newItem: ShoppingItem = {
          id: Math.random().toString(),
          name: name,
          checked: false,
          category: autoCategorize(name)
        };
        setList(prev => [...prev, newItem]);
        setNewItemName('');
      });
    }
  };

  const toggleItem = (id: string) => {
    setList(prev => prev.map(item => {
      if (item.id === id && !item.checked) {
        onCheckItem(item.name); 
        return { ...item, checked: true };
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setList(prev => prev.filter(i => i.id !== id));
  };

  const categorizedItems = useMemo(() => {
    const groups: Record<IngredientCategory, ShoppingItem[]> = {
      'Proteines': [],
      'Legumes': [],
      'Feculents': [],
      'Laiterie': [],
      'Autres': []
    };

    list.forEach(item => {
      const cat = autoCategorize(item.name);
      groups[cat].push(item);
    });

    return groups;
  }, [list]);

  const itemsRemaining = list.filter(i => !i.checked).length;

  return (
    <div className="space-y-8 pt-4 animate-in fade-in duration-700 pb-20 px-1">
      <div className="bg-zinc-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-8 text-primary/20 group-hover:text-primary/40 transition-colors">
            <ShoppingCart size={80} strokeWidth={1} />
         </div>
         <div className="relative">
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-3">Courses à faire</p>
            <div className="flex items-end gap-3">
               <h2 className="text-4xl font-black tracking-tighter leading-none">{itemsRemaining} Articles</h2>
            </div>
         </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-6 shadow-lg border border-black/5 dark:border-zinc-800 group">
        <div className="flex gap-3">
          <input 
            type="text" 
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addItem()}
            placeholder="Ajouter à la liste..."
            className="flex-1 bg-apple-bg-light/30 dark:bg-zinc-800/50 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none border border-black/5 dark:border-zinc-700 transition-all"
          />
          <button 
            onClick={addItem}
            className="w-14 h-14 bg-black dark:bg-primary text-primary dark:text-black rounded-2xl flex items-center justify-center active:scale-90 transition-all shadow-xl"
          >
            <Plus size={24} strokeWidth={3} />
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {list.length === 0 ? (
          <div className="py-24 text-center opacity-10">
            <ShoppingBag size={80} className="mx-auto mb-6" />
            <p className="font-black uppercase tracking-[0.5em] text-[12px]">Panier vide</p>
          </div>
        ) : (
          CATEGORY_META.map(meta => {
            const items = categorizedItems[meta.id];
            if (items.length === 0) return null;
            return (
              <div key={meta.id} className="space-y-4">
                 <div className="flex items-center gap-4 px-4">
                    <div className={`w-10 h-10 rounded-xl ${meta.bg} flex items-center justify-center ${meta.color} shadow-sm border border-black/5`}>
                      {meta.icon}
                    </div>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400 italic">{meta.label}</h3>
                 </div>
                 <div className="grid grid-cols-1 gap-3">
                   {items.map(item => (
                    <div 
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className={`vibrant-card p-6 flex items-center justify-between hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer bg-white dark:bg-zinc-900 shadow-md ${item.checked ? 'opacity-30' : ''}`}
                    >
                      <div className="flex items-center gap-5">
                        {item.checked ? (
                          <div className="w-6 h-6 bg-wellness-sage rounded-lg flex items-center justify-center text-white shadow-sm">
                            <CheckCircle2 size={16} strokeWidth={3} />
                          </div>
                        ) : (
                          <div className="w-6 h-6 border-2 border-black/10 dark:border-zinc-700 rounded-lg" />
                        )}
                        <p className={`text-sm font-black ${item.checked ? 'line-through text-black/40' : 'text-zinc-800 dark:text-zinc-200'} tracking-tight`}>
                          {item.name}
                        </p>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                        className="w-8 h-8 flex items-center justify-center text-zinc-200 hover:text-red-500 transition-colors"
                      >
                        <X size={18} strokeWidth={3} />
                      </button>
                    </div>
                  ))}
                 </div>
              </div>
            );
          })
        )}
      </div>

      {list.some(i => i.checked) && (
        <button 
          onClick={() => setList(prev => prev.filter(i => !i.checked))}
          className="w-full py-6 bg-zinc-100 dark:bg-zinc-800/50 rounded-3xl font-black text-[10px] uppercase tracking-[0.4em] text-zinc-400 border border-black/5 hover:bg-red-50 hover:text-red-500 transition-all"
        >
          Nettoyer la liste
        </button>
      )}
    </div>
  );
};

export default ShoppingListView;
