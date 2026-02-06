"use client";

import { Play, Pause, RotateCcw, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SimulationState } from '@/lib/simulation-types';

interface ControlPanelProps {
  state: SimulationState;
  onToggle: () => void;
  onReset: () => void;
}

export function ControlPanel({ state, onToggle, onReset }: ControlPanelProps) {
  const unstableCount = state.nodes.filter(n => n.stability < 0.5).length;
  const avgLoad = state.nodes.reduce((acc, n) => acc + (n.load / n.capacity), 0) / state.nodes.length;

  return (
    <Card className="w-full bg-white/80 backdrop-blur shadow-xl border-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-headline flex items-center gap-2 text-primary">
          <Activity className="w-6 h-6" />
          System Controls
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-2">
              <Button 
                variant={state.isRunning ? "outline" : "default"} 
                onClick={onToggle}
                className="w-32 transition-all"
              >
                {state.isRunning ? <Pause className="mr-2 w-4 h-4" /> : <Play className="mr-2 w-4 h-4" />}
                {state.isRunning ? "Pause" : "Start"}
              </Button>
              <Button variant="outline" size="icon" onClick={onReset} title="Reset Simulation">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
              Tick: {state.tick}s
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-1">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">System Stability</span>
              <div className="flex items-center gap-2">
                {unstableCount > 0 ? (
                  <>
                    <AlertTriangle className="w-5 h-5 text-accent animate-pulse" />
                    <span className="text-xl font-bold text-accent">{unstableCount} Unstable</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    <span className="text-xl font-bold text-primary">Stable</span>
                  </>
                )}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-1">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Average Load</span>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">{(avgLoad * 100).toFixed(1)}%</span>
                <Badge variant={avgLoad > 0.8 ? "destructive" : "secondary"}>
                  {avgLoad > 0.8 ? "High" : "Optimal"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}