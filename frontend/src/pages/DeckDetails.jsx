import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import Navbar from '../components/Navbar';
import CardForm from '../components/CardForm';
import StudyMode from '../components/StudyMode';

const DeckDetails = () => {
  const { id } = useParams(); // Get ID from URL
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

  if (loading) return <p>Loading...</p>;
  if (!deck) return <p>Collection not found.</p>;

  return (
    <>
      <Navbar />
      <div className="container">
        <div>
          <Link to="/decks" className="text-link">← Back to all collections</Link>
          
          {/* PRIDĖTA: Mygtukas mokymosi pradžiai, rodomas tik jei yra kortelių */}
          {deck.cards?.length > 0 && (
            <button 
              onClick={() => setIsStudyMode(!isStudyMode)} 
              className={`btn ${isStudyMode ? 'btn-danger' : 'btn-primary'}`}
            >
              {isStudyMode ? 'Stop Studying' : 'Start Study Mode 🚀'}
            </button>
          )}
        </div>

        <div className="mb-2 mt-1">
          <h1>{deck.title}</h1>
          <p className="card-text">{deck.description}</p>
        </div>

        {/* LOGIKA: Jei įjungtas mokymosi režimas, rodome StudyMode, jei ne - formą ir sąrašą */}
        {isStudyMode ? (
          <StudyMode 
            cards={deck.cards} 
            onFinish={() => setIsStudyMode(false)} 
          />
        ) : (
          <>
            <CardForm deckId={id} onCardAdded={handleCardAdded} />

            <h2>Cards ({deck.cards?.length || 0})</h2>
            <div className="grid">
              {deck.cards?.map((card) => (
                <div key={card._id} className="card">
                  <div className="input-group">
                    <span className="input-label">Question:</span>
                    <p>{card.front_side}</p> 
                  </div>
                  <div>
                    <span className="input-label">Answer:</span>
                    <p>{card.back_side}</p>
                  </div>
                  {card.hint && (
                    <p className="input-label" >
                       Hint: {card.hint}
                    </p>
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