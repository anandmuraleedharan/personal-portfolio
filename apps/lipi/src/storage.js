// Storage Bridge for Lipi Learning App
// Decouples storage mechanisms from UI components to ease future packaging (e.g., Capacitor, SQLite)

class MemoryStorage {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store.hasOwnProperty(key) ? this.store[key] : null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

class LocalStorageBridge {
  getItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn("localStorage.getItem blocked, falling back to memory", e);
      return null;
    }
  }
  setItem(key, value) {
    try {
      localStorage.setItem(key, String(value));
    } catch (e) {
      console.warn("localStorage.setItem blocked", e);
    }
  }
  removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn("localStorage.removeItem blocked", e);
    }
  }
  clear() {
    try {
      localStorage.clear();
    } catch (e) {
      console.warn("localStorage.clear blocked", e);
    }
  }
}

// Determine available storage provider
function determineStorageProvider() {
  try {
    const testKey = "__lipi_storage_test__";
    localStorage.setItem(testKey, "1");
    localStorage.removeItem(testKey);
    return new LocalStorageBridge();
  } catch (e) {
    console.info("Using in-memory storage fallback");
    return new MemoryStorage();
  }
}

const provider = determineStorageProvider();

const DEFAULT_STATE = {
  xp: 0,
  level: 1,
  hearts: 5,
  streak: 0,
  lastActiveDate: null,
  badges: [],
  unlockedCulturalFacts: [],
  completedTracing: [],
  completedDialogues: [],
  wordsMatchedCount: 0,
  phraseTeaSolved: false,
  user: {
    name: null,
    avatar: "🐘"
  },
  settings: {
    muteSFX: false,
    speechRate: 0.9,
    theme: "forest"
  },
  customVocabulary: []
};

export const StorageProvider = {
  get(key, defaultValue = null) {
    const val = provider.getItem(key);
    if (val === null) return defaultValue;
    try {
      return JSON.parse(val);
    } catch {
      return val;
    }
  },

  set(key, value) {
    provider.setItem(key, JSON.stringify(value));
  },

  remove(key) {
    provider.removeItem(key);
  },

  clear() {
    provider.clear();
  },

  // Save the complete game state
  saveGameState(state) {
    this.set("lipi_game_state", state);
  },

  // Load game state, returning default if empty
  loadGameState() {
    const state = this.get("lipi_game_state");
    if (!state) {
      return { ...DEFAULT_STATE };
    }
    // Merge to ensure backwards compatibility with new state fields
    return { ...DEFAULT_STATE, ...state };
  },

  resetGameState() {
    this.saveGameState(DEFAULT_STATE);
    return { ...DEFAULT_STATE };
  }
};
