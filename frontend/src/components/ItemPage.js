import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const ItemPage = () => {
    const { UserID } = useParams();
    const [Budgets, setBudgets] = useState([]);
    const [Items, setItems] = useState([]);
    const [selectedBudgetID, setSelectedBudgetID] = useState(null);
    const [selectedItemID, setselectedItemID] = useState(null);
    const [NewAmount, setNewAmount] = useState('');
    const [message, setMessage] = useState('');
    
    const fetchBudgets = () => {
        axios.get(`http://localhost:5000/api/Budget/${UserID}`)
          .then(res => setBudgets(res.data))
          .catch(err => console.error(err));
    };

    const fetchItems = (BudgetID) => {
        setSelectedBudgetID(BudgetID);
        axios.get(`http://localhost:5000/api/Items/${BudgetID}/`)
          .then(res => setItems(res.data))
          .catch(err => console.error(err));
    };

    const handleDeleteItem = async (ItemID) => {
        try{
            await fetch(`http://localhost:5000/api/Items/${ItemID}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });
            fetchItems(selectedBudgetID);
            fetchBudgets();
        }
        catch(error){
            console.error("Delete failed: ", error);
        }
    };
    
    useEffect(() => {
        fetchBudgets();
    }, [UserID]);

    const handleUpdateItem = async (e) => {
        e.preventDefault();

        if(!selectedItemID){
            setMessage("Please select an Item First");
            return;
        }

        try {
          const response = await fetch(`http://localhost:5000/api/Items/${selectedItemID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ NewAmount:parseFloat(NewAmount) }),
          });
    
          const result = await response.json();
          if (!response.ok) throw new Error(result.error || "Something went wrong");
    
          setMessage(result.message);
          setNewAmount();
          fetchItems(selectedBudgetID);
          fetchBudgets();
        } 
        catch (error) {
          setMessage(error.message);
        }
    };

    return (
        <div>
            <ul>
                <li><Link to = {`/Home/${UserID}`}>Home</Link></li>
                <li><Link to = {`/Items/${UserID}`}>Item Handling</Link></li>
            </ul>

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
                        <button onClick={() => fetchItems(item.BudgetID)}>
                            View Items
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Items Table */}
            <h3>Showing Items of {selectedBudgetID ? `Budget ID ${selectedBudgetID}` : '...'}</h3>
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Amount</th>
                </tr>
                </thead>
                <tbody>
                {Items.map((item, index) => (
                    <tr key={index}>
                    <td>{item.ItemName}</td>
                    <td>{item.Amount}</td>
                    <td>
                        <button onClick={() => handleDeleteItem(item.ItemID)}>
                            Delete Items
                        </button>
                        <button onClick={() => setselectedItemID(item.ItemID)}>
                            Update Item
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Update Item Form */}
            <h3>Update Item with {selectedItemID ? `Item ID ${selectedItemID}` : '...'}</h3>
            <form onSubmit={handleUpdateItem}>
                <input type="number" placeholder="Enter NewAmount" value={NewAmount} onChange={(e) => setNewAmount(e.target.value)} required />
                <button type="submit">Update Item</button>
                <p>{message}</p>
            </form>
        </div>
    );
};

export default ItemPage;