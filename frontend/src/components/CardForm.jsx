import React, { useState } from 'react';
import api from '../api/client';

const CardForm = ({ deckId, onCardAdded }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // We send the card to the backend for a specific set
      const res = await api.post(`/decks/${deckId}/cards`, { question, answer });
      
      onCardAdded(res.data); // Refresh the list on the screen
      setQuestion('');
      setAnswer('');
    } catch (err) {
      alert('Error adding card');
    }
  };

  return (
    <div className="form-card">
      <h3 className="mb-2">Add a new card</h3>
      <form onSubmit={handleSubmit}>
        <div className="card-form-grid">
          <div className="input-group mt-0">
            <input type="text" placeholder="Question" value={question} onChange={(e) => setQuestion(e.target.value)} required />
          </div>
          <div className="input-group mt-0">
            <input type="text" placeholder="Answer" value={answer} onChange={(e) => setQuestion(e.target.value)} required />
          </div>
          <div className="input-group mt-0">
            <button type="submit" className="btn btn-primary">Add Card</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CardForm;