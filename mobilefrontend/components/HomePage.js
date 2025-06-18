import React, { useEffect, useState, useRef } from 'react';
import Navbar from './Navbar';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';

const HomePage = () => {
  const route = useRoute();
  const { UserID } = route.params;

  const [Budgets, setBudgets] = useState([]);
  const [BudgetName, setName] = useState('');
  const [BudgetAmount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const [ItemName, setItemName] = useState('');
  const [ItemAmount, setItemAmount] = useState('');
  const [ItemMessage, setItemMessage] = useState('');
  const [itemMessageType, setItemMessageType] = useState('');
  const [selectedBudgetID, setSelectedBudgetID] = useState(null);

  const scrollRef = useRef();

  const baseURL = 'http://192.168.1.217:5000';

  const fetchBudgets = () => {
    axios.get(`${baseURL}/api/Budget/${UserID}`)
      .then(res => setBudgets(res.data))
      .catch(err => console.error(err));
  };

  const handleBudgetSubmit = async () => {
    try {
      const response = await fetch(`${baseURL}/api/Budget/${UserID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ BudgetName, BudgetAmount }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Something went wrong");

      setMessage(result.message);
      setName('');
      setAmount('');
      fetchBudgets();
      setMessageType('success');
    } catch (error) {
      setMessage(error.message);
      setMessageType('error');
    }

    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 2000);
  };

  const handleDeleteBudget = async (budgetID) => {
    try {
      await fetch(`${baseURL}/api/Budget/${UserID}/${budgetID}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      fetchBudgets();
    } catch (error) {
      console.error("Delete failed: ", error);
    }
  };

  const handleItemSubmit = async () => {
    if (!selectedBudgetID) {
      setItemMessage("Please select a budget first.");
      return;
    }

    try {
      const response = await fetch(`${baseURL}/api/Items/${UserID}/${selectedBudgetID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Name: ItemName, Amount: parseFloat(ItemAmount) }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Something went wrong");

      setItemMessage(result.message);
      setItemName('');
      setItemAmount('');
      fetchBudgets();
      setItemMessageType('success');
    } catch (error) {
      setItemMessage(error.message);
      setItemMessageType('error');
    }

    setTimeout(() => {
      setItemMessage('');
      setItemMessageType('');
    }, 2000);
  };

  const getSelectedBudgetName = () => {
    const budget = Budgets.find(b => b.BudgetID === selectedBudgetID);
    return budget ? budget.BudgetName : '...';
  };

  useEffect(() => {
    fetchBudgets();
  }, [UserID]);

  return (
    <View style={styles.container}>
      <Navbar />

      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Add New Budget</Text>
        <View style={styles.form}>
          <TextInput style={styles.input} placeholder="Enter Budget Name" placeholderTextColor="#94a3b8" value={BudgetName} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Enter Amount" placeholderTextColor="#94a3b8" value={BudgetAmount} onChangeText={setAmount} keyboardType="numeric" />
          <TouchableOpacity style={styles.button} onPress={handleBudgetSubmit}>
            <Text style={styles.buttonText}>Add Budget</Text>
          </TouchableOpacity>
          {message ? <Text style={[styles.message, messageType === 'success' ? styles.success : styles.error]}>{message}</Text> : null}
        </View>

        <Text style={styles.heading}>Your Budgets</Text>
        <FlatList
          data={Budgets}
          keyExtractor={(item) => item.BudgetID.toString()}
          horizontal
          pagingEnabled
          snapToAlignment="center"
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View style={styles.budgetCard}>
              <Text style={styles.budgetName}>{item.BudgetName}</Text>
              <Text style={styles.budgetText}>Total: {item.TotalBudget}</Text>
              <Text style={styles.budgetText}>Remaining: {item.CurrentAmount}</Text>
              <Text style={styles.budgetText}>Used: {item.UsedAmount}</Text>
              <TouchableOpacity
                style={styles.smallButton}
                onPress={() => {
                  setSelectedBudgetID(item.BudgetID);
                  setTimeout(() => {
                    scrollRef.current?.scrollToEnd({ animated: true });
                  }, 100);
                }}
              >
                <Text style={styles.smallButtonText}>Add Items</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.smallButton, styles.deleteButton]}
                onPress={() => handleDeleteBudget(item.BudgetID)}
              >
                <Text style={styles.smallButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        <Text style={styles.heading}>
          Add Item to <Text style={{ color: '#22c55e' }}>{getSelectedBudgetName()}</Text>
        </Text>

        <View style={styles.form}>
          <TextInput style={styles.input} placeholder="Enter Item Name" placeholderTextColor="#94a3b8" value={ItemName} onChangeText={setItemName} />
          <TextInput style={styles.input} placeholder="Enter Amount" placeholderTextColor="#94a3b8" value={ItemAmount} onChangeText={setItemAmount} keyboardType="numeric" />
          <TouchableOpacity style={styles.button} onPress={handleItemSubmit}>
            <Text style={styles.buttonText}>Add Item</Text>
          </TouchableOpacity>
          {ItemMessage ? <Text style={[styles.message, itemMessageType === 'success' ? styles.success : styles.error]}>{ItemMessage}</Text> : null}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 16,
  },
  heading: {
    fontSize: 20,
    color: '#10b981',
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
  },
  form: {
    backgroundColor: '#1f2937',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#0f172a',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    color: '#f8fafc',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#10b981',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  message: {
    marginTop: 10,
    textAlign: 'center',
  },
  success: {
    color: '#10b981',
  },
  error: {
    color: '#f87171',
  },
  budgetCard: {
    backgroundColor: '#1f2937',
    padding: 16,
    borderRadius: 8,
    marginRight: 12,
    width: 300,
    justifyContent: 'center',
  },
  budgetName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#22c55e',
    textAlign: 'center',
    marginBottom: 8,
  },
  budgetText: {
    color: '#f1f5f9',
    marginBottom: 4,
  },
  smallButton: {
    backgroundColor: '#059669',
    padding: 8,
    borderRadius: 6,
    marginTop: 6,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  smallButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default HomePage;