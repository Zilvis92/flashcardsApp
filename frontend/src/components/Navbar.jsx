import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <Link to="/decks" className="nav-logo">⚡ FlashCards</Link>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/decks" className="btn btn-outline">My Decks</Link>
            <button onClick={logout} className="btn btn-danger">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline">Login</Link>
            <Link to="/register" className="btn btn-primary">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;