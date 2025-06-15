const { sql, poolPromise } = require('../config/db');
const { LoginWithEmail, Signin, AddBudget, DeleteBudget, AddItems, DeleteItem, UpdateItem } = require('../controllers/taskController');

const Task = {
    async LoginWithEmail(email, password) {
        try{
            const pool = await poolPromise;
            let result = await pool.request()
            .input('email', sql.VarChar, email)
            .input('password', sql.VarChar, password)
            .output('message',sql.VarChar)
            .execute('Loggin');

            return result;
        }
        catch(error){
          console.error("Error executing stored procedure:", error);
          throw error; 
        }
    },

    async Signin(fname, lname, Age, Gender, UserType, email, password) {
        try{
            const pool = await poolPromise;
            let result = await pool.request()
            .input('fname', sql.VarChar, fname)
            .input('lname', sql.VarChar, lname)
            .input('Age', sql.Int, Age)
            .input('Gender', sql.VarChar, Gender)
            .input('UserType', sql.VarChar, UserType)
            .input('email', sql.VarChar, email)
            .input('password', sql.VarChar, password)
            .output('message',sql.VarChar)
            .execute('SignIn');

            return result;
        }
        catch(error){
          console.error("Error executing stored procedure:", error);
          throw error; 
        }
    },

    async AddBudget(UserID, BudgetName, BudgetAmount) {
        try{
            const pool = await poolPromise;
            let result = await pool.request()
            .input('UserID', sql.Int, UserID)
            .input('BudgetName', sql.VarChar, BudgetName)
            .input('BudgetAmount', sql.Float, BudgetAmount)
            .output('message',sql.VarChar)
            .execute('AddBudget');

            return result;
        }
        catch(error){
          console.error("Error executing stored procedure:", error);
          throw error; 
        }
    },

    async DeleteBudget(UserID, BudgetID) {
        try{
            const pool = await poolPromise;
            await pool.request()
            .input('UserID', sql.Int, UserID)
            .input('BudgetID', sql.Int, BudgetID)
            .execute('DeleteBudget');

        }
        catch(error){
          console.error("Error executing stored procedure:", error);
          throw error; 
        }
    },

    async AddItems(UserID, BudgetID, Name, Amount) {
        try{
            const pool = await poolPromise;
            let result = await pool.request()
            .input('UserID', sql.Int, UserID)
            .input('BudgetID', sql.Int, BudgetID)
            .input('Name', sql.VarChar, Name)
            .input('Amount', sql.Float, Amount)
            .output('message',sql.VarChar)
            .execute('AddItems');

            return result;
        }
        catch(error){
          console.error("Error executing stored procedure:", error);
          throw error; 
        }
    },

    async DeleteItem(ItemID) {
        try{
            const pool = await poolPromise;
            await pool.request()
            .input('ItemID', sql.Int, ItemID)
            .execute('DeleteItem');
        }
        catch(error){
            console.error("Error executing stored procedure:", error);
            throw error; 
        }
    },

    async UpdateItem(ItemID, NewAmount) {
        try{
            const pool = await poolPromise;
            let result = await pool.request()
            .input('ItemID', sql.Int, ItemID)
            .input('NewAmount', sql.Float, NewAmount)
            .output('message',sql.VarChar)
            .execute('UpdateItemPrice');

            return result;
        }
        catch(error){
            console.error("Error executing stored procedure:", error);
            throw error; 
        }
    }

};

module.exports = Task;