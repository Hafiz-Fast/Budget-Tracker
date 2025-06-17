import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginUser = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
  
    const handleSubmit = async (e) => {
    e.preventDefault();

    try{
        const response = await fetch('http://localhost:5000/api/Login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if(!response.ok){          //Not 200,201 request
            throw new Error(result.error || "Something Went Wrong");
        }

        setMessage(result.message);
        setEmail('');
        setPassword('');

        navigate(`/Home/${result.userid}`);
    }
    catch(error) {
        console.error('Error:', error.message);
        setMessage(error.message);
    }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="text" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
        <p style={{ color:'blue', cursor:'pointer' }} onClick={() => navigate(`/Signin`)}>Don't have an Acount. Signin?</p>
        <p>{message}</p>
      </form>
    );
  };

export default LoginUser;