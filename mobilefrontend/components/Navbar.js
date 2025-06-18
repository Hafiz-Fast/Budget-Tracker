import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const Navbar = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { UserID } = route.params;

  return (
    <View style={styles.navbar}>
      {/* Login Button on the left */}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginButton}>Login</Text>
      </TouchableOpacity>

      {/* Nav links centered */}
      <View style={styles.linkContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Home', { UserID })}>
          <Text style={[styles.link, { color: '#10b981' }]}>🏠 Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Items', { UserID })}>
          <Text style={[styles.link, { color: '#3b82f6' }]}>🧾 Items</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Chart', { UserID })}>
          <Text style={[styles.link, { color: '#f59e0b' }]}>📊 Charts</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0f172a',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  loginButton: {
    backgroundColor: '#10b981',
    color: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    fontWeight: 'bold',
    fontSize: 14,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    gap: 16,
    marginLeft: 16,
  },
  link: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
