# CogPoker

A collaborative, real-time scrum story pointing application. CogPoker uses WebSocket broadcast/presence messaging to synchronise votes and incorporates Web Audio synthesizers alongside an active AI estimator companion.

---

## 📁 Submodule Project Structure

Located at `apps/cogpoker`:
```
apps/cogpoker/
├── app/
│   ├── api/
│   │   └── realtime/
│   │       └── route.ts   # In-memory polling route (failover fallback)
│   ├── room/
│   │   └── [id]/
│   │       └── page.tsx   # Real-time room console & analytics view
│   ├── page.tsx           # Moderator landing & room creator page
│   └── layout.tsx
├── lib/
│   ├── audio.ts           # Web Audio API themes & sound synthesizers
│   ├── gemini.ts          # OpenRouter races & heuristics
│   └── supabase.ts        # Supabase client configurations
├── tests/
│   ├── cogpoker.spec.ts       # E2E room flow validation test
│   └── cogpoker-scale.spec.ts # 10-user, 10-round sizing scale test
├── package.json
└── playwright.config.ts
```

---

## 📡 WebSocket Broadcast & Presence Payloads

All interactions (voter registration, state updates, vote castings, card reveals, and resets) occur via websocket channels:

* **Channel Name**: `poker_room:<room_id>`
* **Broadcast Vote Cast Payload**:
  ```json
  {
    "type": "broadcast",
    "event": "VOTE_CAST",
    "payload": {
      "userId": "usr_99b1a",
      "selectedCard": "8"
    }
  }
  ```
* **Presence Roster Payload**:
  ```json
  {
    "userId": "usr_99b1a",
    "username": "Anand",
    "joinedAt": 1783569459444,
    "role": "Moderator",
    "voteCast": true
  }
  ```

---

## 📊 Real-Time Sizing Analytics & Calculations

Upon card reveal, the room console runs calculations to display sizing metrics:

### 1. Team Consensus Index
Calculates standard deviation (\(\sigma\)) of votes to evaluate alignment.
Let \(x_i\) be the numeric vote of voter \(i\), and \(\bar{x}\) the mean score:
\[\sigma = \sqrt{\frac{1}{N}\sum_{i=1}^{N}(x_i - \bar{x})^2}\]
* **Consensus Score (%)**: Mapped using a linear index:
  \[\text{Consensus} = \max(0, \min(100, 100 - (\sigma \times 20)))\]
  * \(\sigma = 0\) yields **100% Agreement (Strong Consensus)**.
  * \(\sigma \ge 5\) yields **Low Consensus Alert (High Variance)**.

### 2. Factor Uncertainty Levels
Visualizes average factor selections (Complexity, Dependencies, Verification Overhead). The highest average is flagged as the **Critical Sizing Bottleneck**.

---

## 🧠 Parallel AI Estimator & Heuristics

When the host broadcasts a ticket update, CogPoker queries OpenRouter free models in parallel. Whichever model completes first wins. If all calls time out (3.5 seconds), the client executes a local heuristic backup:

```typescript
// Local heuristic size fallback
export function getLocalHeuristicEstimate(
  title: string, 
  complexity: number, 
  dependencies: number, 
  testingOverhead: number
): string {
  const baseScore = complexity * 1.5 + dependencies * 1.2 + testingOverhead * 1.0;
  const fibonacciDeck = [1, 2, 3, 5, 8, 13, 21];
  
  // Find nearest Fibonacci number
  const nearest = fibonacciDeck.reduce((prev, curr) => 
    Math.abs(curr - baseScore) < Math.abs(prev - baseScore) ? curr : prev
  );
  
  return `${nearest} Points (Local Heuristic Fallback - Factors Analysis)`;
}
```

---

## 🔊 Browser Audio Synthesis (Web Audio API)

Sound effects are synthesized programmatically inside the browser thread using `OscillatorNode` and `GainNode` to ensure $0/month bandwidth costs. Below is the chiptune coin chime for the **Arcade Theme**:

```typescript
export function playArcadeCoinChime(audioCtx: AudioContext) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = "square";
  
  // Double-note arpeggio (Arcade Coin Effect)
  const now = audioCtx.currentTime;
  osc.frequency.setValueAtTime(987.77, now); // B5 note
  osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6 note
  
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start(now);
  osc.stop(now + 0.35);
}
```

---

## 🧪 Scalability & Integration Testing Logs

Playwright tests simulate voter behaviors under load:

```bash
$ npx playwright test tests/cogpoker-scale.spec.ts

Running 1 test using 1 worker

[SCALE TEST] Room VRBNXPZ generated successfully.
[SCALE TEST] Moderator joined room. Setting deck configuration: Fibonacci.
[SCALE TEST] 9 Estimator browser sessions initialized.
[SCALE TEST] Starting Round 1 of 10...
  - Broadcasting Ticket CP-101: "Setup Docker container databases"
  - Estimators voting: [1, 2, 3, 5, 8, 5, 3, 5, 8]
  - Consensus: 75% | Variance: Normal
  - Moderator reveals votes. Playback sound trigger verified.
[SCALE TEST] Starting Round 2...
...
[SCALE TEST] Round 10 completed and verified successfully.
[SCALE TEST] Terminating scale session. Active sockets closed.

  1 passed (1.3m)
```
