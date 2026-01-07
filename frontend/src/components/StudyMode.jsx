import React, { useState } from 'react';
import api from '../api/client';

const StudyMode = ({ cards, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // We filter only those cards that have not yet been mastered (mastered: false)
  const unmasteredCards = cards.filter(card => !card.mastered);

  if (unmasteredCards.length === 0) {
    return (
      <div className="card-item text-center">
        <h3>🎉 Congratulations!</h3>
        <p>All cards in this collection have already been learned.</p>
        <button onClick={onFinish} className="btn btn-primary">Go back</button>
      </div>
    );
  }

  const currentCard = unmasteredCards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < unmasteredCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert("You have gone through all the unfinished cards!");
      onFinish();
    }
  };

  const markAsMastered = async () => {
    try {
      // We send a PUT request to your backend
      await api.put(`/cards/${currentCard._id}/mastered`, { mastered: true });
      handleNext();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div className="study-container">
      <div className="progress-bar mb-1">
        Card {currentIndex + 1} iš {unmasteredCards.length}
      </div>

      <div 
        className={`flashcard ${isFlipped ? 'flipped' : ''}`} 
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {isFlipped ? currentCard.back_side : currentCard.front_side}
      </div>

      <p className="mt-1">
        Click on the card to turn it over
      </p>

      <div className="grid mt-2">
        <button onClick={handleNext} className="btn btn-outline">
          Next card
        </button>
        <button onClick={markAsMastered} className="btn btn-success">
          I know / Learned ✅
        </button>
      </div>
    </div>
  );
};

export default StudyMode;