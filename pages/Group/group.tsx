import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  SafeAreaView, // ZMIANA 1: Import SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

type Post = {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  date: string;
};

const mockPosts: Post[] = [
  { id: '1', author: 'John Doe', avatar: 'https://abs.twimg.com/sticky/default_profile_images/default_profile.png', content: 'Hello group! This is our first post.', date: '2h' },
  { id: '2', author: 'Jane Smith', avatar: 'https://abs.twimg.com/sticky/default_profile_images/default_profile.png', content: 'Loving the new app design!', date: '5h' },
  { id: '3', author: 'Mike', avatar: 'https://abs.twimg.com/sticky/default_profile_images/default_profile.png', content: 'When are we meeting?', date: '1d' },
];

function PostCard({ post }: { post: Post }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={[styles.post, { opacity: fadeAnim }]}>
      <Image source={{ uri: post.avatar }} style={styles.avatar} />
      <View style={styles.postContent}>
        <View style={styles.postHeader}>
          <Text style={styles.author}>{post.author}</Text>
          <Text style={styles.time}>{post.date}</Text>
        </View>
        <Text style={styles.text}>{post.content}</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="chatbubble-outline" size={20} color="#657786" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="heart-outline" size={20} color="#657786" />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

export default function GroupHomePage() {
  const [activeTab, setActiveTab] = useState('Feed');
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animateTab = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.2, duration: 150, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  };

  const renderToolbarButton = (name: string, icon: any) => {
    const active = activeTab === name;
    return (
      <TouchableOpacity
        onPress={() => { setActiveTab(name); animateTab(); }}
        style={styles.tabBtn}
      >
        <Animated.View style={{ transform: [{ scale: active ? scaleAnim : 1 }] }}>
          <Ionicons name={icon} size={28} color={active ? '#1DA1F2' : 'gray'} />
        </Animated.View>
        <Text style={[styles.tabText, active && styles.activeTabText]}>{name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    // ZMIANA 2: Użycie SafeAreaView jako głównego kontenera
    <SafeAreaView style={styles.container}> 
      <View style={styles.header}>
        <Text style={styles.headerText}>My Group</Text>
      </View>

      <FlatList
        data={mockPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard post={item} />}
        contentContainerStyle={{ paddingBottom: 100 }} // padding jest nadal potrzebny, aby ostatni element listy nie chował się pod toolbar
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.toolbar}>
        {renderToolbarButton('Feed', 'home')}
        {renderToolbarButton('Chat', 'chatbubbles')}
        {renderToolbarButton('Members', 'people')}
        {renderToolbarButton('Settings', 'settings')}
      </View>
    </SafeAreaView> // ZMIANA 3: Zamknięcie SafeAreaView
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' }, // Ten styl działa idealnie z SafeAreaView
  header: {
    height: 65,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    elevation: 2,
  },
  headerText: { fontSize: 22, fontWeight: '800', color: '#1DA1F2' },
  post: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
    backgroundColor: '#F5F8FA',
    marginVertical: 6,
    marginHorizontal: 10,
    borderRadius: 16,
    elevation: 1,
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  postContent: { flex: 1 },
  postHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  author: { fontWeight: '700', fontSize: 16, color: '#14171A' },
  time: { fontSize: 13, color: '#657786' },
  text: { fontSize: 15, color: '#14171A', marginTop: 6, lineHeight: 20 },
  actions: { flexDirection: 'row', marginTop: 10 },
  iconBtn: { marginRight: 25 },
  toolbar: {
    position: 'absolute',
    bottom: 0,
    width,
    height: 75,
    flexDirection: 'row',
    borderTopWidth: 1.5,
    borderTopColor: '#E1E8ED',
    backgroundColor: '#ffffff',
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 4,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  tabBtn: { alignItems: 'center', justifyContent: 'center' },
  tabText: { fontSize: 12, color: 'gray', marginTop: 2 },
  activeTabText: { color: '#1DA1F2', fontWeight: '700' },
});