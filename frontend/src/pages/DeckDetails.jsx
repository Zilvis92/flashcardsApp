import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import Navbar from '../components/Navbar';
import CardForm from '../components/CardForm';
import StudyMode from '../components/StudyMode';

const DeckDetails = () => {
  const { id } = useParams(); // Get ID from URL
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [editingCardId, setEditingCardId] = useState(null);
  const [editData, setEditData] = useState({ front_side: '', back_side: '', hint: '' });
  const [isEditingDeck, setIsEditingDeck] = useState(false);
  const [deckData, setDeckData] = useState({ title: '', description: '' });

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        const res = await api.get(`/decks/${id}`);
        setDeck(res.data);
        setDeckData({ title: res.data.title, description: res.data.description });
        setLoading(false);
      } catch (err) {
        console.error('Error loading collection', err);
        setLoading(false);
      }
    };
    fetchDeck();
  }, [id]);

  const handleCardAdded = (newCard) => {
    setDeck((prev) => ({
      ...prev,
      cards: [...prev.cards, newCard]
    }));
  };

  const handleDeleteCard = async (cardId) => {
    if (!window.confirm('Are you sure you want to delete this card?')) return;
    try {
      await api.delete(`/cards/${cardId}`);
      setDeck((prev) => ({
        ...prev,
        cards: prev.cards.filter(card => card._id !== cardId)
      }));
    } catch (err) {
      alert('Failed to delete card');
    }
  };

  const handleDeleteDeck = async () => {
    if (!window.confirm('WARNING: Are you sure you want to delete the ENTIRE collection?')) return;
    try {
      await api.delete(`/decks/${id}`);
      navigate('/decks');
    } catch (err) {
      alert('Failed to delete collection');
    }
  };

  const startEditing = (card) => {
    setEditingCardId(card._id);
    setEditData({ front_side: card.front_side, back_side: card.back_side, hint: card.hint || '' });
  };

  const handleUpdateCard = async (cardId) => {
    try {
      const res = await api.put(`/cards/${cardId}`, editData);
      setDeck((prev) => ({
        ...prev,
        cards: prev.cards.map(c => c._id === cardId ? res.data : c)
      }));
      setEditingCardId(null);
    } catch (err) {
      alert('Update failed');
    }
  };

  const handleUpdateDeck = async () => {
    try {
      const res = await api.put(`/decks/${id}`, deckData);
      setDeck(res.data);
      setIsEditingDeck(false);
    } catch (err) {
      alert('Failed to update collection info');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!deck) return <p>Collection not found.</p>;

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="deck-nav-header">
          <Link to="/decks" className="text-link">← Back to all collections</Link>
          
          <div className="nav-links">
            {!isStudyMode && (
              <button 
                onClick={() => setIsEditingDeck(!isEditingDeck)} 
                className="btn btn-outline"
              >
                {isEditingDeck ? 'Cancel Edit' : 'Edit Title ✎'}
              </button>
            )}
            <button onClick={handleDeleteDeck} className="btn btn-danger">
              Delete Collection 🗑️
            </button>
            {deck.cards?.length > 0 && (
              <button 
                onClick={() => setIsStudyMode(!isStudyMode)} 
                className={`btn ${isStudyMode ? 'btn-danger' : 'btn-primary'}`}
              >
                {isStudyMode ? 'Stop Studying' : 'Start Study Mode 🚀'}
              </button>
            )}
          </div>
        </div>

        <div className="deck-header">
          {isEditingDeck ? (
            <div className="form-card" style={{ padding: '1rem', marginBottom: '1rem' }}>
              <input 
                className="mb-1"
                value={deckData.title} 
                onChange={(e) => setDeckData({...deckData, title: e.target.value})}
                placeholder="Collection Title"
              />
              <textarea 
                value={deckData.description} 
                onChange={(e) => setDeckData({...deckData, description: e.target.value})}
                placeholder="Description"
              />
              <button onClick={handleUpdateDeck} className="btn btn-save mt-1">Save Changes</button>
            </div>
          ) : (
            <>
              <h1>{deck.title}</h1>
              <p className="card-text">{deck.description}</p>
            </>
          )}
        </div>

        {isStudyMode ? (
          <StudyMode cards={deck.cards} onFinish={() => setIsStudyMode(false)} />
        ) : (
          <>
            <CardForm deckId={id} onCardAdded={handleCardAdded} />
            <h2>Cards ({deck.cards?.length || 0})</h2>
            <div className="grid">
              {deck.cards?.map((card) => (
                <div key={card._id} className="card">
                  {editingCardId === card._id ? (
                    /* REDAGAVIMO FORMA KORTELĖS VIDUJE */
                    <div className="edit-mode">
                      <input 
                        value={editData.front_side} 
                        onChange={(e) => setEditData({...editData, front_side: e.target.value})} 
                        placeholder="Question"
                      />
                      <input 
                        className="mt-1"
                        value={editData.back_side} 
                        onChange={(e) => setEditData({...editData, back_side: e.target.value})} 
                        placeholder="Answer"
                      />
                      <input 
                        className="mt-1"
                        value={editData.hint} 
                        onChange={(e) => setEditData({...editData, hint: e.target.value})} 
                        placeholder="Hint"
                      />
                      <div className="edit-actions">
                        <button onClick={() => handleUpdateCard(card._id)} className="btn btn-save">Save</button>
                        <button onClick={() => setEditingCardId(null)} className="btn btn-outline">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    /* PAPRASTAS RODYMAS */
                    <>
                      <div className="card-header-actions">
                        <button onClick={() => startEditing(card)} className="btn-icon-danger" style={{color: 'var(--primary)'}} title="Edit">✎</button>
                        <button onClick={() => handleDeleteCard(card._id)} className="btn-icon-danger" title="Delete">✕</button>
                      </div>
                      <div className="input-group">
                        <span className="input-label">Question:</span>
                        <p>{card.front_side}</p> 
                      </div>
                      <div>
                        <span className="input-label">Answer:</span>
                        <p>{card.back_side}</p>
                      </div>
                      {card.hint && <p className="hint-text-muted mt-1">Hint: {card.hint}</p>}
                    </>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default DeckDetails;