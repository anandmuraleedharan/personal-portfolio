"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastPath = useRef(null);

  useEffect(() => {
    // 1. Skip logging in local development unless needed, or log always
    // Let's log always so the user can verify it locally on localhost:3000!
    
    // 2. Resolve/generate session ID in sessionStorage
    let sid = sessionStorage.getItem("visitor_session_id");
    if (!sid) {
      sid = "session_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem("visitor_session_id", sid);
    }

    // 3. Avoid double logging on initial layout mounts
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;

    // 4. Exclude the analytics page itself from counting as a visitor pageview 
    // to prevent infinite loops / polluting your dashboard with your own dashboard views!
    if (pathname === "/analytics") return;

    // 5. Dispatch log hit
    const payload = {
      page_path: pathname,
      referrer: document.referrer || "Direct",
      session_id: sid
    };

    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).catch((err) => {
      console.warn("Analytics logger fail:", err);
    });

  }, [pathname]);

  return null;
}
