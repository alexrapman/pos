// frontend/src/hooks/useSocket.ts
import { useEffect } from 'react';
import { socketService } from '../services/socket';

export const useOrderSocket = (orderId: number, callback: (data: any) => void) => {
  useEffect(() => {
    socketService.joinOrderRoom(orderId);
    socketService.onOrderUpdate(callback);

    return () => {
      socketService.cleanup();
    };
  }, [orderId, callback]);
};

export const useKitchenSocket = (callback: (data: any) => void) => {
  useEffect(() => {
    socketService.joinKitchenRoom();
    socketService.onNewOrder(callback);

    return () => {
      socketService.cleanup();
    };
  }, [callback]);
};