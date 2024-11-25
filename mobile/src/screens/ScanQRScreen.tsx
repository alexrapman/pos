// mobile/src/screens/ScanQRScreen.tsx
import { Camera } from 'react-native-camera';

export const ScanQRScreen = ({ navigation }) => {
  const onQRRead = (event) => {
    const tableId = event.data;
    navigation.navigate('Menu', { tableId });
  };

  return (
    <Camera
      onBarCodeRead={onQRRead}
      style={{ flex: 1 }}
    />
  );
};
