import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const HomePage = () => {
  const { UserID } = useParams();

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
    } 
    catch (error) {
      setMessage(error.message);
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
    } 
    catch (error) {
      setItemMessage(error.message);
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

  return (
    <div>
      <ul>
        <li><Link to = {`/Home/${UserID}`}>Home</Link></li>
        <li><Link to = {`/Items/${UserID}`}>Item Handling</Link></li>
       </ul>
      {/* Budget Form */}
      <form onSubmit={handleBudgetSubmit}>
        <input type="text" placeholder="Enter BudgetName" value={BudgetName} onChange={(e) => setName(e.target.value)} required />
        <input type="number" placeholder="Enter Amount" value={BudgetAmount} onChange={(e) => setAmount(e.target.value)} required />
        <button type="submit">Add Budget</button>
        <p>{message}</p>
      </form>

      {/* Budgets Table with buttons */}
      <h3>Your Budgets:</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Total</th>
            <th>Remaining</th>
            <th>Used</th>
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
                <button onClick={() => setSelectedBudgetID(item.BudgetID)}>
                  Add Items
                </button>
                <button onClick={() => handleDeleteBudget(item.BudgetID)}>
                    Delete Budget
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Item Form */}
      <h3>Add Item to {selectedBudgetID ? `Budget ID ${selectedBudgetID}` : '...'}</h3>
      <form onSubmit={handleItemSubmit}>
        <input type="text" placeholder="Enter ItemName" value={ItemName} onChange={(e) => setItemName(e.target.value)} required />
        <input type="number" placeholder="Enter Amount" value={ItemAmount} onChange={(e) => setItemAmount(e.target.value)} required />
        <button type="submit">Add Item</button>
        <p>{ItemMessage}</p>
      </form>
    </div>
  );
};

export default HomePage;