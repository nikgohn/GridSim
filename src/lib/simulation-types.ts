export type NodeStatus = 'stable' | 'warning' | 'unstable' | 'critical';

export interface GridNode {
  id: string;
  name: string;
  load: number; // Current load in MW
  capacity: number; // Max capacity in MW
  stability: number; // 0 to 1 scale
  x: number; // Position X (percentage 0-100)
  y: number; // Position Y (percentage 0-100)
}

export interface GridConnection {
  id: string;
  fromId: string;
  toId: string;
  transferRate: number; // MW per second
}

export interface SimulationState {
  nodes: GridNode[];
  connections: GridConnection[];
  isRunning: boolean;
  tick: number;
}