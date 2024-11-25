// frontend/src/services/MetricsClient.ts
import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';

interface MetricsState {
  metrics: {
    cpu: number[];
    memory: number[];
    requests: number[];
    responseTime: number[];
  };
  updateMetrics: (type: string, value: number) => void;
}

export const useMetricsStore = create<MetricsState>((set) => ({
  metrics: {
    cpu: [],
    memory: [],
    requests: [],
    responseTime: []
  },
  updateMetrics: (type, value) => 
    set((state) => ({
      metrics: {
        ...state.metrics,
        [type]: [...state.metrics[type].slice(-30), value]
      }
    }))
}));

class MetricsClient {
  private socket: Socket;
  
  constructor() {
    this.socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');
    this.setupListeners();
  }

  private setupListeners() {
    this.socket.on('metrics', (data) => {
      const { metrics } = data;
      Object.entries(metrics).forEach(([type, value]) => {
        useMetricsStore.getState().updateMetrics(type, value as number);
      });
    });
  }

  public disconnect() {
    this.socket.disconnect();
  }
}

export const metricsClient = new MetricsClient();