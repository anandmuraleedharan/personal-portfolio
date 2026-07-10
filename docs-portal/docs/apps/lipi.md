# Lipi Malayalam Learning Game

A highly visual, completely serverless client-side application for mastering Malayalam script, vocabulary, and conversation flows database-free. Lipi uses native browser APIs to handle stroke-by-stroke character tracing, audio synthesis, text-to-speech, and local persistence.

---

## 📁 Submodule Project Structure

Located at `apps/lipi`:
```
apps/lipi/
├── vite.config.js       # Vite build & port configuration (Port 3006)
├── index.html           # Main entry point & SEO definitions
├── package.json
├── public/
│   └── appu.png         # Appu the elephant mascot image asset
└── src/
    ├── main.js          # App shell coordinator, router & toast system
    ├── style.css        # Dark mode glassmorphic CSS design system
    ├── data.js          # static letters (stroke arrays), vocabs, and phrases
    ├── storage.js       # Decoupled Storage Provider (Bridge pattern)
    ├── gamification.js  # XP, level calculations, heart counts, streaks, and league simulation
    ├── audio.js         # Web Audio synthesizer SFX & Web Speech API wrappers
    └── components/
        ├── login.js       # Entry gateway authentication gate & avatar picker
        ├── profile.js     # Personalization panel (themes, speed dials, muting)
        ├── dashboard.js   # Progress map, achievements & AI dictionary widget
        ├── tracing.js     # Responsive canvas-based character tracer
        ├── matchgrid.js   # Match cards grid & 30s Time Attack mode
        ├── assembler.js   # Word chip sentence builder puzzle
        ├── flashcards.js  # Leitner Spaced Repetition (SRS) flippable deck
        └── cultural.js    # Locked/unlocked Kerala cultural discovery facts
```

---

## ✍️ Stroke-by-Stroke Coordinate Tracing

The character tracing canvas does not draw simple pixel paths. Instead, it tracks the user's compliance with standard Malayalam glyph stroke paths:
* **Guide Coordinate Representation:** Characters in `src/data.js` are stored as arrays of strokes, where each stroke is a sequence of `{x, y}` coordinates normalized to a `0-100` bounding box. The database contains the complete Malayalam Aksharamala catalog of **56 alphabets** (15 vowels, 36 consonants, and 5 chillu letters) with validated tracing-ready coordinates.
* **Proximity Matching:** When drawing, the app calculates the Euclidean distance to the next expected node in the active guide path:
  $$\text{dist} = \sqrt{(x_{\text{user}} - x_{\text{guide}})^2 + (y_{\text{user}} - y_{\text{guide}})^2}$$
  - If $\text{dist} \leq 25\text{px}$, the user is snapped to that node and the path advances.
  - If the user strays too far ($\text{dist} > 45\text{px}$ from all segments), the canvas border flashes red, the stroke resets, and a heart is deducted.
* **Responsive Scaling:** Normalized coordinates are mapped to the responsive viewport bounds on-the-fly, allowing smooth finger tracing on mobile devices and cursor clicks on desktop.

---

## 🧠 Decoupled Storage Bridge

To run securely within any standard WebView sandbox (e.g. mobile apps, iframe playgrounds) without throwing security exceptions if cookie/storage permissions are restricted, Lipi implements the **Bridge Pattern**:
* **StorageProvider Interface:** Code layers query `StorageProvider.get()` and `StorageProvider.set()` instead of accessing browser stores directly.
* **In-Memory Fallback:** The bridge automatically verifies if `localStorage` is writeable. If blocked, it redirects all writes to an ephemeral JavaScript memory store (`MemoryStorage`) seamlessly.

```javascript
class LocalStorageBridge {
  getItem(key) {
    try { return localStorage.getItem(key); }
    catch { return null; }
  }
  setItem(key, value) {
    try { localStorage.setItem(key, String(value)); }
    catch {}
  }
}
```

---

## 🔒 Session-Persistent Login Gate

Lipi enforces a visually immersive login screen gate on initial application load:
* **Session Handshake**: Intercepts routing calls in `src/main.js` and blocks entry to the main dashboard if a valid user profile (name and avatar) is not present.
* **Persisted Caching**: State is committed dynamically through `GamificationEngine.saveState`, writing to `localStorage` or falling back to in-memory caching.
* **Form Validation Cues**: Invalid inputs trigger tone effects (`AudioEngine.playFailure()`) and visual shake animations.

---

## 🎨 Multi-Theme Swap & Personalization

The application integrates a real-time configuration panel inside `src/components/profile.js` to modify the learning environment:
* **Dynamic CSS Variable Swapping**: Swaps the class name of `document.body` between `theme-forest`, `theme-gold`, and `theme-indigo`. CSS variables then remap colors, backgrounds, borders, and glow values instantly.
* **Audio Controls**: Mutes auditory arpeggios and buzzer feedback by writing to module-level parameters in `src/audio.js`.
* **Speech Playback Dials**: Modifies the Text-to-Speech playback speed for Malayalam definitions, selecting between slow (0.75x), normal (1.0x), and fast (1.25x).

---

## 🔊 Web Audio Synth & Web Speech API

Lipi avoids heavy MP3 asset payloads by utilizing native browser synthesizers and voice synthesis:
* **Sound FX Synthesizer:** Triggers success chimes (pleasant arpeggio C5 -> E5 -> G5 -> C6) and error buzzers by scheduling frequency changes directly on a Web Audio `OscillatorNode`:
  ```javascript
  const osc = audioCtx.createOscillator();
  osc.frequency.setValueAtTime(523.25, now); // C5
  osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
  ```
* **Text to Speech (TTS):** Appu speaks Malayalam replies using native Web Speech `SpeechSynthesisUtterance`. It dynamically searches for a native `ml-IN` voice pack. If the voice pack is missing, it automatically translates the speech text to the phonetic English spelling (e.g. pronouncing "Namaskaram! Sukhamano?" instead of reading "നമസ്കാരം! സുഖമാണോ?") using the Indian English voice to prevent "question mark" readout bugs. It uses a 50ms queue buffer to avoid WebSpeech cancel race conditions on Chrome/Safari.
* **Speech to Text (STT):** Checks speaking response pronunciation using `webkitSpeechRecognition` configured for `ml-IN`. It matches spoken text dynamically against target Malayalam string outputs.

---

## 🚀 Local Development Commands

1. **Install Dependencies**:
   ```bash
   cd apps/lipi && npm install
   ```
2. **Start Dev Server**:
   ```bash
   npm run dev
   ```
   *(Running on `http://localhost:3006`)*
3. **Compile Client Build Bundle**:
   ```bash
   npm run build
   ```
   *(Outputs relative-pathed static site assets to `dist/`)*

---

## 🌐 Public Malayalam Dictionary API

Lipi exposes its high-performance dictionary search engine as a public, CORS-compliant REST API. Any third-party application can fetch Malayalam definitions from this endpoint without facing domain routing restrictions.

### Endpoint
`GET /api/lipi/dictionary?word=<word>`

### Request Parameters
- `word` (required, string): The English word to translate (e.g. `school` or `friend`).

### Response Schema (JSON)
```json
{
  "malayalam": "വിദ്യാലയം",
  "phonetic": "Vidyaalayam",
  "english": "School",
  "category": "Noun",
  "difficulty": "Easy",
  "exampleMalayalam": "ഞാൻ വിദ്യാലയം കാണുന്നു.",
  "exampleEnglish": "I see the school.",
  "synonyms": ["പള്ളിക്കൂടം", "പാഠശാല"]
}
```

### Architecture Features
- **Partitioned Local Lookup**: Performs instant local searches on the 58,800+ word Olam corpus with zero network overhead.
- **Dynamic AI Cascading**: Connects automatically to OpenRouter LLM APIs as a fallback to translate modern or complex slang words not in the core database.
- **CORS Support**: Implements preflight `OPTIONS` requests and replies with `Access-Control-Allow-Origin: *` headers for full cross-site compatibility.
