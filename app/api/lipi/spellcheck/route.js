import { NextResponse } from "next/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
  "X-Data-License": "Open API - Lipi Malayalam Suite"
};

function corsResponse(data, status = 200) {
  return NextResponse.json(data, { status, headers: CORS_HEADERS });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

// Levenshtein distance algorithm
function levenshteinDistance(a, b) {
  const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

const COMMON_DICTIONARY = [
  "നമസ്കാരം", "നന്ദി", "കേരളം", "മലയാളം", "സ്നേഹം", "സന്തോഷം",
  "വീട്", "വെള്ളം", "ചോറ്", "കാപ്പി", "ചായ", "സുഖമാണോ", "എവിടെ",
  "എന്തൊക്കെ", "വരൂ", "പോകാം", "ആരാണ്", "ശുഭദിനം", "രാത്രി", "പ്രഭാതം",
  "സുപ്രഭാതം", "വിദ്യാലയം", "പുസ്തകം", "സൂര്യൻ", "ചന്ദ്രൻ", "നക്ഷത്രം",
  "മരം", "പൂവ്", "കായ", "ആകാശം", "ഭൂമി", "മഴ", "കാറ്റ്", "തീ"
];

const COMMON_TYPOS = {
  "നമസ്കാരംം": "നമസ്കാരം",
  "നമസ്കരം": "നമസ്കാരം",
  "നന്ദീ": "നന്ദി",
  "കേരളമ്": "കേരളം",
  "മളയാളം": "മലയാളം",
  "സനേഹം": "സ്നേഹം",
  "സന്തൊഷം": "സന്തോഷം",
  "വെള്ളമ്": "വെള്ളം",
  "നമസ്ക്കാരം": "നമസ്കാരം"
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const text = searchParams.get("text");

    if (!text) {
      return corsResponse({ error: "Missing text parameter. Usage: /api/lipi/spellcheck?text=നമസ്കരം" }, 400);
    }

    const trimmed = text.trim();
    let isCorrect = COMMON_DICTIONARY.includes(trimmed);
    let suggestion = trimmed;

    if (COMMON_TYPOS[trimmed]) {
      isCorrect = false;
      suggestion = COMMON_TYPOS[trimmed];
    } else if (!isCorrect) {
      // Find nearest word using Levenshtein distance
      let minDistance = Infinity;
      let bestMatch = trimmed;

      for (const dictWord of COMMON_DICTIONARY) {
        const dist = levenshteinDistance(trimmed, dictWord);
        if (dist < minDistance) {
          minDistance = dist;
          bestMatch = dictWord;
        }
      }

      if (minDistance <= 3) {
        suggestion = bestMatch;
      }
    }

    // Suggestions list
    const candidates = COMMON_DICTIONARY
      .map(w => ({ word: w, distance: levenshteinDistance(trimmed, w) }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3)
      .map(item => item.word);

    return corsResponse({
      query: trimmed,
      isCorrect: isCorrect,
      suggestedCorrection: suggestion,
      confidenceScore: isCorrect ? 1.0 : (suggestion !== trimmed ? 0.85 : 0.5),
      alternativeSuggestions: candidates
    });
  } catch (err) {
    return corsResponse({ error: "Spellcheck failed", details: err.message }, 500);
  }
}
