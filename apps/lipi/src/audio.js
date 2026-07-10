// Lipi Audio & Speech Engine
// Uses Web Audio API for Synthesizer SFX and Web Speech API for TTS & Speech Recognition

let audioCtx = null;
let sfxMuted = false;
let speechRate = 0.9;

// Initialize Web Audio Context on first user interaction
function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Play synthesized tones for sound effects
function playTone(freqs, duration = 0.1, type = 'sine', slide = false) {
  if (sfxMuted) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Create nodes
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = type;
    
    // Set frequency
    if (Array.isArray(freqs) && freqs.length > 1) {
      if (slide) {
        // Frequency sweep (slide)
        osc.frequency.setValueAtTime(freqs[0], now);
        osc.frequency.exponentialRampToValueAtTime(freqs[1], now + duration);
      } else {
        // Arpeggio / step sequence
        const stepTime = duration / freqs.length;
        freqs.forEach((freq, idx) => {
          osc.frequency.setValueAtTime(freq, now + idx * stepTime);
        });
      }
    } else {
      osc.frequency.setValueAtTime(Array.isArray(freqs) ? freqs[0] : freqs, now);
    }
    
    // Volume envelope
    gainNode.gain.setValueAtTime(0.15, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + duration);
  } catch (err) {
    console.warn("Audio synthesis failed:", err);
  }
}

// Local Web Speech Synthesis helper
export const AudioEngine = {
  updateSettings(settings) {
    sfxMuted = settings.muteSFX;
    speechRate = settings.speechRate;
  },
  // SFX: Quick click/tap sound
  playClick() {
    playTone(600, 0.05, 'triangle');
  },

  // SFX: Successful match or correct trace
  playSuccess() {
    // Pleasant rising arpeggio
    playTone([523.25, 659.25, 783.99, 1046.50], 0.3, 'sine'); // C5, E5, G5, C6
  },

  // SFX: Failed matching or drawing error
  playFailure() {
    // Buzz/descending slide
    playTone([220, 110], 0.4, 'sawtooth', true); // A3 to A2 slide
  },

  // SFX: Match grid match (short, satisfying)
  playMatch() {
    playTone([440, 880], 0.15, 'sine'); // A4 to A5 chime
  },

  // SFX: Majestic level-up fanfare
  playLevelUp() {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      
      // Multi-note fan-out
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C4 to C6 arpeggio
      notes.forEach((freq, index) => {
        setTimeout(() => {
          playTone(freq, 0.25, 'sine');
        }, index * 80);
      });
    } catch (e) {
      console.warn(e);
    }
  },

  // Speech Synthesis (Text to Speech)
  speak(text, phoneticText) {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        console.warn("Text-to-Speech not supported in this browser.");
        resolve(false);
        return;
      }

      // Cancel any ongoing speaking
      window.speechSynthesis.cancel();

      // Small delay prevents silent cancel-bug on Chrome/Safari
      setTimeout(() => {
        const voices = window.speechSynthesis.getVoices();
        const malayalamVoice = voices.find(v => v.lang.startsWith('ml') || v.name.toLowerCase().includes('malayalam'));
        
        let textToSpeak = text;
        let speechLang = 'ml-IN';
        
        const utterance = new SpeechSynthesisUtterance();
        
        if (malayalamVoice) {
          utterance.voice = malayalamVoice;
          utterance.rate = speechRate;
        } else {
          // Fallback: search for Indian English voice or let browser pick
          const indEnglishVoice = voices.find(v => v.lang.startsWith('en-IN') || v.lang.startsWith('en'));
          if (indEnglishVoice) utterance.voice = indEnglishVoice;
          utterance.rate = speechRate * 0.8; // slow down fallback voice
          
          // Use phonetic translation to prevent "question mark" pronunciation
          if (phoneticText) {
            textToSpeak = phoneticText;
            speechLang = 'en-IN';
          }
        }

        utterance.text = textToSpeak;
        utterance.lang = speechLang;
        utterance.pitch = 1.1; // Appu is a baby elephant, make it sound slightly younger/higher
        
        utterance.onend = () => resolve(true);
        utterance.onerror = (e) => {
          console.warn("TTS Error:", e);
          resolve(false);
        };

        window.speechSynthesis.speak(utterance);
      }, 50);
    });
  },

  // Speech Recognition (Speech to Text) wrapper
  createSpeechRecognizer() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'ml-IN'; // Listen for Malayalam - India

    return recognition;
  }
};
