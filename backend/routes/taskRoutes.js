const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { body } = require('express-validator');       //For Error Handling

router.post('/Login',taskController.LoginWithEmail);

router.post('/Signin',[
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
],taskController.Signin);

router.post('/Budget/:id',taskController.AddBudget);
router.delete('/Budget/:id1/:id2',taskController.DeleteBudget);
router.post('/Items/:id1/:id2',taskController.AddItems);
router.delete('/Items/:id',taskController.DeleteItem);
router.put('/Items/:id',taskController.UpdateItem);
router.get('/Budget/:id',taskController.GetBudget);
router.get('/Items/:id',taskController.GetItems);

module.exports = router;