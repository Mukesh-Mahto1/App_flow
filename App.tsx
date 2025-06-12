import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from './src/screens/LoginScreen'; 
import HomeScreen from './src/screens/HomeScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import { RootStackParamList } from './src/components/Routes';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is already logged in when app starts
  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      // Simulate app initialization time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const userToken = await AsyncStorage.getItem('userToken');
      setIsLoggedIn(!!userToken);
    } catch (error) {
      console.log('Error checking login status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Loading" component={LoadingScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={isLoggedIn ? "Home" : "Login"}
        screenOptions={{ headerShown: false,animation: 'slide_from_right', }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name= "Register" component={RegisterScreen}/>
        <Stack.Screen 
          name="ForgotPassword" 
          component={ForgotPasswordScreen}
          options={{
            title: 'Forgot Password',
            gestureEnabled: true, // Enable swipe back gesture
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;



/* 
===========================================
INSTALLATION INSTRUCTIONS FOR REACT NATIVE CLI:
===========================================

1. Install React Navigation dependencies:
   npm install @react-navigation/native @react-navigation/native-stack

2. Install required peer dependencies:
   npm install react-native-screens react-native-safe-area-context

3. For iOS (if targeting iOS):
   cd ios && pod install

4. Install Vector Icons:
   npm install react-native-vector-icons
   
   For Android: Add to android/app/build.gradle:
   apply from: file("../../node_modules/react-native-vector-icons/fonts.gradle")
   
   For iOS: Add fonts to Info.plist or use auto-linking

5. File Structure:
   src/
   ├── screens/
   │   ├── LoginScreen.tsx
   │   ├── RegisterScreen.tsx
   │   └── HomeScreen.tsx (your main app)
   └── components/ (optional - for reusable components)

6. Optional - Add TypeScript support if not already configured:
   npm install --save-dev typescript @types/react @types/react-native

===========================================
INTEGRATION NOTES:
===========================================

• Both screens are fully self-contained and ready to use
• Form validation is built-in with real-time error feedback
• Smooth animations and keyboard handling included
• Easy to customize colors, fonts, and styling
• Ready for API integration - just replace the demo code
• Responsive design works on all screen sizes
• Accessibility features included (hitSlop, proper labeling)

===========================================
CUSTOMIZATION POINTS:
===========================================

1. Colors: Update the StyleSheet colors to match your brand
2. API Integration: Replace demo authentication with real API calls
3. Validation Rules: Modify validation patterns in RegisterScreen
4. Storage: Add AsyncStorage for "Remember Me" functionality
5. Error Handling: Customize error messages and handling
6. Loading States: Add custom loading indicators if needed
7. Success Actions: Define what happens after successful registration

===========================================
SECURITY CONSIDERATIONS:
===========================================

• Never store passwords in plain text
• Use secure storage for tokens (react-native-keychain)
• Implement proper password hashing on backend
• Add biometric authentication if needed
• Use HTTPS for all API calls
• Implement proper session management
*/