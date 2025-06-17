import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SigninPage.css';

const SignUser = () => {
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [Age, setAge] = useState('');
  const [Gender, setGender] = useState('');
  const [UserType, setUserType] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/Signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fname, lname, Age, Gender, UserType, email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors && Array.isArray(result.errors)) {
          throw new Error(result.errors[0].msg || 'Validation error');
        } else {
          throw new Error(result.error || 'Something Went Wrong');
        }
      }

      setMessage(result.message);
      setFname('');
      setLname('');
      setAge('');
      setGender('');
      setUserType('');
      setEmail('');
      setPassword('');
      navigate(`/`);
    } catch (error) {
      console.error('Error:', error.message);
      setMessage(error.message);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <input type="text" placeholder="First Name" value={fname} onChange={(e) => setFname(e.target.value)} required />
        <input type="text" placeholder="Last Name" value={lname} onChange={(e) => setLname(e.target.value)} required />
        <input type="number" placeholder="Age" value={Age} onChange={(e) => setAge(e.target.value)} required />

        <input list="GenderOptions" placeholder="Gender" value={Gender} onChange={(e) => setGender(e.target.value)} required />
        <datalist id="GenderOptions">
          <option value="Male" />
          <option value="Female" />
          <option value="Other" />
        </datalist>

        <input list="UserTypes" placeholder="User Type" value={UserType} onChange={(e) => setUserType(e.target.value)} required />
        <datalist id="UserTypes">
          <option value="Student" />
          <option value="Business Man" />
          <option value="Employee" />
          <option value="House Wife" />
        </datalist>

        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button type="submit">Sign Up</button>
        <p className="message">{message}</p>
      </form>
    </div>
  );
};

export default SignUser;