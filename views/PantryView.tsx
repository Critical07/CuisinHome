
import React, { useState, useMemo } from 'react';
import { Plus, X, ShoppingBasket, Search, Carrot, Beef, Pizza, Waves, ChefHat, Star } from 'lucide-react';
import { Ingredient, IngredientCategory } from '../types';

interface Props {
  pantry: Ingredient[];
  setPantry: React.Dispatch<React.SetStateAction<Ingredient[]>>;
  onAttemptAdd: (name: string, type: 'pantry', callback: () => void) => void;
}

const CATEGORIES: { label: string; id: IngredientCategory; icon: React.ReactNode; color: string; bg: string }[] = [
  { label: 'Protéines', id: 'Proteines', icon: <Beef size={20} />, color: 'text-red-500', bg: 'bg-red-50' },
  { label: 'Légumes', id: 'Legumes', icon: <Carrot size={20} />, color: 'text-wellness-sage', bg: 'bg-wellness-sage/10' },
  { label: 'Féculents', id: 'Feculents', icon: <Pizza size={20} />, color: 'text-primary', bg: 'bg-primary/10' },
  { label: 'Laiterie', id: 'Laiterie', icon: <Waves size={20} />, color: 'text-blue-500', bg: 'bg-blue-50' },
  { label: 'Autres', id: 'Autres', icon: <ChefHat size={20} />, color: 'text-zinc-500', bg: 'bg-zinc-50' },
];

const PantryView: React.FC<Props> = ({ pantry, setPantry, onAttemptAdd }) => {
  const [newItem, setNewItem] = useState('');

  const autoCategorize = (name: string): IngredientCategory => {
    const n = name.toLowerCase();
    if (/poulet|boeuf|oeuf|poisson|jambon|dinde|steak|thon|tofu|saumon/.test(n)) return 'Proteines';
    if (/tomate|courgette|carotte|oignon|pomme|banane|salade|avocat|poivron|haricot/.test(n)) return 'Legumes';
    if (/riz|pates|quinoa|pain|patate|farine|couscous|lentille/.test(n)) return 'Feculents';
    if (/lait|fromage|beurre|yaourt|creme|mozzarella|emmental/.test(n)) return 'Laiterie';
    return 'Autres';
  };

  const addItem = () => {
    if (newItem.trim()) {
      const name = newItem.trim();
      onAttemptAdd(name, 'pantry', () => {
        const category = autoCategorize(name);
        setPantry(prev => [...prev, { id: Date.now().toString(), name, category, addedAt: Date.now() }]);
        setNewItem('');
      });
    }
  };

  const groupedPantry = useMemo(() => {
    return CATEGORIES.map(cat => ({
      ...cat,
      items: pantry.filter(i => i.category === cat.id)
    })).filter(group => group.items.length > 0);
  }, [pantry]);

  return (
    <div className="space-y-12 pt-8 pb-32 animate-in fade-in duration-700">
      <div className="vibrant-card p-6 border-none group">
        <div className="flex gap-4">
           <div className="flex-1 relative">
             <input 
               type="text" 
               value={newItem}
               onChange={(e) => setNewItem(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && addItem()}
               placeholder="Qu'avons-nous dans le frigo ?"
               className="w-full bg-wellness-beige dark:bg-zinc-800 rounded-2xl pl-14 pr-6 py-5 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-primary/5 text-zinc-800 dark:text-white border border-black/[0.03] transition-all"
             />
             <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-primary transition-colors" />
           </div>
           <button 
            onClick={addItem}
            className="w-16 bg-primary text-white rounded-2xl flex items-center justify-center active:scale-90 transition-all shadow-[0_8px_20px_-4px_rgba(197,163,88,0.4)]"
           >
            <Plus size={24} strokeWidth={3} />
           </button>
        </div>
      </div>

      <div className="space-y-14">
        {groupedPantry.length === 0 ? (
          <div className="py-24 text-center opacity-30">
            <ShoppingBasket size={80} className="mx-auto mb-6 text-zinc-200" />
            <p className="font-bold uppercase tracking-[0.4em] text-[10px] text-zinc-300">Inventaire vide</p>
          </div>
        ) : (
          groupedPantry.map(group => (
            <div key={group.id} className="space-y-6">
               <div className="flex items-center gap-4 px-4">
                  <div className={`w-10 h-10 rounded-xl ${group.bg} flex items-center justify-center ${group.color} border border-black/[0.02] shadow-sm`}>
                    {group.icon}
                  </div>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">{group.label}</h3>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  {group.items.map(item => (
                    <div key={item.id} className="vibrant-card p-5 flex justify-between items-center group/item hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                       <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-100 capitalize tracking-tight">{item.name}</span>
                       <button 
                        onClick={() => setPantry(prev => prev.filter(i => i.id !== item.id))}
                        className="w-7 h-7 flex items-center justify-center text-zinc-200 hover:text-wellness-blush transition-all"
                       >
                         <X size={16} strokeWidth={3} />
                       </button>
                    </div>
                  ))}
               </div>
            </div>
          ))
        )}
      </div>

      <div className="vibrant-card p-10 rounded-[2.5rem] text-center bg-gradient-to-tr from-primary/[0.02] to-wellness-sage/[0.02] border-dashed border border-black/5">
         <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-primary floating">
           <Star size={20} className="fill-current" />
         </div>
         <p className="text-[10px] font-bold uppercase text-primary tracking-[0.3em] mb-3">Maestro IA</p>
         <p className="text-base font-medium text-zinc-400 leading-relaxed px-4">
           "Une organisation impeccable est le premier ingrédient d'une vie saine."
         </p>
      </div>
    </div>
  );
};

export default PantryView;
