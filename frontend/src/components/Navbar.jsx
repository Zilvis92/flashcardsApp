import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        ⚡ FlashCards
      </Link>
      
      <div className="nav-links">
        {user ? (
          <div>
            <Link to="/decks" className="btn">My Decks</Link>
            <button onClick={logout} className="btn btn-outline">Logout</button>
          </div>
        ) : (
          <>
            <Link to="/login" className="btn">Login</Link>
            <Link to="/register" className="btn btn-primary">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;