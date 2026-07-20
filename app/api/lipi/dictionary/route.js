import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Feature toggle to expose the endpoint as a public API with CORS support
// Keep this true to expose the API for public services
const IS_PUBLIC_API = true;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
  "X-Data-License": "CC BY-SA 2.5 IN (Olam English-Malayalam Corpus)"
};

// Response helper that wraps JSON with CORS headers only when enabled
function corsResponse(data, status = 200) {
  const options = { status };
  if (IS_PUBLIC_API) {
    options.headers = CORS_HEADERS;
  }
  return NextResponse.json(data, options);
}

// Preflight handler for cross-origin requests
export async function OPTIONS() {
  if (!IS_PUBLIC_API) {
    return new NextResponse(null, { status: 405 }); // Method Not Allowed
  }
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS
  });
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const word = searchParams.get("word");

    if (!word) {
      return corsResponse({ error: "Missing word parameter" }, 400);
    }

    const trimmedWord = word.trim();
    const queryWord = trimmedWord.toLowerCase();
    const isEnglish = /^[a-z\s'-]+$/i.test(queryWord);

    // Step 0: Try local partitioned Olam Dictionary Lookup first
    if (isEnglish) {
      const firstChar = queryWord.charAt(0);
      const partitionKey = (firstChar >= 'a' && firstChar <= 'z') ? firstChar : 'other';
      const partitionPath = path.join(process.cwd(), 'app/api/lipi/dictionary/data', `${partitionKey}.json`);
      
      if (fs.existsSync(partitionPath)) {
        try {
          const dictData = JSON.parse(fs.readFileSync(partitionPath, 'utf8'));
          if (dictData && dictData[queryWord]) {
            const entry = dictData[queryWord];
            const partsOfSpeech = Object.keys(entry.definitions);
            const firstPOS = partsOfSpeech[0] || 'Noun';
            const definitions = entry.definitions[firstPOS] || [];
            const primaryTranslation = definitions[0] || "തർജ്ജമ ലഭ്യമല്ല";

            // Format category name
            let category = "Vocabulary";
            if (firstPOS.startsWith('n')) category = "Noun";
            else if (firstPOS.startsWith('v')) category = "Verb";
            else if (firstPOS.startsWith('a')) category = "Adjective";
            else if (firstPOS.startsWith('pron')) category = "Pronoun";
            else if (firstPOS.startsWith('idm')) category = "Expression";

            // Generate template example sentences
            const exampleMalayalam = `ഞാൻ ${primaryTranslation} കാണുന്നു.`;
            const exampleEnglish = `I see the ${entry.word.toLowerCase()}.`;

            // Compile other definitions as synonyms
            const synonymsList = [];
            partsOfSpeech.forEach(pos => {
              entry.definitions[pos].forEach(def => {
                if (def !== primaryTranslation && !synonymsList.includes(def)) {
                  synonymsList.push(def);
                }
              });
            });

            console.log(`[Lipi Dict] Local Olam HIT for word "${trimmedWord}": ${primaryTranslation}`);
            return corsResponse({
              malayalam: primaryTranslation,
              phonetic: entry.word.charAt(0).toUpperCase() + entry.word.slice(1),
              english: entry.word,
              category: category,
              difficulty: entry.word.length > 7 ? "Medium" : "Easy",
              exampleMalayalam: exampleMalayalam,
              exampleEnglish: exampleEnglish,
              synonyms: synonymsList.slice(0, 3).length > 0 ? synonymsList.slice(0, 3) : ["നിഘണ്ടു"]
            });
          }
        } catch (err) {
          console.error("Error reading Olam partition:", err);
        }
      }
    }

    const isMalayalam = /[\u0D00-\u0D7F]/.test(trimmedWord);
    let sourceLang = isMalayalam ? "ml" : "en";
    let targetLang = isMalayalam ? "en" : "ml";

    let translation = "";
    let synonyms = [];

    // Step 1: Attempt lookup via free open-source MyMemory Translation API
    try {
      const myMemoryUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmedWord)}&langpair=${sourceLang}|${targetLang}`;
      const myMemoryRes = await fetch(myMemoryUrl, {
        headers: { "User-Agent": "LipiApp/1.0" }
      });
      
      if (myMemoryRes.ok) {
        const data = await myMemoryRes.json();
        if (data && data.responseData && data.responseData.translatedText) {
          translation = data.responseData.translatedText.trim();
          
          // Capture alternative matches as potential synonyms
          if (data.matches && Array.isArray(data.matches)) {
            synonyms = data.matches
              .map(m => m.translation.trim())
              .filter(t => t !== translation && t !== trimmedWord && t.length > 0)
              .slice(0, 3);
          }
        }
      }
    } catch (apiErr) {
      console.warn("MyMemory Translation API fetch failed:", apiErr);
    }

    // Determine target words for AI enrichment
    const englishWord = isMalayalam ? (translation || "Translation unknown") : trimmedWord;
    const malayalamWord = isMalayalam ? trimmedWord : (translation || "തർജ്ജമ ലഭ്യമല്ല");

    // Step 2: OpenRouter AI Enrichment cascade
    const openrouterKey = process.env.OPENROUTER_API_KEY;
    
    if (!openrouterKey) {
      console.warn("OPENROUTER_API_KEY is not defined in environment. Falling back to local template generator.");
      return corsResponse(generateFallbackResponse(englishWord, malayalamWord, synonyms));
    }

    const models = [
      "google/gemma-2-9b-it:free",
      "meta-llama/llama-3.3-70b-instruct:free"
    ];

    let aiResponseText = "";
    let aiSuccess = false;

    for (const model of models) {
      try {
        const openrouterRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${openrouterKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://anandmuraleedharan.com",
            "X-Title": "Lipi Malayalam Learning App"
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: "system",
                content: "You are a professional Malayalam language expert. Your job is to return a dictionary definition card as clean, raw JSON. Do not write explanations, do not include markdown blocks, and do not wrap in ```json backticks. Return only valid JSON."
              },
              {
                role: "user",
                content: `Enrich this translation: English word: "${englishWord}", Malayalam word: "${malayalamWord}".
                
                Respond in this exact JSON schema:
                {
                  "malayalam": "${malayalamWord}",
                  "phonetic": "phonetic english spelling of the malayalam word",
                  "english": "${englishWord}",
                  "category": "Noun | Verb | Adjective | Pronoun | Expression",
                  "difficulty": "Easy | Medium | Hard",
                  "exampleMalayalam": "a natural Malayalam sentence using the malayalam word",
                  "exampleEnglish": "english translation of that example sentence",
                  "synonyms": ["up to 3 malayalam synonyms for the word"]
                }`
              }
            ],
            temperature: 0.3
          })
        });

        if (openrouterRes.ok) {
          const aiData = await openrouterRes.json();
          if (aiData.choices && aiData.choices[0] && aiData.choices[0].message) {
            aiResponseText = aiData.choices[0].message.content.trim();
            aiSuccess = true;
            break; // Success! Break out of model loop
          }
        }
      } catch (err) {
        console.warn(`OpenRouter lookup failed with model ${model}:`, err);
      }
    }

    if (aiSuccess) {
      try {
        // Strip markdown backticks if the model returned them anyway
        const sanitizedJson = aiResponseText.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
        const parsedResult = JSON.parse(sanitizedJson);
        return corsResponse(parsedResult);
      } catch (parseErr) {
        console.error("Failed to parse OpenRouter JSON response:", parseErr, aiResponseText);
      }
    }

    // Step 3: Fallback response if AI calls fail
    return corsResponse(generateFallbackResponse(englishWord, malayalamWord, synonyms));

  } catch (globalErr) {
    console.error("Global dictionary API route error:", globalErr);
    return corsResponse({ error: "Internal server error" }, 500);
  }
}

// Generate a clean local backup payload if APIs fail or key is missing
function generateFallbackResponse(english, malayalam, synonyms = []) {
  return {
    malayalam: malayalam,
    phonetic: english.charAt(0).toUpperCase() + english.slice(1),
    english: english,
    category: "Vocabulary",
    difficulty: "Medium",
    exampleMalayalam: `ഞാൻ ${malayalam} പഠിക്കുകയാണ്.`,
    exampleEnglish: `I am learning ${english}.`,
    synonyms: synonyms.length > 0 ? synonyms : ["നിഘണ്ടു"]
  };
}
