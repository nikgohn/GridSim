"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { GridNode, GridConnection, SimulationState } from '@/lib/simulation-types';

const INITIAL_NODES: GridNode[] = [
  { id: 'n1', name: 'Central Hub', load: 450, capacity: 1000, stability: 1, x: 50, y: 50 },
  { id: 'n2', name: 'North Station', load: 200, capacity: 500, stability: 1, x: 50, y: 15 },
  { id: 'n3', name: 'South Station', load: 200, capacity: 500, stability: 1, x: 50, y: 85 },
  { id: 'n4', name: 'West Plant', load: 600, capacity: 800, stability: 1, x: 15, y: 50 },
  { id: 'n5', name: 'East Plant', load: 300, capacity: 600, stability: 1, x: 85, y: 50 },
  { id: 'n6', name: 'Northeast Sub', load: 150, capacity: 400, stability: 1, x: 80, y: 20 },
  { id: 'n7', name: 'Northwest Sub', load: 150, capacity: 400, stability: 1, x: 20, y: 20 },
];

const INITIAL_CONNECTIONS: GridConnection[] = [
  { id: 'c1', fromId: 'n1', toId: 'n2', transferRate: 50 },
  { id: 'c2', fromId: 'n1', toId: 'n3', transferRate: 50 },
  { id: 'c3', fromId: 'n1', toId: 'n4', transferRate: 100 },
  { id: 'c4', fromId: 'n1', toId: 'n5', transferRate: 100 },
  { id: 'c5', fromId: 'n2', toId: 'n6', transferRate: 30 },
  { id: 'c6', fromId: 'n2', toId: 'n7', transferRate: 30 },
  { id: 'c7', fromId: 'n4', toId: 'n7', transferRate: 50 },
  { id: 'c8', fromId: 'n5', toId: 'n6', transferRate: 50 },
];

export function useSimulation() {
  const [state, setState] = useState<SimulationState>({
    nodes: INITIAL_NODES,
    connections: INITIAL_CONNECTIONS,
    isRunning: false,
    tick: 0,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const reset = useCallback(() => {
    setState({
      nodes: INITIAL_NODES.map(n => ({ ...n })),
      connections: INITIAL_CONNECTIONS.map(c => ({ ...c })),
      isRunning: false,
      tick: 0,
    });
  }, []);

  const toggleRunning = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: !prev.isRunning }));
  }, []);

  const runTick = useCallback(() => {
    setState(prev => {
      const newNodes = prev.nodes.map(node => {
        // 1. Natural Load Variation
        const drift = (Math.random() - 0.45) * 20; // Slight upward trend bias
        let newLoad = Math.max(0, node.load + drift);

        // 2. Stability Calculation
        let newStability = node.stability;
        if (newLoad > node.capacity) {
          newStability = Math.max(0, node.stability - 0.05);
        } else if (newLoad < node.capacity * 0.8) {
          newStability = Math.min(1, node.stability + 0.02);
        }

        // 3. Effect of Instability (Unstable nodes generate heat/extra load)
        if (newStability < 0.5) {
          newLoad += (1 - newStability) * 15;
        }

        return { ...node, load: newLoad, stability: newStability };
      });

      // 4. Load Transfer between connections
      prev.connections.forEach(conn => {
        const from = newNodes.find(n => n.id === conn.fromId);
        const to = newNodes.find(n => n.id === conn.toId);

        if (from && to) {
          // Transfer from high relative load to low relative load
          const fromRatio = from.load / from.capacity;
          const toRatio = to.load / to.capacity;

          if (fromRatio > toRatio) {
            const transfer = Math.min(conn.transferRate, (fromRatio - toRatio) * 100);
            from.load -= transfer;
            to.load += transfer;
          } else if (toRatio > fromRatio) {
            const transfer = Math.min(conn.transferRate, (toRatio - fromRatio) * 100);
            to.load -= transfer;
            from.load += transfer;
          }
        }
      });

      return {
        ...prev,
        nodes: newNodes,
        tick: prev.tick + 1,
      };
    });
  }, []);

  useEffect(() => {
    if (state.isRunning) {
      timerRef.current = setInterval(runTick, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.isRunning, runTick]);

  return {
    state,
    toggleRunning,
    reset,
  };
}