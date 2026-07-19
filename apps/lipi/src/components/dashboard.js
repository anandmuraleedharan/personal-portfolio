// Dashboard Component
import { GamificationEngine } from '../gamification.js';
import { badges, vocabulary } from '../data.js';
import { AudioEngine } from '../audio.js';

export function mountDashboard(container, navigateToTab, showToast) {
  const state = GamificationEngine.getState();
  
  const user = state.user || { name: "Learner", avatar: "🐘" };
  const userXP = state.xp;
  
  // Calculate completion statuses
  const isTracingDone = state.completedTracing.length > 0;
  const isMatchDone = state.wordsMatchedCount >= 10;
  const isPhraseDone = state.phraseTeaSolved;
  const isDialogueDone = state.completedDialogues.length > 0;
  const isCultureDone = state.unlockedCulturalFacts.length >= 4;

  const html = `
    <div class="welcome-section glass-card">
      <div class="mascot-container">
        <img src="./appu.png" alt="Appu the Elephant" class="mascot-img">
      </div>
      <div class="welcome-text">
        <h1>നമസ്കാരം, ${user.name || "Learner"}! ${user.avatar}</h1>
        <p>Ready to expand your Malayalam skills today? Track your milestones and explore the path below.</p>
        <div style="margin-top: 1rem; display: flex; gap: 1rem; align-items: center;">
          <span style="font-weight: 700; color: var(--color-primary-light);">${userXP} XP Earned</span>
          <span style="color: var(--color-text-muted);">|</span>
          <span style="font-weight: 700; color: var(--color-gold-light);">Level ${state.level} scholar</span>
        </div>
      </div>
    </div>

    <div class="dashboard-grid">
      <!-- Learning Path Map -->
      <div class="learning-path">
        <h2 class="section-title">Your Learning Path</h2>
        
        <div class="path-node ${isTracingDone ? 'completed' : ''}" data-tab="tracing">
          <div class="node-status">✍️</div>
          <div class="node-details">
            <h3>1. Alphabet Tracing</h3>
            <p>Master drawing letters like 'അ' (A) and 'ക' (Ka) stroke-by-stroke.</p>
          </div>
          <div class="node-action">${isTracingDone ? '✓ Completed' : 'Start →'}</div>
        </div>

        <div class="path-node ${isMatchDone ? 'completed' : ''}" data-tab="matchgrid">
          <div class="node-status">🧩</div>
          <div class="node-details">
            <h3>2. Match Grid & Time Attack</h3>
            <p>Link Malayalam words with English meanings. Race the clock in rapid fire!</p>
          </div>
          <div class="node-action">${isMatchDone ? '✓ Completed' : 'Play →'}</div>
        </div>

        <div class="path-node ${isPhraseDone ? 'completed' : ''}" data-tab="assembler">
          <div class="node-status">💬</div>
          <div class="node-details">
            <h3>3. Sentence Builder</h3>
            <p>Arrange Malayalam word chips to build phrases like "I want tea".</p>
          </div>
          <div class="node-action">${isPhraseDone ? '✓ Completed' : 'Build →'}</div>
        </div>

        <div class="path-node ${isDialogueDone ? 'completed' : ''}" data-tab="speaking">
          <div class="node-status">🐘</div>
          <div class="node-details">
            <h3>4. Dialogue Chat with Appu</h3>
            <p>Engage in branching dialogue trees and practice real speaking replies.</p>
          </div>
          <div class="node-action">${isDialogueDone ? '✓ Completed' : 'Talk →'}</div>
        </div>

        <div class="path-node ${isCultureDone ? 'completed' : ''}" data-tab="cultural">
          <div class="node-status">⛵</div>
          <div class="node-details">
            <h3>5. Cultural Quests</h3>
            <p>Unlock stories of Kathakali, Houseboats, and martial arts as you learn.</p>
          </div>
          <div class="node-action">${isCultureDone ? '✓ Completed' : 'Explore →'}</div>
        </div>
      </div>

      <!-- Sidebar widgets -->
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <!-- AI Dictionary & Custom Deck Builder -->
        <div class="dictionary-panel glass-card">
          <h2 style="font-size: 1.2rem; font-weight: 800; border-bottom: 1px solid var(--color-border); padding-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem; margin: 0;">
            📖 AI Dictionary Search
          </h2>
          <p style="font-size: 0.85rem; color: var(--color-text-muted); margin: 0.5rem 0 1rem 0; line-height: 1.4;">
            Search any word (English or Malayalam) to translate and generate a custom flashcard.
          </p>
          
          <div class="search-box-row" style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
            <input 
              type="text" 
              id="dictSearchInput" 
              placeholder="Type coconut, banana, ആന..." 
              style="flex: 1; padding: 0.5rem 0.75rem; border-radius: 6px; border: 1px solid var(--color-border); background: rgba(255,255,255,0.05); color: #fff; font-size: 0.9rem;"
            />
            <button type="button" id="dictSearchBtn" class="primary-btn" style="padding: 0.5rem 1rem; font-size: 0.85rem; min-width: 80px;">
              Search
            </button>
          </div>
          
          <div id="dictResultContainer"></div>
        </div>

        <!-- Badges & Achievements -->
        <div class="badges-container glass-card">
          <h2 style="font-size: 1.2rem; font-weight: 800; border-bottom: 1px solid var(--color-border); padding-bottom: 0.75rem; margin: 0;">
            🎖️ Your Badges
          </h2>
          <div class="badges-grid" style="margin-top: 1rem;">
            ${badges.map(badge => {
              const isUnlocked = state.badges.includes(badge.id);
              return `
                <div class="badge-item ${isUnlocked ? 'unlocked' : ''}" title="${badge.title}: ${badge.description} (${badge.criteria})">
                  <div class="badge-icon">${badge.icon}</div>
                  <div class="badge-title" style="font-size: 0.75rem; margin-top: 0.25rem;">${badge.title}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;

  // Add click event handlers to learning path nodes
  container.querySelectorAll('.path-node').forEach(node => {
    node.addEventListener('click', () => {
      AudioEngine.playClick();
      const tab = node.getAttribute('data-tab');
      navigateToTab(tab);
    });
  });

  // AI Dictionary DOM Handlers
  const searchBtn = container.querySelector("#dictSearchBtn");
  const searchInput = container.querySelector("#dictSearchInput");
  const resultContainer = container.querySelector("#dictResultContainer");

  if (searchBtn && searchInput && resultContainer) {
    const handleSearch = async () => {
      const query = searchInput.value.trim();
      if (!query) return;

      searchBtn.disabled = true;
      searchBtn.textContent = "🔍 ...";
      resultContainer.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 1rem; font-size: 0.85rem; color: var(--color-text-muted);">
          <span class="loading-dot"></span> Searching databases...
        </div>
      `;
      try {
        const apiHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
          ? 'http://localhost:3000' 
          : 'https://anandmuraleedharan.com';
        const response = await fetch(`${apiHost}/api/lipi/dictionary?word=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error("API call failed");
        
        const data = await response.json();
        
        if (data.error) {
          resultContainer.innerHTML = `
            <p style="color: #ef4444; font-size: 0.85rem; margin: 0.5rem 0;">Error: ${data.error}</p>
          `;
        } else {
          renderWordResult(data);
        }
      } catch (err) {
        resultContainer.innerHTML = `
          <p style="color: #ef4444; font-size: 0.85rem; margin: 0.5rem 0;">Failed to find translation. Try another word.</p>
        `;
      } finally {
        searchBtn.disabled = false;
        searchBtn.textContent = "Search";
      }
    };

    searchBtn.addEventListener("click", handleSearch);
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSearch();
      }
    });
  }

  function renderWordResult(data) {
    const alreadyExists = state.customVocabulary.some(v => v.malayalam === data.malayalam) || 
                          vocabulary.some(v => v.malayalam === data.malayalam);
    
    resultContainer.innerHTML = `
      <div class="dict-result-card fade-in" style="background: rgba(255,255,255,0.03); border: 1px solid var(--color-border); border-radius: 8px; padding: 1rem; margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <h4 style="font-size: 1.3rem; font-weight: 800; color: var(--color-primary-light); margin: 0;">${data.malayalam}</h4>
            <span style="font-size: 0.85rem; color: var(--color-text-muted); font-style: italic;">${data.phonetic}</span>
          </div>
          <span style="font-size: 0.75rem; background: rgba(255,255,255,0.1); padding: 0.2rem 0.5rem; border-radius: 12px; font-weight: 600;">
            ${data.category || 'Noun'}
          </span>
        </div>
        
        <p style="font-size: 0.9rem; margin: 0.25rem 0; color: #fff;">
          <strong>Meaning:</strong> ${data.english}
        </p>

        ${data.exampleMalayalam ? `
          <div style="border-left: 2px solid var(--color-primary-light); padding-left: 0.5rem; margin: 0.5rem 0; font-size: 0.85rem;">
            <p style="margin: 0; color: #e2e8f0; font-weight: 500;">${data.exampleMalayalam}</p>
            <p style="margin: 0; color: var(--color-text-muted); font-style: italic;">${data.exampleEnglish}</p>
          </div>
        ` : ''}

        ${data.synonyms && data.synonyms.length > 0 ? `
          <p style="font-size: 0.8rem; margin: 0.2rem 0; color: var(--color-text-muted);">
            <strong>Synonyms:</strong> ${data.synonyms.join(', ')}
          </p>
        ` : ''}

        <button type="button" id="addCustomWordBtn" class="primary-btn" style="width: 100%; margin-top: 0.5rem; font-size: 0.85rem;" ${alreadyExists ? 'disabled' : ''}>
          ${alreadyExists ? 'Already in Deck ✓' : 'Add to Study Deck ➕'}
        </button>
      </div>
    `;

    const addBtn = resultContainer.querySelector("#addCustomWordBtn");
    if (addBtn && !alreadyExists) {
      addBtn.addEventListener("click", () => {
        // Pull latest state to avoid race conditions
        const freshState = GamificationEngine.getState();
        data.id = `custom_${Date.now()}`;
        data.difficulty = data.difficulty || "Medium";
        
        freshState.customVocabulary.push(data);
        GamificationEngine.saveState(freshState);

        AudioEngine.playSuccess();
        addBtn.disabled = true;
        addBtn.textContent = "Added to Deck ✓";
        
        if (typeof showToast === "function") {
          showToast(`"${data.english}" added to your custom flashcard deck!`, "success");
        }
      });
    }
  }
}
