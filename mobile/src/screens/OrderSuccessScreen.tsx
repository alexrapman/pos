// mobile/src/screens/OrderSuccessScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import LottieView from 'lottie-react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export const OrderSuccessScreen = ({ route, navigation }) => {
  const { orderId, tableId } = route.params;
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/animations/success.json')}
        autoPlay
        loop={false}
        style={styles.animation}
      />
      
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Order Confirmed!</Text>
        <Text style={styles.orderNumber}>Order #{orderId}</Text>
        <Text style={styles.tableNumber}>Table {tableId}</Text>
        <Text style={styles.message}>
          Your order has been received and is being prepared.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Menu')}
        >
          <Text style={styles.buttonText}>Return to Menu</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  animation: {
    width: 200,
    height: 200,
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  orderNumber: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  tableNumber: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});