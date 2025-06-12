import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as Keychain from 'react-native-keychain';
import { KeyboardAvoidingView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

interface LoginScreenProps {
  onLoginSuccess?: () => void; // For simple approach
  navigation?: any; // For React Navigation approach
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, navigation }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Handle user login
   * Add your authentication logic here
   */
  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    try {
      // Add your authentication logic here
      // Example: const response = await authService.login(username, password);
      
      // For demo purposes, accept any non-empty credentials
      if (username && password) {
        // Save token/user data if needed
        // await AsyncStorage.setItem('userToken', 'your-token-here');
        if (rememberMe) {
          // ✅ Save username & password securely
          await Keychain.setGenericPassword(username, password);
          await AsyncStorage.setItem('rememberMe', 'true');
        } else {
          await Keychain.resetGenericPassword();
          await AsyncStorage.setItem('rememberMe', 'false');
        }
        
        // Navigate based on which approach you're using
        if (navigation) {
          // React Navigation approach
          navigation.replace('Home');
        } else if (onLoginSuccess) {
          // Simple approach
          onLoginSuccess();
        }
      } else {
        Alert.alert('Error', 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please try again.');
      console.error('Login error:', error);
    }
  };

  /**
   * Handle forgot password
   * Add your forgot password logic here
   */
  const handleForgotPassword = () => {
    // Add forgot password logic here
    console.log('Forgot password pressed');
    if(navigation){
      navigation.navigate('ForgotPassword')
    }
    // Example: navigation.navigate('ForgotPassword');
  };

  /**
   * Navigate to register screen
   */
  const handleGoToRegister = () => {
    if (navigation) {
      navigation.navigate('Register');
    }
  };

  /**
   * Toggle password visibility
   */
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  useEffect(() => {
    const loadStoredCredentials = async () => {
      try {
        const remember = await AsyncStorage.getItem('rememberMe');
        if (remember === 'true') {
          const credentials = await Keychain.getGenericPassword();
          if (credentials) {
            setUsername(credentials.username);
            setPassword(credentials.password);
            setRememberMe(true);
          }
        }
      } catch (error) {
        console.error('Failed to load saved credentials:', error);
      }
    };

    loadStoredCredentials();
  }, []);



  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f7fa" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View style={styles.formContainer}>
          {/* Main Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Let's Get</Text>
            <Text style={styles.subtitle}>Started Now!</Text>
          </View>

          {/* Username Section */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Username</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.iconContainer}>
                <Text style={styles.inputIcon}>👤</Text>
              </View>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Enter your username"
                placeholderTextColor="#a8b2c1"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password Section */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.iconContainer}>
                <Text style={styles.inputIcon}>🔒</Text>
              </View>
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#a8b2c1"
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity 
                style={styles.eyeIconContainer}
                onPress={togglePasswordVisibility}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color="#7f8c8d"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Remember Me & Forgot Password */}
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.rememberMeContainer}
              onPress={() => setRememberMe(!rememberMe)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.rememberMeText}>Remember me</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleForgotPassword} activeOpacity={0.7}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} activeOpacity={0.8}>
            <Text style={styles.loginButtonText}>LOGIN</Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleGoToRegister} activeOpacity={0.7}>
              <Text style={styles.signUpButton}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  keyboardAvoid: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 34,
    fontWeight: '700',
    color: '#2c3e50',
    textAlign: 'center',
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e8ecf0',
  },
  iconContainer: {
    marginRight: 12,
    paddingVertical: 12,
  },
  inputIcon: {
    fontSize: 20,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
    paddingVertical: 16,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
    paddingVertical: 16,
    paddingRight: 12,
  },
  eyeIconContainer: {
    padding: 8,
    marginRight: 4,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#bdc3c7',
    borderRadius: 6,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  checkboxChecked: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  rememberMeText: {
    fontSize: 15,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  forgotPasswordText: {
    fontSize: 15,
    color: '#3498db',
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#34495e',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#34495e',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 24,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  signUpText: {
    fontSize: 15,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  signUpButton: {
    fontSize: 15,
    color: '#27ae60',
    fontWeight: '600',
  },
});

export default LoginScreen;