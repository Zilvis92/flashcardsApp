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
    <div className="form-card">
      <h3 className="mb-2">Create a new collection</h3>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input 
            type="text" 
            placeholder="Collection Title" 
            value={title}
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
        </div>
        <div className="input-group">
          <textarea 
            placeholder="Description (optional)" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
          />
        </div>
        <button type="submit" className="btn btn-primary">Create Collection</button>
      </form>
    </div>
  );
};

export default DeckForm;