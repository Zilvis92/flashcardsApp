import React, { useState } from 'react';
import api from '../api/client';

const StudyMode = ({ cards, onFinish, onReset, onCardStatusChange }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // We only filter those that have not yet been learned
  const unmasteredCards = cards.filter(card => !card.mastered);
  
  // If we have any unmastered tracks, we show them; if not, we show all tracks (Review mode).
  const cardsToDisplay = unmasteredCards.length > 0 ? unmasteredCards : cards;

  const handleResetAndRestart = async () => {
    await onReset();
    setCurrentIndex(0); // Back to the first card
    setIsFlipped(false);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex(currentIndex + 1);
  };

  const markAsMastered = async () => {
    const currentCard = cardsToDisplay[currentIndex];
    try {
      await api.put(`/cards/${currentCard._id}/mastered`, { mastered: true });
      
      // We call the parent component function to update the state
      if (onCardStatusChange) {
        onCardStatusChange(currentCard._id, true);
      }
      
      handleNext();
    } catch (err) {
      console.error("Klaida žymint kortelę:", err);
    }
  };

  if (currentIndex >= cardsToDisplay.length) {
    return (
      <div className="card text-center">
        <h3>🎉 All cards viewed!</h3>
        <p className="mt-1">You want to restart the learning cycle?</p>
        <div className="study-actions">
          <button onClick={handleResetAndRestart} className="btn btn-primary">
            Reset and Repeat 🔄
          </button>
          <button onClick={onFinish} className="btn btn-outline">Finish</button>
        </div>
      </div>
    );
  }

  const currentCard = cardsToDisplay[currentIndex];

  return (
    <div className="study-container">
      <div className="progress-bar">
        Card {currentIndex + 1} from {cardsToDisplay.length}
        {unmasteredCards.length === 0 && "(View mode)"}
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

      <p className="hint-text">Tap on the card to flip it over</p>
      
      {currentCard.hint && !isFlipped && (
        <p className="text-center fs-sm mt-1">💡 Hint: {currentCard.hint}</p>
      )}

      <div className="study-actions">
        <button onClick={handleNext} className="btn btn-outline">
          {currentIndex === cardsToDisplay.length - 1 ? 'Finish' : 'Next card'}
        </button>
        
        {!currentCard.mastered && (
          <button onClick={markAsMastered} className="btn btn-success">
            learned ✅
          </button>
        )}
      </div>
    </div>
  );
};

export default StudyMode;