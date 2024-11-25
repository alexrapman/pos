// frontend/src/__tests__/hooks/useSocket.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useOrderSocket, useKitchenSocket } from '../../hooks/useSocket';
import { socketService } from '../../services/socket';

jest.mock('../../services/socket', () => ({
  socketService: {
    joinOrderRoom: jest.fn(),
    joinKitchenRoom: jest.fn(),
    onOrderUpdate: jest.fn(),
    onNewOrder: jest.fn(),
    cleanup: jest.fn()
  }
}));

describe('WebSocket Hooks Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useOrderSocket', () => {
    it('should join order room and listen for updates', () => {
      const mockCallback = jest.fn();
      const orderId = 123;

      renderHook(() => useOrderSocket(orderId, mockCallback));

      expect(socketService.joinOrderRoom).toHaveBeenCalledWith(orderId);
      expect(socketService.onOrderUpdate).toHaveBeenCalledWith(mockCallback);
    });

    it('should cleanup on unmount', () => {
      const { unmount } = renderHook(() => 
        useOrderSocket(123, jest.fn())
      );

      unmount();
      expect(socketService.cleanup).toHaveBeenCalled();
    });
  });

  describe('useKitchenSocket', () => {
    it('should join kitchen room and listen for new orders', () => {
      const mockCallback = jest.fn();

      renderHook(() => useKitchenSocket(mockCallback));

      expect(socketService.joinKitchenRoom).toHaveBeenCalled();
      expect(socketService.onNewOrder).toHaveBeenCalledWith(mockCallback);
    });

    it('should cleanup on unmount', () => {
      const { unmount } = renderHook(() => 
        useKitchenSocket(jest.fn())
      );

      unmount();
      expect(socketService.cleanup).toHaveBeenCalled();
    });
  });
});