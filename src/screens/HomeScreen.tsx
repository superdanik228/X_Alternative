import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Modal,
  TextInput
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decodeJWT } from '../utils/jwt';
import { Props } from '../types/navigation';
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
  const [joinVisible, setJoinVisible] = useState(false);
  const [joinCode, setJoinCode] = useState('');

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
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get(`${API_URL}/api/my_groups`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setGroups(response.data);
      } catch (error) {
        // console.error('Error fetching groups:', error);
        null;
      }
    };
    getGroups();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    navigation.replace('Welcome');
  };

  const handleJoinGroup = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) return;

    try {
      await axios.post(`${API_URL}/api/join_group`, { code: joinCode }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setJoinVisible(false);
      setJoinCode('');
      const response = await axios.get(`${API_URL}/api/my_groups`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setGroups(response.data);
      console.log('Group joined successfully');
    } catch (err: any) {
      console.error('Error joining group:', err.response?.data?.message || err.message);
    }
  }

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
                onPress={() => navigation.navigate('GroupHomePage', { code: group.code })}
              >
                <Text style={styles.groupName}>{group.name}</Text>
                <Text style={styles.groupDesc}>{group.description}</Text>
                <Text style={styles.groupDesc}>Code: {group.code}</Text>
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
          onPress={() => setJoinVisible(true)}
        >
          <Text style={styles.secondaryText}>Join Group</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Log out na samym dole */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>

      {/* Modal do dołączania do grupy */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={joinVisible}
        onRequestClose={() => setJoinVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View entering={FadeInDown.duration(300)} style={styles.modalBox}>
            <Text style={styles.modalTitle}>Enter Group Code</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="XXXX-XXXX"
              value={joinCode}
              onChangeText={(text) => { 
                setJoinCode(text); 
                if (text.length === 4 && !text.includes('-')) { 
                  setJoinCode(text + '-'); 
                } 
              }}
              autoCapitalize="characters"
              maxLength={9} // 8 chars + hyphen
            />

            <TouchableOpacity
              style={styles.modalPrimaryButton}
              onPress={handleJoinGroup}
            >
              <Text style={styles.modalPrimaryText}>Join</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setJoinVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    width: width * 0.85,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#14171A',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    width: '100%',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 2,
  },
  modalPrimaryButton: {
    backgroundColor: '#1DA1F2',
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  modalPrimaryText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalCancelButton: {
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#1DA1F2',
  },
  modalCancelText: {
    color: '#1DA1F2',
    fontWeight: 'bold',
    fontSize: 18,
  },
});