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

const MALAYALAM_DIGIT_MAP = {
  '0': '൦', '1': '൧', '2': '൨', '3': '൩', '4': '൪',
  '5': '൫', '6': '൬', '7': '൭', '8': '൮', '9': '൯'
};

const UNITS = ["പൂജ്യം", "ഒന്ന്", "രണ്ട്", "മൂന്ന്", "നാല്", "അഞ്ച്", "ആറ്", "ഏഴ്", "എട്ട്", "ഒമ്പത്", "പത്ത്"];
const TEENS = ["പത്ത്", "പതിനൊന്ന്", "പന്ത്രണ്ട്", "പതിമൂന്ന്", "പതിനാല്", "പതിനഞ്ച്", "പതിനാറ്", "പതിനേഴ്", "പതിനെട്ട്", "പത്തൊമ്പത്"];
const TENS = ["", "പത്ത്", "ഇരുപത്", "മുപ്പത്", "നാൽപ്പത്", "അൻപത്", "അറുപത്", "എഴുപത്", "എൺപത്", "തൊണ്ണൂറ്"];
const HUNDREDS = ["", "നൂറ്", "ഇരുനൂറ്", "മൂന്നൂറ്", "നാനൂറ്", "അഞ്ഞൂറ്", "അറുനൂറ്", "എഴുന്നൂറ്", "എണ്ണൂറ്", "തൊള്ളായിരം"];

function numberToMalayalamWords(num) {
  if (num < 0 || num > 999999) return "സംഖ്യ പരിധിക്ക് പുറത്താണ് (0 - 999,999 വരെ)";
  if (num <= 10) return UNITS[num];
  if (num < 20) return TEENS[num - 10];
  if (num < 100) {
    const tensVal = Math.floor(num / 10);
    const remainder = num % 10;
    if (remainder === 0) return TENS[tensVal];
    return `${TENS[tensVal]}ത്തി ${UNITS[remainder]}`;
  }
  if (num < 1000) {
    const hundredVal = Math.floor(num / 100);
    const remainder = num % 100;
    if (remainder === 0) return HUNDREDS[hundredVal];
    return `${HUNDREDS[hundredVal]}ി ${numberToMalayalamWords(remainder)}`;
  }
  if (num < 100000) {
    const thousandVal = Math.floor(num / 1000);
    const remainder = num % 1000;
    const thousandStr = thousandVal === 1 ? "ആയിരം" : `${numberToMalayalamWords(thousandVal)} ആയിരം`;
    if (remainder === 0) return thousandStr;
    return `${thousandVal === 1 ? "ആയിരത്തി" : numberToMalayalamWords(thousandVal) + " ആയിരത്തി"} ${numberToMalayalamWords(remainder)}`;
  }
  const lakhVal = Math.floor(num / 100000);
  const remainder = num % 100000;
  const lakhStr = lakhVal === 1 ? "ഒരു ലക്ഷം" : `${numberToMalayalamWords(lakhVal)} ലക്ഷം`;
  if (remainder === 0) return lakhStr;
  return `${lakhStr} ${numberToMalayalamWords(remainder)}`;
}

function convertDigitsToMalayalam(numStr) {
  return numStr.split('').map(ch => MALAYALAM_DIGIT_MAP[ch] || ch).join('');
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const numParam = searchParams.get("number");

    if (!numParam) {
      return corsResponse({ error: "Missing number parameter. Usage: /api/lipi/number2words?number=1234" }, 400);
    }

    const cleanNumStr = numParam.trim();
    const parsedInt = parseInt(cleanNumStr, 10);

    if (isNaN(parsedInt)) {
      return corsResponse({ error: "Invalid numeric value" }, 400);
    }

    const words = numberToMalayalamWords(parsedInt);
    const malDigits = convertDigitsToMalayalam(cleanNumStr);

    return corsResponse({
      inputNumber: parsedInt,
      malayalamNumerals: malDigits,
      malayalamWords: words,
      formattedMalayalam: `${words} (${malDigits})`
    });
  } catch (err) {
    return corsResponse({ error: "Number conversion failed", details: err.message }, 500);
  }
}
