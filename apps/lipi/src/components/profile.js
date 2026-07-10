import { GamificationEngine } from "../gamification.js";
import { AudioEngine } from "../audio.js";

export function initProfileScreen(container, showToast) {
  if (!container) return;

  const state = GamificationEngine.getState();
  const user = state.user || { name: "", avatar: "🐘" };
  const settings = state.settings || { muteSFX: false, speechRate: 0.9, theme: "forest" };

  const avatars = ["🐘", "🐯", "🦚", "⛵", "🌴", "🥥"];
  let tempAvatar = user.avatar;
  let tempTheme = settings.theme;

  container.innerHTML = `
    <div class="profile-container fade-in">
      <div class="section-header">
        <h2>Profile & Personalization</h2>
        <p>Customize your profile and learning experience</p>
      </div>

      <div class="profile-settings-layout">
        <!-- Left: Profile Edit Card -->
        <div class="settings-card glass-panel">
          <h3>User Profile</h3>
          
          <div class="profile-preview-large">
            <span class="preview-avatar" id="avatarPreviewLarge">${tempAvatar}</span>
            <span class="preview-name" id="namePreviewLarge">${user.name || "Learner"}</span>
          </div>

          <div class="input-group">
            <label for="profileNameInput">Change Name</label>
            <input 
              type="text" 
              id="profileNameInput" 
              value="${user.name || ""}" 
              placeholder="Your name..." 
              maxlength="20"
            />
          </div>

          <div class="avatar-select-group">
            <label>Select Avatar</label>
            <div class="avatar-options">
              ${avatars.map(av => `
                <button 
                  type="button" 
                  class="avatar-option ${av === tempAvatar ? 'active' : ''}" 
                  data-avatar="${av}"
                >
                  ${av}
                </button>
              `).join("")}
            </div>
          </div>
        </div>

        <!-- Right: Settings & Personalization -->
        <div class="settings-card glass-panel">
          <h3>Personalization</h3>

          <!-- Theme Options -->
          <div class="settings-section">
            <label>Aesthetic Color Theme</label>
            <div class="theme-options-grid">
              <button 
                type="button" 
                class="theme-select-btn forest-theme ${tempTheme === 'forest' ? 'active' : ''}" 
                data-theme="forest"
              >
                <span class="theme-dot" style="background: linear-gradient(135deg, #10b981, #059669);"></span>
                Dark Forest
              </button>
              <button 
                type="button" 
                class="theme-select-btn indigo-theme ${tempTheme === 'indigo' ? 'active' : ''}" 
                data-theme="indigo"
              >
                <span class="theme-dot" style="background: linear-gradient(135deg, #6366f1, #4f46e5);"></span>
                Midnight Indigo
              </button>
              <button 
                type="button" 
                class="theme-select-btn gold-theme ${tempTheme === 'gold' ? 'active' : ''}" 
                data-theme="gold"
              >
                <span class="theme-dot" style="background: linear-gradient(135deg, #f59e0b, #d97706);"></span>
                Sunset Gold
              </button>
            </div>
          </div>

          <!-- Sound Options -->
          <div class="settings-section">
            <label>Audio SFX</label>
            <div class="toggle-control-row">
              <span>Mute Game Tones & Chimes</span>
              <label class="switch-toggle">
                <input type="checkbox" id="muteSfxCheckbox" ${settings.muteSFX ? 'checked' : ''} />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <!-- Speech Speed Options -->
          <div class="settings-section">
            <label>Malayalam Voice Speed (TTS)</label>
            <div class="voice-speed-controls">
              <button 
                type="button" 
                class="speed-btn ${settings.speechRate === 0.6 ? 'active' : ''}" 
                data-speed="0.6"
              >
                Slow
              </button>
              <button 
                type="button" 
                class="speed-btn ${settings.speechRate === 0.9 ? 'active' : ''}" 
                data-speed="0.9"
              >
                Normal
              </button>
              <button 
                type="button" 
                class="speed-btn ${settings.speechRate === 1.2 ? 'active' : ''}" 
                data-speed="1.2"
              >
                Fast
              </button>
            </div>
          </div>

          <!-- Save Button -->
          <button type="button" id="saveProfileSettingsBtn" class="primary-btn save-btn">
            Save Customizations 💾
          </button>
        </div>
      </div>
    </div>
  `;

  // 1. Avatar selector listeners
  const avatarBtns = container.querySelectorAll(".avatar-option");
  const avatarPreview = container.querySelector("#avatarPreviewLarge");
  avatarBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      AudioEngine.playClick();
      avatarBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      tempAvatar = btn.getAttribute("data-avatar");
      avatarPreview.textContent = tempAvatar;
    });
  });

  // 2. Name input listener for real-time preview sync
  const nameInput = container.querySelector("#profileNameInput");
  const namePreview = container.querySelector("#namePreviewLarge");
  nameInput.addEventListener("input", () => {
    namePreview.textContent = nameInput.value.trim() || "Learner";
  });

  // 3. Theme selector listeners
  const themeBtns = container.querySelectorAll(".theme-select-btn");
  themeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      AudioEngine.playClick();
      themeBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      tempTheme = btn.getAttribute("data-theme");
      
      // Real-time preview of theme by class swap on body
      document.body.className = `theme-${tempTheme}`;
    });
  });

  // 4. Speech speed selector listeners
  const speedBtns = container.querySelectorAll(".speed-btn");
  let selectedSpeed = settings.speechRate;
  speedBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      AudioEngine.playClick();
      speedBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedSpeed = parseFloat(btn.getAttribute("data-speed"));
    });
  });

  // 5. Save settings handler
  const saveBtn = container.querySelector("#saveProfileSettingsBtn");
  const muteCheckbox = container.querySelector("#muteSfxCheckbox");

  saveBtn.addEventListener("click", () => {
    const freshName = nameInput.value.trim();
    if (!freshName) {
      AudioEngine.playFailure();
      showToast("Name cannot be empty!", "error");
      nameInput.classList.add("shake-error");
      setTimeout(() => nameInput.classList.remove("shake-error"), 500);
      return;
    }

    // Load active state
    const currentState = GamificationEngine.getState();
    
    // Update user profile details
    currentState.user = {
      name: freshName,
      avatar: tempAvatar
    };

    // Update settings
    currentState.settings = {
      muteSFX: muteCheckbox.checked,
      speechRate: selectedSpeed,
      theme: tempTheme
    };

    // Commit changes
    GamificationEngine.saveState(currentState);
    AudioEngine.updateSettings(currentState.settings);

    // Apply global CSS theme class
    document.body.className = `theme-${tempTheme}`;

    // Play sound and alert user
    AudioEngine.playSuccess();
    showToast("Settings saved successfully!", "success");

    // Trigger header reload if needed (dispatch global event)
    const event = new CustomEvent("profileUpdated");
    window.dispatchEvent(event);
  });
}
