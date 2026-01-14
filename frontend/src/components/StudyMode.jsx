import React, { useState } from 'react';
import api from '../api/client';

const StudyMode = ({ cards, onFinish, onReset }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // LOGIKA: Jei yra neišmoktų kortelių, mokomės tik jas. 
  // Jei visos išmoktos, rodome visas (Review režimas).
  const unmasteredCards = cards.filter(card => !card.mastered);
  const cardsToDisplay = unmasteredCards.length > 0 ? unmasteredCards : cards;

  // Jei rinkinyje išvis nėra kortelių (apsauga)
  if (cards.length === 0) {
    return (
      <div className="card text-center">
        <h3>Empty Deck</h3>
        <button onClick={onFinish} className="btn btn-primary mt-1">Go back</button>
      </div>
    );
  }

  // Patikriname, ar ką tik baigėme paskutinę kortelę
  if (currentIndex >= cardsToDisplay.length) {
    return (
      <div className="card text-center">
        <h3>🎉 Session Finished!</h3>
        <p className="mt-1">You've gone through all available cards.</p>
        <div className="study-actions">
          <button onClick={onReset} className="btn btn-primary">Reset Progress 🔄</button>
          <button onClick={onFinish} className="btn btn-outline">Exit</button>
        </div>
      </div>
    );
  }

  const currentCard = cardsToDisplay[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex(currentIndex + 1);
  };

  const markAsMastered = async () => {
    try {
      await api.put(`/cards/${currentCard._id}/mastered`, { mastered: true });
      handleNext();
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="study-container">
      <div className="progress-bar">
        Card {currentIndex + 1} from {cardsToDisplay.length}
        {unmasteredCards.length === 0 && " (Review Mode)"}
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

      <p className="hint-text">Click on the card to turn it over</p>
      
      {currentCard.hint && !isFlipped && (
        <p className="text-center fs-sm mt-1">💡 Hint: {currentCard.hint}</p>
      )}

      <div className="study-actions">
        <button onClick={handleNext} className="btn btn-outline">
          {currentIndex === cardsToDisplay.length - 1 ? 'Finish' : 'Next card'}
        </button>
        
        {/* Rodome „Learned“ mygtuką tik jei kortelė dar nėra išmokta */}
        {!currentCard.mastered && (
          <button onClick={markAsMastered} className="btn btn-success">
            I know / Learned ✅
          </button>
        )}
      </div>
    </div>
  );
};

export default StudyMode;