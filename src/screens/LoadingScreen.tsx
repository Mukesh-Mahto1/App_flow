import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface LoadingScreenProps {}

const LoadingScreen: React.FC<LoadingScreenProps> = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous rotation for loading spinner
    const startRotation = () => {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();
    };

    startRotation();
  }, [fadeAnim, scaleAnim, rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2c3e50" />
      
      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>
            <Text style={styles.logoX}>✕</Text>
            <Text style={styles.logoJakson}>JAKSON</Text>
          </Text>
        </View>

        {/* Loading Spinner */}
        <Animated.View
          style={[
            styles.spinner,
            {
              transform: [{ rotate: spin }],
            },
          ]}
        >
          <View style={styles.spinnerOuter}>
            <View style={styles.spinnerInner} />
          </View>
        </Animated.View>

        {/* Loading Text */}
        <Text style={styles.loadingText}>Loading...</Text>
        <Text style={styles.subText}>Please wait while we set things up</Text>
      </Animated.View>

      {/* Bottom Branding */}
      <View style={styles.bottomContainer}>
        <Text style={styles.brandText}>Powered by JAKSON</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c3e50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logoContainer: {
    marginBottom: 60,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  logoX: {
    color: '#e74c3c',
    fontSize: 42,
  },
  logoJakson: {
    color: '#3498db',
    fontSize: 36,
  },
  spinner: {
    marginBottom: 40,
  },
  spinnerOuter: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderTopColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3498db',
  },
  loadingText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: '#bdc3c7',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  brandText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
});

export default LoadingScreen;