// Lipi Main Application Router & Coordinator
import './style.css';
import { GamificationEngine } from './gamification.js';
import { AudioEngine } from './audio.js';

// Component Mount Functions
import { mountDashboard } from './components/dashboard.js';
import { mountTracing } from './components/tracing.js';
import { mountMatchGrid } from './components/matchgrid.js';
import { mountPhraseAssembler } from './components/assembler.js';
import { mountFlashcards } from './components/flashcards.js';
import { mountSpeaking } from './components/speaking.js';
import { mountCulturalQuests } from './components/cultural.js';
import { initLoginScreen } from './components/login.js';
import { initProfileScreen } from './components/profile.js';
import { mountApiDocs } from './components/apidocs.js';

// Application State
let currentTab = 'dashboard';

// Enforce login gating and route routing
function initApp() {
  const state = GamificationEngine.getState();
  
  // Apply visual settings immediately on boot
  const theme = (state.settings && state.settings.theme) || "forest";
  document.body.className = `theme-${theme}`;
  AudioEngine.updateSettings(state.settings || { muteSFX: false, speechRate: 0.9 });

  if (!state.user || !state.user.name) {
    // Show login screen gate
    initLoginScreen('app', () => {
      // Re-initialize app once user profile is captured
      initApp();
    });
  } else {
    // Show full app shell
    initAppShell();
  }
}

// Mount the App Shell
function initAppShell() {
  const root = document.querySelector('#app');
  const state = GamificationEngine.getState();
  
  root.innerHTML = `
    <!-- Desktop Sidebar Navigation -->
    <aside class="sidebar" id="desktopSidebar">
      <div class="brand">
        <span class="brand-logo">🐘</span>
        <span class="brand-name">Lipi</span>
      </div>
      <nav style="flex: 1; overflow-y: auto; padding-right: 0.25rem;">
        <ul class="nav-menu">
          <li class="nav-item active" data-target="dashboard">
            <span class="nav-icon">🏠</span> Dashboard
          </li>
          <li class="nav-item" data-target="tracing">
            <span class="nav-icon">✍️</span> Tracing
          </li>
          <li class="nav-item" data-target="matchgrid">
            <span class="nav-icon">🧩</span> Match Grid
          </li>
          <li class="nav-item" data-target="assembler">
            <span class="nav-icon">💬</span> Assembler
          </li>
          <li class="nav-item" data-target="flashcards">
            <span class="nav-icon">📚</span> Flashcards
          </li>
          <li class="nav-item" data-target="speaking">
            <span class="nav-icon">🗣️</span> Speaking
          </li>
          <li class="nav-item" data-target="cultural">
            <span class="nav-icon">⛵</span> Cultural Quests
          </li>
          <li class="nav-item" data-target="profile" style="border-top: 1px solid var(--color-border); margin-top: 1rem; padding-top: 1rem;">
            <span class="nav-icon">👤</span> Profile & Settings
          </li>
          <li class="nav-item" data-target="api-docs" style="color: var(--color-gold); font-weight: 600;">
            <span class="nav-icon">🚀</span> Developer API
          </li>
        </ul>
      </nav>
      <div style="font-size: 0.8rem; color: var(--color-text-muted); text-align: center; border-top: 1px solid var(--color-border); padding-top: 1rem;">
        Lipi Malayalam App v1.0
      </div>
    </aside>

    <!-- Mobile Bottom Navigation -->
    <nav class="bottom-nav" id="mobileBottomNav">
      <div class="mobile-nav-item active" data-target="dashboard">
        <span class="mobile-nav-icon">🏠</span>
        <span>Home</span>
      </div>
      <div class="mobile-nav-item" data-target="tracing">
        <span class="mobile-nav-icon">✍️</span>
        <span>Trace</span>
      </div>
      <div class="mobile-nav-item" data-target="matchgrid">
        <span class="mobile-nav-icon">🧩</span>
        <span>Match</span>
      </div>
      <div class="mobile-nav-item" data-target="speaking">
        <span class="mobile-nav-icon">🗣️</span>
        <span>Talk</span>
      </div>
      <div class="mobile-nav-item" data-target="profile">
        <span class="mobile-nav-icon">👤</span>
        <span>Profile</span>
      </div>
    </nav>

    <!-- Main Workspace Area -->
    <main class="main-layout">
      <!-- Profile Header / Stats pill bar -->
      <header class="stats-header">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <span class="header-user-avatar" id="headerAvatar" style="font-size: 1.5rem;">${state.user.avatar || "🐘"}</span>
          <span class="header-user-name" id="headerName" style="font-weight: 700; font-size: 0.95rem;">${state.user.name || "Learner"}</span>
        </div>
        
        <div class="stats-container">
          <div class="stat-pill heart-pill" id="headerHearts" title="Hearts (Mistakes left)">
            <span class="stat-icon">❤️</span>
            <span id="heartsValue">5</span>
          </div>
          <div class="stat-pill streak-pill" id="headerStreak" title="Simulated Daily Streak">
            <span class="stat-icon">🔥</span>
            <span id="streakValue">0</span>
          </div>
          <div class="stat-pill" title="Experience Points">
            <span class="stat-icon">✨</span>
            <span id="xpValue">0 XP</span>
          </div>
          <div class="stat-pill" style="border-color: var(--color-gold-glow); color: var(--color-gold-light);" title="User Level">
            <span class="stat-icon">🏆</span>
            <span id="levelValue">Lvl 1</span>
          </div>
        </div>
      </header>

      <!-- Dynamic Activity viewport -->
      <div class="content-body" id="mainViewport">
        <!-- Component HTML mounted here -->
      </div>
    </main>

    <!-- Toast Notifications Container -->
    <div class="toast-container" id="toastContainer"></div>

    <!-- Developer Control Simulator Panel -->
    <div class="dev-controls">
      <button class="dev-btn" id="devAddXpBtn" title="Instantly add 50 XP to trigger Level Up">✨ Add +50 XP</button>
      <button class="dev-btn" id="devNextDayBtn" title="Simulate passing of 24h to test Streak decay/multiplier">📅 Simulate Next Day</button>
      <button class="dev-btn" id="devRefillBtn" title="Refill all hearts">💖 Refill Hearts</button>
      <button class="dev-btn" id="devResetBtn" style="border-color: hsla(14, 90%, 50%, 0.3);" title="Wipe local storage and start fresh">🔄 Reset State</button>
    </div>
  `;

  // Attach Navigation Listeners
  setupNavigation();

  // Attach Dev Controls
  setupDevPanel();

  // Subscribe to Gamification state updates
  GamificationEngine.subscribe(updateStatsHeader);

  // Initialize view
  renderCurrentTab();
  
  // Trigger initial streak update on load
  GamificationEngine.updateStreak();
}

function setupNavigation() {
  const handleNavClick = (target) => {
    AudioEngine.playClick();
    navigateTo(target);
  };

  // Sidebar Links
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      handleNavClick(item.getAttribute('data-target'));
    });
  });

  // Mobile Bottom Links
  document.querySelectorAll('.mobile-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      handleNavClick(item.getAttribute('data-target'));
    });
  });
}

function navigateTo(tabKey) {
  currentTab = tabKey;
  
  // Update active classes on Desktop nav
  document.querySelectorAll('.nav-item').forEach(item => {
    if (item.getAttribute('data-target') === tabKey) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Update active classes on Mobile nav
  document.querySelectorAll('.mobile-nav-item').forEach(item => {
    if (item.getAttribute('data-target') === tabKey) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  renderCurrentTab();
}

// Render selected component inside main viewport
function renderCurrentTab() {
  const container = document.querySelector('#mainViewport');
  if (!container) return;

  switch (currentTab) {
    case 'dashboard':
      mountDashboard(container, navigateTo, triggerToast);
      break;
    case 'tracing':
      mountTracing(container, navigateTo, triggerToast);
      break;
    case 'matchgrid':
      mountMatchGrid(container, navigateTo, triggerToast);
      break;
    case 'assembler':
      mountPhraseAssembler(container, navigateTo, triggerToast);
      break;
    case 'flashcards':
      mountFlashcards(container, navigateTo, triggerToast);
      break;
    case 'speaking':
      mountSpeaking(container, navigateTo, triggerToast);
      break;
    case 'cultural':
      mountCulturalQuests(container, navigateTo, triggerToast);
      break;
    case 'profile':
      initProfileScreen(container, triggerToast);
      break;
    case 'api-docs':
      mountApiDocs(container, navigateTo, triggerToast);
      break;
    default:
      container.innerHTML = `<h2>Page not found.</h2>`;
  }
}

// Redraw Stats Pill Bar whenever engine emits new values
function updateStatsHeader(state) {
  const heartsVal = document.querySelector('#heartsValue');
  const streakVal = document.querySelector('#streakValue');
  const xpVal = document.querySelector('#xpValue');
  const lvlVal = document.querySelector('#levelValue');
  const headerAvatar = document.querySelector('#headerAvatar');
  const headerName = document.querySelector('#headerName');

  if (heartsVal) heartsVal.textContent = state.hearts;
  if (streakVal) streakVal.textContent = state.streak;
  if (xpVal) xpVal.textContent = `${state.xp} XP`;
  if (lvlVal) lvlVal.textContent = `Lvl ${state.level}`;
  if (headerAvatar && state.user) headerAvatar.textContent = state.user.avatar;
  if (headerName && state.user) headerName.textContent = state.user.name;

  // Heart warning colors
  const heartPill = document.querySelector('#headerHearts');
  if (heartPill) {
    if (state.hearts <= 1) {
      heartPill.classList.add('critical');
    } else {
      heartPill.classList.remove('critical');
    }
  }
}

// Listen to settings profileUpdated updates to refresh headers dynamically
window.addEventListener("profileUpdated", () => {
  const freshState = GamificationEngine.getState();
  updateStatsHeader(freshState);
});

// Floating Toast Banners for Badge Rewards / Success states
export function triggerToast(message, type = 'success') {
  const container = document.querySelector('#toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let icon = '✨';
  if (message.includes('🏆') || message.includes('Achievement')) {
    toast.className += ' badge-unlock';
    icon = '🏆';
  } else if (message.includes('💔') || message.includes('empty')) {
    icon = '💔';
  } else if (message.includes('⚠️')) {
    icon = '⚠️';
  }

  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  // Trigger browser animation reflow
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  // Auto clean toast after 4s
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 450);
  }, 4000);
}

// Developer testing utilities configuration
function setupDevPanel() {
  const addXp = document.querySelector('#devAddXpBtn');
  const nextDay = document.querySelector('#devNextDayBtn');
  const refill = document.querySelector('#devRefillBtn');
  const reset = document.querySelector('#devResetBtn');

  if (addXp) {
    addXp.addEventListener('click', () => {
      AudioEngine.playClick();
      const result = GamificationEngine.addXP(50);
      triggerToast("⚡ Developer mode: Added +50 XP");
      if (result.leveledUp) {
        setTimeout(() => {
          AudioEngine.playLevelUp();
          triggerToast(`✨ LEVEL UP! You reached Level ${result.newLevel}! 🥳`);
        }, 600);
      }
    });
  }

  if (nextDay) {
    nextDay.addEventListener('click', () => {
      AudioEngine.playClick();
      GamificationEngine.simulateNextDay();
      const result = GamificationEngine.updateStreak();
      triggerToast(`📅 Simulated next day. Streak evaluated: ${result.streak} 🔥`);
    });
  }

  if (refill) {
    refill.addEventListener('click', () => {
      AudioEngine.playClick();
      // Replenish hearts
      const state = GamificationEngine.getState();
      while (state.hearts < 5) {
        GamificationEngine.gainHeart();
      }
      triggerToast("💖 Developer mode: Refilled all hearts!");
    });
  }

  if (reset) {
    reset.addEventListener('click', () => {
      if (confirm("Reset application? All streaks, levels, and badges will be deleted.")) {
        AudioEngine.playClick();
        GamificationEngine.resetGame();
        triggerToast("🔄 State reset successfully.");
        
        // Refresh routing
        initApp();
      }
    });
  }
}

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', () => {
  initApp();
});
