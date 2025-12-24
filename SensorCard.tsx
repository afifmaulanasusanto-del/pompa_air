
import React from 'react';

interface SensorCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: string;
  color: string;
}

export const SensorCard: React.FC<SensorCardProps> = ({ label, value, unit, icon, color }) => {
  return (
    <div className="glass p-6 rounded-2xl flex flex-col items-center gap-2 group transition-all hover:scale-105">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color} mb-2 group-hover:animate-pulse`}>
        <i className={`fas ${icon} text-white text-xl`}></i>
      </div>
      <span className="text-slate-400 text-sm font-medium uppercase tracking-wider">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-white">{value}</span>
        {unit && <span className="text-slate-500 text-sm">{unit}</span>}
      </div>
    </div>
  );
};
