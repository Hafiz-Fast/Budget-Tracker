import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import LoginUser from './components/LoginPage';
import SignUser from './components/SigninPage';
import HomePage from './components/HomePage';
import ItemPage from './components/ItemPage';
import ChartPage from './components/ChartPage';

function App() {
  return (
    <Router>
      <Routes>

        <Route path = "/" element = {
          <LoginUser />
         } />

        <Route path = "/Signin" element = {
          <SignUser />
        } />

        <Route path = "/Home/:UserID" element = {
          <HomePage />
        } />

        <Route path = "/Items/:UserID" element = {
          <ItemPage />
        } />

        <Route path="/Chart/:UserID" element = {
          <ChartPage />
        } />

      </Routes>
    </Router>
  );  
}

export default App;
