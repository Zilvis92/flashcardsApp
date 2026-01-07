import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import CardForm from '../components/CardForm';

const DeckDetails = () => {
  const { id } = useParams(); // Get ID from URL
  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const handleCardAdded = (updatedDeck) => {
    // The backend should return an updated set with the new card
    // Or simply add the new card to the existing state:
    setDeck(updatedDeck);
  };

  if (loading) return <p>Loading...</p>;
  if (!deck) return <p>Collection not found.</p>;

  return (
    <>
      <Navbar />
      <div className="container">
        <Link to="/decks" className="text-link">← Back to all collections</Link>
        <div className="mb-2 mt-1">
          <h1>{deck.title}</h1>
          <p className="card-text">{deck.description}</p>
        </div>

        <CardForm deckId={id} onCardAdded={handleCardAdded} />

        <h2>Cards ({deck.cards?.length || 0})</h2>
        <div className="grid">
          {deck.cards?.map((card, index) => (
            <div key={index} className="card">
              <div className="input-group">
                <span className="input-label">Question:</span>
                <p>{card.question}</p>
              </div>
              <div>
                <span className="input-label">Answer:</span>
                <p>{card.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DeckDetails;