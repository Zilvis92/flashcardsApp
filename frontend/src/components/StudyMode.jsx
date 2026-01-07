import React, { useState } from 'react';
import api from '../api/client';

const StudyMode = ({ cards, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // We filter only those cards that have not yet been mastered (mastered: false)
  const unmasteredCards = cards.filter(card => !card.mastered);

  if (unmasteredCards.length === 0) {
    return (
      <div className="card text-center">
        <h3>🎉 Congratulations!</h3>
        <p className="mt-1">All cards in this collection have already been learned.</p>
        <button onClick={onFinish} className="btn btn-primary mt-1">Go back</button>
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
      <div className="progress-bar">
        Card {currentIndex + 1} from {unmasteredCards.length}
      </div>

      <div 
        className={`flashcard-wrapper ${isFlipped ? 'is-flipped' : ''}`} 
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className="card-face">
          {currentCard.front_side}
        </div>
        <div className="card-face card-face-back">
          {currentCard.back_side}
        </div>
      </div>

      <p className="hint-text">
        Click on the card to turn it over
      </p>
      {currentCard.hint && !isFlipped && (
        <p className="text-center fs-sm mt-1">💡 Hint: {currentCard.hint}</p>
      )}

      <div className="study-actions">
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