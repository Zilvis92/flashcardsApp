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
    <form onSubmit={handleSubmit}>
      <h4>Add a new card</h4>
      <input 
        type="text" 
        placeholder="Question (Front)" 
        value={question} 
        onChange={(e) => setQuestion(e.target.value)} 
        required 
      />
      <input 
        type="text" 
        placeholder="Answer (End)" 
        value={answer} 
        onChange={(e) => setAnswer(e.target.value)} 
        required 
      />
      <button type="submit">Add</button>
    </form>
  );
};

export default CardForm;