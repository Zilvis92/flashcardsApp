import React, { useState } from 'react';
import api from '../api/client';

const DeckForm = ({ onDeckCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // We send data to the backend
      const res = await api.post('/decks', { title, description });
      
      // We clean the form
      setTitle('');
      setDescription('');
      
      // Notify the parent component that a new set has arrived
      onDeckCreated(res.data);
    } catch (err) {
      console.error('Error creating collection:', err);
      alert('Failed to create collection');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create a new collection</h3>
      <div>
        <input 
          type="text" 
          placeholder="Rinkinio pavadinimas" 
          value={title}
          onChange={(e) => setTitle(e.target.value)} 
          required 
        />
      </div>
      <div>
        <textarea 
          placeholder="Description (optional)" 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <button type="submit">Create</button>
    </form>
  );
};

export default DeckForm;