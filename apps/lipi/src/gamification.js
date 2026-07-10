// Lipi Gamification Engine
// Handles XP, leveling, hearts, streaks, achievements, and leaderboard simulation

import { StorageProvider } from './storage.js';
import { badges, culturalFacts } from './data.js';

let state = StorageProvider.loadGameState();
const listeners = new Set();

// Helper to notify all subscribers when state changes
function notifyListeners() {
  StorageProvider.saveGameState(state);
  listeners.forEach(cb => cb(state));
}

export const GamificationEngine = {
  // Subscribe to state changes
  subscribe(callback) {
    listeners.add(callback);
    // Initial call with current state
    callback(state);
    return () => listeners.delete(callback);
  },

  // Get current state (read-only)
  getState() {
    return { ...state };
  },

  // Save the state back to memory and storage
  saveState(newState) {
    state = newState;
    notifyListeners();
  },

  // Reload state from physical storage
  reloadState() {
    state = StorageProvider.loadGameState();
    notifyListeners();
  },

  // Reset the game state
  resetGame() {
    state = StorageProvider.resetGameState();
    notifyListeners();
  },

  // Add XP and handle level up calculations
  addXP(amount) {
    const oldXP = state.xp;
    state.xp += amount;

    // Calculate level: 100 XP per level
    const oldLevel = state.level;
    state.level = Math.floor(state.xp / 100) + 1;

    const leveledUp = state.level > oldLevel;
    
    // Check if any badges are unlocked by this update
    const newBadges = this.checkAchievements();

    notifyListeners();

    return {
      leveledUp,
      newLevel: state.level,
      newBadges
    };
  },

  // Lose a heart on mistake
  loseHeart() {
    if (state.hearts > 0) {
      state.hearts--;
      notifyListeners();
    }
    return state.hearts;
  },

  // Gain a heart (through practice or reward)
  gainHeart() {
    if (state.hearts < 5) {
      state.hearts++;
      notifyListeners();
    }
    return state.hearts;
  },

  // Refill hearts using XP (costs 50 XP)
  refillHeartsWithXP() {
    if (state.xp >= 50 && state.hearts < 5) {
      state.xp -= 50;
      state.hearts = 5;
      notifyListeners();
      return true;
    }
    return false;
  },

  // Update streak based on activity date
  updateStreak() {
    const now = new Date();
    const todayStr = now.toDateString();

    if (!state.lastActiveDate) {
      state.streak = 1;
    } else {
      const lastActive = new Date(state.lastActiveDate);
      const diffTime = Math.abs(now - lastActive);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Active on the very next day
        state.streak++;
      } else if (diffDays > 1) {
        // Streak broken
        state.streak = 1;
      }
      // If diffDays === 0, active today already, streak remains same
    }

    state.lastActiveDate = todayStr;
    
    const newBadges = this.checkAchievements();
    notifyListeners();
    return { streak: state.streak, newBadges };
  },

  // Mark a character tracing as completed
  completeTracing(letterId) {
    if (!state.completedTracing.includes(letterId)) {
      state.completedTracing.push(letterId);
      
      // First strokes badge trigger
      const result = this.addXP(15);
      return result;
    }
    return this.addXP(5); // Repeat tracing gives minor XP
  },

  // Increment vocabulary match count
  incrementVocabularyMatch() {
    state.wordsMatchedCount++;
    const newBadges = this.checkAchievements();
    const result = this.addXP(10);
    return { ...result, newBadges };
  },

  // Solve the tea-related phrase
  completePhrase(phraseId) {
    let xpReward = 15;
    if (phraseId === "p1") {
      state.phraseTeaSolved = true;
    }
    const newBadges = this.checkAchievements();
    const result = this.addXP(xpReward);
    return { ...result, newBadges };
  },

  // Complete a dialogue simulation
  completeDialogue(dialogueId) {
    if (!state.completedDialogues.includes(dialogueId)) {
      state.completedDialogues.push(dialogueId);
      const newBadges = this.checkAchievements();
      const result = this.addXP(20);
      return { ...result, newBadges };
    }
    return this.addXP(5); // Repeat dialogues gives minor XP
  },



  // Manually simulate a day change to test streaks
  simulateNextDay() {
    // Set last active date to yesterday to trick the streak calculator
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    state.lastActiveDate = yesterday.toDateString();
    notifyListeners();
  },

  // Check achievements criteria and unlock badges/cultural cards
  checkAchievements() {
    const newlyUnlocked = [];

    badges.forEach(badge => {
      // Skip if already unlocked
      if (state.badges.includes(badge.id)) return;

      let meetsCriteria = false;

      switch (badge.id) {
        case "badge_first_strokes":
          meetsCriteria = state.completedTracing.length >= 1;
          break;
        case "badge_word_smith":
          meetsCriteria = state.wordsMatchedCount >= 10;
          break;
        case "badge_chaya_lover":
          meetsCriteria = state.phraseTeaSolved === true;
          break;
        case "badge_conversationalist":
          meetsCriteria = state.completedDialogues.length >= 1;
          break;
        case "badge_streak_star":
          meetsCriteria = state.streak >= 3;
          break;
        case "badge_collector_gold":
          // Earned 4 other badges (excluding this gold badge itself)
          meetsCriteria = state.badges.filter(id => id !== "badge_collector_gold").length >= 4;
          break;
      }

      if (meetsCriteria) {
        state.badges.push(badge.id);
        newlyUnlocked.push(badge);

        // Auto-unlock corresponding cultural fact
        const fact = culturalFacts.find(f => f.unlockedBy === badge.id);
        if (fact && !state.unlockedCulturalFacts.includes(fact.id)) {
          state.unlockedCulturalFacts.push(fact.id);
        }
      }
    });

    // Final check for the gold collector badge after unlocking new ones
    if (!state.badges.includes("badge_collector_gold")) {
      const otherBadgesCount = state.badges.filter(id => id !== "badge_collector_gold").length;
      if (otherBadgesCount >= 4) {
        const goldBadge = badges.find(b => b.id === "badge_collector_gold");
        if (goldBadge) {
          state.badges.push(goldBadge.id);
          newlyUnlocked.push(goldBadge);
          
          const goldFact = culturalFacts.find(f => f.unlockedBy === goldBadge.id);
          if (goldFact && !state.unlockedCulturalFacts.includes(goldFact.id)) {
            state.unlockedCulturalFacts.push(goldFact.id);
          }
        }
      }
    }

    return newlyUnlocked;
  }
};
