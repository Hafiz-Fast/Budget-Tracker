import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginUser = () => {
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

    try{
        const response = await fetch('http://localhost:5000/api/Signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fname, lname, Age, Gender, UserType, email, password })
        });

        const result = await response.json();

        if(!response.ok){          //Not 200,201 request
            if (result.errors && Array.isArray(result.errors)) {
                throw new Error(result.errors[0].msg || "Validation error");
            }
            else{
                throw new Error(result.error || "Something Went Wrong");
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
    }
    catch(error) {
        console.error('Error:', error.message);
        setMessage(error.message);
    }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Enter First Name" value={fname} onChange={(e) => setFname(e.target.value)} required />
        <input type="text" placeholder="Enter Last Name" value={lname} onChange={(e) => setLname(e.target.value)} required />
        <input type="number" placeholder="Enter Age" value={Age} onChange={(e) => setAge(e.target.value)} required />
        <input list="Gender" placeholder="Enter Gender" value={Gender} onChange={(e) => setGender(e.target.value)} required />
        <datalist id = "Gender">
          <option value="Male" />
          <option value="Female" />
          <option value="Other" />
        </datalist>
        <input list="UserTypes" placeholder="Enter UserType" value={UserType} onChange={(e) => setUserType(e.target.value)} required />
        <datalist id = "UserTypes">
          <option value="Student" />
          <option value="Business Man" />
          <option value="Employee" />
          <option value="House Wife" />
        </datalist>
        <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="text" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Make Acount</button>
        <p>{message}</p>
      </form>
    );
  };

export default LoginUser;