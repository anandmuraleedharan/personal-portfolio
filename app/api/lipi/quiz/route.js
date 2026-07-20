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

const QUESTION_BANK = [
  {
    id: "q1",
    category: "Vocabulary",
    question: "What is the Malayalam word for 'Water'?",
    options: ["വെള്ളം (Vellam)", "ചോറ് (Choru)", "മരം (Maram)", "ആകാശം (Aakasham)"],
    answerIndex: 0,
    explanation: "'വെള്ളം' (Vellam) means Water in Malayalam."
  },
  {
    id: "q2",
    category: "Vocabulary",
    question: "What does 'നന്ദി' (Nandi) mean in English?",
    options: ["Hello", "Thank you", "Goodbye", "Welcome"],
    answerIndex: 1,
    explanation: "'നന്ദി' (Nandi) is used to express gratitude or 'Thank you'."
  },
  {
    id: "q3",
    category: "Grammar",
    question: "Which of the following is a Malayalam Chillaksharam (Chillu letter)?",
    options: ["അ", "ക", "ൻ", "മ"],
    answerIndex: 2,
    explanation: "'ൻ' (n-chillu) is one of the pure consonant Chillu letters in Malayalam."
  },
  {
    id: "q4",
    category: "Culture & Proverbs",
    question: "Complete the proverb: 'മിന്നുന്നതെല്ലാം ______ அல்ல (പൊന്നല്ല)'",
    options: ["വെള്ളം", "പൊന്നല്ല", "പൂവ്", "തീ"],
    answerIndex: 1,
    explanation: "The famous proverb is 'മിന്നുന്നതെല്ലാം പൊന്നല്ല' (All that glitters is not gold)."
  },
  {
    id: "q5",
    category: "Numerals",
    question: "What is the value of the Malayalam numeral '൨'?",
    options: ["1", "2", "3", "5"],
    answerIndex: 1,
    explanation: "'൨' represents the number 2 in traditional Malayalam script."
  }
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const countParam = parseInt(searchParams.get("count") || "5", 10);
    const category = searchParams.get("category");

    let filtered = [...QUESTION_BANK];

    if (category) {
      filtered = filtered.filter(q => q.category.toLowerCase() === category.toLowerCase());
    }

    const questions = filtered.slice(0, Math.max(1, countParam));

    return corsResponse({
      count: questions.length,
      questions: questions,
      generatedAt: new Date().toISOString()
    });
  } catch (err) {
    return corsResponse({ error: "Quiz generation failed", details: err.message }, 500);
  }
}
