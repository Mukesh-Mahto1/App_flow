import React, { useState, useRef, useEffect } from 'react';
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
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

interface ForgotPasswordScreenProps {
  navigation?: any; // For React Navigation approach
}

// Email validation pattern
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 6;

// Define the different steps in the forgot password flow
type ForgotPasswordStep = 'email' | 'otp' | 'newPassword' | 'success';

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  // Step management - controls which screen to show
  const [currentStep, setCurrentStep] = useState<ForgotPasswordStep>('email');
  
  // Form data for all steps
  const [email, setEmail] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  
  // UI state management
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [resendTimer, setResendTimer] = useState(0);
  
  // Animation refs for smooth transitions
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  
  // Input refs for better UX
  const emailRef = useRef<TextInput>(null);
  const otpRef = useRef<TextInput>(null);
  const newPasswordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  /**
   * Animate step transitions
   * @param direction - 'forward' or 'backward'
   */
  const animateStepTransition = (direction: 'forward' | 'backward' = 'forward') => {
    const slideValue = direction === 'forward' ? -50 : 50;
    
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: slideValue,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  /**
   * Timer for OTP resend functionality
   */
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  /**
   * Clear errors when user starts typing
   * @param field - Field name to clear error for
   */
  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  /**
   * Validate email format
   * @param emailValue - Email to validate
   * @returns Error message or empty string
   */
  const validateEmail = (emailValue: string): string => {
    if (!emailValue.trim()) return 'Email is required';
    if (!EMAIL_REGEX.test(emailValue)) return 'Please enter a valid email address';
    return '';
  };

  /**
   * Validate OTP format
   * @param otpValue - OTP to validate
   * @returns Error message or empty string
   */
  const validateOTP = (otpValue: string): string => {
    if (!otpValue.trim()) return 'OTP is required';
    if (otpValue.length !== 6) return 'OTP must be 6 digits';
    if (!/^\d+$/.test(otpValue)) return 'OTP must contain only numbers';
    return '';
  };

  /**
   * Validate new password
   * @param passwordValue - Password to validate
   * @returns Error message or empty string
   */
  const validateNewPassword = (passwordValue: string): string => {
    if (!passwordValue) return 'Password is required';
    if (passwordValue.length < PASSWORD_MIN_LENGTH) {
      return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
    }
    return '';
  };

  /**
   * Validate confirm password
   * @param confirmValue - Confirm password to validate
   * @returns Error message or empty string
   */
  const validateConfirmPassword = (confirmValue: string): string => {
    if (!confirmValue) return 'Please confirm your password';
    if (confirmValue !== newPassword) return 'Passwords do not match';
    return '';
  };

  /**
   * STEP 1: Send OTP to email
   * Replace this with your actual API call
   */
  const handleSendOTP = async () => {
    const emailError = validateEmail(email);
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    setIsLoading(true);
    try {
      // Replace with your actual API call
      /*
      const response = await fetch('YOUR_API_ENDPOINT/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      */

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Success - move to OTP step
      animateStepTransition('forward');
      setCurrentStep('otp');
      setResendTimer(60); // Start 60-second timer
      
      Alert.alert(
        'OTP Sent!',
        `We've sent a 6-digit verification code to ${email}. Please check your email.`,
        [{ text: 'OK' }]
      );

    } catch (error) {
      console.error('Send OTP error:', error);
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to send OTP. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * STEP 2: Verify OTP
   * Replace this with your actual API call
   */
  const handleVerifyOTP = async () => {
    const otpError = validateOTP(otp);
    if (otpError) {
      setErrors({ otp: otpError });
      return;
    }

    setIsLoading(true);
    try {
      // Replace with your actual API call
      /*
      const response = await fetch('YOUR_API_ENDPOINT/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      */

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Success - move to new password step
      animateStepTransition('forward');
      setCurrentStep('newPassword');

    } catch (error) {
      console.error('Verify OTP error:', error);
      Alert.alert(
        'Invalid OTP',
        'The verification code you entered is invalid or has expired. Please try again.'
      );
      setErrors({ otp: 'Invalid or expired OTP' });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * STEP 3: Reset password
   * Replace this with your actual API call
   */
  const handleResetPassword = async () => {
    const passwordError = validateNewPassword(newPassword);
    const confirmError = validateConfirmPassword(confirmPassword);
    
    if (passwordError || confirmError) {
      setErrors({
        newPassword: passwordError,
        confirmPassword: confirmError,
      });
      return;
    }

    setIsLoading(true);
    try {
      // Replace with your actual API call
      /*
      const response = await fetch('YOUR_API_ENDPOINT/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      */

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Success - show success step
      animateStepTransition('forward');
      setCurrentStep('success');

    } catch (error) {
      console.error('Reset password error:', error);
      Alert.alert(
        'Reset Failed',
        error instanceof Error ? error.message : 'Failed to reset password. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Resend OTP functionality
   */
  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    
    setResendTimer(60);
    try {
      // Same API call as handleSendOTP but without navigation
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('OTP Resent', 'A new verification code has been sent to your email.');
    } catch (error) {
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
      setResendTimer(0);
    }
  };

  /**
   * Navigate back to login screen
   */
  const handleBackToLogin = () => {
    if (navigation) {
      navigation.navigate('Login');
    }
  };

  /**
   * Handle back navigation between steps
   */
  const handleBackStep = () => {
    animateStepTransition('backward');
    
    switch (currentStep) {
      case 'otp':
        setCurrentStep('email');
        break;
      case 'newPassword':
        setCurrentStep('otp');
        break;
      case 'success':
        handleBackToLogin();
        break;
      default:
        if (navigation) {
          navigation.goBack();
        }
    }
  };

  /**
   * Get step-specific title and subtitle
   */
  const getStepContent = () => {
    switch (currentStep) {
      case 'email':
        return {
          title: 'Forgot',
          subtitle: 'Password?',
          description: 'Enter your email address and we\'ll send you a verification code to reset your password.',
        };
      case 'otp':
        return {
          title: 'Verify',
          subtitle: 'Email',
          description: `We've sent a 6-digit code to ${email}. Enter it below to continue.`,
        };
      case 'newPassword':
        return {
          title: 'New',
          subtitle: 'Password',
          description: 'Create a strong new password for your account.',
        };
      case 'success':
        return {
          title: 'Success!',
          subtitle: '',
          description: 'Your password has been reset successfully. You can now login with your new password.',
        };
    }
  };

  const stepContent = getStepContent();

  /**
   * Render step-specific form content
   */
  const renderStepContent = () => {
    switch (currentStep) {
      case 'email':
        return (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>📧 Email Address</Text>
              <TextInput
                ref={emailRef}
                style={[styles.input, errors.email ? styles.inputError : null]}
                value={email}
                onChangeText={(value) => {
                  setEmail(value.toLowerCase().trim());
                  clearError('email');
                }}
                placeholder="Enter your email address"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="send"
                onSubmitEditing={handleSendOTP}
                autoFocus
              />
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>

            <TouchableOpacity 
              style={[styles.primaryButton, isLoading && styles.primaryButtonDisabled]} 
              onPress={handleSendOTP}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>
                {isLoading ? 'SENDING CODE...' : 'SEND VERIFICATION CODE'}
              </Text>
            </TouchableOpacity>
          </>
        );

      case 'otp':
        return (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>🔢 Verification Code</Text>
              <TextInput
                ref={otpRef}
                style={[styles.input, styles.otpInput, errors.otp ? styles.inputError : null]}
                value={otp}
                onChangeText={(value) => {
                  // Only allow numbers and limit to 6 digits
                  const numericValue = value.replace(/[^0-9]/g, '').slice(0, 6);
                  setOtp(numericValue);
                  clearError('otp');
                }}
                placeholder="Enter 6-digit code"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={6}
                returnKeyType="done"
                onSubmitEditing={handleVerifyOTP}
                autoFocus
              />
              {errors.otp ? <Text style={styles.errorText}>{errors.otp}</Text> : null}
            </View>

            <TouchableOpacity 
              style={[styles.primaryButton, isLoading && styles.primaryButtonDisabled]} 
              onPress={handleVerifyOTP}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>
                {isLoading ? 'VERIFYING...' : 'VERIFY CODE'}
              </Text>
            </TouchableOpacity>

            {/* Resend OTP */}
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't receive the code? </Text>
              <TouchableOpacity 
                onPress={handleResendOTP}
                disabled={resendTimer > 0}
                activeOpacity={0.7}
              >
                <Text style={[styles.resendButton, resendTimer > 0 && styles.resendButtonDisabled]}>
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        );

      case 'newPassword':
        return (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>🔒 New Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  ref={newPasswordRef}
                  style={[styles.passwordInput, errors.newPassword ? styles.inputError : null]}
                  value={newPassword}
                  onChangeText={(value) => {
                    setNewPassword(value);
                    clearError('newPassword');
                  }}
                  placeholder="Enter new password"
                  placeholderTextColor="#999"
                  secureTextEntry={!showNewPassword}
                  returnKeyType="next"
                  onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                  autoFocus
                />
                <TouchableOpacity 
                  style={styles.eyeIconContainer}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Icon
                    name={showNewPassword ? 'eye-off' : 'eye'}
                    size={22}
                    color="#555"
                  />
                </TouchableOpacity>
              </View>
              {errors.newPassword ? <Text style={styles.errorText}>{errors.newPassword}</Text> : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>🔒 Confirm Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  ref={confirmPasswordRef}
                  style={[styles.passwordInput, errors.confirmPassword ? styles.inputError : null]}
                  value={confirmPassword}
                  onChangeText={(value) => {
                    setConfirmPassword(value);
                    clearError('confirmPassword');
                  }}
                  placeholder="Confirm new password"
                  placeholderTextColor="#999"
                  secureTextEntry={!showConfirmPassword}
                  returnKeyType="done"
                  onSubmitEditing={handleResetPassword}
                />
                <TouchableOpacity 
                  style={styles.eyeIconContainer}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Icon
                    name={showConfirmPassword ? 'eye-off' : 'eye'}
                    size={22}
                    color="#555"
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
            </View>

            <TouchableOpacity 
              style={[styles.primaryButton, isLoading && styles.primaryButtonDisabled]} 
              onPress={handleResetPassword}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>
                {isLoading ? 'RESETTING PASSWORD...' : 'RESET PASSWORD'}
              </Text>
            </TouchableOpacity>
          </>
        );

      case 'success':
        return (
          <>
            <View style={styles.successIconContainer}>
              <Icon name="check-circle" size={80} color="#27ae60" />
            </View>

            <TouchableOpacity 
              style={styles.primaryButton} 
              onPress={handleBackToLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>BACK TO LOGIN</Text>
            </TouchableOpacity>
          </>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f7fa" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View 
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {/* Header with Back Button */}
            <View style={styles.headerContainer}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={handleBackStep}
                activeOpacity={0.7}
              >
                <Icon name="arrow-left" size={24} color="#2c3e50" />
              </TouchableOpacity>
              
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{stepContent.title}</Text>
                {stepContent.subtitle && <Text style={styles.subtitle}>{stepContent.subtitle}</Text>}
              </View>

              {/* Step Indicator */}
              <View style={styles.stepIndicator}>
                <View style={styles.stepDots}>
                  <View style={[styles.stepDot, currentStep === 'email' && styles.stepDotActive]} />
                  <View style={[styles.stepDot, ['otp', 'newPassword', 'success'].includes(currentStep) && styles.stepDotActive]} />
                  <View style={[styles.stepDot, ['newPassword', 'success'].includes(currentStep) && styles.stepDotActive]} />
                  <View style={[styles.stepDot, currentStep === 'success' && styles.stepDotActive]} />
                </View>
              </View>
            </View>

            {/* Form Card */}
            <View style={styles.formCard}>
              {/* Description */}
              <Text style={styles.description}>{stepContent.description}</Text>
              
              {/* Step-specific content */}
              {renderStepContent()}
            </View>
          </Animated.View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  formContainer: {
    alignItems: 'center',
  },
  headerContainer: {
    width: '100%',
    maxWidth: 380,
    marginBottom: 40,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 36,
    fontWeight: '700',
    color: '#2c3e50',
    textAlign: 'center',
  },
  stepIndicator: {
    alignItems: 'center',
  },
  stepDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#bdc3c7',
    marginHorizontal: 5,
  },
  stepDotActive: {
    backgroundColor: '#3498db',
  },
  formCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#ffffff',
    borderRadius: 25,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 8,
  },
  description: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 12,
    fontWeight: '500',
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: '#e0e6ed',
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
    paddingVertical: 8,
  },
  otpInput: {
    textAlign: 'center',
    fontSize: 24,
    letterSpacing: 8,
    fontWeight: '600',
  },
  inputError: {
    borderBottomColor: '#e74c3c',
  },
  passwordContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    borderBottomWidth: 2,
    borderBottomColor: '#e0e6ed',
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
    paddingVertical: 8,
    paddingRight: 40,
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 8,
    padding: 4,
    zIndex: 1,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 5,
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: '#3498db',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryButtonDisabled: {
    backgroundColor: '#95a5a6',
    shadowOpacity: 0.1,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  resendText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  resendButton: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '600',
  },
  resendButtonDisabled: {
    color: '#95a5a6',
  },
  successIconContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
});

export default ForgotPasswordScreen;