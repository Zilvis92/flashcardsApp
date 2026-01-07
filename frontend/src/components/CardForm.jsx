import React, { useState } from 'react';
import api from '../api/client';

const CardForm = ({ deckId, onCardAdded }) => {
  const [sideA, setFrontSide] = useState('');
  const [sideB, setBackSide] = useState('');
  const [hint, setHint] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/cards', { 
        deckId, 
        front_side: sideA, 
        back_side: sideB, 
        hint 
      });
      
      onCardAdded(res.data);
      setFrontSide('');
      setBackSide('');
      setHint('');
    } catch (err) {
      console.error('Error adding card:', err.response?.data || err.message);
      alert('Failed to add card. Check the console.');
    }
  };

  return (
    <div className="form-card">
      <h3 className="mb-2">Add a new card</h3>
      <form onSubmit={handleSubmit}>
        <div className="card-form-grid">
          <div className="input-group mt-0">
            <input 
              type="text" 
              placeholder="Question (Front)" 
              value={sideA} 
              onChange={(e) => setFrontSide(e.target.value)}
              required 
            />
          </div>
          <div className="input-group mt-0">
            <input 
              type="text" 
              placeholder="Answer (back)" 
              value={sideB} 
              onChange={(e) => setBackSide(e.target.value)}
              required 
            />
          </div>
          <div className="input-group mt-0">
            <input 
              type="text" 
              placeholder="Hint (optional)" 
              value={hint} 
              onChange={(e) => setHint(e.target.value)} 
            />
          </div>
          <div className="input-group mt-0">
            <button type="submit" className="btn btn-primary">Add</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CardForm;