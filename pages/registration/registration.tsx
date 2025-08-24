import React, { useState } from "react";
import { API_URL } from '@env';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import axios from "axios";
import { Props } from "../../params/ParamList";

export default function RegistrationScreen({ navigation }: Props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Handle registration logic here (e.g., API call)
    const handleRegister = async () => {
        try {
            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }
            const response = await axios.post(
                `${API_URL}/api/register`,
                {
                    username,
                    password,
                }
            );

            // alert(response.data.message);
            navigation.navigate("Login");
            console.log("Registration successful:", response.data);
        } catch (error) {
            // console.log("Registration error:", error);
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 400) {
                    alert("Username already taken");
                } else {
                    alert("Registration failed");
                }
            } else {
                alert("Network error");
            }
            console.log("Registration error:", error);
        }
    };
    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <Animated.View entering={FadeInDown.delay(100).duration(600)}>
                <Text style={styles.title}>Register</Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(200).duration(600)}>
                <TextInput
                    style={styles.input}
                    placeholder="Choose a username"
                    placeholderTextColor="#657786"
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
                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    placeholderTextColor="#657786"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(500).duration(600)}>
                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(600).duration(600)}>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.signupText}>
                        Already have an account?{" "}
                        <Text style={styles.signupLink}>Log In</Text>
                    </Text>
                </TouchableOpacity>
            </Animated.View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        paddingHorizontal: 30,
        justifyContent: "center",
    },
    title: {
        fontSize: 32,
        fontWeight: "800",
        color: "#1DA1F2",
        marginBottom: 40,
        textAlign: "center",
    },
    input: {
        backgroundColor: "#F5F8FA",
        color: "#14171A",
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 30,
        fontSize: 16,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 1,
    },
    button: {
        backgroundColor: "#1DA1F2",
        borderRadius: 30,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonText: {
        color: "#ffffff",
        fontWeight: "700",
        fontSize: 18,
    },
    signupText: {
        fontSize: 14,
        color: "#657786",
        marginTop: 20,
        textAlign: "center",
    },
    signupLink: {
        color: "#1DA1F2",
        fontWeight: "600",
    },
});
