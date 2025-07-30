import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const router = useRouter();

    const handleReset = () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email');
            return;
        }

        // Aici se poate adăuga integrarea cu backend-ul pentru trimitere reset
        Alert.alert('Success', 'If the email exists, a reset link has been sent.');
        router.push('/(auth)/login');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
        >
            <View style={styles.card}>
                <Text style={styles.logo}>🏥 RACES</Text>
                <Text style={styles.subtitle}>Reset your password</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#555"
                />

                <TouchableOpacity style={styles.button} onPress={handleReset}>
                    <Text style={styles.buttonText}>Send Reset Link</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                    <Text style={styles.link}>Back to Login</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f6fa',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    card: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#fff',
        padding: 32,
        borderRadius: 16,
        elevation: 6,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    logo: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2F3C7E',
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        color: '#2F3C7E',
        marginBottom: 24,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        color: '#000',
    },
    button: {
        backgroundColor: '#2F3C7E',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginBottom: 12,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    link: {
        color: '#2F3C7E',
        textAlign: 'center',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
});
