import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Props } from "../../../params/ParamList";
import { API_URL } from '@env';

const { width } = Dimensions.get("window");

export default function CreateGroupScreen({ navigation }: Props) {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateGroup = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/create_group`,
        { name: groupName, description: description },
        {
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem("userToken")}`,
          },
        }
      );

      if (response.status === 201) {
        navigation.replace("Home");
      } else {
        console.log("Group creation failed");
      }
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Tytuł */}
      <Animated.Text
        entering={FadeInDown.duration(700)}
        style={styles.title}
      >
        Create a New Group
      </Animated.Text>

      {/* Opis */}
      <Animated.Text
        entering={FadeInDown.delay(150).duration(700)}
        style={styles.subtitle}
      >
        Add a name and description for your group.
      </Animated.Text>

      {/* Formularz */}
      <Animated.View
        entering={FadeInUp.delay(300).duration(700)}
        style={styles.form}
      >
        <TextInput
          style={styles.input}
          placeholder="Group Name"
          placeholderTextColor="#657786"
          value={groupName}
          onChangeText={setGroupName}
        />
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Description"
          placeholderTextColor="#657786"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />

        <TouchableOpacity style={styles.primaryButton} onPress={handleCreateGroup}>
          <Text style={styles.primaryText}>Create Group</Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1DA1F2",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#657786",
    textAlign: "center",
    maxWidth: width * 0.8,
    lineHeight: 22,
    marginBottom: 40,
  },
  form: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    backgroundColor: "#F5F8FA",
    color: "#14171A",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    fontSize: 16,
    marginBottom: 20,
    width: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  multiline: {
    textAlignVertical: "top",
    paddingVertical: 12,
  },
  primaryButton: {
    backgroundColor: "#1DA1F2",
    paddingVertical: 14,
    width: "85%",
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
});
