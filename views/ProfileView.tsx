
import React from 'react';
import { Shield, ChevronRight, Award, Moon, Sun, Crown, Star, ArrowUpRight, CheckCircle } from 'lucide-react';
import { UserProfile } from '../types';

interface Props {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onUpgrade: () => void;
}

const ProfileView: React.FC<Props> = ({ user, darkMode, setDarkMode, onUpgrade }) => {
  return (
    <div className="space-y-8 pt-6 pb-32 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* ELITE MEMBERSHIP CARD - ULTRA COMPACT & LUXE */}
      <div className="px-1">
        <div className="membership-card p-7 aspect-[1.58/1] shadow-2xl flex flex-col justify-between group">
            <div className="absolute inset-0 shimmer opacity-5 pointer-events-none" />
            
            <div className="flex justify-between items-start relative z-10">
                <div className="space-y-5">
                    <div className="card-chip" />
                    <div className="space-y-0.5">
                        <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-[0.5em]">Identity Profile</p>
                        <h3 className="title-display text-lg text-white tracking-[0.05em]">{user.name}</h3>
                    </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md">
                    <Crown size={20} className="text-primary fill-current" />
                </div>
            </div>

            <div className="flex justify-between items-end relative z-10">
                <div className="space-y-1.5">
                    <p className="text-[8px] font-mono text-zinc-500 tracking-[0.3em]">8802 1192 0034 8872</p>
                    <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Membre Premium Actif</p>
                </div>
                <div className="text-right">
                    <span className="text-[9px] font-black text-white/30 italic tracking-widest italic uppercase">VIP Status</span>
                </div>
            </div>
        </div>
      </div>

      {/* Subscription Callout */}
      {!user.isPremium && (
        <div className="px-1">
          <button onClick={onUpgrade} className="vibrant-card p-7 bg-primary text-white flex items-center justify-between group">
             <div className="space-y-0.5 text-left">
                <h4 className="title-display text-sm tracking-[0.1em]">Accès Illimité</h4>
                <p className="text-[8px] font-bold text-white/60 tracking-widest uppercase">Débloquez Gemini 3 Elite</p>
             </div>
             <ArrowUpRight size={18} className="text-white/80" />
          </button>
        </div>
      )}

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-3 gap-2 px-1">
         {[
           { label: 'Nutri', val: 'A+', icon: <Star size={10}/> },
           { label: 'IA Rank', val: 'Top 1%', icon: <Award size={10}/> },
           { label: 'Série', val: '12 J', icon: <CheckCircle size={10}/> }
         ].map((s, i) => (
           <div key={i} className="vibrant-card py-4 px-2 text-center space-y-1">
              <div className="flex items-center gap-1 justify-center text-zinc-300">
                 {s.icon}
                 <span className="text-[8px] font-bold uppercase tracking-widest">{s.label}</span>
              </div>
              <p className="text-sm font-black tracking-tighter text-zinc-900 dark:text-white uppercase">{s.val}</p>
           </div>
         ))}
      </div>

      {/* Settings Sections */}
      <div className="space-y-3 px-1">
        <h3 className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.4em] px-2">Configuration</h3>
        
        <div className="vibrant-card overflow-hidden">
          <button onClick={() => setDarkMode(!darkMode)} className="w-full flex items-center justify-between p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
             <div className="flex items-center gap-4">
                <div className="w-9 h-9 bg-zinc-50 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-300 border border-black/5">
                  {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                </div>
                <div className="text-left">
                  <p className="font-bold text-xs text-zinc-900 dark:text-white">Interface Visuelle</p>
                  <p className="text-[8px] font-bold text-zinc-300 uppercase tracking-widest mt-0.5">Mode {darkMode ? 'Obsidian' : 'Alabaster'}</p>
                </div>
             </div>
             <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${darkMode ? 'bg-primary' : 'bg-zinc-200'}`}>
                <div className={`w-3 h-3 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-4' : 'translate-x-0'}`} />
             </div>
          </button>

          <div className="h-px bg-black/[0.03] dark:bg-white/[0.03] ml-16" />

          <button className="w-full flex items-center justify-between p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
             <div className="flex items-center gap-4">
                <div className="w-9 h-9 bg-zinc-50 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-300 border border-black/5">
                  <Shield size={16} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-xs text-zinc-900 dark:text-white">Biométrie & Privacy</p>
                  <p className="text-[8px] font-bold text-zinc-300 uppercase tracking-widest mt-0.5">Données Sécurisées</p>
                </div>
             </div>
             <ChevronRight size={14} className="text-zinc-200" />
          </button>
        </div>
      </div>

      <div className="text-center pt-4 opacity-20">
        <p className="text-[8px] font-bold uppercase tracking-[0.5em] text-zinc-500 italic">Cuisin'Home Atelier Elite • Final Build v5.2</p>
      </div>
    </div>
  );
};

export default ProfileView;
