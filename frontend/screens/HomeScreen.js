import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { addBudget, deleteBudget } from '../api/api';
import { Ionicons } from '@expo/vector-icons';

const sampleUserId = 1; // Replace with actual user ID after login

export default function HomeScreen({ navigation }) {
  const [budgets, setBudgets] = useState([]);

  // Mock fetching budgets (replace with API later)
  const fetchBudgets = async () => {
    // Here you'd call your backend to get budgets for this user
    setBudgets([
      { id: 101, name: 'Monthly Bills', amount: 1200 },
      { id: 102, name: 'Groceries', amount: 500 },
    ]);
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleAddBudget = async () => {
    const name = `Budget ${budgets.length + 1}`;
    const amount = Math.floor(Math.random() * 1000) + 100;

    try {
      const res = await addBudget(sampleUserId, { BudgetName: name, BudgetAmount: amount });
      alert(res.data.output.message);
      fetchBudgets(); // refresh list
    } catch (err) {
      console.error(err);
      alert('Failed to add budget');
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('BudgetDetail', { budget: item })}>
      <View>
        <Text style={styles.budgetName}>{item.name}</Text>
        <Text style={styles.budgetAmount}>${item.amount}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#888" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Budgets</Text>
      <FlatList
        data={budgets}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity style={styles.fab} onPress={handleAddBudget}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f9fc' },
  heading: { fontSize: 26, fontWeight: '600', textAlign: 'center', marginTop: 20, color: '#2c3e50' },
  list: { padding: 20 },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 4,
  },
  budgetName: { fontSize: 18, fontWeight: '500', color: '#2c3e50' },
  budgetAmount: { fontSize: 16, color: '#27ae60', marginTop: 4 },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#2e86de',
    borderRadius: 30,
    padding: 16,
    elevation: 6,
  },
});