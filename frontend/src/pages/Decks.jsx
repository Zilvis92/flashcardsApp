import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import DeckForm from '../components/DeckForm';


const Decks = () => {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Function to get all sets
  const fetchDecks = async () => {
    try {
      const res = await api.get('/decks');
      setDecks(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error receiving sets:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecks();
  }, []);

  // This function will be called when DeckForm successfully creates a new deck.
  const handleDeckCreated = (newDeck) => {
    setDecks([...decks, newDeck]);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div >
      <h1>My card sets</h1>
      
      {/* Form of creation */}
      <DeckForm onDeckCreated={handleDeckCreated} />

      {/* List of collections */}
      <div>
        {decks.length === 0 ? (
          <p>There are no collections yet. Be the first to create one!</p>
        ) : (
          decks.map((deck) => (
            <div key={deck._id}>
              <h3>{deck.title}</h3>
              <p>{deck.description}</p>
              <button onClick={() => navigate(`/decks/${deck._id}`)}>Open set / Learn</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Decks;