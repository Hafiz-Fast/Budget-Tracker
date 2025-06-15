import axios from 'axios';

const BASE_URL = 'http://192.168.0.102:5000/api'; // Replace with actual IP & port

export const loginUser = (email, password) =>
  axios.post(`${BASE_URL}/Login`, { email, password });

export const signupUser = (userData) =>
  axios.post(`${BASE_URL}/Signin`, userData);

export const addBudget = (userId, data) =>
  axios.post(`${BASE_URL}/Budget/${userId}`, data);

export const deleteBudget = (userId, budgetId) =>
  axios.delete(`${BASE_URL}/Budget/${userId}/${budgetId}`);

export const addItem = (userId, budgetId, item) =>
  axios.post(`${BASE_URL}/Items/${userId}/${budgetId}`, item);

export const updateItem = (itemId, newAmount) =>
  axios.put(`${BASE_URL}/Items/${itemId}`, { NewAmount: newAmount });

export const deleteItem = (itemId) =>
  axios.delete(`${BASE_URL}/Items/${itemId}`);
