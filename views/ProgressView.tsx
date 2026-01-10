
import React from 'react';
import { DailyLog } from '../types';
import { Bell, Flame, Activity, Zap, Droplets, Star, Clock, Utensils, ChevronRight, CalendarDays } from 'lucide-react';

interface Props {
  logs: Record<string, DailyLog>;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  streak: number;
  darkMode: boolean;
}

const ProgressView: React.FC<Props> = ({ logs, selectedDate, setSelectedDate, streak }) => {
  const currentLog = logs[selectedDate] || {
    date: selectedDate,
    totalKcal: 0,
    targetKcal: 2200,
    goalMet: false,
    macros: { carbs: 0, protein: 0, fats: 0 },
    meals: []
  };

  const kcalPercent = Math.min(100, (currentLog.totalKcal / currentLog.targetKcal) * 100);

  const getWeekDates = () => {
    const current = new Date();
    const day = current.getDay();
    const diff = current.getDate() - (day === 0 ? 6 : day - 1); 
    const monday = new Date(current.setDate(diff));
    
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  };

  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const dates = getWeekDates();
  
  return (
    <div className="space-y-6 pt-4 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Weekly Tracker - Master Harmonized */}
      <div className="px-1">
        <div className="vibrant-card p-7 space-y-7 relative overflow-hidden">
          <div className="flex justify-between items-center px-1">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                    <CalendarDays size={18} />
                </div>
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Calendrier</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center border border-black/5">
              <Bell size={14} className="text-zinc-300" />
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-1.5">
            {dates.map((date, i) => {
              const dateStr = date.toISOString().split('T')[0];
              const isSelected = dateStr === selectedDate;
              const log = logs[dateStr];
              const isGoalMet = log?.goalMet || false;
              
              return (
                <button 
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`flex flex-col items-center py-4 rounded-2xl transition-all relative ${
                    isSelected 
                      ? 'bg-zinc-900 text-white shadow-xl scale-105 z-10' 
                      : 'hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span className={`text-[8px] font-black uppercase tracking-widest mb-2 ${isSelected ? 'text-primary' : 'text-zinc-400'}`}>
                    {weekDays[i]}
                  </span>
                  <div className="relative flex items-center justify-center">
                    <span className={`text-sm font-black ${isSelected ? 'text-white' : 'text-zinc-800 dark:text-zinc-200'}`}>
                      {date.getDate()}
                    </span>
                    {isGoalMet && (
                      <div className="absolute -right-3 -top-1">
                        <Flame size={10} className="text-primary fill-current" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Metabolism Block - Master Harmonized */}
      <div className="px-1">
        <div className="vibrant-card p-8 space-y-8 relative overflow-hidden">
          <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                      <Activity size={18} />
                  </div>
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Métabolisme</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-zinc-50 dark:bg-zinc-900 rounded-full border border-black/[0.03]">
                 <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                 <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 italic">{streak}J</span>
              </div>
          </div>

          <div className="flex justify-between items-end px-1">
              <div className="space-y-1">
                  <p className="text-5xl font-black tracking-tighter text-zinc-900 dark:text-white leading-none">{currentLog.totalKcal}</p>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-2">Kcal consommées</p>
              </div>
              <div className="text-right">
                  <p className="text-xl font-bold text-zinc-300 tracking-tight">/ {currentLog.targetKcal}</p>
                  <p className="text-[9px] font-black text-zinc-300 uppercase tracking-widest italic">Objectif</p>
              </div>
          </div>

          <div className="h-2.5 bg-zinc-50 dark:bg-zinc-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-1000 ease-out rounded-full shadow-[0_0_20px_rgba(197,163,88,0.7)]"
                style={{ width: `${kcalPercent}%` }}
              />
          </div>

          {/* Centered Macro Blocks with High Contrast */}
          <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                  { label: 'Glucides', val: currentLog.macros.carbs, color: 'bg-cyan-400', glow: 'shadow-[0_0_15px_rgba(34,211,238,0.7)]', target: 200, unit: 'g' },
                  { label: 'Protéines', val: currentLog.macros.protein, color: 'bg-rose-500', glow: 'shadow-[0_0_15px_rgba(244,63,94,0.7)]', target: 130, unit: 'g' },
                  { label: 'Lipides', val: currentLog.macros.fats, color: 'bg-amber-500', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.7)]', target: 60, unit: 'g' }
              ].map((m, i) => (
                  <div key={i} className="flex flex-col items-center text-center p-5 bg-zinc-50/50 dark:bg-zinc-900/40 rounded-[2rem] border border-black/[0.02] dark:border-white/[0.02]">
                      <p className="text-[8px] font-black text-zinc-400 uppercase tracking-[0.25em] mb-4 w-full truncate">
                        {m.label}
                      </p>
                      <div className="flex items-baseline gap-0.5 justify-center">
                          <span className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50">{m.val}</span>
                          <span className="text-[9px] font-black text-zinc-400 uppercase">{m.unit}</span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 mt-4 rounded-full overflow-visible">
                          <div 
                              className={`h-full rounded-full transition-all duration-700 ${m.color} ${m.glow}`} 
                              style={{ width: `${Math.min(100, (m.val/m.target)*100)}%` }}
                          />
                      </div>
                  </div>
              ))}
          </div>
        </div>
      </div>

      {/* Grid Quick Data */}
      <div className="grid grid-cols-2 gap-5 px-1">
         <div className="vibrant-card p-7 flex flex-col justify-between aspect-[1.25/1]">
            <div className="w-10 h-10 bg-blue-50/50 dark:bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center border border-blue-100/50 dark:border-blue-500/20">
                <Droplets size={20} />
            </div>
            <div>
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">Hydratation</p>
                <h4 className="text-2xl font-black tracking-tight text-zinc-800 dark:text-white">1.2 <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">L</span></h4>
            </div>
         </div>
         <div className="vibrant-card p-7 flex flex-col justify-between aspect-[1.25/1]">
            <div className="w-10 h-10 bg-orange-50/50 dark:bg-orange-500/10 text-orange-500 rounded-xl flex items-center justify-center border border-orange-100/50 dark:border-orange-500/20">
                <Zap size={20} />
            </div>
            <div>
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">Score IA</p>
                <h4 className="text-2xl font-black tracking-tight text-zinc-800 dark:text-white">94 <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">%</span></h4>
            </div>
         </div>
      </div>

      {/* Journal Timeline */}
      <div className="space-y-4 px-1 pt-4">
        <div className="flex justify-between items-center px-4">
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em]">Journal du jour</h3>
            <ChevronRight size={14} className="text-zinc-300" />
        </div>
        <div className="space-y-3">
          {currentLog.meals.map((meal) => (
            <div key={meal.id} className="vibrant-card p-5 flex justify-between items-center group active:scale-[0.98] border-none bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm">
              <div className="flex items-center gap-5">
                <div className="w-11 h-11 bg-zinc-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-300 border border-black/5 group-hover:text-primary transition-colors">
                  <Utensils size={16} />
                </div>
                <div>
                  <p className="font-black text-sm text-zinc-800 dark:text-zinc-100 tracking-tight">{meal.name}</p>
                  <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-1">{meal.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-zinc-900 dark:text-white leading-none">+{meal.kcal}</p>
                <p className="text-[8px] font-bold text-zinc-400 uppercase mt-1">kcal</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressView;
