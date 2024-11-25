// mobile/src/App.tsx
import React, { useEffect } from 'react';
import { AppNavigator } from './navigation/AppNavigator';
import { PushNotificationService } from './services/PushNotificationService';

const App = () => {
  const pushNotificationService = new PushNotificationService();

  useEffect(() => {
    pushNotificationService.requestPermission();
    pushNotificationService.getToken().then(token => {
      // Enviar token al backend para suscripción
    });

    const unsubscribeOnMessage = pushNotificationService.onMessage(async message => {
      console.log('A new FCM message arrived!', message);
    });

    const unsubscribeOnNotificationOpened = pushNotificationService.onNotificationOpened(message => {
      console.log('Notification caused app to open from background state:', message);
    });

    pushNotificationService.onBackgroundMessage(async message => {
      console.log('Message handled in the background!', message);
    });

    return () => {
      unsubscribeOnMessage();
      unsubscribeOnNotificationOpened();
    };
  }, []);

  return <AppNavigator />;
};

export default App;