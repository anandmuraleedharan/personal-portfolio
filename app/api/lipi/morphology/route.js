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

// Sandhi compound database
const SANDHI_RULES_DB = {
  "മരമുകളിലുണ്ട്": {
    root: "മരം",
    parts: ["മരം (Tree)", "മുകളിൽ (Above)", "ഉണ്ട് (Is present)"],
    grammarType: "Lopa / Agama Sandhi (ലോപ/ആഗമ സന്ധി)",
    explanation: "Compound word joining 'മരം' (tree) with location modifier 'മുകളിൽ' and verb 'ഉണ്ട്'."
  },
  "വീട്ടിലുണ്ട്": {
    root: "വീട്",
    parts: ["വീട് (House)", "ഇൽ (In)", "ഉണ്ട് (Is present)"],
    grammarType: "Agama Sandhi (ആഗമ സന്ധി)",
    explanation: "Noun 'വീട്' attached with locative suffix '-ഇൽ' and verb 'ഉണ്ട്'."
  },
  "വിദ്യാലയം": {
    root: "വിദ്യ",
    parts: ["വിദ്യ (Knowledge)", "ആലയം (Abode / School)"],
    grammarType: "Deergha Sandhi (ദീർഘ സന്ധി)",
    explanation: "Sanskrit origin Sandhi combining 'വിദ്യ' and 'ആലയം'."
  },
  "സൂര്യോദയം": {
    root: "സൂര്യൻ",
    parts: ["സൂര്യൻ (Sun)", "ഉദയം (Rise)"],
    grammarType: "Guna Sandhi (ഗുണ സന്ധി)",
    explanation: "Combining noun 'സൂര്യൻ' and 'ഉദയം' to form 'Sunrise'."
  },
  "പൊൻമണി": {
    root: "പൊന്ന്",
    parts: ["പൊന്ന് (Gold)", "മണി (Bead / Gem)"],
    grammarType: "Aadesha Sandhi (ആദേശ സന്ധി)",
    explanation: "Sound modification of 'പൊന്ന്' before 'മണി'."
  }
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const word = searchParams.get("word");

    if (!word) {
      return corsResponse({ 
        error: "Missing word parameter. Usage: /api/lipi/morphology?word=മരമുകളിലുണ്ട്",
        sampleWords: Object.keys(SANDHI_RULES_DB)
      }, 400);
    }

    const trimmed = word.trim();
    if (SANDHI_RULES_DB[trimmed]) {
      const match = SANDHI_RULES_DB[trimmed];
      return corsResponse({
        word: trimmed,
        rootWord: match.root,
        morphemes: match.parts,
        sandhiType: match.grammarType,
        explanation: match.explanation,
        isCompound: true
      });
    }

    // Heuristic suffix analysis
    let detectedRoot = trimmed;
    let suffixes = [];

    if (trimmed.endsWith("ഉണ്ട്")) {
      detectedRoot = trimmed.replace(/ഉണ്ട്$/, "");
      suffixes.push("ഉണ്ട് (Verb: Present)");
    } else if (trimmed.endsWith("ഇൽ")) {
      detectedRoot = trimmed.replace(/ഇൽ$/, "");
      suffixes.push("ഇൽ (Locative Suffix: In/At)");
    } else if (trimmed.endsWith("കൾ")) {
      detectedRoot = trimmed.replace(/കൾ$/, "");
      suffixes.push("കൾ (Plural Suffix)");
    } else if (trimmed.endsWith("ഓട്")) {
      detectedRoot = trimmed.replace(/ഓട്$/, "");
      suffixes.push("ഓട് (Associative Suffix: With)");
    }

    return corsResponse({
      word: trimmed,
      rootWord: detectedRoot || trimmed,
      morphemes: [detectedRoot, ...suffixes],
      sandhiType: suffixes.length > 0 ? "Morphological Suffix Attachment" : "Single Root Word",
      explanation: suffixes.length > 0 ? `Decomposed root word '${detectedRoot}' with attached suffixes.` : "Standalone root word.",
      isCompound: suffixes.length > 0
    });

  } catch (err) {
    return corsResponse({ error: "Morphology analysis failed", details: err.message }, 500);
  }
}
