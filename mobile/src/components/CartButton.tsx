// mobile/src/components/CartButton.tsx
export const CartButton: React.FC<{ itemCount: number; total: number; onPress: () => void }> = 
  ({ itemCount, total, onPress }) => {
  
  return (
    <TouchableOpacity style={styles.cartButton} onPress={onPress}>
      <View style={styles.cartContent}>
        <Text style={styles.cartText}>View Cart</Text>
        <View style={styles.cartInfo}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{itemCount}</Text>
          </View>
          <Text style={styles.total}>${total.toFixed(2)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  details: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
    marginTop: 8,
  },
  cartButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#2196F3',
    borderRadius: 30,
    padding: 16,
  },
  cartContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cartInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: 'white',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  badgeText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  total: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});