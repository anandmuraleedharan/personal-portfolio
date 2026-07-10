// Phrase Assembler sentence builder component
import { phrases } from '../data.js';
import { GamificationEngine } from '../gamification.js';
import { AudioEngine } from '../audio.js';

export function mountPhraseAssembler(container, navigateToTab, triggerToast) {
  let activePhraseIdx = 0;
  let activePhrase = phrases[activePhraseIdx];
  
  let poolChips = []; // Chips available to choose from
  let placedChips = []; // Chips placed in the sentence builder
  
  function initUI() {
    activePhrase = phrases[activePhraseIdx];
    placedChips = [];
    
    // Create pool chips (correct words + distractors)
    const correctWords = activePhrase.words.map(w => ({ ...w, isDistractor: false }));
    const distractors = activePhrase.distractors.map(text => ({ text, translit: "", meaning: "distractor", isDistractor: true }));
    
    // Mix and shuffle
    poolChips = [...correctWords, ...distractors]
      .map((chip, idx) => ({ ...chip, uid: `chip_${idx}`, used: false }))
      .sort(() => 0.5 - Math.random());

    const html = `
      <div class="assembler-container glass-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; width: 100%;">
          <h2 class="section-title" style="margin-bottom: 0;">Sentence Builder</h2>
          <select id="phraseSelect" class="btn" style="width: auto; padding: 0.4rem 1rem;">
            ${phrases.map((p, idx) => `
              <option value="${idx}" ${idx === activePhraseIdx ? 'selected' : ''}>
                Phrase ${idx + 1}: ${p.english}
              </option>
            `).join('')}
          </select>
        </div>

        <div class="assembler-question">
          <p style="color: var(--color-text-muted); font-size: 0.95rem; margin-bottom: 0.5rem;">Translate the English sentence:</p>
          <div class="target-sentence">"${activePhrase.english}"</div>
        </div>

        <!-- Placed chips area -->
        <div style="width: 100%;">
          <p style="color: var(--color-text-muted); font-size: 0.85rem; margin-bottom: 0.5rem; text-align: center;">Tap chips below to build the translation:</p>
          <div id="placedChipsArea" class="placed-chips-area">
            <!-- Selected chips will show here -->
          </div>
        </div>

        <!-- Available chips pool -->
        <div id="wordPool" class="word-pool">
          <!-- Pool chips will show here -->
        </div>

        <div id="chipDescription" style="min-height: 40px; text-align: center; color: var(--color-gold-light); font-size: 0.9rem; font-weight: 600;">
          <!-- Hover/select helper details -->
        </div>

        <div class="assembler-actions">
          <button id="resetAssemblerBtn" class="btn">Reset</button>
          <button id="checkAssemblerBtn" class="btn btn-primary">Check Answer</button>
          <button id="nextPhraseBtn" class="btn btn-primary" style="display: none;">Next Phrase →</button>
        </div>
      </div>
    `;

    container.innerHTML = html;

    // Attach UI Listeners
    container.querySelector('#phraseSelect').addEventListener('change', (e) => {
      AudioEngine.playClick();
      activePhraseIdx = parseInt(e.target.value);
      initUI();
    });

    container.querySelector('#resetAssemblerBtn').addEventListener('click', () => {
      AudioEngine.playClick();
      initUI();
    });

    container.querySelector('#checkAssemblerBtn').addEventListener('click', () => {
      AudioEngine.playClick();
      checkAnswer();
    });

    container.querySelector('#nextPhraseBtn').addEventListener('click', () => {
      AudioEngine.playClick();
      if (activePhraseIdx < phrases.length - 1) {
        activePhraseIdx++;
        initUI();
      } else {
        triggerToast("🎉 You've solved all sentence puzzles! Returning to Dashboard.");
        navigateToTab('dashboard');
      }
    });

    renderChips();
  }

  function renderChips() {
    const placedContainer = container.querySelector('#placedChipsArea');
    const poolContainer = container.querySelector('#wordPool');

    // Render Placed Chips
    if (placedChips.length === 0) {
      placedContainer.innerHTML = `<span style="color: rgba(255,255,255,0.15); font-size: 0.95rem; font-style: italic;">Tap words to insert...</span>`;
    } else {
      placedContainer.innerHTML = placedChips.map(chip => `
        <button class="word-chip" data-uid="${chip.uid}">
          ${chip.text}
        </button>
      `).join('');

      // Click placed chip to return it
      placedContainer.querySelectorAll('.word-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          AudioEngine.playClick();
          const uid = btn.getAttribute('data-uid');
          removePlacedChip(uid);
        });
        btn.addEventListener('mouseenter', () => showChipDetails(btn.getAttribute('data-uid')));
      });
    }

    // Render Pool Chips
    poolContainer.innerHTML = poolChips.map(chip => `
      <button class="word-chip ${chip.used ? 'selected' : ''}" data-uid="${chip.uid}">
        ${chip.text}
      </button>
    `).join('');

    // Click pool chip to select it
    poolContainer.querySelectorAll('.word-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const uid = btn.getAttribute('data-uid');
        const chip = poolChips.find(c => c.uid === uid);
        if (!chip.used) {
          AudioEngine.playClick();
          addPlacedChip(uid);
        }
      });
      btn.addEventListener('mouseenter', () => showChipDetails(btn.getAttribute('data-uid')));
    });
  }

  function addPlacedChip(uid) {
    const chip = poolChips.find(c => c.uid === uid);
    chip.used = true;
    placedChips.push(chip);
    renderChips();
  }

  function removePlacedChip(uid) {
    const chipIndex = placedChips.findIndex(c => c.uid === uid);
    if (chipIndex !== -1) {
      const chip = placedChips[chipIndex];
      chip.used = false;
      placedChips.splice(chipIndex, 1);
    }
    renderChips();
  }

  function showChipDetails(uid) {
    const chip = poolChips.find(c => c.uid === uid);
    const desc = container.querySelector('#chipDescription');
    if (chip && chip.translit) {
      desc.innerHTML = `Pronunciation: <strong>${chip.translit}</strong> &nbsp;•&nbsp; Meaning: <strong>${chip.meaning}</strong>`;
    } else if (chip && chip.isDistractor) {
      desc.innerHTML = `Meaning: <em>Distractor Word</em>`;
    }
  }

  function checkAnswer() {
    const state = GamificationEngine.getState();
    if (state.hearts <= 0) {
      triggerToast("💔 You have no hearts left! Spend XP or click refill to continue.");
      return;
    }

    // Join placed chips text
    const answer = placedChips.map(c => c.text).join(' ');
    
    // Clean strings (remove trailing question marks or punctuation for check)
    const cleanStr = (str) => str.replace(/[?.,!]/g, '').trim();

    if (cleanStr(answer) === cleanStr(activePhrase.malayalam)) {
      // CORRECT!
      AudioEngine.playSuccess();
      
      const result = GamificationEngine.completePhrase(activePhrase.id);
      
      if (result.leveledUp) {
        setTimeout(() => {
          AudioEngine.playLevelUp();
          triggerToast(`✨ LEVEL UP! You reached Level ${result.newLevel}! 🥳`);
        }, 800);
      } else {
        triggerToast("🎉 Correct Sentence! +15 XP");
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

      // Lock chips and reveal "Next" button
      container.querySelector('#checkAssemblerBtn').style.display = 'none';
      container.querySelector('#resetAssemblerBtn').style.display = 'none';
      container.querySelector('#nextPhraseBtn').style.display = 'block';

      // Mark placed area green
      const placedArea = container.querySelector('#placedChipsArea');
      placedArea.style.borderColor = 'var(--color-primary-light)';
      placedArea.style.background = 'rgba(42, 85, 55, 0.15)';
      
      container.querySelectorAll('.placed-chips-area .word-chip').forEach(chip => {
        chip.style.borderColor = 'var(--color-primary-light)';
        chip.style.color = 'var(--color-primary-light)';
        chip.style.pointerEvents = 'none';
      });
    } else {
      // INCORRECT
      AudioEngine.playFailure();
      const remainingHearts = GamificationEngine.loseHeart();

      // Shake placed chips area
      const placedArea = container.querySelector('#placedChipsArea');
      placedArea.style.borderColor = 'var(--color-coral)';
      placedArea.classList.add('incorrect');
      
      setTimeout(() => {
        placedArea.style.borderColor = 'var(--color-border)';
        placedArea.classList.remove('incorrect');
      }, 500);

      if (remainingHearts <= 0) {
        triggerToast("💔 Heart empty! Return to dashboard to practice.");
        setTimeout(() => navigateToTab('dashboard'), 1500);
      } else {
        triggerToast(`❌ Incorrect word order! Try again. (${remainingHearts} ❤️ left)`);
      }
    }
  }

  // Load component
  initUI();
}
