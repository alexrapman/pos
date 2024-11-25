// mobile/src/components/LoadingSpinner.tsx
export const LoadingSpinner = () => {
    const spinValue = new Animated.Value(0);
  
    React.useEffect(() => {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true
        })
      ).start();
    }, []);
  
    const spin = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });
  
    return (
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        {/* Spinner content */}
      </Animated.View>
    );
  };