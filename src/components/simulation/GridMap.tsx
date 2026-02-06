"use client";

import { GridNode, GridConnection } from '@/lib/simulation-types';
import { cn } from '@/lib/utils';

interface GridMapProps {
  nodes: GridNode[];
  connections: GridConnection[];
}

export function GridMap({ nodes, connections }: GridMapProps) {
  return (
    <div className="relative w-full aspect-video bg-slate-100 rounded-3xl overflow-hidden shadow-inner border-8 border-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      {/* SVG Layer for Connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="25" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" opacity="0.5" />
          </marker>
        </defs>
        {connections.map((conn) => {
          const from = nodes.find(n => n.id === conn.fromId);
          const to = nodes.find(n => n.id === conn.toId);
          if (!from || !to) return null;

          const isHeavyLoad = (from.load / from.capacity) > 0.8 || (to.load / to.capacity) > 0.8;

          return (
            <line
              key={conn.id}
              x1={`${from.x}%`}
              y1={`${from.y}%`}
              x2={`${to.x}%`}
              y2={`${to.y}%`}
              className={cn(
                "transition-all duration-500",
                isHeavyLoad ? "stroke-accent/50 stroke-[3]" : "stroke-slate-300 stroke-[2]"
              )}
              markerEnd="url(#arrow)"
            />
          );
        })}
      </svg>

      {/* Node Layer */}
      {nodes.map((node) => {
        const loadRatio = node.load / node.capacity;
        const isUnstable = node.stability < 0.5;
        const isWarning = loadRatio > 0.8 && !isUnstable;

        return (
          <div
            key={node.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            <div className="flex flex-col items-center group">
              {/* Node Indicator */}
              <div 
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 relative",
                  isUnstable ? "bg-accent text-white shadow-lg animate-flash-unstable" : 
                  isWarning ? "bg-accent/20 text-accent border-2 border-accent" : 
                  "bg-white border-2 border-primary text-primary shadow-sm"
                )}
              >
                {/* Visual Load Glow */}
                <div 
                  className={cn(
                    "absolute inset-0 rounded-2xl opacity-20 scale-150 animate-pulse-load",
                    isUnstable ? "bg-accent" : "bg-primary"
                  )}
                  style={{ transform: `scale(${1 + loadRatio * 0.5})` }}
                />
                
                <span className="text-[10px] font-bold z-10">
                  {Math.round(loadRatio * 100)}%
                </span>
              </div>

              {/* Node Label */}
              <div className="mt-3 text-center pointer-events-none">
                <p className="text-xs font-bold text-slate-700 whitespace-nowrap bg-white/90 px-2 py-0.5 rounded shadow-sm">
                  {node.name}
                </p>
                <p className="text-[9px] font-medium text-slate-500 uppercase tracking-tighter">
                  {Math.round(node.load)} / {node.capacity} MW
                </p>
              </div>

              {/* Tooltip on Hover */}
              <div className="absolute top-full mt-10 hidden group-hover:block z-50">
                <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl text-xs min-w-32 flex flex-col gap-1">
                  <p className="font-bold border-b border-white/20 pb-1 mb-1">{node.name}</p>
                  <div className="flex justify-between">
                    <span>Stability:</span>
                    <span className={cn(node.stability < 0.5 ? "text-accent" : "text-green-400")}>
                      {Math.round(node.stability * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Condition:</span>
                    <span>{isUnstable ? "Critical" : isWarning ? "Warning" : "Nominal"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}