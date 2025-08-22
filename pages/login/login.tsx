import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Props }  from '../../params/ParamList';

export default function LoginScreen({ navigation }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.0.131:3001/api/login', {
                username,
                password,
            });

      if (response.status === 200) {
        const token = response.data.token;
        await AsyncStorage.setItem('userToken', token);
        navigation.replace('Home');
      } else {
        console.log('Login failed');
      }
    } catch (error) {
      console.log('Login error:', error);
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Animated.View entering={FadeInDown.delay(100).duration(600)}>
        <Text style={styles.title}>Login</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).duration(600)}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#657786"
          keyboardType="default"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(300).duration(600)}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#657786"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(400).duration(600)}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(500).duration(600)}>
        <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
          <Text style={styles.signupText}>
            Don’t have an account? <Text style={styles.signupLink}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1DA1F2',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F5F8FA',
    color: '#14171A',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    fontSize: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  button: {
    backgroundColor: '#1DA1F2',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 18,
  },
  signupText: {
    fontSize: 14,
    color: '#657786',
    marginTop: 20,
    textAlign: 'center',
  },
  signupLink: {
    color: '#1DA1F2',
    fontWeight: '600',
  },
});
