
import React from 'react';

interface WaterTankProps {
  levelPercent: number; // 0 to 100
  isCritical: boolean;
}

export const WaterTank: React.FC<WaterTankProps> = ({ levelPercent, isCritical }) => {
  return (
    <div className="relative w-full h-80 glass rounded-3xl overflow-hidden border-4 border-slate-700">
      {/* Percentage Text */}
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
        <span className="text-5xl font-bold text-white drop-shadow-md">
          {Math.round(levelPercent)}%
        </span>
      </div>

      {/* Water Body */}
      <div 
        className={`absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-in-out ${
          isCritical ? 'bg-red-500/80' : 'bg-blue-500/80'
        }`}
        style={{ height: `${levelPercent}%` }}
      >
        {/* Wave Animation Overlay */}
        <div className="absolute top-[-20px] left-0 w-[200%] h-10 opacity-50">
           <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-full fill-current text-inherit water-wave">
             <path d="M0,50 C150,0 350,0 500,50 C650,100 850,100 1000,50 L1000,100 L0,100 Z" />
           </svg>
        </div>
      </div>

      {/* Tank Markings */}
      <div className="absolute inset-y-0 right-4 flex flex-col justify-between py-8 text-slate-400 font-mono text-xs z-10">
        <span>100%</span>
        <span>75%</span>
        <span>50%</span>
        <span>25%</span>
        <span>0%</span>
      </div>
    </div>
  );
};
