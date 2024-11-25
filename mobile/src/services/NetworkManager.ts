// mobile/src/services/NetworkManager.ts
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { create } from 'zustand';

interface NetworkStore {
  isOnline: boolean;
  type: string | null;
  setStatus: (status: NetInfoState) => void;
}

export const useNetworkStore = create<NetworkStore>((set) => ({
  isOnline: true,
  type: null,
  setStatus: (status: NetInfoState) => 
    set({ isOnline: !!status.isConnected, type: status.type })
}));

export class NetworkManager {
  private static instance: NetworkManager;

  private constructor() {
    this.initializeNetworkListener();
  }

  static getInstance(): NetworkManager {
    if (!NetworkManager.instance) {
      NetworkManager.instance = new NetworkManager();
    }
    return NetworkManager.instance;
  }

  private initializeNetworkListener() {
    NetInfo.addEventListener(state => {
      useNetworkStore.getState().setStatus(state);
      this.handleConnectionChange(state);
    });
  }

  private handleConnectionChange(state: NetInfoState) {
    if (state.isConnected) {
      this.onConnectionRestored();
    }
  }

  private async onConnectionRestored() {
    // Trigger sync operations
    const offlineStorage = OfflineStorageService.getInstance();
    await offlineStorage.processSyncQueue();
  }

  async checkConnection(): Promise<boolean> {
    const state = await NetInfo.fetch();
    return !!state.isConnected;
  }
}

// mobile/src/components/NetworkStatus.tsx
import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useNetworkStore } from '../services/NetworkManager';

export const NetworkStatus = () => {
  const { isOnline, type } = useNetworkStore();
  const translateY = React.useRef(new Animated.Value(-50)).current;

  React.useEffect(() => {
    Animated.spring(translateY, {
      toValue: isOnline ? -50 : 0,
      useNativeDriver: true,
    }).start();
  }, [isOnline]);

  return (
    <Animated.View 
      style={[
        styles.container,
        { transform: [{ translateY }] }
      ]}
    >
      <Text style={styles.text}>
        {isOnline ? 'Back Online' : 'No Internet Connection'}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#dc3545',
    padding: 8,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  }
});