
import React, { useState } from 'react';
import { BookMarked, Plus, Search, ChevronRight, ChevronLeft, X, LayoutGrid, List, Heart, MoreVertical, Flame, Clock } from 'lucide-react';
import { RecipeBook, Recipe } from '../types';

interface Props {
  books: RecipeBook[];
  setBooks: React.Dispatch<React.SetStateAction<RecipeBook[]>>;
}

const RecipeBooksView: React.FC<Props> = ({ books, setBooks }) => {
  const [selectedBook, setSelectedBook] = useState<RecipeBook | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newBookName, setNewBookName] = useState('');

  if (selectedBook) {
    return (
      <div className="space-y-10 pt-6 pb-24 animate-in fade-in duration-500">
        <button onClick={() => setSelectedBook(null)} className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2 hover:text-primary transition-colors">
          <ChevronLeft size={12} /> Bibliothèque
        </button>
        <div className="px-1">
          <h2 className="title-luxury text-4xl mb-2 tracking-normal">{selectedBook.name}</h2>
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest opacity-80">{selectedBook.recipes.length} Sauvegardes</p>
        </div>
        <div className="grid grid-cols-1 gap-5">
          {selectedBook.recipes.map((r, i) => (
            <div key={i} className="vibrant-card overflow-hidden group hover:scale-[1.02]">
              <div className="aspect-[16/9] relative overflow-hidden">
                <img src={r.imageUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-white/20 backdrop-blur-md rounded text-[9px] font-bold text-white uppercase tracking-widest">Favoris</span>
                  </div>
                  <h4 className="text-xl font-semibold text-white tracking-tight">{r.title}</h4>
                </div>
              </div>
            </div>
          ))}
          {selectedBook.recipes.length === 0 && (
            <div className="vibrant-card p-20 text-center border-dashed border-2 border-black/5 bg-transparent shadow-none">
              <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-[0.4em]">Collection vide</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pt-8 pb-32 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex justify-between items-end px-1">
        <div>
          <h2 className="title-luxury text-5xl tracking-normal">Collections</h2>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em] mt-3 opacity-80">Mes archives culinaires</p>
        </div>
        <button onClick={() => setIsCreating(true)} className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-[0_10px_30px_-5px_rgba(197,163,88,0.4)] transition-all active:scale-90 hover:rotate-3">
          <Plus size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {books.map((book, i) => (
          <button 
            key={book.id} 
            onClick={() => setSelectedBook(book)} 
            className="vibrant-card p-8 flex items-center justify-between group hover:translate-y-[-2px] hover:shadow-xl transition-all animate-in fade-in"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-wellness-beige dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-500 border border-black/[0.02]">
                {book.emoji}
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-1 tracking-tight">{book.name}</h3>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{book.recipes.length} Recettes</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-300 group-hover:text-primary transition-colors">
              <ChevronRight size={18} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecipeBooksView;
