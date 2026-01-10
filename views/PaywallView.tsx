
import React from 'react';
import { Crown, Sparkles, Zap, Music2, ShieldCheck, Star, Heart, ArrowRight } from 'lucide-react';

interface Props {
  onSubscribe: () => void;
}

const PaywallView: React.FC<Props> = ({ onSubscribe }) => {
  const features = [
    { icon: <Music2 size={20} className="text-white" />, title: "Inspiration TikTok +", desc: "Zéro limite sur vos découvertes.", bg: "bg-wellness-blush" },
    { icon: <Sparkles size={20} className="text-white" />, title: "Intelligence Gemini 3", desc: "Le top de l'IA pour vos menus.", bg: "bg-primary" },
    { icon: <Heart size={20} className="text-white" />, title: "Wellness Master", desc: "Un coaching nutritionnel sur-mesure.", bg: "bg-wellness-sage" },
    { icon: <ShieldCheck size={20} className="text-white" />, title: "Zéro Pub", desc: "Focus total sur votre éclat.", bg: "bg-zinc-800" },
  ];

  return (
    <div className="space-y-8 pt-6 pb-32 animate-in fade-in slide-in-from-bottom-10 duration-1000">
      <div className="relative rounded-[4rem] overflow-hidden bg-white dark:bg-zinc-900 p-10 shadow-2xl border-none">
        
        {/* Vibrant Gradients */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-wellness-blush/20 blur-[100px] rounded-full animate-float" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/20 blur-[100px] rounded-full animate-float" style={{ animationDelay: '2s' }} />

        <div className="relative flex flex-col items-center text-center space-y-12">
          <div className="w-24 h-24 bg-gradient-to-tr from-wellness-blush via-primary to-wellness-gold rounded-[2.5rem] flex items-center justify-center shadow-2xl animate-bounce" style={{ animationDuration: '3s' }}>
            <Crown size={48} className="text-white" strokeWidth={1.5} />
          </div>

          <div className="space-y-4">
            <h2 className="text-5xl font-black text-zinc-800 dark:text-white tracking-tighter italic leading-[0.9]">Éveillez votre Potentiel</h2>
            <p className="text-[12px] font-black text-wellness-blush uppercase tracking-[0.5em] mt-4">Expérience Cuisin'Home Pro</p>
          </div>

          <div className="w-full space-y-4">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-6 p-6 bg-wellness-beige/50 dark:bg-white/5 rounded-3xl border border-wellness-clay/10 text-left transition-all hover:scale-[1.03] group">
                <div className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform`}>
                  {f.icon}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-black text-zinc-800 dark:text-zinc-200 uppercase tracking-widest">{f.title}</h4>
                  <p className="text-[11px] text-zinc-500 font-bold mt-1 leading-tight">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full pt-6 space-y-8">
            <button 
              onClick={onSubscribe}
              className="w-full py-8 bg-zinc-900 dark:bg-primary text-white dark:text-black font-black rounded-[2.5rem] shadow-2xl active:scale-95 transition-all flex flex-col items-center justify-center uppercase tracking-[0.4em] text-[12px] relative overflow-hidden btn-glow-gold"
            >
              <span className="relative z-10 flex items-center gap-3">Commencer • 9,99€ / mois <ArrowRight size={18}/></span>
              <span className="text-[9px] opacity-60 font-black tracking-widest mt-2 italic relative z-10">Essai gratuit de 7 jours</span>
            </button>

            <div className="flex justify-center gap-10 opacity-30">
              <div className="flex flex-col items-center gap-2">
                <Star size={18} fill="currentColor" />
                <span className="text-[10px] font-black uppercase tracking-widest">4.9 Star</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <ShieldCheck size={18} fill="currentColor" />
                <span className="text-[10px] font-black uppercase tracking-widest">Sécurisé</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-center text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] px-14 leading-relaxed italic">
        Votre abonnement permet de financer nos serveurs IA et de vous offrir le meilleur service possible.
      </p>
    </div>
  );
};

export default PaywallView;
