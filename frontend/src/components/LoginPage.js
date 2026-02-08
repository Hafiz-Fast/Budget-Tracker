import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginUser = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://budgettracker-e4fecfgjbkfng9gf.centralindia-01.azurewebsites.net/api/Login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Something Went Wrong');
      }

      setMessage(result.message);
      setEmail('');
      setPassword('');
      navigate(`/Home/${result.userid}`);
    } catch (error) {
      console.error('Error:', error.message);
      setMessage(error.message);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        <p className="signup-link" onClick={() => navigate(`/Signin`)}>
          Don't have an account? <span>Sign up</span>
        </p>
        <p className="message">{message}</p>
      </form>
    </div>
  );
};

export default LoginUser;