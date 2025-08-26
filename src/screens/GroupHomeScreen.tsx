import React, { useState, useRef, useEffect, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// --- Stałe i Typy ---

const { width } = Dimensions.get('window');

// Definicja motywu kolorystycznego dla spójności
const theme = {
  primary: '#1DA1F2',
  background: '#ffffff',
  cardBackground: '#F5F8FA',
  border: '#E1E8ED',
  textPrimary: '#14171A',
  textSecondary: '#657786',
  gray: 'gray',
  white: '#ffffff',
};

type Post = {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  date: string;
};

// Lepsze typowanie dla ikon
type IconName = keyof typeof Ionicons.glyphMap;

// --- Dane Mockowe ---

const mockPosts: Post[] = [
  { id: '1', author: 'John Doe', avatar: 'https://abs.twimg.com/sticky/default_profile_images/default_profile.png', content: 'Hello group! This is our first post.', date: '2h' },
  { id: '2', author: 'Jane Smith', avatar: 'https://abs.twimg.com/sticky/default_profile_images/default_profile.png', content: 'Loving the new app design!', date: '5h' },
  { id: '3', author: 'Mike', avatar: 'https://abs.twimg.com/sticky/default_profile_images/default_profile.png', content: 'When are we meeting?', date: '1d' },
];

// --- Komponenty Podrzędne ---

/**
 * Karta posta z animacją wejścia.
 * Używa React.memo, aby uniknąć niepotrzebnych re-renderów.
 */
const PostCard = memo(({ post, index }: { post: Post; index: number }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Animacja pojawiania się karty po zamontowaniu komponentu
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay: index * 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, index]);

  return (
    <Animated.View
      style={[
        styles.post,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Image source={{ uri: post.avatar }} style={styles.avatar} />
      <View style={styles.postContent}>
        <View style={styles.postHeader}>
          <Text style={styles.author}>{post.author}</Text>
          <Text style={styles.time}>{post.date}</Text>
        </View>
        <Text style={styles.text}>{post.content}</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="chatbubble-outline" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="heart-outline" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
});

/**
 * Przycisk na dolnym pasku narzędzi.
 * Również zmemoizowany dla optymalizacji.
 */
const ToolbarButton = memo(({ name, icon, isActive, onPress }: { name: string; icon: IconName; isActive: boolean; onPress: () => void; }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animacja skalowania przy zmianie aktywnej zakładki
    if (isActive) {
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.2, duration: 150, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]).start();
    }
  }, [isActive, scaleAnim]);

  return (
    <TouchableOpacity onPress={onPress} style={styles.tabBtn}>
      <Animated.View style={{ transform: [{ scale: isActive ? scaleAnim : 1 }] }}>
        <Ionicons name={icon} size={28} color={isActive ? theme.primary : theme.gray} />
      </Animated.View>
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>{name}</Text>
    </TouchableOpacity>
  );
});

// --- Główny Komponent Strony ---

export default function GroupHomeScreen() {
  const [activeTab, setActiveTab] = useState('Feed');
  const plusScale = useRef(new Animated.Value(1)).current;

  const onPlusPress = () => {
    // Animacja przycisku "+"
    Animated.sequence([
      Animated.timing(plusScale, { toValue: 0.8, duration: 100, useNativeDriver: true }),
      Animated.timing(plusScale, { toValue: 1.2, duration: 100, useNativeDriver: true }),
      Animated.timing(plusScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    // Tutaj logika dodawania nowego posta
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>My Group</Text>
      </View>

      <FlatList
        data={mockPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => <PostCard post={item} index={index} />}
        contentContainerStyle={styles.listContentContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Dolny pasek narzędzi z wyśrodkowanym przyciskiem "+" */}
      <View style={styles.toolbar}>
        <View style={styles.toolbarSection}>
          <ToolbarButton name="Feed" icon="home" isActive={activeTab === 'Feed'} onPress={() => setActiveTab('Feed')} />
          <ToolbarButton name="Chat" icon="chatbubbles" isActive={activeTab === 'Chat'} onPress={() => setActiveTab('Chat')} />
        </View>

        <View style={styles.toolbarSection}>
          <ToolbarButton name="Members" icon="people" isActive={activeTab === 'Members'} onPress={() => setActiveTab('Members')} />
          <ToolbarButton name="Exit" icon="exit-outline" isActive={activeTab === 'Exit'} onPress={() => setActiveTab('Exit')} />
        </View>

        {/* Przycisk "+" jest pozycjonowany absolutnie nad paskiem */}
        <Animated.View style={[styles.plusBtnContainer, { transform: [{ scale: plusScale }] }]}>
          <TouchableOpacity style={styles.plusBtn} onPress={onPlusPress} activeOpacity={0.8}>
            <Ionicons name="add" size={32} color={theme.white} />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

// --- Style ---

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  header: {
    height: 65,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.background,
  },
  headerText: { fontSize: 22, fontWeight: '800', color: theme.primary },
  listContentContainer: { paddingBottom: 100, paddingTop: 10 },
  
  // Style karty posta
  post: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    backgroundColor: theme.cardBackground,
    marginVertical: 6,
    marginHorizontal: 10,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  postContent: { flex: 1 },
  postHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  author: { fontWeight: '700', fontSize: 16, color: theme.textPrimary },
  time: { fontSize: 13, color: theme.textSecondary },
  text: { fontSize: 15, color: theme.textPrimary, marginTop: 6, lineHeight: 22 },
  actions: { flexDirection: 'row', marginTop: 12 },
  iconBtn: { marginRight: 30 },

  // Style paska narzędzi
  toolbar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 75,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.background,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    elevation: 10,
  },
  toolbarSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabBtn: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  tabText: { fontSize: 12, color: theme.gray, marginTop: 4 },
  activeTabText: { color: theme.primary, fontWeight: '700' },

  // Style przycisku "+"
  plusBtnContainer: {
    position: 'absolute',
    // Wyśrodkowanie horyzontalne
    left: width / 2 - 30, // (szerokość ekranu / 2) - (szerokość przycisku / 2)
    // Podniesienie przycisku ponad pasek
    top: -20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});