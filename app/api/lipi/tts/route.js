import { NextResponse } from "next/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
  "X-Data-License": "Open API - Lipi Malayalam Speech Engine"
};

function corsResponse(data, status = 200) {
  return NextResponse.json(data, { status, headers: CORS_HEADERS });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const text = searchParams.get("text");

    if (!text) {
      return corsResponse({ error: "Missing text parameter. Usage: /api/lipi/tts?text=നമസ്കാരം" }, 400);
    }

    const cleanText = text.trim();
    const isMalayalam = /[\u0D00-\u0D7F]/.test(cleanText);

    // Build Web Speech API synthesis configuration
    const webSpeechConfig = {
      lang: "ml-IN",
      voiceName: "Google മലയാളം (Malayalam) or fallback Indic Voice",
      rate: 0.9,
      pitch: 1.0
    };

    // Google Translate TTS Public Endpoint Fallback
    const fallbackAudioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanText)}&tl=${isMalayalam ? 'ml' : 'en'}&client=tw-ob`;

    return corsResponse({
      queryText: cleanText,
      languageCode: isMalayalam ? "ml-IN" : "en-US",
      audioUrl: fallbackAudioUrl,
      webSpeechConfig: webSpeechConfig,
      ssml: `<speak><lang xml:lang="${isMalayalam ? 'ml-IN' : 'en-US'}">${cleanText}</lang></speak>`
    });
  } catch (err) {
    return corsResponse({ error: "Speech metadata generation failed", details: err.message }, 500);
  }
}
