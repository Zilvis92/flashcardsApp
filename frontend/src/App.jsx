import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';

// temporary create for testing
const Home = () => <h1>Mano kortelių rinkiniai</h1>;
const Login = () => <h1>Prisijungimas</h1>;

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* later will need add Header/Navigacija */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          {/* later will add /register, /decks, /study */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;