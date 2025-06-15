import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { signupUser } from '../api/api';

export default function SigninScreen({ navigation }) {
  const [form, setForm] = useState({
    fname: '',
    lname: '',
    Age: '',
    Gender: '',
    UserType: '',
    email: '',
    password: ''
  });

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleSignup = async () => {
    try {
      const res = await signupUser(form);
      alert(res.data.output.message);
      navigation.navigate('Login');
    } catch (err) {
      console.error(err);
      alert('Signup failed.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.box}>
          <Text style={styles.title}>Create Account</Text>

          <TextInput
            placeholder="First Name"
            style={styles.input}
            value={form.fname}
            onChangeText={text => handleChange('fname', text)}
          />
          <TextInput
            placeholder="Last Name"
            style={styles.input}
            value={form.lname}
            onChangeText={text => handleChange('lname', text)}
          />
          <TextInput
            placeholder="Age"
            keyboardType="numeric"
            style={styles.input}
            value={form.Age}
            onChangeText={text => handleChange('Age', text)}
          />
          <TextInput
            placeholder="Gender"
            style={styles.input}
            value={form.Gender}
            onChangeText={text => handleChange('Gender', text)}
          />
          <TextInput
            placeholder="User Type"
            style={styles.input}
            value={form.UserType}
            onChangeText={text => handleChange('UserType', text)}
          />
          <TextInput
            placeholder="Email"
            style={styles.input}
            value={form.email}
            onChangeText={text => handleChange('email', text)}
          />
          <TextInput
            placeholder="Password"
            style={styles.input}
            secureTextEntry
            value={form.password}
            onChangeText={text => handleChange('password', text)}
          />

          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
    elevation: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f0f4f8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
    color: '#2c3e50',
  },
  button: {
    backgroundColor: '#2e86de',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 14,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  link: {
    textAlign: 'center',
    color: '#2e86de',
    fontSize: 15,
  },
});