import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Navbar from './Navbar';
import axios from 'axios';

const SCREEN_WIDTH = Dimensions.get('window').width;

const ItemPage = ({ route }) => {
  const { UserID } = route.params;
  const [Budgets, setBudgets] = useState([]);
  const [Items, setItems] = useState([]);
  const [selectedBudgetID, setSelectedBudgetID] = useState(null);
  const [selectedItemID, setSelectedItemID] = useState(null);
  const [NewAmount, setNewAmount] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const budgetListRef = useRef(null);
  const itemListRef = useRef(null);

  const [budgetScrollIndex, setBudgetScrollIndex] = useState(0);
  const [itemScrollIndex, setItemScrollIndex] = useState(0);

  const fetchBudgets = () => {
    if (itemListRef.current) {
      itemListRef.current.scrollToOffset({ offset: 0, animated: false });
    }
    setBudgetScrollIndex(0);
    axios
      .get(`http://192.168.1.217:5000/api/Budget/${UserID}`)
      .then((res) => setBudgets(res.data))
      .catch((err) => console.error(err));
  };

  const fetchItems = (BudgetID) => {
    if (itemListRef.current) {
      itemListRef.current.scrollToOffset({ offset: 0, animated: false });
    }
    setItemScrollIndex(0);
    setSelectedBudgetID(BudgetID);
    axios
      .get(`http://192.168.1.217:5000/api/Items/${BudgetID}/`)
      .then((res) => setItems(res.data))
      .catch((err) => console.error(err));
  };

  const handleDeleteItem = async (ItemID) => {
    try {
      await fetch(`http://192.168.1.217:5000/api/Items/${ItemID}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      fetchItems(selectedBudgetID);
      fetchBudgets();
    } catch (error) {
      console.error('Delete failed: ', error);
    }
  };

  const handleUpdateItem = async () => {
    if (!selectedItemID) {
      setMessage('Please select an Item First');
      return;
    }

    try {
      const response = await fetch(
        `http://192.168.1.217:5000/api/Items/${selectedItemID}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ NewAmount: parseFloat(NewAmount) }),
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Something went wrong');

      setMessage(result.message);
      setNewAmount('');
      fetchItems(selectedBudgetID);
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

  const getSelectedItemName = () => {
    const item = Items.find((i) => i.ItemID === selectedItemID);
    return item ? item.ItemName : '...';
  };

  useEffect(() => {
    fetchBudgets();
  }, [UserID]);

  return (
    <View style={styles.container}>
      <Navbar UserID={UserID} />

      {/* Budgets Header with Scroll Hint */}
      <View style={styles.headingRow}>
        <Text style={styles.heading}>Your Budgets</Text>
        <Text style={styles.scrollHint}>Scroll right →</Text>
      </View>

      {/* Horizontal Budget Cards */}
      <FlatList
        ref={budgetListRef}
        data={Budgets}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.BudgetID.toString()}
        renderItem={({ item, index }) => (
          <View style={[
            styles.card,
            index === Budgets.length - 1 && styles.lastCard
          ]}>
            <Text style={styles.cardTitle}>{item.BudgetName}</Text>
            <Text style={styles.text}>Total: {item.TotalBudget}</Text>
            <Text style={styles.text}>Remaining: {item.CurrentAmount}</Text>
            <Text style={styles.text}>Used: {item.UsedAmount}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => fetchItems(item.BudgetID)}
            >
              <Text style={styles.buttonText}>View Items</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.listContentContainer}
      />

      {/* Items Section */}
      {selectedBudgetID && (
        <>
          <View style={styles.headingRow}>
            <Text style={styles.heading}>
              Items of{' '}
              <Text style={{ color: '#22c55e' }}>
                {Budgets.find((b) => b.BudgetID === selectedBudgetID)?.BudgetName || '...'}
              </Text>
            </Text>
            <Text style={styles.scrollHint}>Scroll right →</Text>
          </View>

          {Items.length > 0 ? (
            <FlatList
              ref={itemListRef}
              data={Items}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.ItemID.toString()}
              renderItem={({ item, index }) => (
                <View style={[
                  styles.card,
                  index === Items.length - 1 && styles.lastCard
                ]}>
                  <Text style={styles.cardTitle}>{item.ItemName}</Text>
                  <Text style={styles.text}>Amount: {item.Amount}</Text>
                  <TouchableOpacity
                    style={[styles.button, styles.deleteButton]}
                    onPress={() => handleDeleteItem(item.ItemID)}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => setSelectedItemID(item.ItemID)}
                  >
                    <Text style={styles.buttonText}>Update</Text>
                  </TouchableOpacity>
                </View>
              )}
              contentContainerStyle={styles.listContentContainer}
            />
          ) : (
            <Text style={styles.text}>No items found.</Text>
          )}
        </>
      )}

      {/* Update Form */}
      <View style={styles.updateForm}>
        <Text style={styles.updateheading}>
          Update{' '}
          <Text style={{ color: '#facc15' }}>
            {selectedItemID ? getSelectedItemName() : '...'}
          </Text>
        </Text>

        <TextInput
          placeholder="Enter New Amount"
          style={styles.input}
          placeholderTextColor="#94a3b8"
          keyboardType="numeric"
          value={NewAmount}
          onChangeText={setNewAmount}
        />
        <TouchableOpacity style={styles.button} onPress={handleUpdateItem}>
          <Text style={styles.buttonText}>Update Item</Text>
        </TouchableOpacity>
        <Text
          style={[
            styles.message,
            messageType === 'success' ? styles.success : styles.error,
          ]}
        >
          {message}
        </Text>
      </View>
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
    color: '#10b981',
    fontSize: 18,
    fontWeight: 'bold',
  },
  updateheading: {
    color: '#10b981',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10, 
  },
  headingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  scrollHint: {
    color: '#64748b',
    fontSize: 12,
    marginLeft: 8,
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: '#1f2937',
    width: SCREEN_WIDTH - 40,
    padding: 20,
    borderRadius: 12,
    marginRight: 12,
    marginLeft: 4,
  },
  lastCard: {
    marginRight: 16,
  },
  listContentContainer: {
    paddingHorizontal: 4,
    paddingBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    color: '#22c55e',
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  text: {
    color: '#f1f5f9',
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#059669',
    padding: 10,
    borderRadius: 6,
    marginTop: 8,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  message: {
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 5,
  },
  success: {
    color: '#10b981',
  },
  error: {
    color: '#f87171',
  },
  updateForm: {
    backgroundColor: '#1f2937',
    padding: 16,
    borderRadius: 8,
    marginTop: 30,
    marginBottom: 50,
  },
});

export default ItemPage;