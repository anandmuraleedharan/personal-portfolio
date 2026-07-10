// Character Tracing Component
import { tracingLetters } from '../data.js';
import { GamificationEngine } from '../gamification.js';
import { AudioEngine } from '../audio.js';

export function mountTracing(container, navigateToTab, triggerToast) {
  let activeLetterIdx = 0;
  let activeLetter = tracingLetters[activeLetterIdx];
  
  let canvas = null;
  let ctx = null;
  let isDrawing = false;
  
  // Stencil and User Coverage State
  let stencilData = null;
  let totalStencilPixels = 0;
  let userMaskCanvas = null;
  let userMaskCtx = null;
  
  let isCompleted = false;
  let strayFrameCount = 0;
  let lastPos = null;
  let penSize = parseInt(localStorage.getItem('lipi_pen_size') || '16');

  function initUI() {
    activeLetter = tracingLetters[activeLetterIdx];
    isCompleted = false;
    strayFrameCount = 0;
    lastPos = null;

    // Initialize Offscreen Stencil
    initStencil();

    const html = `
      <div class="tracing-container glass-card">
        <div class="tracing-header">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; width: 100%;">
            <h2 class="section-title">Character Tracing</h2>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <select id="letterSelect" class="btn" style="width: auto; padding: 0.4rem 1rem;">
                ${tracingLetters.map((l, idx) => `
                  <option value="${idx}" ${idx === activeLetterIdx ? 'selected' : ''}>
                    ${l.char} (${l.phonetic})
                  </option>
                `).join('')}
              </select>
              <select id="penSizeSelect" class="btn" style="width: auto; padding: 0.4rem 1rem;">
                <option value="10" ${penSize === 10 ? 'selected' : ''}>Pen: Thin</option>
                <option value="16" ${penSize === 16 ? 'selected' : ''}>Pen: Medium</option>
                <option value="24" ${penSize === 24 ? 'selected' : ''}>Pen: Thick</option>
              </select>
            </div>
          </div>
          <p style="color: var(--color-text-muted); margin-bottom: 1.5rem;">
            ${activeLetter.description} <em>${activeLetter.englishExample}</em>
          </p>
        </div>

        <div style="display: flex; flex-direction: column; align-items: center; gap: 1.5rem; width: 100%;">
          <div class="canvas-wrapper">
            <canvas id="tracingCanvas" width="300" height="300"></canvas>
            <div id="canvasInstruction" class="canvas-instruction">
              Color in the faint background character to trace it! (0% completed)
            </div>
          </div>

          <div class="tracing-actions">
            <button id="clearCanvasBtn" class="btn">Clear</button>
            <button id="nextLetterBtn" class="btn btn-primary" disabled>Next Letter →</button>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;

    canvas = container.querySelector('#tracingCanvas');
    ctx = canvas.getContext('2d');

    // Add UI Listeners
    container.querySelector('#letterSelect').addEventListener('change', (e) => {
      AudioEngine.playClick();
      activeLetterIdx = parseInt(e.target.value);
      initUI();
    });

    container.querySelector('#penSizeSelect').addEventListener('change', (e) => {
      AudioEngine.playClick();
      penSize = parseInt(e.target.value);
      localStorage.setItem('lipi_pen_size', String(penSize));
    });

    container.querySelector('#clearCanvasBtn').addEventListener('click', () => {
      AudioEngine.playClick();
      resetCanvasState();
    });

    const nextBtn = container.querySelector('#nextLetterBtn');
    nextBtn.addEventListener('click', () => {
      AudioEngine.playClick();
      if (activeLetterIdx < tracingLetters.length - 1) {
        activeLetterIdx++;
        initUI();
      } else {
        triggerToast("🎉 You've practiced all letters! Returning to Dashboard.");
        navigateToTab('dashboard');
      }
    });

    // Draw background guides
    drawGuides();

    // Canvas Events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      startDrawing(touch);
    });
    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      draw(touch);
    });
    canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      stopDrawing();
    });
  }

  function initStencil() {
    const offscreen = document.createElement('canvas');
    offscreen.width = 300;
    offscreen.height = 300;
    const oCtx = offscreen.getContext('2d');
    
    // Fill white
    oCtx.fillStyle = '#ffffff';
    oCtx.fillRect(0, 0, 300, 300);
    
    // Draw character in solid black (centered)
    oCtx.fillStyle = '#000000';
    oCtx.font = '800 160px "Malayalam Sangam MN", "Malayalam MN", "Outfit", "Inter", sans-serif';
    oCtx.textAlign = 'center';
    oCtx.textBaseline = 'middle';
    oCtx.fillText(activeLetter.char, 150, 140); // Shift up slightly to match main canvas
    
    // Get image data
    const imgData = oCtx.getImageData(0, 0, 300, 300);
    stencilData = imgData.data;
    
    // Count black pixels
    totalStencilPixels = 0;
    for (let i = 0; i < stencilData.length; i += 4) {
      if (stencilData[i] < 10) {
        totalStencilPixels++;
      }
    }
    
    // Create user coverage mask canvas
    userMaskCanvas = document.createElement('canvas');
    userMaskCanvas.width = 300;
    userMaskCanvas.height = 300;
    userMaskCtx = userMaskCanvas.getContext('2d');
    userMaskCtx.clearRect(0, 0, 300, 300); // transparent background
  }

  function getMousePos(evt) {
    const rect = canvas.getBoundingClientRect();
    const clientX = evt.clientX;
    const clientY = evt.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  function drawGuides() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw faint background character stencil
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.font = '800 160px "Malayalam Sangam MN", "Malayalam MN", "Outfit", "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(activeLetter.char, canvas.width / 2, canvas.height / 2 - 10);

    // 2. Draw central grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0); ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.moveTo(0, canvas.height / 2); ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // 3. Draw user mask canvas overlay (their drawings)
    ctx.drawImage(userMaskCanvas, 0, 0);
  }

  function startDrawing(e) {
    const state = GamificationEngine.getState();
    if (state.hearts <= 0) {
      triggerToast("💔 You have no hearts left! Practice vocabulary to recover hearts.");
      return;
    }

    if (isCompleted) return; // Already finished

    isDrawing = true;
    lastPos = getMousePos(e);
    strayFrameCount = 0;

    // Record starting touch/point
    userMaskCtx.beginPath();
    userMaskCtx.arc(lastPos.x, lastPos.y, penSize / 2, 0, Math.PI * 2);
    userMaskCtx.fillStyle = '#a24628'; // beautiful theme primary color
    userMaskCtx.fill();

    drawGuides();
  }

  function draw(e) {
    if (!isDrawing || isCompleted) return;
    const pos = getMousePos(e);

    // Proximity check: Is user drawing on the character?
    let isOnStencil = false;
    const checkRadius = Math.max(12, penSize); // dynamic based on pen size
    for (let dx = -checkRadius; dx <= checkRadius; dx += 4) {
      for (let dy = -checkRadius; dy <= checkRadius; dy += 4) {
        const checkX = Math.round(pos.x + dx);
        const checkY = Math.round(pos.y + dy);
        if (checkX >= 0 && checkX < 300 && checkY >= 0 && checkY < 300) {
          const index = (checkY * 300 + checkX) * 4;
          if (stencilData[index] < 10) {
            isOnStencil = true;
            break;
          }
        }
      }
      if (isOnStencil) break;
    }

    if (!isOnStencil) {
      strayFrameCount++;
      if (strayFrameCount > 20) { // Off-track!
        handleTraceError();
        return;
      }
    } else {
      strayFrameCount = 0;
    }

    // Draw stroke segment on user mask canvas
    userMaskCtx.beginPath();
    userMaskCtx.moveTo(lastPos.x, lastPos.y);
    userMaskCtx.lineTo(pos.x, pos.y);
    userMaskCtx.strokeStyle = '#a24628'; // theme color
    userMaskCtx.lineWidth = penSize; // dynamic pen brush size
    userMaskCtx.lineCap = 'round';
    userMaskCtx.lineJoin = 'round';
    userMaskCtx.stroke();

    lastPos = pos;
    drawGuides();

    // Show real-time coverage updates
    const pct = checkCoverage();
    const instruction = container.querySelector('#canvasInstruction');
    instruction.textContent = `Color in the faint background character to trace it! (${Math.round(pct)}% completed)`;
  }

  function stopDrawing() {
    if (!isDrawing) return;
    isDrawing = false;
    lastPos = null;

    const pct = checkCoverage();
    const instruction = container.querySelector('#canvasInstruction');

    if (pct >= 65) { // 65% covered is standard threshold for a complete glyph
      isCompleted = true;
      instruction.innerHTML = `<span style="color: var(--color-primary-light); font-weight: bold;">🎉 Excellent! Traced successfully!</span>`;
      handleLetterSuccess();
    } else {
      instruction.textContent = `Color in the faint background character to trace it! (${Math.round(pct)}% completed)`;
    }
  }

  function checkCoverage() {
    const userImgData = userMaskCtx.getImageData(0, 0, 300, 300).data;
    let coveredPixels = 0;
    
    // Count user covered stencil pixels
    for (let i = 0; i < stencilData.length; i += 4) {
      const isStencil = stencilData[i] < 10;
      const isUser = userImgData[i + 3] > 10; // check alpha channel (drawn pixels)
      if (isStencil && isUser) {
        coveredPixels++;
      }
    }
    
    return (coveredPixels / totalStencilPixels) * 100;
  }

  function handleTraceError() {
    isDrawing = false;
    lastPos = null;
    strayFrameCount = 0;
    
    // Flash Canvas Wrapper border red
    const wrapper = container.querySelector('.canvas-wrapper');
    wrapper.style.borderColor = 'var(--color-coral)';
    setTimeout(() => {
      wrapper.style.borderColor = 'var(--color-border)';
    }, 400);

    AudioEngine.playFailure();
    const remainingHearts = GamificationEngine.loseHeart();
    
    if (remainingHearts <= 0) {
      triggerToast("💔 Heart empty! Return to dashboard to practice.");
      setTimeout(() => navigateToTab('dashboard'), 1500);
    } else {
      triggerToast(`⚠️ Off track! Keep your brush on the letter stencil. (${remainingHearts} ❤️ left)`);
      // Ephemerally reset user Mask on error so they try again clean
      userMaskCtx.clearRect(0, 0, 300, 300);
    }

    drawGuides();
  }

  function handleLetterSuccess() {
    const result = GamificationEngine.completeTracing(activeLetter.id);
    AudioEngine.playSuccess();
    
    if (result.leveledUp) {
      AudioEngine.playLevelUp();
      triggerToast(`✨ LEVEL UP! You reached Level ${result.newLevel}! 🥳`);
    } else {
      triggerToast(`✨ Tracing complete! +15 XP`);
    }

    if (result.newBadges && result.newBadges.length > 0) {
      result.newBadges.forEach(badge => {
        setTimeout(() => {
          AudioEngine.playLevelUp();
          triggerToast(`🏆 Achievement Unlocked: ${badge.title}!`);
        }, 1000);
      });
    }

    // Enable Next Letter button
    const nextBtn = container.querySelector('#nextLetterBtn');
    nextBtn.removeAttribute('disabled');
  }

  function resetCanvasState() {
    isCompleted = false;
    isDrawing = false;
    strayFrameCount = 0;
    lastPos = null;
    userMaskCtx.clearRect(0, 0, 300, 300);
    
    const nextBtn = container.querySelector('#nextLetterBtn');
    nextBtn.setAttribute('disabled', 'true');

    const instruction = container.querySelector('#canvasInstruction');
    instruction.textContent = `Color in the faint background character to trace it! (0% completed)`;
    
    drawGuides();
  }

  // Initial load
  initUI();
}
