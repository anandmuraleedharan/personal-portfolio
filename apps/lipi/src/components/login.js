import { GamificationEngine } from "../gamification.js";
import { AudioEngine } from "../audio.js";

export function initLoginScreen(containerId, onLoginSuccess) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const avatars = ["🐘", "🐯", "🦚", "⛵", "🌴", "🥥"];
  let selectedAvatar = avatars[0];

  container.innerHTML = `
    <div class="login-card-wrapper fade-in">
      <div class="login-header">
        <img src="./appu.png" alt="Appu Mascot" class="login-mascot" />
        <h1 class="login-logo">Lipi</h1>
        <p class="login-tagline">Start your Malayalam learning journey today</p>
      </div>

      <div class="login-card">
        <div class="input-group">
          <label for="userNameInput">What is your name?</label>
          <input 
            type="text" 
            id="userNameInput" 
            placeholder="Enter your name..." 
            autocomplete="off" 
            maxlength="20"
          />
          <span class="error-msg" id="loginErrorMsg"></span>
        </div>

        <div class="avatar-select-group">
          <label>Choose your Mascot</label>
          <div class="avatar-options">
            ${avatars.map((av, idx) => `
              <button 
                type="button" 
                class="avatar-option ${idx === 0 ? 'active' : ''}" 
                data-avatar="${av}"
              >
                ${av}
              </button>
            `).join("")}
          </div>
        </div>

        <button type="button" id="startJourneyBtn" class="primary-btn login-btn">
          Start Journey 🚀
        </button>
      </div>
    </div>
  `;

  // Handle Avatar Selection
  const optionButtons = container.querySelectorAll(".avatar-option");
  optionButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      AudioEngine.playClick();
      optionButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedAvatar = btn.getAttribute("data-avatar");
    });
  });

  // Handle Start Journey Submit
  const startBtn = document.getElementById("startJourneyBtn");
  const nameInput = document.getElementById("userNameInput");
  const errorMsg = document.getElementById("loginErrorMsg");

  startBtn.addEventListener("click", () => {
    const rawName = nameInput.value.trim();
    if (!rawName) {
      AudioEngine.playFailure();
      errorMsg.textContent = "Please enter a name to continue!";
      nameInput.classList.add("shake-error");
      setTimeout(() => nameInput.classList.remove("shake-error"), 500);
      return;
    }

    // Save user details
    const state = GamificationEngine.getState();
    state.user = {
      name: rawName,
      avatar: selectedAvatar
    };
    GamificationEngine.saveState(state);
    
    AudioEngine.playSuccess();

    // Trigger Callback to switch routing
    if (typeof onLoginSuccess === "function") {
      onLoginSuccess();
    }
  });

  // Support pressing Enter key
  nameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      startBtn.click();
    }
  });
}
