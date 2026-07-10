// Cultural Quests & Discovery Cards Component
import { culturalFacts } from '../data.js';
import { GamificationEngine } from '../gamification.js';
import { AudioEngine } from '../audio.js';

export function mountCulturalQuests(container, navigateToTab, triggerToast) {
  const state = GamificationEngine.getState();

  function injectModalStyles() {
    if (document.getElementById('cultural-modal-styles')) return;
    const style = document.createElement('style');
    style.id = 'cultural-modal-styles';
    style.textContent = `
      .cultural-modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(10, 15, 30, 0.8);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      .cultural-modal-backdrop.active {
        opacity: 1;
      }
      .cultural-modal-content {
        background: rgba(18, 25, 50, 0.95);
        border: 1px solid var(--color-gold);
        border-radius: 20px;
        width: 90%;
        max-width: 600px;
        max-height: 85vh;
        overflow-y: auto;
        padding: 2.5rem;
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6), 0 0 25px rgba(255, 215, 0, 0.25);
        transform: scale(0.9);
        transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        position: relative;
        display: flex;
        flex-direction: column;
      }
      .cultural-modal-backdrop.active .cultural-modal-content {
        transform: scale(1);
      }
      .cultural-modal-close-x {
        position: absolute;
        top: 1rem;
        right: 1.25rem;
        font-size: 2rem;
        background: none;
        border: none;
        color: var(--color-text-muted);
        cursor: pointer;
        transition: color var(--transition-fast);
        line-height: 1;
      }
      .cultural-modal-close-x:hover {
        color: var(--color-gold);
      }
      .cultural-modal-body p {
        margin-bottom: 1.25rem;
        font-size: 0.98rem;
        line-height: 1.7;
        color: var(--color-text-muted);
      }
      .cultural-card.unlocked-card {
        cursor: pointer;
        transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.25s, box-shadow 0.25s !important;
      }
      .cultural-card.unlocked-card:hover {
        transform: translateY(-5px) scale(1.02);
        border-color: #ffe066 !important;
        box-shadow: 0 0 25px rgba(255, 224, 102, 0.4) !important;
      }
    `;
    document.head.appendChild(style);
  }

  function openDetailModal(fact) {
    const backdrop = document.createElement('div');
    backdrop.className = 'cultural-modal-backdrop';
    
    const detailsParagraphs = fact.details 
      ? fact.details.split('\n\n').map(p => `<p>${p}</p>`).join('')
      : '<p>Detailed heritage documentation is being prepared for this quest.</p>';

    backdrop.innerHTML = `
      <div class="cultural-modal-content">
        <button class="cultural-modal-close-x" id="closeXBtn">&times;</button>
        <div style="display: flex; align-items: center; gap: 1.25rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--color-border); padding-bottom: 1.25rem;">
          <span style="font-size: 2.8rem; background: rgba(255, 215, 0, 0.1); padding: 0.6rem 0.8rem; border-radius: 12px; border: 1px solid var(--color-gold); display: inline-flex; align-items: center; justify-content: center;">
            ${fact.icon}
          </span>
          <div>
            <span style="font-size: 0.72rem; text-transform: uppercase; color: var(--color-gold); font-weight: 700; letter-spacing: 1px; display: block; margin-bottom: 0.2rem;">
              📜 Heritage Discovery
            </span>
            <h2 style="font-size: 1.6rem; font-weight: 800; color: var(--color-text); margin: 0; line-height: 1.25;">
              ${fact.title}
            </h2>
          </div>
        </div>
        <div class="cultural-modal-body" style="overflow-y: auto; flex-grow: 1; padding-right: 0.5rem; margin-bottom: 1.5rem;">
          <p style="font-size: 1.08rem; line-height: 1.65; color: var(--color-text); font-weight: 600; margin-bottom: 1.5rem; border-left: 3px solid var(--color-gold); padding-left: 1rem;">
            ${fact.description}
          </p>
          ${detailsParagraphs}
        </div>
        <div style="display: flex; justify-content: flex-end; border-top: 1px solid var(--color-border); padding-top: 1.25rem;">
          <button class="btn btn-secondary" id="closeDocBtn" style="max-width: 150px; font-weight: 700;">Close Document</button>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);
    
    // Trigger active transitions
    setTimeout(() => {
      backdrop.classList.add('active');
    }, 10);

    function close() {
      AudioEngine.playClick();
      backdrop.classList.remove('active');
      setTimeout(() => {
        backdrop.remove();
      }, 300);
    }

    backdrop.querySelector('#closeXBtn').addEventListener('click', close);
    backdrop.querySelector('#closeDocBtn').addEventListener('click', close);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) close();
    });
  }

  function initUI() {
    injectModalStyles();

    const html = `
      <div class="cultural-container glass-card">
        <h2 class="section-title">Kerala Cultural Discovery</h2>
        
        <p style="color: var(--color-text-muted); font-size: 0.95rem; margin-bottom: 2rem; text-align: center;">
          Embark on quests into Kerala's rich traditions. Unlocking badges in learning activities reveals these heritage secrets! <br/>
          <span style="color: var(--color-gold); font-weight: 600; font-size: 0.85rem; text-transform: uppercase; margin-top: 0.5rem; display: inline-block;">✨ Click any unlocked card to view the full historical document</span>
        </p>
 
        <div class="cultural-grid">
          ${culturalFacts.map(fact => {
            // Check if user has unlocked the badge required for this fact
            const isUnlocked = state.badges.includes(fact.unlockedBy);

            if (isUnlocked) {
              return `
                <div class="cultural-card unlocked-card" data-id="${fact.id}" style="border-color: var(--color-gold); box-shadow: 0 0 15px var(--color-gold-glow);">
                  <div class="cultural-card-body">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <span class="cultural-icon">${fact.icon}</span>
                      <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--color-gold-light); font-weight: 700;">✨ Unlocked (Click to read)</span>
                    </div>
                    <h3 class="cultural-title">${fact.title}</h3>
                    <p class="cultural-description">${fact.description}</p>
                  </div>
                </div>
              `;
            } else {
              return `
                <div class="cultural-card locked">
                  <div class="lock-overlay">
                    <span class="lock-icon">🔒</span>
                    <h4 style="font-weight: 700; color: var(--color-text); font-size: 1.1rem; margin-bottom: 0.25rem;">Locked Discovery</h4>
                    <p class="lock-hint">${fact.hint}</p>
                  </div>
                  <div class="cultural-card-body" style="opacity: 0.15; pointer-events: none; filter: blur(2px);">
                    <span class="cultural-icon">${fact.icon}</span>
                    <h3 class="cultural-title">${fact.title}</h3>
                    <p class="cultural-description">Hidden description of Kerala history.</p>
                  </div>
                </div>
              `;
            }
          }).join('')}
        </div>

        <div style="display: flex; justify-content: center; margin-top: 2.5rem;">
          <button id="exitCultureBtn" class="btn btn-primary" style="max-width: 250px;">Return to Dashboard</button>
        </div>
      </div>
    `;

    container.innerHTML = html;

    // Attach click listeners to exit button
    container.querySelector('#exitCultureBtn').addEventListener('click', () => {
      AudioEngine.playClick();
      navigateToTab('dashboard');
    });

    // Attach click listeners to unlocked cards
    container.querySelectorAll('.unlocked-card').forEach(card => {
      card.addEventListener('click', () => {
        const factId = card.getAttribute('data-id');
        const fact = culturalFacts.find(f => f.id === factId);
        if (fact) {
          AudioEngine.playClick();
          openDetailModal(fact);
        }
      });
    });
  }

  // Load Component
  initUI();
}
