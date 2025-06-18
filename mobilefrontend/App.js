// App.js (React Native)
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import your screen components
import LoginUser from './components/LoginPage';
import SignUser from './components/SigninPage';
import HomePage from './components/HomePage';
import ItemPage from './components/ItemPage';
import ChartPage from './components/ChartPage';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>

        <Stack.Screen name="Login" component={LoginUser} />
        <Stack.Screen name="Signin" component={SignUser} />
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="Items" component={ItemPage} />
        <Stack.Screen name="Chart" component={ChartPage} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}