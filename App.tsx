import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from './pages/welcome/Welcome';
import LoginScreen from './pages/login/login';
import RegistrationScreen from './pages/registration/registration';
import HomeScreen from './pages/home/home';
import CreateGroupScreen from './pages/home/create_group/CreateGroup';

const Stack = createNativeStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);

  const checkToken = async () => {
    const token = await AsyncStorage.getItem('userToken');
    setUserToken(token);
    setLoading(false);
  };

  useEffect(() => {
    checkToken();
  }, []);

  if (loading) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
