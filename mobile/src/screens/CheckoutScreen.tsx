// mobile/src/screens/CheckoutScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useCart } from '../hooks/useCart';
import { PaymentMethod } from '../types';

export const CheckoutScreen = ({ route, navigation }) => {
  const { tableId } = route.params;
  const { items, total, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tableId,
          items,
          total,
          paymentMethod
        })
      });

      if (!response.ok) throw new Error('Order failed');

      clearCart();
      navigation.navigate('OrderSuccess');
    } catch (error) {
      Alert.alert('Error', 'Failed to process order');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        {items.map(item => (
          <View key={item.id} style={styles.item}>
            <Text style={styles.itemName}>{item.name} x{item.quantity}</Text>
            <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        {['cash', 'card'].map(method => (
          <TouchableOpacity
            key={method}
            style={[
              styles.paymentMethod,
              paymentMethod === method && styles.selectedPayment
            ]}
            onPress={() => setPaymentMethod(method as PaymentMethod)}
          >
            <Text style={styles.paymentText}>
              {method.charAt(0).toUpperCase() + method.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.checkoutButton, isProcessing && styles.processingButton]}
        onPress={handleCheckout}
        disabled={isProcessing}
      >
        <Text style={styles.checkoutText}>
          {isProcessing ? 'Processing...' : 'Confirm Order'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  paymentMethod: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedPayment: {
    borderColor: '#2196F3',
    backgroundColor: '#e3f2fd',
  },
  paymentText: {
    fontSize: 16,
  },
  checkoutButton: {
    backgroundColor: '#2196F3',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  processingButton: {
    backgroundColor: '#90caf9',
  },
  checkoutText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});