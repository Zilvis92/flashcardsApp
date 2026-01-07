import React, { useState } from 'react';
import api from '../api/client';

const DeckForm = ({ onDeckCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('English');
  const [targetLanguage, setTargetLanguage] = useState('Lithuanian');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/decks', { 
        title, 
        description, 
        sourceLanguage, 
        targetLanguage 
      });
      
      setTitle('');
      setDescription('');
      onDeckCreated(res.data);
    } catch (err) {
      console.error('Error creating collection:', err.response?.data || err);
      alert(err.response?.data?.message || 'Failed to create collection');
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
          <input 
            type="text" 
            placeholder="From the language" 
            value={sourceLanguage}
            onChange={(e) => setSourceLanguage(e.target.value)}
            required
          />
          <input 
            type="text" 
            placeholder="Into the language" 
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
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