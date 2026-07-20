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

// Dictionary of high-frequency Manglish -> Malayalam exact words
const EXACT_MANGLISH_MAP = {
  "namaskaram": "നമസ്കാരം",
  "namaste": "നമസ്കാരം",
  "nandi": "നന്ദി",
  "manga": "മാങ്ങ",
  "thenga": "തേങ്ങ",
  "kerala": "കേരളം",
  "keralam": "കേരളം",
  "malayalam": "മലയാളം",
  "sneham": "സ്നേഹം",
  "santhosham": "സന്തോഷം",
  "veedu": "വീട്",
  "vellam": "വെള്ളം",
  "choru": "ചോറ്",
  "kaappi": "കാപ്പി",
  "chaaya": "ചായ",
  "sukhamano": "സുഖമാണോ",
  "evide": "എവിടെ",
  "enthoke": "എന്തൊക്കെ",
  "varoo": "വരൂ",
  "pokaam": "പോകാം",
  "aarannu": "ആരാണ്",
  "shubhadinam": "ശുഭദിനം",
  "raathri": "രാത്രി",
  "prabhatham": "പ്രഭാതം"
};

// Common reverse dictionary (Malayalam -> Manglish)
const REVERSE_MANGLISH_MAP = Object.fromEntries(
  Object.entries(EXACT_MANGLISH_MAP).map(([k, v]) => [v, k.charAt(0).toUpperCase() + k.slice(1)])
);

// Fallback phonetic transliterator algorithm
function transliterateManglish(inputStr) {
  const normalized = inputStr.trim().toLowerCase();
  if (EXACT_MANGLISH_MAP[normalized]) {
    return EXACT_MANGLISH_MAP[normalized];
  }

  // Tokenize words
  const words = normalized.split(/\s+/);
  const converted = words.map(w => {
    if (EXACT_MANGLISH_MAP[w]) return EXACT_MANGLISH_MAP[w];
    
    // Rule-based phonetic replacement
    let res = w
      .replace(/zh/g, "ഴ")
      .replace(/sh/g, "ശ")
      .replace(/ch/g, "ച")
      .replace(/th/g, "ത")
      .replace(/dh/g, "ധ")
      .replace(/nj/g, "ഞ")
      .replace(/ng/g, "ങ")
      .replace(/ph/g, "ഫ")
      .replace(/bh/g, "ഭ")
      .replace(/gh/g, "ഘ")
      .replace(/kh/g, "ഖ")
      .replace(/aa/g, "ആ")
      .replace(/ee/g, "ഈ")
      .replace(/oo/g, "ഊ")
      .replace(/ou/g, "ഔ")
      .replace(/ai/g, "ഐ")
      .replace(/ei/g, "എ")
      .replace(/a/g, "അ")
      .replace(/i/g, "ഇ")
      .replace(/u/g, "ഉ")
      .replace(/e/g, "എ")
      .replace(/o/g, "ഒ")
      .replace(/k/g, "ക")
      .replace(/g/g, "ഗ")
      .replace(/j/g, "ജ")
      .replace(/t/g, "റ്റ")
      .replace(/d/g, "ദ")
      .replace(/n/g, "ന")
      .replace(/p/g, "പ")
      .replace(/b/g, "ബ")
      .replace(/m/g, "മ")
      .replace(/y/g, "യ")
      .replace(/r/g, "ര")
      .replace(/l/g, "ല")
      .replace(/v/g, "വ")
      .replace(/w/g, "വ")
      .replace(/s/g, "സ")
      .replace(/h/g, "ഹ");

    return res;
  });

  return converted.join(" ");
}

function transliterateMalayalamToManglish(inputStr) {
  const trimmed = inputStr.trim();
  if (REVERSE_MANGLISH_MAP[trimmed]) {
    return REVERSE_MANGLISH_MAP[trimmed];
  }

  return trimmed
    .replace(/നമസ്കാരം/g, "Namaskaram")
    .replace(/നന്ദി/g, "Nandi")
    .replace(/കേരളം/g, "Keralam")
    .replace(/മലയാളം/g, "Malayalam")
    .replace(/സ്നേഹം/g, "Sneham")
    .replace(/സന്തോഷം/g, "Santhosham")
    .replace(/വീട്/g, "Veedu")
    .replace(/വെള്ളം/g, "Vellam")
    .replace(/ചോറ്/g, "Choru")
    .replace(/കാപ്പി/g, "Kaappi")
    .replace(/ചായ/g, "Chaaya")
    .replace(/സുഖമാണോ/g, "Sukhamano")
    .replace(/എവിടെ/g, "Evide")
    .replace(/എന്തൊക്കെ/g, "Enthoke")
    .replace(/വരൂ/g, "Varoo")
    .replace(/പോകാം/g, "Pokaam")
    .replace(/ആരാണ്/g, "Aarannu")
    .replace(/ശുഭദിനം/g, "Shubhadinam")
    .replace(/രാത്രി/g, "Raathri")
    .replace(/പ്രഭാതം/g, "Prabhatham");
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const text = searchParams.get("text");
    const direction = searchParams.get("direction") || "manglish2malayalam";

    if (!text) {
      return corsResponse({ error: "Missing text parameter. Usage: /api/lipi/transliterate?text=namaskaram" }, 400);
    }

    let result = "";
    if (direction === "malayalam2manglish" || /[\u0D00-\u0D7F]/.test(text)) {
      result = transliterateMalayalamToManglish(text);
    } else {
      result = transliterateManglish(text);
    }

    return corsResponse({
      original: text,
      transliterated: result,
      direction: direction,
      script: /[\u0D00-\u0D7F]/.test(result) ? "Malayalam Script (മലയാളം)" : "Latin Script (Manglish)"
    });
  } catch (err) {
    return corsResponse({ error: "Transliteration failed", details: err.message }, 500);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { text, direction = "manglish2malayalam" } = body;

    if (!text) {
      return corsResponse({ error: "Missing text in JSON body" }, 400);
    }

    let result = "";
    if (direction === "malayalam2manglish" || /[\u0D00-\u0D7F]/.test(text)) {
      result = transliterateMalayalamToManglish(text);
    } else {
      result = transliterateManglish(text);
    }

    return corsResponse({
      original: text,
      transliterated: result,
      direction: direction,
      script: /[\u0D00-\u0D7F]/.test(result) ? "Malayalam Script (മലയാളം)" : "Latin Script (Manglish)"
    });
  } catch (err) {
    return corsResponse({ error: "Invalid JSON or server error", details: err.message }, 500);
  }
}
