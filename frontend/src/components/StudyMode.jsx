import React, { useState } from 'react';
import api from '../api/client';

const StudyMode = ({ cards, onFinish, onReset, onCardStatusChange }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Filtruojame tik tas, kurios dar neišmoktos
  const unmasteredCards = cards.filter(card => !card.mastered);
  
  // Jei turime neišmoktų - rodome jas, jei ne - rodome visas (Review režimas)
  const cardsToDisplay = unmasteredCards.length > 0 ? unmasteredCards : cards;

  // Funkcija, kuri iškviečia reset ir atstato vietinę būseną
  const handleResetAndRestart = async () => {
    await onReset(); // Iškviečiame funkciją iš DeckDetails, kuri atlieka API skambutį
    setCurrentIndex(0); // Grįžtame prie pirmos kortelės
    setIsFlipped(false); // Užtikriname, kad kortelė nebūtų apversta
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex(currentIndex + 1);
  };

  const markAsMastered = async () => {
    const currentCard = cardsToDisplay[currentIndex];
    try {
      await api.put(`/cards/${currentCard._id}/mastered`, { mastered: true });
      
      // Iškviečiame tėvinio komponento funkciją, kad atnaujintų būseną
      if (onCardStatusChange) {
        onCardStatusChange(currentCard._id, true);
      }
      
      handleNext();
    } catch (err) {
      console.error("Klaida žymint kortelę:", err);
    }
  };

  // Pabaigos ekranas
  if (currentIndex >= cardsToDisplay.length) {
    return (
      <div className="card text-center">
        <h3>🎉 Visos kortelės peržiūrėtos!</h3>
        <p className="mt-1">Norite pradėti mokymosi ciklą iš naujo?</p>
        <div className="study-actions">
          {/* Šis mygtukas iškviečia mūsų naują funkciją */}
          <button onClick={handleResetAndRestart} className="btn btn-primary">
            Nunulinti ir Kartoti 🔄
          </button>
          <button onClick={onFinish} className="btn btn-outline">Baigti</button>
        </div>
      </div>
    );
  }

  const currentCard = cardsToDisplay[currentIndex];

  return (
    <div className="study-container">
      <div className="progress-bar">
        Kortelė {currentIndex + 1} iš {cardsToDisplay.length}
        {unmasteredCards.length === 0 && " (Peržiūros režimas)"}
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

      <p className="hint-text">Spauskite ant kortelės, kad ją apverstumėte</p>
      
      {currentCard.hint && !isFlipped && (
        <p className="text-center fs-sm mt-1">💡 Užuomina: {currentCard.hint}</p>
      )}

      <div className="study-actions">
        <button onClick={handleNext} className="btn btn-outline">
          {currentIndex === cardsToDisplay.length - 1 ? 'Baigti' : 'Kita kortelė'}
        </button>
        
        {!currentCard.mastered && (
          <button onClick={markAsMastered} className="btn btn-success">
            Išmokau ✅
          </button>
        )}
      </div>
    </div>
  );
};

export default StudyMode;