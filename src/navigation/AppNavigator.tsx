import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import HomeScreen from '../screens/HomeScreen';
import CreateGroupScreen from '../screens/CreateGroupScreen';
import GroupHomeScreen from '../screens/GroupHomeScreen';
import { RootStackParamList } from '../types/navigation';
import { useAuth } from '../hooks/useAuth';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { loading, userToken, checkToken } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ headerShown: false }}
        initialRouteName={userToken ? 'Home' : 'Welcome'}
      >
        <Stack.Screen name="Welcome">
          {props => <WelcomeScreen {...props} userToken={userToken} />}
        </Stack.Screen>

        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registration" component={RegistrationScreen} />

        <Stack.Screen 
          name="Home"
          options={{ gestureEnabled: false }}
        >
          {props => <HomeScreen {...props} userToken={userToken} refreshToken={checkToken} />}
        </Stack.Screen>
        
        <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />
        
        <Stack.Screen 
          name="GroupHomePage"
          component={GroupHomeScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}