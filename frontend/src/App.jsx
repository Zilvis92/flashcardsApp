import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Decks from './pages/Decks';
import DeckDetails from './pages/DeckDetails';

function App() {
  return (
    <AuthProvider>
      <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/decks" 
              element={
                <ProtectedRoute>
                  <Decks />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/decks/:id" 
              element={
                <ProtectedRoute>
                  <DeckDetails />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<h1>Welcome to the Flashcards app!</h1>} />
          </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;