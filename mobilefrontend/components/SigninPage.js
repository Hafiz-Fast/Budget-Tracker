// components/SigninPage.js (React Native version)

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const SignUser = () => {
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [Age, setAge] = useState('');
  const [Gender, setGender] = useState('');
  const [UserType, setUserType] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigation = useNavigation();

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://192.168.1.217:5000/api/Signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fname,
          lname,
          Age,
          Gender,
          UserType,
          email,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors && Array.isArray(result.errors)) {
          throw new Error(result.errors[0].msg || 'Validation error');
        } else {
          throw new Error(result.error || 'Something Went Wrong');
        }
      }

      setMessage(result.message);
      setFname('');
      setLname('');
      setAge('');
      setGender('');
      setUserType('');
      setEmail('');
      setPassword('');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error:', error.message);
      setMessage(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.heading}>Create Account</Text>

        <TextInput
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor="#94a3b8"
          value={fname}
          onChangeText={setFname}
        />

        <TextInput
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor="#94a3b8"
          value={lname}
          onChangeText={setLname}
        />

        <TextInput
          style={styles.input}
          placeholder="Age"
          placeholderTextColor="#94a3b8"
          value={Age}
          onChangeText={setAge}
          keyboardType="numeric"
        />

        <Picker
          selectedValue={Gender}
          onValueChange={(value) => setGender(value)}
          style={styles.picker}
        >
          <Picker.Item label="Select Gender" value="" />
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
          <Picker.Item label="Other" value="Other" />
        </Picker>

        <Picker
          selectedValue={UserType}
          onValueChange={(value) => setUserType(value)}
          style={styles.picker}
        >
          <Picker.Item label="Select User Type" value="" />
          <Picker.Item label="Student" value="Student" />
          <Picker.Item label="Business Man" value="Business Man" />
          <Picker.Item label="Employee" value="Employee" />
          <Picker.Item label="House Wife" value="House Wife" />
        </Picker>

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
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

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
      maxWidth: 450,
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
      marginBottom: 12,
      color: '#f8fafc',
      fontSize: 16,
    },
    picker: {
      backgroundColor: '#0f172a',
      borderColor: '#334155',
      borderWidth: Platform.OS === 'android' ? 1 : 0,
      borderRadius: 8,
      marginBottom: 12,
      color: '#f8fafc',
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
    message: {
      textAlign: 'center',
      color: '#f87171',
      marginTop: 8,
    },
});
  

export default SignUser;
