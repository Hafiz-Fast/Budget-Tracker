// components/LoginPage.js (React Native version)

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LoginUser = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigation = useNavigation();

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://192.168.1.217:5000/api/Login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Something Went Wrong');
      }

      setMessage(result.message);
      setEmail('');
      setPassword('');
      navigation.navigate('Home', { UserID: result.userid });

    } catch (error) {
      console.error('Error:', error.message);
      setMessage(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.heading}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#94a3b8"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#94a3b8"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.signupLink} onPress={() => navigation.navigate('Signin')}>
          Don't have an account? <Text style={styles.signupSpan}>Sign up</Text>
        </Text>

        {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#0f172a',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
    form: {
      backgroundColor: '#1f2937',
      padding: 24,
      borderRadius: 12,
      width: '100%',
      maxWidth: 400,
      shadowColor: '#000',
      shadowOpacity: 0.5,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 10,
      elevation: 6,
    },
    heading: {
      fontSize: 24,
      textAlign: 'center',
      marginBottom: 24,
      color: '#10b981',
      fontWeight: 'bold',
    },
    input: {
      backgroundColor: '#0f172a',
      borderColor: '#334155',
      borderWidth: 1,
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
      color: '#f8fafc',
      fontSize: 16,
    },
    button: {
      backgroundColor: '#10b981',
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 8,
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    signupLink: {
      textAlign: 'center',
      marginTop: 16,
      color: '#cbd5e1',
    },
    signupSpan: {
      color: '#10b981',
      textDecorationLine: 'underline',
    },
    message: {
      textAlign: 'center',
      marginTop: 8,
      color: '#f87171',
    },
});

export default LoginUser;