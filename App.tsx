import React, { useState, useEffect } from 'react';
import { SensorData, AIInsight } from './types';
import { WaterTank } from './components/WaterTank';
import { SensorCard } from './components/SensorCard';
import { analyzeWaterSystem } from './services/aiService';
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

const MAX_HISTORY = 50;

const App: React.FC = () => {
  const [data, setData] = useState<SensorData[]>([]);
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  /* =============================
     🔌 DATA DARI ARDUINO (WS)
  ============================== */
  useEffect(() => {
  const ws = new WebSocket("ws://localhost:8081"); // pastikan PORT SAMA

  ws.onopen = () => {
    console.log("WS CONNECTED");
  };

  ws.onmessage = (event) => {
    const d = JSON.parse(event.data);
    console.log("WS DATA:", d);

    const newData = {
      waterValue: d.waterValue,
      potValue: d.potValue,
      threshold: d.threshold,
      distance: d.distance,
      relayState: d.waterValue >= d.threshold,
      buzzerState: d.waterValue < d.threshold,
      ledRed: d.waterValue < d.threshold,
      ledGreen: d.waterValue >= d.threshold,
      timestamp: Date.now()
    };

    setData(prev => [...prev, newData].slice(-50));
  };

  ws.onerror = (e) => console.error("WS ERROR", e);

  return () => ws.close();
}, []);


  const handleAIAnalysis = async () => {
    if (data.length < 5) return;
    setIsAnalyzing(true);
    const result = await analyzeWaterSystem(data);
    setInsight(result);
    setIsAnalyzing(false);
  };

  const current = data[data.length - 1];
  const levelPercent = current ? (current.waterValue / 4095) * 100 : 0;

  return (
    <div className="min-h-screen pb-12">

      {/* HEADER */}
      <header className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-slate-700">
        <h1 className="text-xl font-bold text-blue-400">AQUAFLOW PRO</h1>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${current?.ledGreen ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-slate-400">LIVE DATA</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass p-8 rounded-3xl">
            <WaterTank
              levelPercent={levelPercent}
              isCritical={current?.ledRed || false}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <SensorCard
              label="Relay"
              value={current?.relayState ? 'ON' : 'OFF'}
              icon="fa-plug"
              color="bg-emerald-600"
            />
            <SensorCard
              label="Alarm"
              value={current?.buzzerState ? 'ACTIVE' : 'IDLE'}
              icon="fa-bell"
              color={current?.buzzerState ? 'bg-red-600' : 'bg-slate-700'}
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-8 space-y-8">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <SensorCard label="Water ADC" value={current?.waterValue || 0} icon="fa-water" color="bg-blue-600" />
            <SensorCard label="Distance" value={current?.distance || 0} unit="cm" icon="fa-ruler" color="bg-indigo-600" />
            <SensorCard label="Pot" value={current?.potValue || 0} icon="fa-sliders" color="bg-amber-600" />
            <SensorCard label="Threshold" value={current?.threshold || 0} icon="fa-gauge" color="bg-orange-600" />
          </div>

          <div className="glass p-8 rounded-3xl h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" hide />
                <YAxis />
                <Tooltip />
                <Area dataKey="waterValue" stroke="#3b82f6" fill="#3b82f6" />
                <Line dataKey="threshold" stroke="#f59e0b" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

        

        </div>
      </main>
    </div>
  );
};

export default App;
