import React, { useState, useEffect, useMemo } from 'react';
import { 
  Refrigerator, Plus, Settings, Camera, Sparkles, ShoppingCart, 
  Music2, LayoutGrid, ChevronRight, Timer, UtensilsCrossed, 
  BookMarked, X, CreditCard
} from 'lucide-react';
import { AppTab, Ingredient, UserProfile, DailyLog, Recipe, MealType, ShoppingItem, PrepTimePreference, RecipeBook } from './types';

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

const App: React.FC = () => {
  // État de l'onglet actif
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.PROGRESS);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mealSelectionStep, setMealSelectionStep] = useState<'type' | 'time' | null>(null);
  
  // États de sélection pour la génération de recette
  const [selectedMealType, setSelectedMealType] = useState<MealType | null>(null);
  const [selectedTimePref, setSelectedTimePref] = useState<PrepTimePreference>('express');
  
  // Données utilisateur
  const [user, setUser] = useState<UserProfile>({
    name: 'Invité',
    goal: 'maintain',
    dailyKcalTarget: 1850,
    isPremium: false,
    importsUsed: 0
  });

  // Inventaire
  const [pantry, setPantry] = useState<Ingredient[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [recipeBooks, setRecipeBooks] = useState<RecipeBook[]>([
    { id: '1', name: 'Favoris', emoji: '✨', recipes: [] }
  ]);

  // Journaling
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [logs, setLogs] = useState<Record<string, DailyLog>>({});

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const handleLogFood = (food: any) => {
    const date = todayStr;
    setLogs(prev => {
      const current = prev[date] || {
        date,
        totalKcal: 0,
        targetKcal: user.dailyKcalTarget,
        goalMet: false,
        macros: { carbs: 0, protein: 0, fats: 0 },
        meals: []
      };
      return {
        ...prev,
        [date]: {
          ...current,
          totalKcal: current.totalKcal + (food.kcal || 0),
          // Fix typo: '2h-digit' is not a valid value for Intl.DateTimeFormatOptions. Using '2-digit' instead.
          meals: [...current.meals, { ...food, id: Date.now().toString(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]
        }
      };
    });
    setActiveTab(AppTab.PROGRESS);
  };

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.PANTRY: return <PantryView pantry={pantry} setPantry={setPantry} onAttemptAdd={(n, t, cb) => cb()} />;
      case AppTab.TRACKER: return <CalorieTrackerView onLogFood={handleLogFood} />;
      case AppTab.RECIPE_BOOKS: return <RecipeBooksView books={recipeBooks} setBooks={setRecipeBooks} />;
      case AppTab.TIKTOK_IMPORT: return <TikTokImportView onAddToList={(items) => {
        setShoppingList(prev => [...prev, ...items.map(i => ({ id: Math.random().toString(), name: i, checked: false, category: 'Autres' as const }))]);
        setActiveTab(AppTab.SHOPPING);
      }} onCompleteRecipe={handleLogFood} />;
      case AppTab.PAYWALL: return <PaywallView onSubscribe={() => { setUser(p => ({ ...p, isPremium: true })); setActiveTab(AppTab.PROFILE); }} />;
      case AppTab.SHOPPING: return <ShoppingListView list={shoppingList} setList={setShoppingList} onCheckItem={() => {}} onAttemptAdd={(n, t, cb) => cb()} />;
      case AppTab.SUGGESTION: return (
        <SuggestionView 
          pantry={pantry} user={user} 
          mealType={selectedMealType!} timePref={selectedTimePref}
          currentRecipe={null}
          onRecipeGenerated={() => {}}
          onAddToList={() => {}}
          onCompleteRecipe={handleLogFood} 
          recipeBooks={recipeBooks}
          onSaveToBook={(recipe, bookId) => {
            setRecipeBooks(prev => prev.map(b => b.id === bookId ? { ...b, recipes: [...b.recipes, recipe] } : b));
          }}
          onCreateBookAndSave={(recipe, name) => {
            const newBook = { id: Date.now().toString(), name, emoji: '📖', recipes: [recipe] };
            setRecipeBooks(prev => [...prev, newBook]);
          }}
          onResetSelection={() => setMealSelectionStep('type')}
        />
      );
      case AppTab.PROFILE: return <ProfileView user={user} setUser={setUser} darkMode={isDarkMode} setDarkMode={setIsDarkMode} onUpgrade={() => setActiveTab(AppTab.PAYWALL)} />;
      case AppTab.PROGRESS:
      default: return <ProgressView logs={logs} selectedDate={selectedDate} setSelectedDate={setSelectedDate} streak={3} darkMode={isDarkMode} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F6] dark:bg-black max-w-md mx-auto relative overflow-hidden font-sans">
      
      {/* Header DTCA */}
      <header className="px-6 pt-12 pb-4 flex justify-between items-center z-40 bg-[#FAF9F6]/90 dark:bg-black/90 backdrop-blur-md sticky top-0">
        <button 
          onClick={() => setActiveTab(AppTab.PROFILE)} 
          className="w-10 h-10 flex items-center justify-center bg-white dark:bg-zinc-900 rounded-full border border-black/5 active:scale-90 transition-transform"
        >
          <Settings size={18} className="text-zinc-400" />
        </button>
        <div className="flex flex-col items-center">
          <h1 className="title-luxury text-sm tracking-[0.3em] text-[#121212] dark:text-white uppercase italic">Cuisin'Home</h1>
          <div className="h-0.5 w-8 bg-[#C5A358] mt-1 rounded-full"></div>
        </div>
        <button 
          onClick={() => setActiveTab(AppTab.SHOPPING)} 
          className="w-10 h-10 flex items-center justify-center bg-white dark:bg-zinc-900 rounded-full border border-black/5 relative active:scale-90 transition-transform"
        >
          <ShoppingCart size={18} className="text-zinc-400" />
          {shoppingList.filter(i => !i.checked).length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C5A358] rounded-full text-[10px] text-white flex items-center justify-center font-bold">
              {shoppingList.filter(i => !i.checked).length}
            </span>
          )}
        </button>
      </header>

      {/* Contenu Principal */}
      <main className="flex-1 px-6 overflow-y-auto pb-32 pt-4">
        {renderContent()}
      </main>

      {/* Navigation Mobile DTCA */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[360px] z-[100]">
        <nav className="glass-nav rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] py-3 px-6 flex items-center justify-between border border-black/[0.03]">
          <button 
            onClick={() => setActiveTab(AppTab.PANTRY)} 
            className={`p-3 rounded-2xl transition-all ${activeTab === AppTab.PANTRY ? 'bg-[#C5A358]/10 text-[#C5A358]' : 'text-zinc-300'}`}
          >
            <Refrigerator size={24} />
          </button>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="w-14 h-14 bg-[#121212] dark:bg-[#C5A358] text-white rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-transform -translate-y-2 border-4 border-[#FAF9F6] dark:border-black"
          >
            <Plus size={28} className={`transition-transform duration-300 ${isMenuOpen ? 'rotate-45' : ''}`} />
          </button>
          
          <button 
            onClick={() => setActiveTab(AppTab.PROGRESS)} 
            className={`p-3 rounded-2xl transition-all ${activeTab === AppTab.PROGRESS ? 'bg-[#C5A358]/10 text-[#C5A358]' : 'text-zinc-300'}`}
          >
            <LayoutGrid size={24} />
          </button>
        </nav>
      </div>

      {/* Menu d'Action IA Studio */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-white/40 dark:bg-black/60 backdrop-blur-xl" onClick={() => setIsMenuOpen(false)}></div>
          <div className="vibrant-card w-full p-8 relative animate-dtc max-w-[320px]">
            <div className="flex justify-between items-center mb-8">
              <h2 className="title-luxury text-xl">IA Studio</h2>
              <button onClick={() => setIsMenuOpen(false)} className="w-8 h-8 flex items-center justify-center bg-zinc-50 dark:bg-zinc-800 rounded-full text-zinc-400">
                <X size={16}/>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Scanner', tab: AppTab.TRACKER, icon: <Camera size={22} />, color: 'bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' },
                { label: 'IA Chef', action: 'recipe', icon: <Sparkles size={22} />, color: 'bg-[#C5A358] text-white' },
                { label: 'TikTok', tab: AppTab.TIKTOK_IMPORT, icon: <Music2 size={22} />, color: 'bg-[#ff0050]/10 text-[#ff0050]' },
                { label: 'Favoris', tab: AppTab.RECIPE_BOOKS, icon: <BookMarked size={22} />, color: 'bg-blue-50 text-blue-500' }
              ].map((m) => (
                <button 
                  key={m.label}
                  onClick={() => { 
                    setIsMenuOpen(false); 
                    if (m.tab) setActiveTab(m.tab);
                    if (m.action === 'recipe') setMealSelectionStep('type');
                  }}
                  className={`flex flex-col items-center gap-3 p-5 rounded-[2rem] transition-all active:scale-95 ${m.color}`}
                >
                  {m.icon}
                  <span className="font-bold text-[9px] uppercase tracking-widest">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sélecteur de Recette IA (Modal) */}
      {mealSelectionStep && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-white/40 dark:bg-black/60 backdrop-blur-xl" onClick={() => setMealSelectionStep(null)}></div>
          <div className="vibrant-card w-full p-10 animate-dtc max-w-[320px]">
             <h3 className="title-luxury text-xl mb-8">
               {mealSelectionStep === 'type' ? 'On prépare quoi ?' : 'Quel est le tempo ?'}
             </h3>
             {mealSelectionStep === 'type' ? (
               <div className="space-y-3">
                 {['Entrée', 'Plat', 'Dessert', 'Goûter'].map(t => (
                   <button key={t} onClick={() => { setSelectedMealType(t as MealType); setMealSelectionStep('time'); }} 
                     className="w-full p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800 text-sm font-bold text-left flex justify-between items-center transition-all hover:bg-[#C5A358]/10 group">
                      {t} <ChevronRight size={16} className="text-zinc-300 group-hover:text-[#C5A358]" />
                   </button>
                 ))}
               </div>
             ) : (
               <div className="space-y-4">
                 <button onClick={() => { setSelectedTimePref('express'); setActiveTab(AppTab.SUGGESTION); setMealSelectionStep(null); }} 
                   className="w-full p-6 rounded-2xl border border-black/5 flex items-center gap-4 hover:bg-[#C5A358]/5 transition-colors">
                    <div className="w-10 h-10 bg-[#C5A358]/10 text-[#C5A358] rounded-xl flex items-center justify-center"><Timer size={20} /></div>
                    <div className="text-left">
                      <p className="font-bold text-sm">Express</p>
                      <p className="text-[10px] text-zinc-400 font-medium tracking-widest uppercase">~ 15 min</p>
                    </div>
                 </button>
                 <button onClick={() => { setSelectedTimePref('gourmet'); setActiveTab(AppTab.SUGGESTION); setMealSelectionStep(null); }} 
                   className="w-full p-6 rounded-2xl border border-black/5 flex items-center gap-4 hover:bg-zinc-50 transition-colors">
                    <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center"><UtensilsCrossed size={20} /></div>
                    <div className="text-left">
                      <p className="font-bold text-sm">Gourmet</p>
                      <p className="text-[10px] text-zinc-400 font-medium tracking-widest uppercase">~ 45 min</p>
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