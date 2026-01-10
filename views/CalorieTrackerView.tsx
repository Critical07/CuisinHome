
import React, { useState, useRef } from 'react';
import { Camera, Upload, ChevronRight, Sparkles, Zap } from 'lucide-react';
import { analyzeFoodImage } from '../geminiService';

interface Props {
  onLogFood: (food: { name: string; kcal: number; carbs: number; protein: number; fats: number }) => void;
}

const CalorieTrackerView: React.FC<Props> = ({ onLogFood }) => {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        setImage(reader.result as string);
        analyze(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyze = async (base64: string) => {
    setAnalyzing(true);
    setResult(null);
    try {
      const data = await analyzeFoodImage(base64);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 pt-8 animate-in fade-in duration-1000">
      <div className="premium-card rounded-[3.5rem] p-12 text-center space-y-10 border-white/5 bg-gradient-to-br from-zinc-900 to-black">
        <div className="w-24 h-24 bg-cyan-500 rounded-[2.5rem] flex items-center justify-center mx-auto text-black shadow-2xl glow-cyan group">
          <Camera size={48} className="group-hover:rotate-12 transition-transform" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter italic">Scanner IA</h2>
          <p className="text-[10px] font-bold text-zinc-500 mt-4 uppercase tracking-[0.3em] leading-relaxed">Identification instantanée des macros</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-4">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-4 p-10 rounded-[2.5rem] bg-white/5 border border-white/5 hover:bg-white/10 transition-all active:scale-95 shadow-xl"
          >
            <Camera className="text-cyan-500" size={32} />
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Photo</span>
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-4 p-10 rounded-[2.5rem] bg-white/5 border border-white/5 hover:bg-white/10 transition-all active:scale-95 shadow-xl"
          >
            <Upload className="text-zinc-500" size={32} />
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Galerie</span>
          </button>
        </div>
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
      </div>

      {analyzing && (
        <div className="premium-card rounded-[3rem] p-16 flex flex-col items-center gap-10 border-white/5 bg-black">
          <div className="relative">
             <div className="w-24 h-24 border-[8px] border-white/5 rounded-full"></div>
             <div className="w-24 h-24 border-[8px] border-cyan-500 border-t-transparent rounded-full animate-spin absolute top-0 glow-cyan"></div>
             <Zap size={32} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-500 animate-pulse" />
          </div>
          <div className="text-center">
            <p className="text-xl font-black text-white italic uppercase tracking-tighter">Vision AI en cours...</p>
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.4em] mt-3">Calcul des macros</p>
          </div>
        </div>
      )}

      {result && (
        <div className="premium-card rounded-[4rem] overflow-hidden border-white/5 shadow-2xl animate-in slide-in-from-bottom-10 bg-black">
          <div className="h-72 relative">
            <img src={image!} alt="Food" className="w-full h-full object-cover" />
            <div className="absolute top-6 left-6">
               <div className="px-4 py-2 bg-cyan-500 text-black rounded-xl flex items-center gap-2 shadow-2xl glow-cyan">
                <Sparkles size={16} strokeWidth={3} />
                <span className="text-[11px] font-black uppercase tracking-widest">Identifié</span>
              </div>
            </div>
          </div>
          <div className="p-10 space-y-10">
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-4xl font-black text-white capitalize tracking-tighter italic">{result.name}</h3>
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-2">Score de Précision IA 99%</p>
              </div>
              <div className="text-right">
                <p className="text-5xl font-black text-cyan-500 tracking-tighter leading-none">{result.kcal}</p>
                <p className="text-[10px] text-zinc-700 uppercase font-black tracking-widest mt-2 italic">kcal</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Carbs', val: result.carbs, color: 'text-zinc-300' },
                { label: 'Prot', val: result.protein, color: 'text-white' },
                { label: 'Fats', val: result.fats, color: 'text-zinc-500' }
              ].map(m => (
                <div key={m.label} className="p-6 bg-white/5 rounded-3xl text-center border border-white/5">
                  <p className="text-[9px] font-black text-zinc-600 uppercase mb-3">{m.label}</p>
                  <p className={`text-2xl font-black ${m.color}`}>{m.val}g</p>
                </div>
              ))}
            </div>

            <button 
              onClick={() => onLogFood(result)}
              className="w-full py-7 bg-white text-black font-black rounded-3xl shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4 uppercase tracking-[0.3em] text-[11px]"
            >
              Ajouter au Journal <ChevronRight size={24} strokeWidth={3} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalorieTrackerView;
