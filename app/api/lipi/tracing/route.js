import { NextResponse } from "next/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
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

const TRACING_DATASET = [
  {
    char: "അ",
    category: "Swarangal (Vowels)",
    phonetic: "A",
    strokeCount: 3,
    paths: [
      "M 30,50 C 30,20 70,20 70,50 C 70,80 30,80 50,110",
      "M 50,110 L 110,110",
      "M 90,50 L 90,140"
    ],
    audioSymbol: "a",
    difficulty: "Easy"
  },
  {
    char: "ആ",
    category: "Swarangal (Vowels)",
    phonetic: "Aa",
    strokeCount: 4,
    paths: [
      "M 30,50 C 30,20 70,20 70,50 C 70,80 30,80 50,110",
      "M 50,110 L 110,110",
      "M 90,50 L 90,140",
      "M 90,140 C 130,140 130,50 110,50"
    ],
    audioSymbol: "aa",
    difficulty: "Easy"
  },
  {
    char: "ഇ",
    category: "Swarangal (Vowels)",
    phonetic: "I",
    strokeCount: 3,
    paths: [
      "M 40,40 C 80,20 80,80 40,80",
      "M 40,80 C 10,80 10,130 50,130",
      "M 50,130 L 110,130"
    ],
    audioSymbol: "i",
    difficulty: "Medium"
  },
  {
    char: "ക",
    category: "Vyanjanangal (Consonants)",
    phonetic: "Ka",
    strokeCount: 3,
    paths: [
      "M 30,60 C 30,20 70,20 70,60 C 70,120 30,120 30,60",
      "M 70,60 C 110,60 110,120 70,120",
      "M 30,90 L 110,90"
    ],
    audioSymbol: "ka",
    difficulty: "Easy"
  },
  {
    char: "ഗ",
    category: "Vyanjanangal (Consonants)",
    phonetic: "Ga",
    strokeCount: 2,
    paths: [
      "M 30,120 L 30,50 C 30,20 70,20 70,50 L 70,120",
      "M 70,80 L 110,80 L 110,120"
    ],
    audioSymbol: "ga",
    difficulty: "Easy"
  },
  {
    char: "ൻ",
    category: "Chillaksharam",
    phonetic: "N (Chillu)",
    strokeCount: 2,
    paths: [
      "M 40,50 C 40,30 80,30 80,50 L 80,100",
      "M 80,100 C 120,100 120,140 80,140"
    ],
    audioSymbol: "n_chillu",
    difficulty: "Medium"
  }
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const charParam = searchParams.get("char");
    const categoryParam = searchParams.get("category");

    let results = [...TRACING_DATASET];

    if (charParam) {
      results = results.filter(item => item.char === charParam.trim() || item.phonetic.toLowerCase() === charParam.trim().toLowerCase());
    }

    if (categoryParam) {
      results = results.filter(item => item.category.toLowerCase().includes(categoryParam.trim().toLowerCase()));
    }

    return corsResponse({
      count: results.length,
      characters: results,
      viewBox: "0 0 160 160",
      strokeWidth: 6,
      license: "Open API - Lipi Tracing Engine"
    });
  } catch (err) {
    return corsResponse({ error: "Failed to fetch character stroke data", details: err.message }, 500);
  }
}
