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

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        const res = await api.get(`/decks/${id}`);
        setDeck(res.data);
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

  if (loading) return <p>Loading...</p>;
  if (!deck) return <p>Collection not found.</p>;

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="deck-nav-header">
          <Link to="/decks" className="text-link">← Back to all collections</Link>
          
          <div className="nav-links">
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
          <h1>{deck.title}</h1>
          <p className="card-text">{deck.description}</p>
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
                  <div className="card-header-actions">
                    <button 
                      onClick={() => handleDeleteCard(card._id)} 
                      className="btn-icon-danger"
                      title="Delete card"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="input-group">
                    <span className="input-label">Question:</span>
                    <p>{card.front_side}</p> 
                  </div>
                  <div>
                    <span className="input-label">Answer:</span>
                    <p>{card.back_side}</p>
                  </div>
                  {card.hint && (
                    <p className="hint-text-muted mt-1">Hint: {card.hint}</p>
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