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

const MALAYALAM_MONTHS = [
  { name: "Chingam (ചിങ്ങം)", startMonth: 8, startDay: 17 },
  { name: "Kanni (കന്നി)", startMonth: 9, startDay: 17 },
  { name: "Thulam (തുലാം)", startMonth: 10, startDay: 18 },
  { name: "Vrischikam (വൃശ്ചികം)", startMonth: 11, startDay: 17 },
  { name: "Dhanu (ധനു)", startMonth: 12, startDay: 16 },
  { name: "Makaram (മകരം)", startMonth: 1, startDay: 15 },
  { name: "Kumbham (കുംഭം)", startMonth: 2, startDay: 15 },
  { name: "Meenam (മീനം)", startMonth: 3, startDay: 15 },
  { name: "Medam (മേടം)", startMonth: 4, startDay: 14 },
  { name: "Edavam (ഇടവം)", startMonth: 5, startDay: 15 },
  { name: "Mithunam (മിഥുനം)", startMonth: 6, startDay: 16 },
  { name: "Karkidakam (കർക്കിടകം)", startMonth: 7, startDay: 17 }
];

const NAKSHATRAS = [
  "Aswathi (അശ്വതി)", "Bharani (ഭരണി)", "Karthika (കാർത്തിക)", "Rohini (രോഹിണി)", 
  "Makayiram (മകയിരം)", "Thiruvathira (തിരുവാതിര)", "Punarstham (പുണർതം)", "Pooyyam (പൂയം)", 
  "Ayilyam (ആയില്യം)", "Makam (മകം)", "Pooram (പൂരം)", "Uthram (ഉത്രം)", 
  "Hastham (അത്തം)", "Chithira (ചിത്തിര)", "Choti (ചോതി)", "Visakham (വിശാഖം)", 
  "Anizham (അനിഴം)", "Thrikketa (തൃക്കേട്ട)", "Moolam (മൂലം)", "Pooraadam (പൂരാടം)", 
  "Uthraadam (ഉത്രാടം)", "Thiruvonam (തിരുവോണം)", "Avittam (അവിട്ടം)", "Chathayam (ചതയം)", 
  "Pooruruttathi (പൂരുരുട്ടാതി)", "Uthruttathi (ഉത്രട്ടാതി)", "Revathi (രേവതി)"
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");
    
    let targetDate = new Date();
    if (dateParam) {
      const parsed = new Date(dateParam);
      if (!isNaN(parsed.getTime())) {
        targetDate = parsed;
      }
    }

    const year = targetDate.getFullYear();
    const month = targetDate.getMonth() + 1; // 1-12
    const day = targetDate.getDate();

    // Kollam Era year formula (CE Year - 825 or 824)
    const kollamYear = month >= 8 && day >= 17 ? year - 824 : year - 825;

    // Approximate Malayalam Month determination
    let currentMonth = MALAYALAM_MONTHS[0];
    let monthDay = 1;

    for (let i = 0; i < MALAYALAM_MONTHS.length; i++) {
      const m = MALAYALAM_MONTHS[i];
      if (month === m.startMonth && day >= m.startDay) {
        currentMonth = m;
        monthDay = day - m.startDay + 1;
        break;
      } else if (month === (m.startMonth % 12) + 1 && day < MALAYALAM_MONTHS[(i + 1) % 12].startDay) {
        currentMonth = m;
        monthDay = 30 - (m.startDay - day);
        break;
      }
    }

    // Cyclic Nakshatra approximation for demonstration
    const dayOfYear = Math.floor((targetDate - new Date(year, 0, 0)) / (1000 * 60 * 60 * 24));
    const nakshatraIndex = dayOfYear % NAKSHATRAS.length;
    const nakshatra = NAKSHATRAS[nakshatraIndex];

    return corsResponse({
      gregorianDate: targetDate.toISOString().split("T")[0],
      kollamEraYear: kollamYear,
      malayalamMonth: currentMonth.name,
      malayalamDay: monthDay,
      formattedKollamDate: `${currentMonth.name} ${monthDay}, Kollam Era ${kollamYear} (കൊല്ലവർഷം ${kollamYear})`,
      nakshatra: nakshatra
    });
  } catch (err) {
    return corsResponse({ error: "Calendar conversion failed", details: err.message }, 500);
  }
}
