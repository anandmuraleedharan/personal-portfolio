import { NextResponse } from "next/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
  "X-Data-License": "Public Domain Folklore - Lipi Malayalam Suite"
};

function corsResponse(data, status = 200) {
  return NextResponse.json(data, { status, headers: CORS_HEADERS });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

// Public Domain Traditional Malayalam Proverbs Corpus
const PROVERBS_DATASET = [
  {
    id: "p1",
    malayalam: "മിന്നുന്നതെല്ലാം പൊന്നല്ല.",
    phonetic: "Minnunnathellam ponnalla.",
    literalEnglish: "All that glitters is not gold.",
    meaning: "Appearances can be deceptive; not everything that looks valuable is genuine.",
    englishEquivalent: "All that glitters is not gold.",
    category: "Wisdom"
  },
  {
    id: "p2",
    malayalam: "അണ്ണാൻ തന്നാലായത്.",
    phonetic: "Annan thannaalaayathu.",
    literalEnglish: "What the squirrel can contribute.",
    meaning: "Every small effort counts and contributes to a noble cause.",
    englishEquivalent: "Every little bit helps.",
    category: "Effort & Character"
  },
  {
    id: "p3",
    malayalam: "വിളയും പയർ മുളയിൽ അറിയാം.",
    phonetic: "Vilayum payar mulayil ariyaam.",
    literalEnglish: "A fruitful bean plant is known by its sprout.",
    meaning: "A child's future potential or character can be glimpsed early in life.",
    englishEquivalent: "As the twig is bent, so grows the tree.",
    category: "Youth & Potential"
  },
  {
    id: "p4",
    malayalam: "ആഴമളക്കാതെ ഇറങ്ങരുത്.",
    phonetic: "Aazhamalakkaathe irangaruthu.",
    literalEnglish: "Do not step in without measuring the depth.",
    meaning: "Assess risks thoroughly before making commitments.",
    englishEquivalent: "Look before you leap.",
    category: "Prudence"
  },
  {
    id: "p5",
    malayalam: "കിണറ്റിലെ തവള.",
    phonetic: "Kinattile thavala.",
    literalEnglish: "The frog in the well.",
    meaning: "Someone with a narrow worldview who assumes their small surroundings are the whole world.",
    englishEquivalent: "Narrow-minded person.",
    category: "Perspective"
  },
  {
    id: "p6",
    malayalam: "അറിയാത്ത പിള്ളക്ക് ചൊറിയുമ്പോൾ അറിയാം.",
    phonetic: "Ariyaatha pillakku choriyumbol ariyaam.",
    literalEnglish: "An inexperienced child learns when it starts itching.",
    meaning: "Experience is the best teacher, especially after making mistakes.",
    englishEquivalent: "Experience is the best teacher.",
    category: "Experience"
  },
  {
    id: "p7",
    malayalam: "പത്തു പൈസ ലാഭത്തിന് നൂറു രൂപ ചേതം.",
    phonetic: "Pathu paisa laabhathinu nooru roopa chetham.",
    literalEnglish: "Saving ten paise leads to a hundred rupees loss.",
    meaning: "Penny wise, pound foolish.",
    englishEquivalent: "Penny wise and pound foolish.",
    category: "Finance & Value"
  },
  {
    id: "p8",
    malayalam: "പണമുള്ളവന് പതിനേഴ് കൂട്ടം.",
    phonetic: "Panamullavanu pathinezhu koottam.",
    literalEnglish: "The rich man has seventeen sets of companions.",
    meaning: "Wealth easily attracts friends and followers.",
    englishEquivalent: "Money attracts friends.",
    category: "Society"
  }
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const countParam = parseInt(searchParams.get("count") || "5", 10);

    let results = [...PROVERBS_DATASET];

    if (category) {
      results = results.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const query = search.toLowerCase();
      results = results.filter(p => 
        p.malayalam.toLowerCase().includes(query) ||
        p.literalEnglish.toLowerCase().includes(query) ||
        p.meaning.toLowerCase().includes(query) ||
        p.phonetic.toLowerCase().includes(query)
      );
    }

    // Shuffle if random or slice count
    const finalProverbs = results.slice(0, Math.max(1, countParam));

    return corsResponse({
      total: results.length,
      proverbs: finalProverbs,
      source: "Public Domain Traditional Malayalam Folklore",
      license: "Public Domain / CC0"
    });
  } catch (err) {
    return corsResponse({ error: "Failed to retrieve proverbs", details: err.message }, 500);
  }
}
