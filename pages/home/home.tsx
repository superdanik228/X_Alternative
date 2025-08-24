import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import decodeJWT from '../../decode/JWTdecoder';
import { Props } from '../../params/ParamList';
import axios from 'axios';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { API_URL } from '@env';

const { width } = Dimensions.get('window');

type Group = {
  _id: string;
  name: string;
  description: string;
  code: string;
  createdAt: string;
  __v: number;
};

export default function HomeScreen({ navigation }: Props) {
  const [username, setUsername] = useState<string | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const getUsername = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        const decoded = decodeJWT(token);
        setUsername(decoded.username);
      }
    };
    getUsername();

    const getGroups = async () => {
      const response = await axios.get(`${API_URL}/api/my_groups`, {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem('userToken')}`,
        },
      });
      setGroups(response.data);
    };
    getGroups();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    navigation.replace('Welcome');
  };

  return (
    <View style={styles.container}>
      {/* Nagłówek */}
      <Animated.Text 
        entering={FadeInDown.duration(700)} 
        style={styles.title}
      >
        {username ? `Welcome, ${username}` : 'Home'}
      </Animated.Text>

      {/* Lista grup */}
      <ScrollView contentContainerStyle={styles.groupList}>
        {groups.length === 0 ? (
          <Animated.Text 
            entering={FadeInDown.delay(300).duration(700)} 
            style={styles.emptyText}
          >
            No groups yet. Create or join one!
          </Animated.Text>
        ) : (
          groups.map((group, index) => (
            <Animated.View 
              key={group._id} 
              entering={FadeInUp.delay(150 * index).duration(600)}
            >
              <TouchableOpacity 
                style={styles.groupCard}
                activeOpacity={0.8}
                // onPress={() => navigation.navigate('GroupDetails', { groupId: group._id })}
              >
                <Text style={styles.groupName}>{group.name}</Text>
                <Text style={styles.groupDesc}>{group.description}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))
        )}
      </ScrollView>

      {/* Przyciski na dole */}
      <Animated.View 
        entering={FadeInUp.delay(400).duration(700)} 
        style={styles.bottomButtons}
      >
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => navigation.navigate('CreateGroup')}
        >
          <Text style={styles.primaryText}>Create Group</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.secondaryButton}
          // onPress={() => navigation.navigate('JoinGroup')}
        >
          <Text style={styles.secondaryText}>Join Group</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Log out na samym dole */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1DA1F2',
    marginBottom: 30,
    textAlign: 'center',
  },
  groupList: {
    alignItems: 'center',
    paddingBottom: 150,
  },
  emptyText: {
    fontSize: 16,
    color: '#657786',
    marginTop: 40,
    textAlign: 'center',
    maxWidth: width * 0.8,
    lineHeight: 22,
  },
  groupCard: {
    backgroundColor: '#F5F8FA',
    width: width * 0.9,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  groupName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#14171A',
    marginBottom: 6,
  },
  groupDesc: {
    fontSize: 14,
    color: '#657786',
    lineHeight: 20,
  },
  bottomButtons: {
    position: 'absolute',
    bottom: 80,
    width: width * 0.9,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#1DA1F2',
    paddingVertical: 14,
    width: '100%',
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 12,
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
    width: '100%',
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
  logoutButton: {
    position: 'absolute',
    bottom: 30,
  },
  logoutText: {
    color: '#FF4C4C',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
