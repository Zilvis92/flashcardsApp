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
    <>
      <Navbar />
      <div className="container">
        <header className="mb-2">
          <h1>My card sets</h1>
        </header>

        <DeckForm onDeckCreated={handleDeckCreated} />

        <div className="grid">
          {decks.map((deck) => (
            <div key={deck._id} className="card">
              <div>
                <h3 className="card-title">{deck.title}</h3>
                <p className="card-text">{deck.description}</p>
              </div>
              <button className="btn btn-primary btn-full" onClick={() => navigate(`/decks/${deck._id}`)}>
                Open set / Learn
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Decks;