import React from 'react';
import { Link, useParams } from 'react-router-dom';

const Navbar = () => {
  const { UserID } = useParams();

  const navLinkStyle = {
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    color: '#f1f5f9',
    margin: '0 1rem',
  };

  return (
    <div
      style={{
        backgroundColor: '#0f172a', // darker than forms
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        marginBottom: '2rem',
        borderBottom: '1px solid #334155', // minimal separation
        borderRadius: '0px', // ensures it's flat
        boxShadow: 'none',   // removes glow
      }}
    >
      {/* Login Button on Far Left */}
      <Link
        to="/"
        style={{
          backgroundColor: '#10b981',
          color: '#ffffff',
          textDecoration: 'none',
          padding: '0.6rem 1.2rem',
          borderRadius: '6px',
          fontWeight: 'bold',
          fontSize: '1rem',
        }}
      >
        Login
      </Link>

      {/* Centered Nav Links */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          flex: 1,
          flexWrap: 'wrap',
        }}
      >
        <Link to={`/Home/${UserID}`} style={{ ...navLinkStyle, color: '#10b981' }}>
          🏠 Home
        </Link>
        <Link to={`/Items/${UserID}`} style={{ ...navLinkStyle, color: '#3b82f6' }}>
          🧾 Items
        </Link>
        <Link to={`/Chart/${UserID}`} style={{ ...navLinkStyle, color: '#f59e0b' }}>
          📊 Charts
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
