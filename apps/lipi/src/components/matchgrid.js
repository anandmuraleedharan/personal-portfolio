// Match Grid & Time Attack Component
import { vocabulary } from '../data.js';
import { GamificationEngine } from '../gamification.js';
import { AudioEngine } from '../audio.js';

export function mountMatchGrid(container, navigateToTab, triggerToast) {
  let isTimeAttack = false;
  let activeCards = [];
  let selectedCard = null;
  let matchesCount = 0; // Correct matches in current session
  
  // Timer State for Time Attack
  let timerInterval = null;
  let timeLeft = 30; // 30 seconds start
  const maxTime = 30;
  
  function initUI() {
    // Clear any timers
    if (timerInterval) clearInterval(timerInterval);
    
    selectedCard = null;
    matchesCount = 0;
    
    // Generate card list
    activeCards = generateMatchPairs();

    const html = `
      <div class="matchgrid-container glass-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h2 class="section-title" style="margin-bottom: 0;">Vocabulary Match Grid</h2>
            <p style="color: var(--color-text-muted); font-size: 0.9rem; margin-top: 0.25rem;">
              Select a Malayalam card and its corresponding English meaning card to match.
            </p>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button id="stdModeBtn" class="btn ${!isTimeAttack ? 'btn-primary' : ''}" style="padding: 0.4rem 1rem; font-size: 0.85rem;">Standard</button>
            <button id="timeAttackModeBtn" class="btn ${isTimeAttack ? 'btn-primary' : ''}" style="padding: 0.4rem 1rem; font-size: 0.85rem;">⚡ Time Attack</button>
          </div>
        </div>

        ${isTimeAttack ? `
          <div class="time-attack-header">
            <span style="font-weight: 700; color: var(--color-gold-light);">Timer: <span id="timerLabel">30</span>s</span>
            <span style="font-weight: 700; color: var(--color-primary-light);">Matches: <span id="matchCounter">0</span></span>
          </div>
          <div class="timer-bar-container">
            <div id="timerBar" class="timer-bar"></div>
          </div>
        ` : ''}

        <div class="match-grid" id="gridContainer">
          <!-- Cards rendered here -->
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 2rem;">
          <button id="resetMatchBtn" class="btn" style="width: auto;">Shuffle / Reset</button>
          <button id="exitMatchBtn" class="btn btn-primary" style="width: auto;">Finish Activity</button>
        </div>
      </div>
    `;

    container.innerHTML = html;

    // Attach Listeners
    container.querySelector('#stdModeBtn').addEventListener('click', () => {
      if (isTimeAttack) {
        AudioEngine.playClick();
        isTimeAttack = false;
        initUI();
      }
    });

    container.querySelector('#timeAttackModeBtn').addEventListener('click', () => {
      if (!isTimeAttack) {
        AudioEngine.playClick();
        isTimeAttack = true;
        initUI();
      }
    });

    container.querySelector('#resetMatchBtn').addEventListener('click', () => {
      AudioEngine.playClick();
      initUI();
    });

    container.querySelector('#exitMatchBtn').addEventListener('click', () => {
      AudioEngine.playClick();
      if (timerInterval) clearInterval(timerInterval);
      
      if (isTimeAttack && matchesCount > 0) {
        // Distribute final XP for Time Attack matches
        const xpEarned = matchesCount * 5;
        const result = GamificationEngine.addXP(xpEarned);
        triggerToast(`⚡ Time Attack Complete! You matched ${matchesCount} pairs and earned +${xpEarned} XP!`);
        if (result.leveledUp) {
          setTimeout(() => {
            AudioEngine.playLevelUp();
            triggerToast(`✨ LEVEL UP! You reached Level ${result.newLevel}! 🥳`);
          }, 800);
        }
      }
      navigateToTab('dashboard');
    });

    renderCards();

    if (isTimeAttack) {
      startTimeAttack();
    }
  }

  // Generate 4 random words (8 cards total)
  function generateMatchPairs() {
    const state = GamificationEngine.getState();
    const customVocab = state.customVocabulary || [];
    const activeVocab = [...vocabulary, ...customVocab];
    
    // Shuffle active vocabulary list
    const shuffledVocab = [...activeVocab].sort(() => 0.5 - Math.random());
    // Pick 4 words
    const selectedWords = shuffledVocab.slice(0, 4);
    
    // Create card items
    const cards = [];
    selectedWords.forEach(word => {
      cards.push({
        id: `${word.id}_ml`,
        wordId: word.id,
        text: word.malayalam,
        isMalayalam: true,
        matched: false
      });
      cards.push({
        id: `${word.id}_en`,
        wordId: word.id,
        text: word.english,
        isMalayalam: false,
        matched: false
      });
    });

    // Shuffle the 8 cards
    return cards.sort(() => 0.5 - Math.random());
  }

  function renderCards() {
    const grid = container.querySelector('#gridContainer');
    grid.innerHTML = activeCards.map(card => `
      <div class="match-card ${card.isMalayalam ? 'malayalam-card' : ''} ${card.matched ? 'matched' : ''}" 
           data-id="${card.id}" 
           data-wordid="${card.wordId}">
        ${card.text}
      </div>
    `).join('');

    // Attach click events
    grid.querySelectorAll('.match-card').forEach(cardEl => {
      cardEl.addEventListener('click', () => handleCardClick(cardEl));
    });
  }

  function handleCardClick(cardEl) {
    const state = GamificationEngine.getState();
    if (state.hearts <= 0) {
      triggerToast("💔 You have no hearts left! Spend XP or click refill to continue.");
      return;
    }

    const cardId = cardEl.getAttribute('data-id');
    const wordId = cardEl.getAttribute('data-wordid');
    const cardObj = activeCards.find(c => c.id === cardId);

    if (cardObj.matched) return; // Skip completed cards
    AudioEngine.playClick();

    // If card is already selected, deselect it
    if (selectedCard && selectedCard.id === cardId) {
      cardEl.classList.remove('selected');
      selectedCard = null;
      return;
    }

    // Mark as selected
    cardEl.classList.add('selected');

    if (!selectedCard) {
      // First card selected
      selectedCard = cardObj;
    } else {
      // Second card selected - check match
      const secondCard = cardObj;
      const firstCard = selectedCard;

      const firstEl = container.querySelector(`[data-id="${firstCard.id}"]`);
      const secondEl = cardEl;

      if (firstCard.wordId === secondCard.wordId && firstCard.isMalayalam !== secondCard.isMalayalam) {
        // MATCH SUCCESS!
        firstCard.matched = true;
        secondCard.matched = true;
        matchesCount++;

        firstEl.classList.remove('selected');
        secondEl.classList.remove('selected');
        firstEl.classList.add('matched');
        secondEl.classList.add('matched');

        AudioEngine.playMatch();
        selectedCard = null;

        if (isTimeAttack) {
          // Time Attack mode: gain 3 seconds, update counter
          timeLeft = Math.min(timeLeft + 3, maxTime);
          container.querySelector('#matchCounter').textContent = matchesCount;
          updateTimerBar();
          
          // If all 4 pairs matched, load 4 new pairs immediately to keep playing!
          if (activeCards.every(c => c.matched)) {
            setTimeout(() => {
              activeCards = generateMatchPairs();
              renderCards();
            }, 400);
          }
        } else {
          // Standard mode: complete gamification steps
          const result = GamificationEngine.incrementVocabularyMatch();
          
          // Earned heart back on correct matching (practice loop!)
          if (state.hearts < 5) {
            GamificationEngine.gainHeart();
            triggerToast("💖 Correct match! Earned +1 Heart back.");
          }

          if (result.leveledUp) {
            setTimeout(() => {
              AudioEngine.playLevelUp();
              triggerToast(`✨ LEVEL UP! You reached Level ${result.newLevel}! 🥳`);
            }, 800);
          }

          // Check for newly unlocked achievements
          if (result.newBadges && result.newBadges.length > 0) {
            result.newBadges.forEach(badge => {
              setTimeout(() => {
                AudioEngine.playLevelUp();
                triggerToast(`🏆 Achievement Unlocked: ${badge.title}!`);
              }, 1200);
            });
          }

          // If all standard matches completed
          if (activeCards.every(c => c.matched)) {
            triggerToast("🎉 You matched all words! Nice practice.");
          }
        }
      } else {
        // MISMATCH FAILURE
        firstEl.classList.remove('selected');
        secondEl.classList.remove('selected');
        
        firstEl.classList.add('incorrect');
        secondEl.classList.add('incorrect');

        AudioEngine.playFailure();
        selectedCard = null;

        const remainingHearts = GamificationEngine.loseHeart();

        // Shake and clean highlight after animation
        setTimeout(() => {
          firstEl.classList.remove('incorrect');
          secondEl.classList.remove('incorrect');
        }, 500);

        if (remainingHearts <= 0) {
          if (timerInterval) clearInterval(timerInterval);
          triggerToast("💔 Heart empty! Return to dashboard to practice.");
          setTimeout(() => navigateToTab('dashboard'), 1500);
        } else {
          triggerToast(`❌ Incorrect match! (${remainingHearts} ❤️ left)`);
        }
      }
    }
  }

  // Timer runner for Time Attack
  function startTimeAttack() {
    timeLeft = maxTime;
    updateTimerBar();

    timerInterval = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        timeLeft = 0;
        updateTimerBar();
        handleTimeAttackEnd();
      } else {
        container.querySelector('#timerLabel').textContent = timeLeft;
        updateTimerBar();
      }
    }, 1000);
  }

  function updateTimerBar() {
    const bar = container.querySelector('#timerBar');
    if (bar) {
      const percentage = (timeLeft / maxTime) * 100;
      bar.style.width = `${percentage}%`;
      if (timeLeft <= 8) {
        bar.style.background = 'var(--color-coral)';
      } else {
        bar.style.background = 'linear-gradient(90deg, var(--color-primary), var(--color-gold))';
      }
    }
  }

  function handleTimeAttackEnd() {
    // Lock all interactions
    container.querySelectorAll('.match-card').forEach(el => {
      el.style.pointerEvents = 'none';
    });

    const xpEarned = matchesCount * 5;
    const result = GamificationEngine.addXP(xpEarned);
    
    // Play level up if triggered
    if (result.leveledUp) {
      setTimeout(() => {
        AudioEngine.playLevelUp();
        triggerToast(`✨ LEVEL UP! You reached Level ${result.newLevel}! 🥳`);
      }, 1000);
    }

    triggerToast(`⏰ Time's up! You matched ${matchesCount} pairs and earned +${xpEarned} XP!`);
    
    // Wait briefly, then show final stats
    setTimeout(() => {
      initUI(); // reset or give option to exit
    }, 3000);
  }

  // Load component
  initUI();
}
