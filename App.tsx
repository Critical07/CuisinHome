
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChefHat, Refrigerator, Plus, LineChart, Settings, Camera, Sparkles, Flame, AlertCircle, ShoppingCart, 
  CheckCircle2, Music2, Search, Moon, Sun, Trophy, X, AlertTriangle, Zap, Timer, UtensilsCrossed, 
  BookMarked, Library, ChevronRight, LayoutGrid
} from 'lucide-react';
import { AppTab, Ingredient, UserProfile, DailyLog, Recipe, MealType, ShoppingItem, IngredientCategory, PrepTimePreference, RecipeBook } from './types';

// --- Views ---
import PantryView from './views/PantryView';
import CalorieTrackerView from './views/CalorieTrackerView';
import SuggestionView from './views/SuggestionView';
import ProgressView from './views/ProgressView';
import ProfileView from './views/ProfileView';
import ShoppingListView from './views/ShoppingListView';
import TikTokImportView from './views/TikTokImportView';
import PaywallView from './views/PaywallView';
import RecipeBooksView from './views/RecipeBooksView';

const normalize = (str: string) => str.toLowerCase()
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .replace(/s$/, "")
  .trim();

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.PROGRESS);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mealSelectionStep, setMealSelectionStep] = useState<'type' | 'time' | null>(null);
  const [showGoalCelebration, setShowGoalCelebration] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'info' | 'error'} | null>(null);
  
  const [selectedMealType, setSelectedMealType] = useState<MealType | null>(null);
  const [selectedTimePref, setSelectedTimePref] = useState<PrepTimePreference>('express');
  
  const [recipeBooks, setRecipeBooks] = useState<RecipeBook[]>([
    { id: '1', name: 'Favoris du Dimanche', emoji: '✨', recipes: [] },
    { id: '2', name: 'Cuisine de Saison', emoji: '🍃', recipes: [] },
    { id: '3', name: 'Desserts Fins', emoji: '🍓', recipes: [] }
  ]);

  const [duplicateCheck, setDuplicateCheck] = useState<{
    name: string,
    location: 'pantry' | 'shopping',
    onConfirm: () => void
  } | null>(null);

  const [currentSuggestedRecipe, setCurrentSuggestedRecipe] = useState<Recipe | null>(null);
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [selectedDate, setSelectedDate] = useState(todayStr);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const [pantry, setPantry] = useState<Ingredient[]>([
    { id: '1', name: 'Avocat', category: 'Legumes', addedAt: Date.now() },
    { id: '2', name: 'Oeufs', category: 'Proteines', addedAt: Date.now() },
    { id: '3', name: 'Yaourt Grec', category: 'Laiterie', addedAt: Date.now() }
  ]);

  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [user, setUser] = useState<UserProfile>({
    name: 'Sarah',
    goal: 'maintain',
    dailyKcalTarget: 1850,
    isPremium: true,
    importsUsed: 0
  });

  const [logs, setLogs] = useState<Record<string, DailyLog>>({
    [todayStr]: {
      date: todayStr,
      totalKcal: 420,
      targetKcal: 1850,
      goalMet: false,
      macros: { carbs: 30, protein: 25, fats: 15 },
      meals: [
        { id: 'm1', name: 'Petit-déjeuner Équilibré', kcal: 420, time: '08:15', type: 'Plat' }
      ]
    }
  });

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAttemptAdd = (name: string, type: 'pantry' | 'shopping', callback: () => void) => {
    const normName = normalize(name);
    const inPantry = pantry.find(p => normalize(p.name) === normName);
    if (inPantry) {
      setDuplicateCheck({ name, location: 'pantry', onConfirm: callback });
      return;
    }
    const inShopping = shoppingList.find(s => normalize(s.name) === normName);
    if (inShopping) {
      setDuplicateCheck({ name, location: 'shopping', onConfirm: callback });
      return;
    }
    callback();
  };

  const handleLogFood = (food: { name: string; kcal: number; carbs: number; protein: number; fats: number }) => {
    setLogs(prev => {
      const currentLog = prev[todayStr] || {
        date: todayStr, totalKcal: 0, targetKcal: user.dailyKcalTarget, goalMet: false,
        macros: { carbs: 0, protein: 0, fats: 0 }, meals: []
      };
      const newTotalKcal = currentLog.totalKcal + food.kcal;
      const isGoalMetNow = newTotalKcal >= currentLog.targetKcal;
      if (newTotalKcal >= currentLog.targetKcal && currentLog.totalKcal < currentLog.targetKcal) setShowGoalCelebration(true);

      return {
        ...prev,
        [todayStr]: {
          ...currentLog,
          totalKcal: newTotalKcal,
          goalMet: isGoalMetNow,
          macros: {
            carbs: currentLog.macros.carbs + food.carbs,
            protein: currentLog.macros.protein + food.protein,
            fats: currentLog.macros.fats + food.fats
          },
          meals: [...currentLog.meals, { id: Date.now().toString(), name: food.name, kcal: food.kcal, time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }), type: 'Plat' }]
        }
      };
    });
    setCurrentSuggestedRecipe(null);
    setActiveTab(AppTab.PROGRESS);
    showToast("Journal mis à jour");
  };

  const handleAddRecipeToBook = (recipe: Recipe, bookId: string) => {
    setRecipeBooks(prev => prev.map(book => 
      book.id === bookId 
        ? { ...book, recipes: [...book.recipes, recipe] }
        : book
    ));
    showToast("Sauvegardé");
  };

  const handleCreateAndAddRecipe = (recipe: Recipe, bookName: string) => {
    const newBook: RecipeBook = {
      id: Math.random().toString(),
      name: bookName,
      emoji: '📓',
      recipes: [recipe]
    };
    setRecipeBooks(prev => [...prev, newBook]);
    showToast(`Livre créé`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.PANTRY: return <PantryView pantry={pantry} setPantry={setPantry} onAttemptAdd={handleAttemptAdd} />;
      case AppTab.TRACKER: return <CalorieTrackerView onLogFood={handleLogFood} />;
      case AppTab.RECIPE_BOOKS: return <RecipeBooksView books={recipeBooks} setBooks={setRecipeBooks} />;
      case AppTab.TIKTOK_IMPORT: return (
        <TikTokImportView 
          onAddToList={(items) => items.forEach(name => handleAttemptAdd(name, 'shopping', () => setShoppingList(prev => [...prev, { id: Math.random().toString(), name, checked: false, category: 'Autres' as const }])))}
          onCompleteRecipe={(r) => handleLogFood({ name: r.title, kcal: r.calories, carbs: r.macros.carbs, protein: r.macros.protein, fats: r.macros.fats })}
        />
      );
      case AppTab.PAYWALL: return <PaywallView onSubscribe={() => { setUser(prev => ({ ...prev, isPremium: true })); setActiveTab(AppTab.PROGRESS); }} />;
      case AppTab.SHOPPING: return <ShoppingListView list={shoppingList} setList={setShoppingList} onCheckItem={() => {}} onAttemptAdd={handleAttemptAdd} />;
      case AppTab.SUGGESTION: return (
        <SuggestionView 
          pantry={pantry} user={user} 
          mealType={selectedMealType!} timePref={selectedTimePref}
          currentRecipe={currentSuggestedRecipe}
          onRecipeGenerated={(r) => setCurrentSuggestedRecipe(r)}
          onAddToList={(items) => items.forEach(name => handleAttemptAdd(name, 'shopping', () => setShoppingList(prev => [...prev, { id: Math.random().toString(), name, checked: false, category: 'Autres' as const }])))}
          onCompleteRecipe={(r) => handleLogFood({ name: r.title, kcal: r.calories, carbs: r.macros.carbs, protein: r.macros.protein, fats: r.macros.fats })} 
          recipeBooks={recipeBooks}
          onSaveToBook={handleAddRecipeToBook}
          onCreateBookAndSave={handleCreateAndAddRecipe}
          onResetSelection={() => setMealSelectionStep('type')}
        />
      );
      case AppTab.PROGRESS: return <ProgressView logs={logs} selectedDate={selectedDate} setSelectedDate={setSelectedDate} streak={12} darkMode={isDarkMode} />;
      case AppTab.PROFILE: return <ProfileView user={user} setUser={setUser} darkMode={isDarkMode} setDarkMode={setIsDarkMode} onUpgrade={() => setActiveTab(AppTab.PAYWALL)} />;
      default: return <ProgressView logs={logs} selectedDate={selectedDate} setSelectedDate={setSelectedDate} streak={12} darkMode={isDarkMode} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-wellness-beige dark:bg-black max-w-md mx-auto relative shadow-2xl overflow-hidden font-sans transition-colors duration-700">
      
      {duplicateCheck && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setDuplicateCheck(null)}></div>
          <div className="vibrant-card w-full p-10 text-center relative max-w-xs scale-95 animate-in zoom-in-95">
            <h3 className="text-2xl font-bold text-zinc-800 dark:text-white mb-2">Déjà présent</h3>
            <p className="text-sm text-zinc-500 mb-8 px-4 leading-relaxed">Cet article figure déjà dans votre inventaire intelligent.</p>
            <div className="space-y-3">
              <button 
                onClick={() => { duplicateCheck.onConfirm(); setDuplicateCheck(null); }}
                className="w-full py-5 bg-primary text-white font-bold rounded-2xl text-xs uppercase tracking-widest shadow-lg"
              >
                Ajouter quand même
              </button>
              <button 
                onClick={() => setDuplicateCheck(null)}
                className="w-full py-4 text-zinc-400 font-bold text-[10px] uppercase tracking-widest"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {notification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[110] w-[80%] animate-in slide-in-from-top-4 duration-500">
           <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-4 border border-black/5 dark:border-white/5">
              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              <p className="text-[11px] font-bold text-zinc-700 dark:text-zinc-200 uppercase tracking-widest">{notification.message}</p>
           </div>
        </div>
      )}

      <header className="px-8 pt-14 pb-4 sticky top-0 z-40 flex justify-between items-center bg-wellness-beige/80 dark:bg-black/80 backdrop-blur-xl border-b border-black/[0.02]">
        <button onClick={() => setActiveTab(AppTab.PROFILE)} className="group flex items-center gap-4">
           <div className="w-12 h-12 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-300 shadow-sm border border-black/5 group-hover:border-primary transition-all">
              <Settings size={18} className="group-hover:rotate-45 transition-transform" />
           </div>
        </button>
        
        <div className="text-center">
            <h1 className="text-sm font-bold tracking-[0.3em] text-zinc-800 dark:text-white uppercase leading-none italic">Atelier IA</h1>
        </div>

        <button onClick={() => setActiveTab(AppTab.SHOPPING)} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${activeTab === AppTab.SHOPPING ? 'bg-primary text-white shadow-xl' : 'bg-white dark:bg-zinc-900 text-zinc-300 border border-black/5'}`}>
            <ShoppingCart size={18} />
        </button>
      </header>

      <main className="flex-1 px-7 overflow-y-auto pb-44">
        {renderContent()}
      </main>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-[360px] z-50">
        <nav className="glass-nav rounded-[2.5rem] shadow-2xl py-5 px-10 flex items-center justify-between">
          <button onClick={() => setActiveTab(AppTab.PANTRY)} className={`transition-all hover:scale-110 active:scale-90 ${activeTab === AppTab.PANTRY ? 'text-primary' : 'text-zinc-300'}`}>
            <Refrigerator size={22} />
          </button>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className={`w-16 h-16 rounded-[1.8rem] flex items-center justify-center transition-all shadow-2xl active:scale-90 ${isMenuOpen ? 'bg-zinc-800 text-white' : 'bg-primary text-white glow-subtle-gold'}`}
          >
            <Plus size={28} strokeWidth={3} className={`transition-transform duration-500 ${isMenuOpen ? 'rotate-45' : ''}`} />
          </button>
          
          <button onClick={() => setActiveTab(AppTab.PROGRESS)} className={`transition-all hover:scale-110 active:scale-90 ${activeTab === AppTab.PROGRESS ? 'text-primary' : 'text-zinc-300'}`}>
            <LayoutGrid size={22} />
          </button>
        </nav>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-white/40 dark:bg-black/60 backdrop-blur-3xl" onClick={() => setIsMenuOpen(false)}></div>
          <div className="vibrant-card w-full p-10 relative max-w-sm animate-in zoom-in-95">
            <h2 className="title-luxury text-4xl mb-12">Exploration</h2>
            <div className="grid grid-cols-2 gap-5">
              {[
                { label: 'Scanner', tab: AppTab.TRACKER, icon: <Camera size={24} />, color: 'bg-zinc-50 dark:bg-zinc-800 text-zinc-800' },
                { label: 'Chef IA', action: 'recipe', icon: <Sparkles size={24} />, color: 'bg-primary/5 text-primary border-primary/10' },
                { label: 'Social', tab: AppTab.TIKTOK_IMPORT, icon: <Music2 size={24} />, color: 'bg-wellness-blush/5 text-wellness-blush border-wellness-blush/10' },
                { label: 'Archives', tab: AppTab.RECIPE_BOOKS, icon: <BookMarked size={24} />, color: 'bg-zinc-50 dark:bg-zinc-800 text-zinc-400' }
              ].map((m) => (
                <button 
                  key={m.label}
                  onClick={() => { 
                    setIsMenuOpen(false); 
                    if (m.tab) setActiveTab(m.tab);
                    if (m.action === 'recipe') setMealSelectionStep('type');
                  }}
                  className={`flex flex-col items-center gap-6 p-10 rounded-3xl transition-all active:scale-95 border border-black/[0.03] ${m.color} shadow-sm group`}
                >
                  <div className="group-hover:scale-110 transition-transform">{m.icon}</div>
                  <span className="font-bold text-[10px] uppercase tracking-[0.2em]">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {mealSelectionStep && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-6 animate-in fade-in">
          <div className="absolute inset-0 bg-white/40 dark:bg-black/60 backdrop-blur-3xl" onClick={() => setMealSelectionStep(null)}></div>
          <div className="vibrant-card w-full p-12 animate-in zoom-in-95 max-w-sm">
             <h3 className="title-luxury text-4xl mb-10">
               {mealSelectionStep === 'type' ? 'Catégorie' : 'Tempo'}
             </h3>
             {mealSelectionStep === 'type' ? (
               <div className="space-y-4">
                 {['Entrée', 'Plat', 'Dessert', 'Goûter'].map(t => (
                   <button key={t} onClick={() => { setSelectedMealType(t as MealType); setMealSelectionStep('time'); }} 
                     className="w-full p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-800/50 text-sm font-bold text-zinc-700 dark:text-zinc-200 text-left flex justify-between items-center transition-all hover:bg-primary/10 hover:translate-x-1 group">
                      {t} <ChevronRight size={16} className="text-zinc-300 group-hover:text-primary" />
                   </button>
                 ))}
               </div>
             ) : (
               <div className="space-y-5">
                 <button onClick={() => { setSelectedTimePref('express'); setActiveTab(AppTab.SUGGESTION); setMealSelectionStep(null); }} 
                   className="w-full p-8 rounded-3xl border border-black/[0.03] dark:border-white/[0.03] flex items-center gap-6 transition-all hover:bg-primary/5 group">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center"><Timer size={24} /></div>
                    <div className="text-left">
                      <p className="font-bold text-base tracking-tight">Express</p>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Saisir en 15 min</p>
                    </div>
                 </button>
                 <button onClick={() => { setSelectedTimePref('gourmet'); setActiveTab(AppTab.SUGGESTION); setMealSelectionStep(null); }} 
                   className="w-full p-8 rounded-3xl border border-black/[0.03] dark:border-white/[0.03] flex items-center gap-6 transition-all hover:bg-wellness-sage/5 group">
                    <div className="w-12 h-12 bg-wellness-sage/10 text-wellness-sage rounded-2xl flex items-center justify-center"><UtensilsCrossed size={24} /></div>
                    <div className="text-left">
                      <p className="font-bold text-base tracking-tight">Gourmet</p>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Artisanat 45 min</p>
                    </div>
                 </button>
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
