import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { KeyboardAvoidingView, ScrollView } from 'react-native';
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

interface RegisterScreenProps {
  onRegisterSuccess?: () => void; // For simple approach
  navigation?: any; // For React Navigation approach
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ onRegisterSuccess, navigation }) => {
  // ========== STATE MANAGEMENT ==========
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // ========== VALIDATION FUNCTIONS ==========
  
  /**
   * Validate email format
   * @param email - Email string to validate
   * @returns boolean - True if email is valid
   */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Validate password strength
   * @param password - Password string to validate
   * @returns object - Contains isValid boolean and error message
   */
  const validatePassword = (password: string): { isValid: boolean; message?: string } => {
    if (password.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters long' };
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (!/(?=.*\d)/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one number' };
    }
    return { isValid: true };
  };

  /**
   * Validate name field
   * @param name - Name string to validate
   * @returns boolean - True if name is valid
   */
  const validateName = (name: string): boolean => {
    return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name.trim());
  };

  /**
   * Real-time validation as user types
   * Updates errors state dynamically
   */
  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'name':
        if (!validateName(value)) {
          newErrors.name = 'Name must be at least 2 characters and contain only letters';
        } else {
          delete newErrors.name;
        }
        break;
      case 'email':
        if (!validateEmail(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;
      case 'password':
        const passwordValidation = validatePassword(value);
        if (!passwordValidation.isValid) {
          newErrors.password = passwordValidation.message;
        } else {
          delete newErrors.password;
        }
        break;
      case 'confirmPassword':
        if (value !== formData.password) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else {
          delete newErrors.confirmPassword;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  // ========== EVENT HANDLERS ==========

  /**
   * Handle form field changes
   * @param field - Field name to update
   * @param value - New value for the field
   */
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Real-time validation
    validateField(field, value);
  };

  /**
   * Handle user registration
   * Validates form and processes registration
   */
  const handleRegister = async () => {
    // Validate all fields before submission
    const { name, email, password, confirmPassword } = formData;
    
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!agreeToTerms) {
      Alert.alert('Error', 'Please agree to the Terms & Conditions');
      return;
    }

    // Check for any validation errors
    if (Object.keys(errors).length > 0) {
      Alert.alert('Error', 'Please fix the validation errors before continuing');
      return;
    }

    setIsLoading(true);
    
    try {
      // ========== AUTHENTICATION LOGIC ==========
      // Replace this section with your actual registration API call
      // Example:
      // const response = await authService.register({
      //   name: name.trim(),
      //   email: email.trim().toLowerCase(),
      //   password: password,
      // });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, accept valid form data
      console.log('Registration data:', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
      });

      // ========== POST-REGISTRATION LOGIC ==========
      // Save user data/token if needed
      // await AsyncStorage.setItem('userToken', response.token);
      // await AsyncStorage.setItem('userData', JSON.stringify(response.user));
      
      Alert.alert(
        'Success',
        'Account created successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate based on which approach you're using
              if (navigation) {
                // React Navigation approach
                navigation.replace('Home');
                // Or navigate to login: navigation.navigate('Login');
              } else if (onRegisterSuccess) {
                // Simple approach
                onRegisterSuccess();
              }
            },
          },
        ]
      );
      
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Navigate to login screen
   */
  const handleGoToLogin = () => {
    if (navigation) {
      navigation.navigate('Login');
    }
  };

  /**
   * Handle terms and conditions
   * Add your terms logic here
   */
  const handleViewTerms = () => {
    // Navigate to terms screen or show modal
    console.log('View Terms & Conditions');
    // Example: navigation.navigate('Terms');
  };

  /**
   * Toggle password visibility
   */
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  /**
   * Toggle confirm password visibility
   */
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prev => !prev);
  };

  // ========== RENDER HELPERS ==========

  /**
   * Render input field with validation
   * @param config - Input field configuration
   */
  const renderInputField = (config: {
    label: string;
    icon: string;
    field: string;
    placeholder: string;
    secureTextEntry?: boolean;
    showPasswordToggle?: boolean;
    onTogglePassword?: () => void;
    keyboardType?: string;
    autoCapitalize?: string;
  }) => {
    const { label, icon, field, placeholder, secureTextEntry, showPasswordToggle, onTogglePassword, keyboardType, autoCapitalize } = config;
    const hasError = errors[field as keyof FormErrors];
    const isFocused = focusedInput === field;
    
    return (
      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>{label}</Text>
        <View style={[
          styles.inputWrapper,
          hasError && styles.inputWrapperError,
          isFocused && styles.inputWrapperFocused,
        ]}>
          <View style={styles.iconContainer}>
            <Text style={styles.inputIcon}>{icon}</Text>
          </View>
          <TextInput
            style={[styles.input, showPasswordToggle && styles.passwordInput]}
            value={formData[field as keyof typeof formData]}
            onChangeText={(value) => handleInputChange(field, value)}
            onFocus={() => setFocusedInput(field)}
            onBlur={() => setFocusedInput(null)}
            placeholder={placeholder}
            placeholderTextColor="#a8b2c1"
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType as any}
            autoCapitalize={autoCapitalize as any}
            autoCorrect={false}
          />
          {showPasswordToggle && (
            <TouchableOpacity 
              style={styles.eyeIconContainer}
              onPress={onTogglePassword}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon
                name={secureTextEntry ? 'eye' : 'eye-off'}
                size={24}
                color="#7f8c8d"
              />
            </TouchableOpacity>
          )}
        </View>
        {hasError && (
          <Text style={styles.errorText}>{hasError}</Text>
        )}
      </View>
    );
  };

  // ========== MAIN RENDER ==========
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f7fa" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            {/* Main Title */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Create Your</Text>
              <Text style={styles.subtitle}>Account</Text>
            </View>

            {/* Form Fields */}
            {renderInputField({
              label: 'Full Name',
              icon: '👤',
              field: 'name',
              placeholder: 'Enter your full name',
              autoCapitalize: 'words',
            })}

            {renderInputField({
              label: 'Email Address',
              icon: '📧',
              field: 'email',
              placeholder: 'Enter your email address',
              keyboardType: 'email-address',
              autoCapitalize: 'none',
            })}

            {renderInputField({
              label: 'Password',
              icon: '🔒',
              field: 'password',
              placeholder: 'Create a strong password',
              secureTextEntry: !showPassword,
              showPasswordToggle: true,
              onTogglePassword: togglePasswordVisibility,
            })}

            {renderInputField({
              label: 'Confirm Password',
              icon: '🔐',
              field: 'confirmPassword',
              placeholder: 'Confirm your password',
              secureTextEntry: !showConfirmPassword,
              showPasswordToggle: true,
              onTogglePassword: toggleConfirmPasswordVisibility,
            })}

            {/* Terms & Conditions */}
            <View style={styles.termsContainer}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setAgreeToTerms(!agreeToTerms)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}>
                  {agreeToTerms && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <View style={styles.termsTextContainer}>
                  <Text style={styles.termsText}>I agree to the </Text>
                  <TouchableOpacity onPress={handleViewTerms} activeOpacity={0.7}>
                    <Text style={styles.termsLink}>Terms & Conditions</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>

            {/* Register Button */}
            <TouchableOpacity 
              style={[styles.registerButton, isLoading && styles.registerButtonDisabled]} 
              onPress={handleRegister}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <Text style={styles.registerButtonText}>
                {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
              </Text>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={handleGoToLogin} activeOpacity={0.7}>
                <Text style={styles.loginButton}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ========== STYLES ==========
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
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
    marginBottom: 20,
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
  inputWrapperFocused: {
    borderColor: '#3498db',
    shadowColor: '#3498db',
    shadowOpacity: 0.15,
  },
  inputWrapperError: {
    borderColor: '#e74c3c',
    shadowColor: '#e74c3c',
    shadowOpacity: 0.15,
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
    paddingRight: 12,
  },
  eyeIconContainer: {
    padding: 8,
    marginRight: 4,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
    fontWeight: '500',
  },
  termsContainer: {
    marginBottom: 32,
    marginTop: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#bdc3c7',
    borderRadius: 6,
    marginRight: 12,
    marginTop: 2,
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
  termsTextContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  termsText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
    lineHeight: 20,
  },
  termsLink: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '600',
    textDecorationLine: 'underline',
    lineHeight: 20,
  },
  registerButton: {
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
  registerButtonDisabled: {
    backgroundColor: '#7f8c8d',
    shadowOpacity: 0.1,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  loginText: {
    fontSize: 15,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  loginButton: {
    fontSize: 15,
    color: '#27ae60',
    fontWeight: '600',
  },
});

export default RegisterScreen;