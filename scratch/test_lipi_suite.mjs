import http from 'http';

const BASE_URL = 'http://localhost:3000';

const TEST_ENDPOINTS = [
  { path: '/api/lipi/dictionary?word=coconut', name: 'Dictionary' },
  { path: '/api/lipi/transliterate?text=namaskaram', name: 'Transliterate' },
  { path: '/api/lipi/spellcheck?text=നമസ്കരം', name: 'Spellcheck' },
  { path: '/api/lipi/proverbs?count=2', name: 'Proverbs' },
  { path: '/api/lipi/morphology?word=മരമുകളിലുണ്ട്', name: 'Morphology' },
  { path: '/api/lipi/number2words?number=1234', name: 'Number2Words' },
  { path: '/api/lipi/calendar?date=2026-07-19', name: 'Calendar' },
  { path: '/api/lipi/tracing?char=അ', name: 'Tracing' },
  { path: '/api/lipi/tts?text=നമസ്കാരം', name: 'TTS' },
  { path: '/api/lipi/quiz?count=2', name: 'Quiz' }
];

async function runTests() {
  console.log("🧪 Testing 10 Malayalam Developer API Suite Endpoints...\n");
  
  let passedCount = 0;

  for (const ep of TEST_ENDPOINTS) {
    try {
      const url = `${BASE_URL}${ep.path}`;
      const res = await fetch(url);
      const json = await res.json();
      
      if (res.status === 200 && !json.error) {
        console.log(`✅ [200 OK] ${ep.name}: ${ep.path}`);
        console.log(`   Sample Output:`, JSON.stringify(json).slice(0, 110) + '...\n');
        passedCount++;
      } else {
        console.error(`❌ [FAIL ${res.status}] ${ep.name}:`, json);
      }
    } catch (err) {
      console.error(`❌ [FETCH ERROR] ${ep.name}:`, err.message);
    }
  }

  console.log(`\n🎉 Summary: ${passedCount}/${TEST_ENDPOINTS.length} endpoints passed verification!`);
}

runTests();
