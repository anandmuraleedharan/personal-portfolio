// Developer API Documentation component inside Lipi
import { AudioEngine } from '../audio.js';

export function mountApiDocs(container, navigateToTab, triggerToast) {
  let wordInput = 'coconut';
  let responseData = null;
  let loadingState = false;

  function getApiUrl() {
    const apiHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:3000' 
      : 'https://anandmuraleedharan.com';
    return `${apiHost}/api/lipi/dictionary?word=${encodeURIComponent(wordInput.trim())}`;
  }

  async function handleTestApi() {
    if (!wordInput.trim()) return;
    loadingState = true;
    render();

    try {
      const url = getApiUrl();
      const res = await fetch(url);
      responseData = await res.json();
    } catch (err) {
      responseData = { error: "Failed to connect to API", details: err.message };
    } finally {
      loadingState = false;
      render();
    }
  }

  function render() {
    const html = `
      <div class="apidocs-container glass-card" style="padding: 2.5rem; max-width: 800px; margin: 0 auto;">
        <div style="border-bottom: 1px solid var(--color-border); padding-bottom: 1.5rem; margin-bottom: 2rem;">
          <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--color-gold); font-weight: 700; letter-spacing: 1px;">
            🚀 Open Developer API
          </span>
          <h2 style="font-size: 2.2rem; font-weight: 800; color: var(--color-text); margin: 0.5rem 0 1rem 0;">
            Lipi Malayalam Dictionary API
          </h2>
          <p style="color: var(--color-text-muted); font-size: 1rem; line-height: 1.6; margin: 0;">
            Exposes Lipi's dictionary translation engine (combining Olam corpus lookups, MyMemory translations, and LLM-enrichments) as a free public REST API for developers.
          </p>
        </div>

        <!-- License Alert -->
        <div style="background: rgba(255, 215, 0, 0.04); border: 1px solid rgba(255, 215, 0, 0.2); border-radius: 12px; padding: 1.25rem; margin-bottom: 2rem;">
          <h3 style="color: var(--color-gold); font-size: 1.05rem; margin-top: 0; margin-bottom: 0.5rem; font-weight: 700;">
            ⚖️ Open Data License & Attribution
          </h3>
          <p style="color: var(--color-text-muted); font-size: 0.9rem; line-height: 1.5; margin: 0;">
            This API is powered by the **Olam English-Malayalam Corpus** (<a href="https://olam.in" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-gold)", textDecoration: "underline" }}>olam.in</a>) licensed under the **Creative Commons Attribution-ShareAlike 2.5 India License** (CC BY-SA 2.5 IN) and **GNU GPL v3**. This API is provided as a free public service with CORS support.
          </p>
        </div>

        <!-- API Specs -->
        <div style="margin-bottom: 2.5rem;">
          <h3 style="font-size: 1.3rem; margin-bottom: 1rem; font-weight: 700;">API Endpoint</h3>
          <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid var(--color-border); border-radius: 8px; padding: 1.25rem; font-family: monospace; font-size: 0.95rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
              <span style="background: #10b981; color: white; padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: 700; font-size: 0.75rem;">GET</span>
              <span style="color: #ffd700;">/api/lipi/dictionary?word={term}</span>
            </div>
            <div style="color: var(--color-text-muted); font-size: 0.85rem; margin-top: 0.75rem; border-top: 1px solid var(--color-border); padding-top: 0.75rem;">
              <strong>Query Parameters:</strong><br/>
              <code>word</code> (string, required) - The English or Malayalam word to query.
            </div>
          </div>
        </div>

        <!-- Interactive Playground -->
        <div style="margin-bottom: 2.5rem;">
          <h3 style="font-size: 1.3rem; margin-bottom: 1rem; font-weight: 700;">Try the Sandbox</h3>
          <div style="display: flex; gap: 0.75rem; margin-bottom: 1.25rem;">
            <input 
              type="text" 
              id="sandboxInput" 
              value="${wordInput}" 
              placeholder="Enter word (e.g., coconut)" 
              style="flex-grow: 1; padding: 0.75rem 1rem; background: rgba(0,0,0,0.2); border: 1px solid var(--color-border); border-radius: 8px; color: var(--color-text); font-size: 0.95rem;"
            />
            <button 
              id="sandboxSendBtn" 
              class="btn btn-primary" 
              style="max-width: 150px; font-weight: 700;"
              ${loadingState ? 'disabled' : ''}
            >
              ${loadingState ? 'Sending...' : 'Send'}
            </button>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <span style="font-size: 0.8rem; color: var(--color-text-muted); display: block; margin-bottom: 0.4rem;">Endpoint URL:</span>
            <pre id="urlPreviewBlock" style="background: rgba(0,0,0,0.3); padding: 0.75rem 1rem; border-radius: 6px; font-size: 0.85rem; color: var(--color-text-muted); overflow-x: auto; border: 1px solid var(--color-border); margin: 0; font-family: monospace;">${getApiUrl()}</pre>
          </div>

          ${responseData ? `
            <div>
              <span style="font-size: 0.8rem; color: var(--color-text-muted); display: block; margin-bottom: 0.4rem;">JSON Response:</span>
              <pre style="background: rgba(0,0,0,0.4); padding: 1.25rem; border-radius: 8px; font-size: 0.88rem; color: #34d399; overflow-x: auto; max-height: 300px; border: 1px solid var(--color-border); margin: 0; font-family: monospace; overflow-y: auto;">${JSON.stringify(responseData, null, 2)}</pre>
            </div>
          ` : ''}
        </div>

        <div style="display: flex; justify-content: center; margin-top: 2rem; border-top: 1px solid var(--color-border); padding-top: 1.5rem;">
          <button id="exitApiDocsBtn" class="btn btn-secondary" style="max-width: 250px;">Return to Dashboard</button>
        </div>
      </div>
    `;

    container.innerHTML = html;

    // Attach Event Listeners
    const input = container.querySelector('#sandboxInput');
    const urlPreview = container.querySelector('#urlPreviewBlock');
    if (input) {
      input.addEventListener('input', (e) => {
        wordInput = e.target.value;
        if (urlPreview) {
          urlPreview.textContent = getApiUrl();
        }
      });
      // Allow enter key submission
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          AudioEngine.playClick();
          handleTestApi();
        }
      });
    }

    const sendBtn = container.querySelector('#sandboxSendBtn');
    if (sendBtn) {
      sendBtn.addEventListener('click', () => {
        AudioEngine.playClick();
        handleTestApi();
      });
    }

    const exitBtn = container.querySelector('#exitApiDocsBtn');
    if (exitBtn) {
      exitBtn.addEventListener('click', () => {
        AudioEngine.playClick();
        navigateToTab('dashboard');
      });
    }
  }

  // Initial render
  render();
}
