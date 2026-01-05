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
    <div>
      <Link to="/dashboard">← Back to all collections</Link>
      <h1>{deck.title}</h1>
      <p>{deck.description}</p>

      <CardForm deckId={id} onCardAdded={handleCardAdded} />

      <h3>Cards ({deck.cards ? deck.cards.length : 0})</h3>
      <div>
        {deck.cards && deck.cards.length > 0 ? (
          deck.cards.map((card, index) => (
            <div key={index}>
              <strong>Q:</strong> {card.question} <br />
              <strong>A:</strong> {card.answer}
            </div>
          ))
        ) : (
          <p>There are no cards in this collection yet.</p>
        )}
      </div>
    </div>
  );
};

export default DeckDetails;