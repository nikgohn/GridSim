"use client";

import { useSimulation } from '@/hooks/use-simulation';
import { ControlPanel } from '@/components/simulation/ControlPanel';
import { GridMap } from '@/components/simulation/GridMap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Info, ShieldAlert } from 'lucide-react';

export default function Home() {
  const { state, toggleRunning, reset } = useSimulation();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-8">
          <div className="flex items-center gap-4">
            <div className="bg-primary p-3 rounded-2xl shadow-lg shadow-primary/20">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-headline font-black text-slate-900 tracking-tight">GridSim</h1>
              <p className="text-slate-500 font-medium">Power Grid Stability Simulation</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Health</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-500" 
                    style={{ width: `${state.nodes.reduce((acc, n) => acc + n.stability, 0) / state.nodes.length * 100}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-primary">
                  {Math.round(state.nodes.reduce((acc, n) => acc + n.stability, 0) / state.nodes.length * 100)}%
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Simulation Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Controls */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <ControlPanel 
              state={state} 
              onToggle={toggleRunning} 
              onReset={reset} 
            />

            <Card className="border-none shadow-lg bg-white/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Info className="w-4 h-4 text-slate-400" />
                  Simulation Rules
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-slate-600 leading-relaxed space-y-3">
                <p>
                  Nodes naturally drift in load. If a node exceeds its 
                  <span className="font-bold"> Capacity</span>, its stability drops.
                </p>
                <div className="p-3 bg-accent/10 rounded-lg border border-accent/20 flex gap-2">
                  <ShieldAlert className="w-4 h-4 text-accent shrink-0" />
                  <p>
                    <span className="font-bold text-accent">Unstable nodes</span> (stability &lt; 50%) 
                    generate excess internal load, creating a feedback loop.
                  </p>
                </div>
                <p>
                  <span className="font-bold">Connections</span> automatically balance load between nodes based 
                  on their relative capacities to maintain system equilibrium.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Grid Map Visualizer */}
          <div className="lg:col-span-3">
            <GridMap 
              nodes={state.nodes} 
              connections={state.connections} 
            />
          </div>
        </div>

        {/* Status Dashboard */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {state.nodes.slice(0, 4).map(node => (
            <Card key={node.id} className="border-none shadow-md overflow-hidden group hover:shadow-xl transition-all">
              <div 
                className="h-1 bg-primary" 
                style={{ width: `${(node.load / node.capacity) * 100}%`, backgroundColor: node.stability < 0.5 ? 'hsl(var(--accent))' : 'hsl(var(--primary))' }} 
              />
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-800">{node.name}</h3>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${node.stability < 0.5 ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'}`}>
                    {node.stability < 0.5 ? 'Alert' : 'Nominal'}
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-black text-slate-900">{Math.round(node.load)} <span className="text-xs text-slate-400 font-medium">MW</span></span>
                  <span className="text-xs text-slate-500">Cap: {node.capacity} MW</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

      </div>
    </div>
  );
}