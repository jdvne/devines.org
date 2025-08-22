import { useState } from 'react';
import { Helmet } from "react-helmet";

import styles from './Slots.module.css';

const EMOJIS = ['🍎', '🍊', '🍋', '🍇', '🍓', '🍑', '🍒', '🥭', '🍍', '🥥', '🥝', '🍉', '🍈', '🍌', '🍐', '🍏'];

export function Slots() {
  const [slots, setSlots] = useState(Array(5).fill(null).map(() => ({ emoji: '❓', locked: false })));
  const [isSpinning, setIsSpinning] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [pulls, setPulls] = useState(0);
  const [showShare, setShowShare] = useState(false);

  const spinSlots = () => {
    if (isSpinning || gameWon) return;
    
    setIsSpinning(true);
    setPulls(prev => prev + 1);
    
    // Simulate spinning animation
    setTimeout(() => {
      const newSlots = slots.map(slot => 
        slot.locked ? slot : { ...slot, emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)] }
      );
      setSlots(newSlots);
      setIsSpinning(false);
      
      // Check for win condition
      const firstEmoji = newSlots[0].emoji;
      if (newSlots.every(slot => slot.emoji === firstEmoji)) {
        setGameWon(true);
        setShowShare(true);
      }
    }, 1000);
  };

  const toggleLock = (index) => {
    if (isSpinning || gameWon || pulls === 0) return;
    
    setSlots(prev => prev.map((slot, i) => 
      i === index ? { ...slot, locked: !slot.locked } : slot
    ));
  };

  const resetGame = () => {
    setSlots(Array(5).fill(null).map(() => ({ emoji: '❓', locked: false })));
    setIsSpinning(false);
    setGameWon(false);
    setPulls(0);
    setShowShare(false);
  };

  const shareResult = () => {
    const shareText = `🎰 I hit the jackpot in ${pulls} pulls!\n ${slots.map(slot => slot.emoji).join(' ')}\n\nHit the slots at devines.org/slots`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Slots Game Result',
        text: shareText,
        url: 'https://devines.org/slots'
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Result copied to clipboard!');
    }
  };

  return (
    <div className={styles.slotsPage}>
      <Helmet bodyAttributes={{ class: styles.body }}>
        <title>hit the slots - Joshua Devine</title>
      </Helmet>
      
      <div className={styles.slotsContainer}>
        <h1 className={styles.slotsTitle}>🎰 hit the slots 🎰</h1>
        <div className={styles.slotsHorizontalBar}></div>
        
        <div className={styles.gameInfo}>
          <p>Pull the lever until you get 5 matching emojis in a row!</p>
          <p>Click on a slot to lock it in place {pulls === 0 && "(after first pull)"}.</p>
        </div>

        <div className={styles.pullsCounter}>{pulls}</div>
        
        <div className={styles.slotMachine}>
          <div className={styles.slotsDisplay}>
            {slots.map((slot, index) => (
              <div 
                key={index} 
                className={`${styles.slot} ${slot.locked ? styles.locked : ''} ${isSpinning && !slot.locked ? styles.spinning : ''} ${pulls === 0 ? styles.disabled : ''}`}
                onClick={() => toggleLock(index)}
              >
                <div className={styles.emoji}>{slot.emoji}</div>
                {slot.locked && <div className={styles.lockIcon}>🔒</div>}
              </div>
            ))}
          </div>
          
          <div className={styles.leverContainer}>
            <button 
              className={`${styles.lever} ${isSpinning ? styles.spinning : ''}`}
              onClick={spinSlots}
              disabled={isSpinning || gameWon}
              title="Pull Lever"
              aria-label="Pull lever to spin slots"
            />
          </div>
        </div>

        <div className={styles.controls}>
          
          {gameWon && (
            <button className={styles.resetButton} onClick={resetGame}>
              🎉 Play Again 🎉
            </button>
          )}
        </div>

        {gameWon && (
          <div className={styles.winMessage}>
            <h2>🎉 JACKPOT! 🎉</h2>
            <p>You won in {pulls} pulls!</p>
            <div className={styles.winningCombo}>
              {slots.map((slot, index) => (
                <span key={index} className={styles.winEmoji}>{slot.emoji}</span>
              ))}
            </div>
          </div>
        )}

        {showShare && (
          <div className={styles.shareSection}>
            <button className={styles.shareButton} onClick={shareResult}>
              📤 Share Result
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
