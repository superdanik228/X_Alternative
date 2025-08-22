import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import decodeJWT from '../../decode/JWTdecoder';
import { Props } from '../../params/ParamList';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: Props) {
  const [username, setUsername] = useState<string | null>(null);
  const [groups, setGroups] = useState<string[]>([]); // na razie pusta lista

  useEffect(() => {
    const getUsername = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        const decoded = decodeJWT(token);
        setUsername(decoded.username);
      }
    };
    getUsername();

    // tu później wczytasz grupy z API
    setGroups([]); // na start pusto
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    navigation.replace('Welcome');
  };

//   const handleSettings = () => {
//     navigation.navigate('Settings'); // musisz mieć ekran Settings w Stack.Navigator
//   };

  return (
    <View style={styles.container}>
      {/* Header z tytułem i ikonką zębatki */}
      <View style={styles.header}>
        <Text style={styles.title}>Home</Text>
        {/* <TouchableOpacity onPress={handleSettings}>
          <Ionicons name="settings-outline" size={28} color="#1DA1F2" />
        </TouchableOpacity> */}
      </View>

      {/* Powitanie użytkownika */}
      {username && <Text style={styles.subtitle}>Welcome, {username}!</Text>}

      {/* Lista grup */}
      {groups.length === 0 ? (
        <Text style={styles.emptyText}>Empty</Text>
      ) : (
        groups.map((group, idx) => (
          <Text key={idx} style={styles.groupItem}>{group}</Text>
        ))
      )}

      {/* Przyciski na dole */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.bottomButton}>
          <Text style={styles.bottomButtonText}>Create Group</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton}>
          <Text style={styles.bottomButtonText}>Join Group</Text>
        </TouchableOpacity>
      </View>

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
    padding: 16,
    paddingTop: 50,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 50,
  },
  groupItem: {
    fontSize: 16,
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    marginVertical: 5,
    width: width * 0.9,
    textAlign: 'center',
  },
  bottomButtons: {
    position: 'absolute',
    bottom: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width * 0.9,
  },
  bottomButton: {
    flex: 1,
    backgroundColor: '#1DA1F2',
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  bottomButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  logoutButton: {
    position: 'absolute',
    bottom: 20,
  },
  logoutText: {
    color: '#FF4C4C',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
