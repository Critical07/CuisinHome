
import React, { useState } from 'react';
import { Music2, Plus, ChevronLeft, Sparkles, ClipboardPaste, Zap, Check, ArrowRight } from 'lucide-react';
import { Recipe } from '../types';
import { importRecipeFromTikTokUrl } from '../geminiService';

interface Props {
  onAddToList: (items: string[]) => void;
  onCompleteRecipe: (recipe: Recipe) => void;
}

const TikTokImportView: React.FC<Props> = ({ onAddToList, onCompleteRecipe }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isCooking, setIsCooking] = useState(false);
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  const handleImport = async (inputUrl?: string) => {
    const targetUrl = inputUrl || url;
    if (!targetUrl.includes('tiktok.com')) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await importRecipeFromTikTokUrl(targetUrl);
      setRecipe(data);
    } catch (err) {
      setError("Désolé, impossible d'extraire cette vidéo. Vérifiez le lien.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.includes('tiktok.com')) {
        setUrl(text);
        handleImport(text);
      }
    } catch (err) {}
  };

  const toggleItemAdd = (ing: string) => {
    onAddToList([ing]);
    setAddedItems(prev => new Set(prev).add(ing));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[65vh] space-y-12 animate-in fade-in duration-1000">
        <div className="relative">
          <div className="w-32 h-32 border-[12px] border-white/5 rounded-[3rem] animate-pulse"></div>
          <div className="w-32 h-32 border-[12px] border-brand-pink border-t-transparent rounded-[3rem] animate-spin absolute top-0 glow-pink"></div>
          <Zap size={40} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-pink animate-pulse" />
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-black text-white tracking-tighter italic uppercase">Magic Scan</h2>
          <p className="text-[10px] text-zinc-500 mt-3 font-black uppercase tracking-[0.4em] animate-pulse">Extraction Pro en cours...</p>
        </div>
      </div>
    );
  }

  if (recipe && !isCooking) {
    return (
      <div className="space-y-6 pt-6 pb-24 animate-in slide-in-from-bottom-10 duration-700">
        <button onClick={() => setRecipe(null)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2">
          <ChevronLeft size={14} /> Revenir à l'import
        </button>

        <div className="premium-card rounded-[3rem] overflow-hidden border-none shadow-2xl group">
          <div className="aspect-video relative overflow-hidden">
             <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-8">
               <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-brand-pink text-white text-[9px] font-black uppercase rounded-lg glow-pink flex items-center gap-2">
                    <Sparkles size={10} /> Recette Vérifiée
                  </span>
               </div>
               <h2 className="text-4xl font-black text-white tracking-tight leading-tight mb-2 italic">{recipe.title}</h2>
               <div className="flex gap-4 text-[11px] font-black text-zinc-400 uppercase tracking-widest">
                  <span className="text-brand-pink">{recipe.calories} kcal</span>
                  <span>•</span>
                  <span>{recipe.prepTime}</span>
               </div>
             </div>
          </div>

          <div className="p-10 space-y-8 bg-black">
             <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">Ingrédients</h3>
                <button onClick={() => onAddToList(recipe.ingredients)} className="text-[9px] font-black text-brand-pink uppercase tracking-widest underline underline-offset-4">Tout ajouter</button>
             </div>
             
             <div className="grid grid-cols-1 gap-3">
               {recipe.ingredients.map((ing, idx) => (
                 <button 
                  key={idx} 
                  onClick={() => toggleItemAdd(ing)}
                  className={`flex items-center justify-between p-6 rounded-2xl border transition-all active:scale-95 ${addedItems.has(ing) ? 'bg-green-500 border-green-500 text-white' : 'bg-white/5 border-white/5 text-zinc-300'}`}
                 >
                   <span className="text-sm font-bold truncate pr-4">{ing}</span>
                   {addedItems.has(ing) ? <Check size={18} strokeWidth={3} /> : <Plus size={18} />}
                 </button>
               ))}
             </div>

             <button 
              onClick={() => setIsCooking(true)}
              className="w-full py-6 bg-white text-black font-black rounded-3xl flex items-center justify-center gap-4 uppercase tracking-[0.25em] text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
             >
               Commencer à cuisiner <ArrowRight size={20} />
             </button>
          </div>
        </div>
      </div>
    );
  }

  if (isCooking && recipe) {
    return (
      <div className="space-y-8 pt-6 pb-24 animate-in fade-in duration-500">
        <button onClick={() => setIsCooking(false)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-600">
          <ChevronLeft size={14} /> Retour à la fiche
        </button>

        <div className="premium-card rounded-[3.5rem] p-10 border-white/5">
          <h2 className="text-3xl font-black text-white mb-10 tracking-tight italic leading-tight">{recipe.title}</h2>
          <div className="space-y-12">
            {recipe.instructions.map((step, idx) => (
              <div key={idx} className="flex gap-6 items-start">
                <span className="flex-shrink-0 w-12 h-12 rounded-2xl bg-brand-pink text-white text-sm font-black flex items-center justify-center shadow-lg glow-pink">
                  {idx + 1}
                </span>
                <p className="text-md font-bold text-zinc-400 leading-relaxed pt-2">
                  {step}
                </p>
              </div>
            ))}
            <button 
              onClick={() => onCompleteRecipe(recipe)}
              className="w-full py-6 bg-green-500 text-white font-black rounded-3xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
            >
              Terminé ! Ajouter au journal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pt-12 animate-in fade-in duration-1000 pb-20">
      <div className="premium-card rounded-[4rem] p-12 text-center space-y-10 border-white/5 relative overflow-hidden bg-gradient-to-b from-zinc-900 to-black">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-pink via-brand-purple to-brand-indigo" />
        
        <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl relative group">
          <div className="absolute inset-0 bg-brand-pink blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
          <Music2 size={48} className="text-black relative z-10" />
        </div>

        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter italic">TikTok Magic</h2>
          <p className="text-[10px] font-bold text-zinc-500 mt-5 uppercase tracking-[0.3em] leading-relaxed">
            Copiez un lien TikTok. Collez-le.<br/>Cuisinez comme un Pro.
          </p>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <input 
              type="text" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Collez le lien ici..."
              className="w-full bg-white/5 rounded-3xl pl-8 pr-16 py-7 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-pink/50 text-white border border-white/5"
            />
            <button onClick={handlePaste} className="absolute right-5 top-1/2 -translate-y-1/2 p-3 text-zinc-600 hover:text-brand-pink transition-colors">
              <ClipboardPaste size={22} />
            </button>
          </div>

          <button 
            onClick={() => handleImport()}
            disabled={!url.includes('tiktok.com')}
            className={`w-full py-6 rounded-3xl font-black flex items-center justify-center gap-4 transition-all shadow-2xl uppercase tracking-[0.25em] text-xs ${url.includes('tiktok.com') ? 'bg-brand-pink text-white hover:scale-105 glow-pink' : 'bg-white/5 text-zinc-700 opacity-50 cursor-not-allowed'}`}
          >
            Importer <Zap size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TikTokImportView;
