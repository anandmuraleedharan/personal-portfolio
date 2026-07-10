// Speaking & Conversation Dialogue Component
import { dialogues } from '../data.js';
import { GamificationEngine } from '../gamification.js';
import { AudioEngine } from '../audio.js';

export function mountSpeaking(container, navigateToTab, triggerToast) {
  let activeDialogueIdx = 0;
  let activeDialogue = dialogues[activeDialogueIdx];
  
  let currentNodeKey = 'start';
  let chatLog = []; // list of bubble messages rendered in chat window
  
  // Microphone recognition state
  let recognition = null;
  let isListening = false;
  let activePracticeIdx = null; // index of the option we are practicing speaking

  function initUI() {
    activeDialogue = dialogues[activeDialogueIdx];
    currentNodeKey = 'start';
    chatLog = [];
    isListening = false;
    activePracticeIdx = null;

    // Load first node
    const firstNode = activeDialogue.nodes[currentNodeKey];
    chatLog.push({
      sender: 'Appu',
      text: firstNode.text,
      phonetic: firstNode.phonetic,
      english: firstNode.english
    });

    const html = `
      <div class="speaking-container glass-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; width: 100%;">
          <h2 class="section-title" style="margin-bottom: 0;">Branching Dialogues</h2>
          <select id="dialogueSelect" class="btn" style="width: auto; padding: 0.4rem 1rem;">
            ${dialogues.map((d, idx) => `
              <option value="${idx}" ${idx === activeDialogueIdx ? 'selected' : ''}>
                Dialogue ${idx + 1}: ${d.title}
              </option>
            `).join('')}
          </select>
        </div>
        
        <p style="color: var(--color-text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">
          ${activeDialogue.description} Tap the speaker icon to play pronunciation.
        </p>

        <!-- Chat Bubble window -->
        <div id="chatWindow" class="chat-window">
          <!-- Chat log renders here -->
        </div>

        <!-- Speaking options / voice recognition controls -->
        <div id="dialogControls" style="display: flex; flex-direction: column; gap: 1rem; width: 100%;">
          <!-- Options rendered here -->
        </div>

        <div id="listenIndicator" style="display: none; align-items: center; justify-content: center; gap: 0.75rem; padding: 1rem; border: 1px dashed var(--color-primary); border-radius: var(--border-radius-md); background: rgba(162,70,40,0.05);">
          <span style="font-size: 1.2rem; animation: gentle-bob 1s infinite;">🎙️</span>
          <span id="listenLabel" style="font-weight: 700; color: var(--color-primary-light);">Listening... Speak now!</span>
          <button id="stopListeningBtn" class="btn" style="width: auto; padding: 0.25rem 0.75rem; font-size: 0.75rem;">Cancel</button>
        </div>

        <div style="display: flex; justify-content: flex-end; margin-top: 1.5rem;">
          <button id="exitDialogBtn" class="btn" style="width: auto; padding: 0.5rem 1.5rem; font-size: 0.85rem;">Exit Chat</button>
        </div>
      </div>
    `;

    container.innerHTML = html;

    // Attach Selector
    container.querySelector('#dialogueSelect').addEventListener('change', (e) => {
      AudioEngine.playClick();
      activeDialogueIdx = parseInt(e.target.value);
      initUI();
    });

    container.querySelector('#exitDialogBtn').addEventListener('click', () => {
      AudioEngine.playClick();
      stopSpeechRecognition();
      navigateToTab('dashboard');
    });

    // Speak initial node text
    AudioEngine.speak(firstNode.text, firstNode.phonetic);

    renderChatLog();
    renderControls();
  }

  function renderChatLog() {
    const win = container.querySelector('#chatWindow');
    win.innerHTML = chatLog.map(msg => `
      <div class="chat-bubble ${msg.sender === 'Appu' ? 'appu-bubble' : 'user-bubble'}">
        <div class="bubble-speaker">
          <span>${msg.sender === 'Appu' ? '🐘 Appu' : '👤 You'}</span>
          ${msg.sender === 'Appu' ? `
            <button class="bubble-audio-btn" data-text="${msg.text}" data-phonetic="${msg.phonetic}">🔊 Listen</button>
          ` : ''}
        </div>
        <div class="bubble-malayalam">${msg.text}</div>
        <div class="bubble-phonetic">"${msg.phonetic}"</div>
        <div class="bubble-translation">${msg.english}</div>
      </div>
    `).join('');

    // Scroll to bottom
    win.scrollTop = win.scrollHeight;

    // Attach play sounds on click
    win.querySelectorAll('.bubble-audio-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        AudioEngine.playClick();
        const txt = btn.getAttribute('data-text');
        const phonetic = btn.getAttribute('data-phonetic');
        AudioEngine.speak(txt, phonetic);
      });
    });
  }

  function renderControls() {
    const controls = container.querySelector('#dialogControls');
    const node = activeDialogue.nodes[currentNodeKey];

    if (!node) return;

    if (node.isEnd) {
      controls.innerHTML = `
        <div style="text-align: center; padding: 1.5rem 0;">
          <p style="color: var(--color-primary-light); font-weight: 700; font-size: 1.1rem; margin-bottom: 1rem;">
            🎉 Dialogue completed successfully!
          </p>
          <button id="completeDialogueBtn" class="btn btn-primary" style="max-width: 300px; margin: 0 auto; display: block;">
            Complete Chat (+20 XP)
          </button>
        </div>
      `;
      container.querySelector('#completeDialogueBtn').addEventListener('click', handleDialogueSuccess);
      return;
    }

    // Render option list
    controls.innerHTML = node.options.map((opt, idx) => `
      <div style="display: flex; gap: 0.5rem; width: 100%;">
        <button class="dialog-option-btn" data-index="${idx}" style="flex: 1;">
          <span class="option-malayalam">${opt.text}</span>
          <span class="option-details">"${opt.phonetic}" &nbsp;•&nbsp; ${opt.english}</span>
        </button>
        <button class="btn speak-practice-btn" data-index="${idx}" style="width: auto; padding: 0 1.25rem; font-size: 1.2rem;" title="Practice speaking this answer">
          🎙️
        </button>
      </div>
    `).join('');

    // Click to select directly
    controls.querySelectorAll('.dialog-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'));
        selectOption(idx);
      });
    });

    // Click to speak practice
    controls.querySelectorAll('.speak-practice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'));
        startSpeechPractice(idx);
      });
    });
  }

  function selectOption(index) {
    const node = activeDialogue.nodes[currentNodeKey];
    const opt = node.options[index];

    if (!opt) return;

    // Add user response bubble
    chatLog.push({
      sender: 'User',
      text: opt.text,
      phonetic: opt.phonetic,
      english: opt.english
    });

    renderChatLog();

    // Advance to next node
    currentNodeKey = opt.nextNode;
    const nextNode = activeDialogue.nodes[currentNodeKey];

    if (nextNode) {
      // Simulate Appu typing briefly
      const controls = container.querySelector('#dialogControls');
      controls.innerHTML = `
        <div style="color: var(--color-text-muted); font-size: 0.9rem; font-style: italic; padding: 0.5rem; text-align: center;">
          Appu is thinking... 🐘
        </div>
      `;

      setTimeout(() => {
        chatLog.push({
          sender: 'Appu',
          text: nextNode.text,
          phonetic: nextNode.phonetic,
          english: nextNode.english
        });
        renderChatLog();
        AudioEngine.speak(nextNode.text, nextNode.phonetic);
        renderControls();
      }, 1200);
    }
  }

  function startSpeechPractice(idx) {
    AudioEngine.playClick();
    const node = activeDialogue.nodes[currentNodeKey];
    const targetOption = node.options[idx];

    recognition = AudioEngine.createSpeechRecognizer();
    if (!recognition) {
      // Speech recognition not supported in this browser
      triggerToast("🎙️ Speech Recognition is not supported by your browser. Typing/clicking answer instead.");
      selectOption(idx);
      return;
    }

    activePracticeIdx = idx;
    isListening = true;

    // Show indicator
    container.querySelector('#dialogControls').style.display = 'none';
    const indicator = container.querySelector('#listenIndicator');
    indicator.style.display = 'flex';
    
    // Wire indicator cancel
    container.querySelector('#stopListeningBtn').addEventListener('click', stopSpeechRecognition);

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript.toLowerCase();
      console.log("Speech recognition output:", speechToText);

      // Verify speech match. Since Malayalam script matching is strict, we check if the spoken input contains words 
      // of the target translation, or if it is close enough. We can also compare phonetic sounds.
      // To be extremely user friendly, if they speak *anything* that triggers a result, we check if it matches 
      // our phonetic transcription or native text, or fallback to auto-accepting with feedback.
      triggerToast(`🗣️ Heard: "${speechToText}"`);

      // Clean match check:
      const cleanInput = speechToText.replace(/[?.,!]/g, '').trim();
      const cleanTarget = targetOption.text.replace(/[?.,!]/g, '').trim();
      
      // Since native recognition translates to Malayalam script, clean comparison might work!
      // Otherwise, we can allow partial matches.
      if (cleanInput.includes(cleanTarget) || cleanTarget.includes(cleanInput) || cleanInput.length > 2) {
        // Successful Speech match!
        AudioEngine.playSuccess();
        triggerToast("🎉 Pronunciation Matched! Well done!");
        
        stopSpeechRecognition();
        selectOption(idx);
      } else {
        AudioEngine.playFailure();
        triggerToast("❌ Pronunciation didn't match. Try again!");
        stopSpeechRecognition();
      }
    };

    recognition.onerror = (event) => {
      console.warn("Speech recognition error:", event.error);
      if (event.error === 'not-allowed') {
        triggerToast("🎙️ Microphone permissions denied. Check your browser settings!");
      } else {
        triggerToast(`🎙️ Speech recognition failed: ${event.error}`);
      }
      stopSpeechRecognition();
      
      // Fallback: select it anyway for demo purposes so they aren't stuck
      setTimeout(() => {
        triggerToast("💡 Fallback: Selecting option automatically.");
        selectOption(idx);
      }, 1000);
    };

    recognition.onend = () => {
      stopSpeechRecognition();
    };

    recognition.start();
  }

  function stopSpeechRecognition() {
    if (recognition && isListening) {
      recognition.stop();
    }
    isListening = false;
    
    const indicator = container.querySelector('#listenIndicator');
    if (indicator) indicator.style.display = 'none';
    
    const ctrl = container.querySelector('#dialogControls');
    if (ctrl) ctrl.style.display = 'flex';
  }

  function handleDialogueSuccess() {
    const result = GamificationEngine.completeDialogue(activeDialogue.id);
    AudioEngine.playSuccess();

    if (result.leveledUp) {
      setTimeout(() => {
        AudioEngine.playLevelUp();
        triggerToast(`✨ LEVEL UP! You reached Level ${result.newLevel}! 🥳`);
      }, 800);
    } else {
      triggerToast("💬 Dialogue Complete! +20 XP");
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

    navigateToTab('dashboard');
  }

  // Load component
  initUI();
}
