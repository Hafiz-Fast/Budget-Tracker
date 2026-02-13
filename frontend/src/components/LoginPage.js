import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { baseUrl } from '../config';

const LoginUser = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  // start loading
    setMessage('');    // clear previous messages

    try {
      const response = await fetch(`${baseUrl}/api/Login`, {
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
    } finally {
      setLoading(false); // stop loading
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
          disabled={loading} // disable input while loading
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading} // disable input while loading
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p className="signup-link" onClick={() => navigate(`/Signin`)}>
          Don't have an account? <span>Sign up</span>
        </p>
        <p className="message">{message}</p>
      </form>
    </div>
  );
};

export default LoginUser;