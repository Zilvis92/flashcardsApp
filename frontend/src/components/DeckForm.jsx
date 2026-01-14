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
          <label className="input-label">Title</label>
          <input 
            type="text" 
            placeholder="Collection Title" 
            value={title}
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
        </div>
        <div className="input-row">
          <div className="input-col">
            <div className="input-group">
              <label className="input-label">From</label>
              <input 
                type="text" 
                placeholder="Source Language" 
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="input-col">
            <div className="input-group">
              <label className="input-label">Into</label>
              <input 
                type="text" 
                placeholder="Target Language" 
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Description</label>
          <textarea 
            placeholder="Description (optional)" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
          />
        </div>
        
        <button type="submit" className="btn btn-primary btn-full">
          Create Collection
        </button>
      </form>
    </div>
  );
};

export default DeckForm;