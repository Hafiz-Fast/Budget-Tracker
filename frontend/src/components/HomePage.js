import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './HomePage.css';
import Navbar from './Navbar';

const HomePage = () => {
  const { UserID } = useParams();
  const itemFormRef = React.useRef(null);
  const [messageType, setMessageType] = useState(''); // "success" or "error"
  const [itemMessageType, setItemMessageType] = useState('');

  // Budget-related state
  const [BudgetName, setName] = useState('');
  const [BudgetAmount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [Budgets, setBudgets] = useState([]);

  // Item-related state
  const [ItemName, setItemName] = useState('');
  const [ItemAmount, setItemAmount] = useState('');
  const [ItemMessage, setItemMessage] = useState('');
  const [selectedBudgetID, setSelectedBudgetID] = useState(null); // new state

  const handleBudgetSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/api/Budget/${UserID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ BudgetName, BudgetAmount }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Something went wrong");

      setMessage(result.message);
      setName('');
      setAmount('');
      fetchBudgets(); // Refresh budgets

      setMessageType('success');
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 2000);
    } 
    catch (error) {
      setMessage(error.message);
      setMessageType('error');
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 2000);
    }
  };

  const handleDeleteBudget = async (budgetID) => {
    try{
        await fetch(`http://localhost:5000/api/Budget/${UserID}/${budgetID}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        fetchBudgets();
    }
    catch(error){
        console.error("Delete failed: ", error);
    }
  };

  const handleItemSubmit = async (e) => {
    e.preventDefault();

    if (!selectedBudgetID) {
      setItemMessage("Please select a budget first.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/Items/${UserID}/${selectedBudgetID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Name: ItemName, Amount: parseFloat(ItemAmount) }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Something went wrong");

      setItemMessage(result.message);
      setItemName('');
      setItemAmount('');
      fetchBudgets(); // Refresh budgets

      setItemMessageType('success');
      setTimeout(() => {
        setItemMessage('');
        setItemMessageType('');
      }, 2000);
    } 
    catch (error) {
      setItemMessage(error.message);
      setItemMessageType('error');
      setTimeout(() => {
        setItemMessage('');
        setItemMessageType('');
      }, 2000);
    }
  };

  const fetchBudgets = () => {
    axios.get(`http://localhost:5000/api/Budget/${UserID}`)
      .then(res => setBudgets(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchBudgets();
  }, [UserID]);

  const getSelectedBudgetName = () => {
    const budget = Budgets.find(b => b.BudgetID === selectedBudgetID);
    return budget ? budget.BudgetName : null;
  };

  const handleSelectBudget = (id) => {
    setSelectedBudgetID(id);
    setTimeout(() => {
      itemFormRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100); // slight delay to allow re-render
  };

  return (
    <div className="home-container">
       <Navbar />

      <div className="form-section">
        <h2>Add New Budget</h2>
        <form onSubmit={handleBudgetSubmit}>
          <input type="text" placeholder="Enter Budget Name" value={BudgetName} onChange={(e) => setName(e.target.value)} required />
          <input type="number" placeholder="Enter Amount" value={BudgetAmount} onChange={(e) => setAmount(e.target.value)} required />
          <button type="submit">Add Budget</button>
          <p className={`message ${messageType}`}>{message}</p>
        </form>
      </div>

      <div className="table-section">
        <h2>Your Budgets</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Total</th>
              <th>Remaining</th>
              <th>Used</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Budgets.map((item, index) => (
              <tr key={index}>
                <td>{item.BudgetName}</td>
                <td>{item.TotalBudget}</td>
                <td>{item.CurrentAmount}</td>
                <td>{item.UsedAmount}</td>
                <td>
                  <button onClick={() => handleSelectBudget(item.BudgetID)}>Add Items</button>
                  <button className="delete-btn" onClick={() => handleDeleteBudget(item.BudgetID)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="form-section" ref={itemFormRef}>
      <h2>Add Item to {selectedBudgetID ? getSelectedBudgetName() : '...'}</h2>
        <form onSubmit={handleItemSubmit}>
          <input type="text" placeholder="Enter Item Name" value={ItemName} onChange={(e) => setItemName(e.target.value)} required />
          <input type="number" placeholder="Enter Amount" value={ItemAmount} onChange={(e) => setItemAmount(e.target.value)} required />
          <button type="submit">Add Item</button>
          <p className={`message ${itemMessageType}`}>{ItemMessage}</p>
        </form>
      </div>
    </div>

  );
};

export default HomePage;