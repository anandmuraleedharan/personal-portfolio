// Leitner SRS Flashcards Component
import { vocabulary } from '../data.js';
import { GamificationEngine } from '../gamification.js';
import { AudioEngine } from '../audio.js';

export function mountFlashcards(container, navigateToTab, triggerToast) {
  let activeIndex = 0;
  let isFlipped = false;
  
  // Load state and build combined vocabulary (offline base + user custom words)
  const state = GamificationEngine.getState();
  const customVocab = state.customVocabulary || [];
  const activeVocab = [...vocabulary, ...customVocab];

  if (!state.leitnerBoxes) {
    state.leitnerBoxes = {};
  }
  
  activeVocab.forEach(word => {
    if (!state.leitnerBoxes[word.id]) {
      state.leitnerBoxes[word.id] = 1; // default Box 1
    }
  });

  function saveLeitnerBoxes() {
    const currentState = GamificationEngine.getState();
    currentState.leitnerBoxes = state.leitnerBoxes;
    GamificationEngine.addXP(0); // Trigger save state
  }

  function initUI() {
    isFlipped = false;
    
    if (activeVocab.length === 0) {
      container.innerHTML = `
        <div class="flashcards-container glass-card">
          <h2 class="section-title">Spaced Repetition Flashcards</h2>
          <p style="text-align: center; color: var(--color-text-muted); padding: 2rem;">
            No cards available to study. Check back or search custom words in the Dashboard!
          </p>
        </div>
      `;
      return;
    }

    const word = activeVocab[activeIndex];
    const boxLevel = state.leitnerBoxes[word.id] || 1;

    const html = `
      <div class="flashcards-container glass-card">
        <h2 class="section-title" style="width: 100%;">Spaced Repetition Flashcards</h2>
        
        <p style="color: var(--color-text-muted); font-size: 0.9rem; text-align: center; margin-bottom: 1.5rem;">
          Flip the card to review translations. Grade your memory to schedule review frequency.
        </p>

        <!-- 3D Card Scene -->
        <div class="card-scene">
          <div class="card-element" id="flashcard">
            <!-- Front Face -->
            <div class="card-face card-face-front">
              <div style="font-size: 0.8rem; text-transform: uppercase; color: var(--color-primary-light); letter-spacing: 2px; margin-bottom: 2rem;">
                Malayalam Word
              </div>
              <div class="card-word-malayalam">${word.malayalam}</div>
              <div class="card-word-phonetic">"${word.phonetic}"</div>
              
              <!-- Leitner Box indicator -->
              <div style="margin-top: 3rem; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                <span style="font-size: 0.75rem; color: var(--color-text-muted);">SRS Mastery Box:</span>
                <div class="leitner-boxes">
                  <div class="leitner-dot ${boxLevel >= 1 ? 'active' : ''}"></div>
                  <div class="leitner-dot ${boxLevel >= 2 ? 'active' : ''}"></div>
                  <div class="leitner-dot ${boxLevel >= 3 ? 'active' : ''}"></div>
                </div>
              </div>
            </div>

            <!-- Back Face -->
            <div class="card-face card-face-back">
              <div style="font-size: 0.8rem; text-transform: uppercase; color: var(--color-gold); letter-spacing: 2px; margin-bottom: 1.5rem;">
                Translation
              </div>
              <div class="card-word-english">${word.english}</div>
              <p style="font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 0.25rem;">Pronunciation:</p>
              <p style="font-size: 1.1rem; font-weight: 700; color: var(--color-primary-light); margin-bottom: 1.5rem;">${word.phonetic}</p>
              
              <div class="card-word-example" style="border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 1rem; width: 100%;">
                <span style="color: var(--color-gold-light); font-weight: 700;">Category:</span> ${word.category}
              </div>
            </div>
          </div>
        </div>

        <!-- Rating controls (revealed after flip) -->
        <div id="ratingControls" style="display: flex; gap: 1rem; width: 100%; max-width: 320px; height: 48px; opacity: 0; pointer-events: none; transition: opacity 0.3s ease;">
          <button id="againBtn" class="btn" style="border-color: var(--color-coral); color: var(--color-coral-light); font-size: 0.85rem;">
            🔴 Study Again (Box 1)
          </button>
          <button id="knowBtn" class="btn btn-primary" style="background: var(--color-primary); border-color: var(--color-primary); font-size: 0.85rem;">
            🟢 I Know It (+1 Box)
          </button>
        </div>

        <!-- Pagination Controls -->
        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; max-width: 320px; margin-top: 1rem;">
          <button id="prevCardBtn" class="btn" style="padding: 0.5rem 1rem; font-size: 0.85rem;" ${activeIndex === 0 ? 'disabled' : ''}>← Prev</button>
          <span class="pagination-info" style="font-size: 0.9rem; color: var(--color-text-muted); font-weight: 600;">
            Card ${activeIndex + 1} of ${activeVocab.length}
          </span>
          <button id="nextCardBtn" class="btn" style="padding: 0.5rem 1rem; font-size: 0.85rem;" ${activeIndex === activeVocab.length - 1 ? 'disabled' : ''}>Next →</button>
        </div>
      </div>
    `;

    container.innerHTML = html;

    // Attach card flip handler
    const cardEl = container.querySelector('#flashcard');
    if (cardEl) {
      cardEl.addEventListener('click', toggleFlip);
    }

    // Attach button handlers
    const prevBtn = container.querySelector('#prevCardBtn');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (activeIndex > 0) {
          AudioEngine.playClick();
          activeIndex--;
          initUI();
        }
      });
    }

    const nextBtn = container.querySelector('#nextCardBtn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (activeIndex < activeVocab.length - 1) {
          AudioEngine.playClick();
          activeIndex++;
          initUI();
        }
      });
    }

    const againBtn = container.querySelector('#againBtn');
    if (againBtn) {
      againBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        AudioEngine.playClick();
        state.leitnerBoxes[word.id] = 1; // Send back to Box 1
        saveLeitnerBoxes();
        triggerToast("🔁 Scheduled for frequent review (Box 1)");
        
        // Auto advance to next card after short delay
        setTimeout(() => {
          if (activeIndex < activeVocab.length - 1) {
            activeIndex++;
            initUI();
          } else {
            toggleFlip();
          }
        }, 500);
      });
    }

    const knowBtn = container.querySelector('#knowBtn');
    if (knowBtn) {
      knowBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        AudioEngine.playClick();
        const currentBox = state.leitnerBoxes[word.id] || 1;
        state.leitnerBoxes[word.id] = Math.min(currentBox + 1, 3); // Level up to max Box 3
        saveLeitnerBoxes();
        
        // Earn a small amount of XP for learning!
        const xpResult = GamificationEngine.addXP(2);
        triggerToast("✅ Mastery updated! Card scheduled less frequently. +2 XP");
        
        if (xpResult.leveledUp) {
          setTimeout(() => {
            AudioEngine.playLevelUp();
            triggerToast(`✨ LEVEL UP! You reached Level ${xpResult.newLevel}! 🥳`);
          }, 800);
        }

        // Auto advance
        setTimeout(() => {
          if (activeIndex < activeVocab.length - 1) {
            activeIndex++;
            initUI();
          } else {
            toggleFlip();
          }
        }, 500);
      });
    }
  }

  function toggleFlip() {
    isFlipped = !isFlipped;
    const cardEl = container.querySelector('#flashcard');
    const controls = container.querySelector('#ratingControls');

    if (isFlipped) {
      cardEl.classList.add('is-flipped');
      controls.style.opacity = '1';
      controls.style.pointerEvents = 'auto';
      // Speak the word on flip back
      const word = activeVocab[activeIndex];
      AudioEngine.speak(word.malayalam, word.phonetic);
    } else {
      cardEl.classList.remove('is-flipped');
      controls.style.opacity = '0';
      controls.style.pointerEvents = 'none';
    }
  }

  // Load component
  initUI();
}
