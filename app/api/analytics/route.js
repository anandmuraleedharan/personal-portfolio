import { NextResponse } from "next/server";
import crypto from "crypto";
import { verifyTOTP } from "@/lib/totp";

// Resolved credentials (dedicate project)
const supabaseUrl = process.env.ANALYTICS_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321";
const supabaseKey = process.env.ANALYTICS_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.ANALYTICS_SUPABASE_SERVICE_ROLE_KEY || supabaseKey;
const totpSecret = process.env.ANALYTICS_TOTP_SECRET;

// Helper to generate the session hash signature
function getSessionSignature() {
  return crypto.createHash("sha256").update(totpSecret + "_session_salt").digest("hex");
}

// User-agent parser
function parseUserAgent(ua) {
  if (!ua) return { browser: "Unknown", os: "Unknown" };
  
  let browser = "Unknown";
  let os = "Unknown";
  
  // OS Detection
  if (ua.includes("Windows NT")) os = "Windows";
  else if (ua.includes("Macintosh") || ua.includes("Mac OS X")) os = "macOS";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("Linux")) os = "Linux";
  
  // Browser Detection
  if (ua.includes("Chrome") && !ua.includes("Chromium") && !ua.includes("Edg")) browser = "Chrome";
  else if (ua.includes("Safari") && !ua.includes("Chrome") && !ua.includes("Chromium")) browser = "Safari";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Edg")) browser = "Edge";
  else if (ua.includes("Trident") || ua.includes("MSIE")) browser = "IE";
  
  return { browser, os };
}

// GET handler: fetch stats or verify session
export async function GET(request) {
  const cookieStore = request.cookies;
  const sessionCookie = cookieStore.get("totp_session")?.value;
  const signature = getSessionSignature();
  
  if (!sessionCookie || sessionCookie !== signature) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const isVercel = process.env.VERCEL === "1";
  const isLocalhostDb = supabaseUrl.includes("127.0.0.1") || supabaseUrl.includes("localhost");

  if (isVercel && isLocalhostDb) {
    return NextResponse.json({
      authenticated: true,
      setupRequired: true,
      databaseOffline: true,
      error: "Database URL points to localhost (127.0.0.1) in production.",
      message: "Your portfolio is live on Vercel, but the analytics database is configured to localhost. Local databases are only reachable during local development. To connect a database in production, please set up a cloud Supabase project and add its credentials (ANALYTICS_SUPABASE_URL and ANALYTICS_SUPABASE_ANON_KEY) to your Vercel project settings."
    });
  }

  try {
    // Fetch logs from Supabase
    const res = await fetch(`${supabaseUrl}/rest/v1/visitor_logs?order=timestamp.desc&limit=100`, {
      headers: {
        "apikey": supabaseServiceKey,
        "Authorization": `Bearer ${supabaseServiceKey}`
      }
    });

    if (!res.ok) {
      // Table doesn't exist yet, return help info
      return NextResponse.json({ 
        authenticated: true,
        setupRequired: true, 
        message: "Table 'visitor_logs' not found. Please create the table in Supabase SQL editor." 
      });
    }

    const logs = await res.json();

    // 1. Calculate aggregations
    const totalHits = logs.length;
    const uniqueSessions = new Set(logs.map(l => l.session_id));
    const uniqueVisitors = uniqueSessions.size;
    const avgHits = uniqueVisitors > 0 ? (totalHits / uniqueVisitors).toFixed(1) : 0;

    // 2. Frequency mapping for pages
    const pageCounts = {};
    const referrerCounts = {};
    const countryCounts = {};
    const osCounts = {};
    const browserCounts = {};

    // 3. Speed metrics tracking
    let loadTimeSum = 0;
    let loadTimeCount = 0;
    let ttfbSum = 0;
    let ttfbCount = 0;
    let fcpSum = 0;
    let fcpCount = 0;
    const pageSpeeds = {};

    logs.forEach(log => {
      pageCounts[log.page_path] = (pageCounts[log.page_path] || 0) + 1;
      
      const ref = log.referrer || "Direct";
      referrerCounts[ref] = (referrerCounts[ref] || 0) + 1;
      
      const cnt = log.country || "Local";
      countryCounts[cnt] = (countryCounts[cnt] || 0) + 1;
      
      osCounts[log.os] = (osCounts[log.os] || 0) + 1;
      browserCounts[log.browser] = (browserCounts[log.browser] || 0) + 1;

      if (log.load_time && log.load_time > 0) {
        loadTimeSum += log.load_time;
        loadTimeCount++;
        if (!pageSpeeds[log.page_path]) {
          pageSpeeds[log.page_path] = { sum: 0, count: 0 };
        }
        pageSpeeds[log.page_path].sum += log.load_time;
        pageSpeeds[log.page_path].count++;
      }
      if (log.ttfb && log.ttfb > 0) {
        ttfbSum += log.ttfb;
        ttfbCount++;
      }
      if (log.fcp && log.fcp > 0) {
        fcpSum += log.fcp;
        fcpCount++;
      }
    });

    const formatFreq = (obj) => Object.entries(obj).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);

    const avgLoadTime = loadTimeCount > 0 ? Math.round(loadTimeSum / loadTimeCount) : null;
    const avgTtfb = ttfbCount > 0 ? Math.round(ttfbSum / ttfbCount) : null;
    const avgFcp = fcpCount > 0 ? Math.round(fcpSum / fcpCount) : null;

    const pageSpeedsList = Object.entries(pageSpeeds).map(([name, data]) => ({
      name,
      avgSpeed: Math.round(data.sum / data.count),
      count: data.count
    })).sort((a, b) => b.count - a.count);

    return NextResponse.json({
      authenticated: true,
      setupRequired: false,
      stats: {
        totalHits,
        uniqueVisitors,
        avgHits,
        avgLoadTime,
        avgTtfb,
        avgFcp
      },
      breakdowns: {
        pages: formatFreq(pageCounts),
        referrers: formatFreq(referrerCounts),
        countries: formatFreq(countryCounts),
        os: formatFreq(osCounts),
        browsers: formatFreq(browserCounts),
        pageSpeeds: pageSpeedsList
      },
      logs: logs.slice(0, 20) // send only latest 20 logs for the feed
    });

  } catch (err) {
    return NextResponse.json({
      authenticated: true,
      setupRequired: true,
      databaseOffline: true,
      error: "Failed to connect to database: " + err.message,
      message: "The serverless function could not connect to the database. Make sure your database is online and reachable from Vercel. If you are using a local Supabase instance, it is only reachable on localhost during development."
    });
  }
}

// POST handler: log visit or verify passcode
export async function POST(request) {
  try {
    const body = await request.json();
    
    // ACTION: Verify TOTP Code
    if (body.action === "verify") {
      const { code } = body;
      if (!totpSecret) {
        return NextResponse.json({ authenticated: false, error: "Authenticator secret is not configured in server environment variables." }, { status: 500 });
      }
      const isValid = verifyTOTP(code, totpSecret);
      
      if (isValid) {
        const response = NextResponse.json({ authenticated: true });
        response.cookies.set("totp_session", getSessionSignature(), {
          path: "/",
          httpOnly: true,
          maxAge: 86400, // 24 hours
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production"
        });
        return response;
      } else {
        return NextResponse.json({ authenticated: false, error: "Invalid passcode code." }, { status: 400 });
      }
    }
    
    // ACTION: Log visitor page hit
    const { page_path, referrer, session_id, load_time, ttfb, fcp } = body;
    if (!page_path || !session_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const isVercel = process.env.VERCEL === "1";
    const isLocalhostDb = supabaseUrl.includes("127.0.0.1") || supabaseUrl.includes("localhost");

    if (isVercel && isLocalhostDb) {
      console.warn("Analytics post skipped: Localhost database configured in production.");
      return NextResponse.json({ success: false, warning: "Database is configured to localhost in production." });
    }
    
    // Resolve headers
    const country = request.headers.get("x-vercel-ip-country") || "Local";
    const userAgent = request.headers.get("user-agent") || "";
    const { browser, os } = parseUserAgent(userAgent);
    
    // Insert into Supabase
    const insertRes = await fetch(`${supabaseUrl}/rest/v1/visitor_logs`, {
      method: "POST",
      headers: {
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify({
        page_path,
        referrer: referrer || "Direct",
        session_id,
        country,
        browser,
        os,
        load_time: load_time ? parseInt(load_time) : null,
        ttfb: ttfb ? parseInt(ttfb) : null,
        fcp: fcp ? parseInt(fcp) : null
      })
    });

    if (!insertRes.ok) {
      console.error("Supabase insert error:", await insertRes.text());
      return NextResponse.json({ error: "Failed to write log to DB" }, { status: 502 });
    }

    // ENFORCE 100-ROW FIFO LIMIT (Pruning)
    // Fetch all logs ordered by timestamp desc (only get id)
    const listRes = await fetch(`${supabaseUrl}/rest/v1/visitor_logs?select=id&order=timestamp.desc`, {
      headers: {
        "apikey": supabaseServiceKey,
        "Authorization": `Bearer ${supabaseServiceKey}`
      }
    });

    if (listRes.ok) {
      const records = await listRes.json();
      if (records.length > 100) {
        // Collect extra IDs to delete
        const excessIds = records.slice(100).map(r => r.id);
        
        // Execute delete call
        await fetch(`${supabaseUrl}/rest/v1/visitor_logs?id=in.(${excessIds.join(",")})`, {
          method: "DELETE",
          headers: {
            "apikey": supabaseServiceKey,
            "Authorization": `Bearer ${supabaseServiceKey}`
          }
        });
      }
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Analytics POST error:", err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 200 });
  }
}
