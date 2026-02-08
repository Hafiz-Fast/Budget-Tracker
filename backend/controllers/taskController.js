const Task = require('../models/taskModel');
const { validationResult } = require('express-validator');

exports.LoginWithEmail = async (req,res) => {
    try {
        const {email, password} = req.body;
        const result = await Task.LoginWithEmail(email, password);
        const message = result.output.message;
        const UserID = result.output.UserID;
        
        if(message === 'Login Successful'){
            res.status(200).json({ message: 'Login Successful', userid: UserID });
        }
        else if(message === 'Wrong Password'){
            res.status(400).json({ error: 'Wrong Password' });
        }
        else if(message === 'Email does not exist'){
            res.status(400).json({ error: 'Email does not exist' });
        }

    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.Signin = async (req,res) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {fname, lname, Age, Gender, UserType, email, password} = req.body;
        const result = await Task.Signin(fname, lname, Age, Gender, UserType, email, password);
        const message = result.output.message;

        if(message === 'Acount made Successfuly'){
            res.status(201).json({ message: 'Signin Successful' });
        }
        else if(message === 'Acount with this email already exist'){
            res.status(400).json({ error: 'Acount with this email already exist' });
        }

    } catch(error){
        console.error("Error creating task:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.AddBudget = async (req,res) => {
    try {
        const UserID = parseInt(req.params.id)
        const {BudgetName, BudgetAmount} = req.body;
        const result = await Task.AddBudget(UserID, BudgetName, BudgetAmount);
        const message = result.output.message;
        const BudgetID = result.output.BudgetID;

        if(message === 'Budget Added Successfuly'){
            res.status(201).json({ message: 'Budget Added Successfuly', budgetID:BudgetID });
        }
        else if(message === 'Budget with this name already exist'){
            res.status(400).json({ error: 'Budget with this name already exist' });
        }

    } catch(error) {
        console.error("Error creating task:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.DeleteBudget = async (req,res) => {
    try {
        const UserID = parseInt(req.params.id1)
        const BudgetID = parseInt(req.params.id2);
        await Task.DeleteBudget(UserID, BudgetID);
        res.status(201).json({ message: 'Task created using stored procedure' });

    } catch(error) {
        console.error("Error creating task:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.AddItems = async (req,res) => {
    try {
        const UserID = parseInt(req.params.id1)
        const BudgetID = parseInt(req.params.id2);
        const {Name, Amount} = req.body;
        console.log("Received Item: " + { UserID, BudgetID, Name, Amount });
        const result = await Task.AddItems(UserID, BudgetID, Name, Amount);
        const message = result.output.message;

        if(message ===  'Item Added Successfuly'){
            res.status(201).json({ message: 'Item Added Successfuly' });
        }
        else if(message === 'Error! The Item Amount is greater than Budget'){
            res.status(400).json({ error: 'Error! The Item Amount is greater than Budget' });
        }

    } catch(error) {
        console.error("Error creating task:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.DeleteItem = async (req,res) => {
    try {
        const ItemID = parseInt(req.params.id);
        await Task.DeleteItem(ItemID);
        res.status(201).json({ message: 'Item Deleted Successfuly' });

    } catch(error) {
        console.error("Error creating task:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.UpdateItem = async (req,res) => {
    try {
        const ItemID = parseInt(req.params.id);
        const {NewAmount} = req.body;
        const result = await Task.UpdateItem(ItemID, NewAmount);
        const message = result.output.message;

        if(message ===  'Item Amount and Budget updated successfuly!'){
            res.status(201).json({ message: 'Item Amount and Budget updated successfuly!' });
        }
        else if(message === 'Error! Not Enough Budget'){
            res.status(400).json({ error: 'Error! Not Enough Budget' });
        }
        else if(message === 'Error! Item does not exists'){
            res.status(500).json({ error: 'Error! Item does not exists' });
        }

    } catch(error) {
        console.error("Error creating task:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.GetBudget = async (req,res) => {
    try {
        const UserID = parseInt(req.params.id);
        const result = await Task.GetBudget(UserID);
        res.json(result);
        
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.GetItems = async (req,res) => {
    try {
        const BudgetID = parseInt(req.params.id);
        const result = await Task.GetItems(BudgetID);
        res.json(result);
        
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};