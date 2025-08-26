import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { ScreenProps } from '../types/navigation';

const { width } = Dimensions.get('window');

interface Props extends ScreenProps<'Welcome'> {
  userToken: string | null;
}

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      {/* Ikona z animacją */}
      <Animated.View entering={ZoomIn.duration(800)} style={styles.iconWrapper}>
        <Ionicons name="people-circle-outline" size={96} color="#1DA1F2" />
      </Animated.View>

      {/* Tytuł i opis */}
      <Animated.Text entering={FadeInDown.delay(200).duration(700)} style={styles.title}>
        Welcome to Grouply
      </Animated.Text>
      <Animated.Text entering={FadeInDown.delay(400).duration(700)} style={styles.subtitle}>
        Your private space for posts and conversations with your team.
      </Animated.Text>

      {/* Przyciski */}
      <Animated.View entering={FadeInUp.delay(600).duration(700)} style={styles.buttonsWrapper}>
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.primaryText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton} 
          onPress={() => navigation.navigate('Registration')}
        >
          <Text style={styles.secondaryText}>Sign Up</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconWrapper: {
    marginBottom: 30,
    backgroundColor: '#E8F5FD',
    borderRadius: 100,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1DA1F2',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#657786',
    textAlign: 'center',
    maxWidth: width * 0.8,
    lineHeight: 22,
    marginBottom: 50,
  },
  buttonsWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#1DA1F2',
    paddingVertical: 14,
    width: '80%',
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  secondaryButton: {
    paddingVertical: 14,
    width: '80%',
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#1DA1F2',
  },
  secondaryText: {
    color: '#1DA1F2',
    fontWeight: '700',
    fontSize: 18,
  },
});