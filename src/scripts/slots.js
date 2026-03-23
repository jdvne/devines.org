const EMOJIS = ['🍎','🍊','🍋','🍇','🍓','🍑','🍒','🥭','🍍','🥥','🥝','🍉','🍈','🍌','🍐','🍏'];

let slots = Array(5).fill(null).map(() => ({ emoji: '❓', locked: false }));
let isSpinning = false;
let gameWon = false;
let pulls = 0;

const slotEls = Array.from(document.querySelectorAll('.slot'));
const lever = document.getElementById('lever');
const pullsCounter = document.getElementById('pulls-counter');
const winMessage = document.getElementById('win-message');
const winPullsText = document.getElementById('win-pulls-text');
const winningCombo = document.getElementById('winning-combo');
const resetBtn = document.getElementById('reset-btn');
const shareBtn = document.getElementById('share-btn');

function render() {
  slotEls.forEach((el, i) => {
    const slot = slots[i];
    const emojiEl = el.querySelector('.emoji');
    emojiEl.textContent = slot.emoji;
    el.classList.toggle('locked', slot.locked);
    el.classList.toggle('disabled', pulls === 0);
    const existing = el.querySelector('.lockIcon');
    if (existing) existing.remove();
    if (slot.locked) {
      const lock = document.createElement('div');
      lock.className = 'lockIcon';
      lock.textContent = '🔒';
      el.appendChild(lock);
    }
  });
  pullsCounter.textContent = String(pulls);
  lever.disabled = isSpinning || gameWon;
  lever.classList.toggle('spinning', isSpinning);
}

slotEls.forEach((el, i) => {
  el.addEventListener('click', () => {
    if (isSpinning || gameWon || pulls === 0) return;
    slots[i].locked = !slots[i].locked;
    render();
  });
});

lever.addEventListener('click', () => {
  if (isSpinning || gameWon) return;
  isSpinning = true;
  pulls++;
  render();

  slotEls.forEach((el, i) => {
    if (!slots[i].locked) el.classList.add('spinning');
  });

  setTimeout(() => {
    slots = slots.map(slot =>
      slot.locked ? slot : { ...slot, emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)] }
    );
    isSpinning = false;
    slotEls.forEach(el => el.classList.remove('spinning'));

    const firstEmoji = slots[0].emoji;
    if (slots.every(s => s.emoji === firstEmoji)) {
      gameWon = true;
      winPullsText.textContent = `You won in ${pulls} pulls!`;
      winningCombo.innerHTML = slots.map(s => `<span class="winEmoji">${s.emoji}</span>`).join('');
      winMessage.hidden = false;
      resetBtn.hidden = false;
      shareBtn.hidden = false;
    }
    render();
  }, 1000);
});

resetBtn.addEventListener('click', () => {
  slots = Array(5).fill(null).map(() => ({ emoji: '❓', locked: false }));
  isSpinning = false;
  gameWon = false;
  pulls = 0;
  winMessage.hidden = true;
  resetBtn.hidden = true;
  shareBtn.hidden = true;
  render();
});

shareBtn.addEventListener('click', () => {
  const shareTitle = `🎰 I hit the jackpot in ${pulls} pulls!`;
  const shareTextResults = slots.map(s => s.emoji).join(' ');
  const shareTextAction = 'hit the slots at devines.org/slots';
  if (navigator.share) {
    navigator.share({ title: shareTitle, text: shareTextResults, url: 'https://devines.org/slots' });
  } else {
    navigator.clipboard.writeText(`${shareTitle}\n${shareTextResults}\n\n${shareTextAction}`);
    alert('Result copied to clipboard!');
  }
});

render();
