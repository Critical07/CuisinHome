
import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, Clock, Flame, RefreshCw, Check, X, ArrowRight, AlertCircle, ShoppingCart, ChevronLeft, CheckCircle2, Heart, Refrigerator, CircleAlert, Plus, Zap, Timer, BookMarked, Save } from 'lucide-react';
import { Ingredient, Recipe, UserProfile, MealType, PrepTimePreference, RecipeBook } from '../types';
import { generateRecipe } from '../geminiService';

interface Props {
  pantry: Ingredient[];
  user: UserProfile;
  mealType: MealType;
  timePref: PrepTimePreference;
  currentRecipe: Recipe | null;
  onRecipeGenerated: (recipe: Recipe) => void;
  onAddToList: (items: string[]) => void;
  onCompleteRecipe: (recipe: Recipe) => void;
  recipeBooks: RecipeBook[];
  onSaveToBook: (recipe: Recipe, bookId: string) => void;
  onCreateBookAndSave: (recipe: Recipe, bookName: string) => void;
  onResetSelection: () => void;
}

const normalize = (str: string) => str.toLowerCase()
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .replace(/s$/, "")
  .trim();

const SuggestionView: React.FC<Props> = ({ 
  pantry, user, mealType, timePref, currentRecipe, onRecipeGenerated, onAddToList, onCompleteRecipe, 
  recipeBooks, onSaveToBook, onCreateBookAndSave, onResetSelection
}) => {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<'yes' | 'no' | null>(null);
  const [showMatchDetails, setShowMatchDetails] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [newBookName, setNewBookName] = useState('');
  const [isCreatingBook, setIsCreatingBook] = useState(false);

  const fetchNewSuggestion = async () => {
    setLoading(true);
    setFeedback(null);
    setShowMatchDetails(false);
    try {
      const newRecipe = await generateRecipe(pantry, user.goal, mealType, timePref);
      onRecipeGenerated(newRecipe);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentRecipe) fetchNewSuggestion();
  }, [mealType, timePref]);

  const matchAnalysis = useMemo(() => {
    if (!currentRecipe) return { have: [], miss: [], percent: 0 };
    const have: string[] = [];
    const miss: string[] = [];
    const pantryNorm = pantry.map(p => normalize(p.name));
    currentRecipe.ingredients.forEach(ing => {
      const ingNorm = normalize(ing);
      const isOwned = pantryNorm.some(p => ingNorm.includes(p) || p.includes(ingNorm));
      if (isOwned) have.push(ing); else miss.push(ing);
    });
    const percent = Math.round((have.length / currentRecipe.ingredients.length) * 100);
    return { have, miss, percent };
  }, [currentRecipe, pantry]);

  const handleFinalize = () => {
    setShowSaveModal(true);
  };

  const completeAction = () => {
    setShowSaveModal(false);
    onCompleteRecipe(currentRecipe!);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6 animate-in fade-in duration-500">
        <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="title-luxury text-3xl">Confection en cours...</p>
      </div>
    );
  }

  if (!currentRecipe) return null;

  return (
    <div className="space-y-10 pt-6 pb-20 animate-in fade-in duration-700">
      
      {showSaveModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-white/60 dark:bg-black/80 backdrop-blur-xl" onClick={completeAction}></div>
          <div className="vibrant-card w-full p-10 relative max-w-sm">
            <h3 className="title-luxury text-3xl mb-8">Archiver</h3>
            <div className="space-y-2 mb-8 max-h-60 overflow-y-auto">
              {recipeBooks.map(book => (
                <button key={book.id} onClick={() => { onSaveToBook(currentRecipe, book.id); completeAction(); }}
                  className="w-full p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-between text-sm font-semibold hover:bg-primary/10 transition-colors">
                  <div className="flex items-center gap-3"><span>{book.emoji}</span> {book.name}</div>
                  <Plus size={16} className="text-zinc-300" />
                </button>
              ))}
            </div>
            <button onClick={completeAction} className="w-full py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Plus tard</button>
          </div>
        </div>
      )}

      {currentRecipe.isPossible === false ? (
        <div className="vibrant-card p-12 text-center space-y-6">
          <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto text-zinc-400">
            <CircleAlert size={32} />
          </div>
          <h2 className="title-luxury text-3xl">Introuvable</h2>
          <p className="text-sm text-zinc-500 px-4 leading-relaxed">{currentRecipe.missingTypeExplanation}</p>
          <div className="pt-4 space-y-2">
            <button onClick={() => fetchNewSuggestion()} className="w-full py-5 bg-primary text-white font-semibold rounded-2xl shadow-sm">Réessayer</button>
            <button onClick={onResetSelection} className="w-full py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Changer les critères</button>
          </div>
        </div>
      ) : (
        <>
          <div className="vibrant-card overflow-hidden group">
            <div className="aspect-[4/3] relative">
              <img src={currentRecipe.imageUrl} alt={currentRecipe.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex gap-2 mb-3">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-bold text-white uppercase tracking-widest">{timePref}</span>
                  <span className="px-3 py-1 bg-wellness-sage/80 backdrop-blur-md rounded-lg text-[10px] font-bold text-white uppercase tracking-widest">{matchAnalysis.percent}% Match</span>
                </div>
                <h2 className="title-luxury text-4xl text-white leading-none">{currentRecipe.title}</h2>
              </div>
            </div>
            <div className="p-8 flex justify-between items-center bg-white dark:bg-zinc-900 border-t border-black/5 dark:border-white/5">
              <div className="flex gap-6 text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><Clock size={14}/> {currentRecipe.prepTime}</span>
                <span className="flex items-center gap-1.5"><Flame size={14}/> {currentRecipe.calories} kcal</span>
              </div>
              <button onClick={() => setFeedback('yes')} className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all"><Check size={24} /></button>
            </div>
          </div>

          {!feedback && (
            <div className="flex justify-center gap-6">
               <button onClick={() => setFeedback('no')} className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-900 border border-black/5 flex items-center justify-center text-zinc-400 transition-all hover:bg-zinc-50"><X size={24}/></button>
               <button onClick={fetchNewSuggestion} className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-900 border border-black/5 flex items-center justify-center text-zinc-400 transition-all hover:bg-zinc-50"><RefreshCw size={24}/></button>
            </div>
          )}

          {feedback === 'yes' && (
            <div className="vibrant-card p-10 space-y-12 animate-in slide-in-from-bottom-6 duration-500">
              <div>
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-6">Préparation</h3>
                <div className="space-y-8">
                  {currentRecipe.instructions.map((step, idx) => (
                    <div key={idx} className="flex gap-6 items-start">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full border border-primary/20 text-primary text-[10px] font-bold flex items-center justify-center">0{idx + 1}</span>
                      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed pt-1.5">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={handleFinalize} className="w-full py-6 bg-primary text-white font-semibold rounded-2xl shadow-xl">Marquer comme terminé</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SuggestionView;
