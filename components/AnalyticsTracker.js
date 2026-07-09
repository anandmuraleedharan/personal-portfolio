"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastPath = useRef(null);

  useEffect(() => {
    // 1. Resolve/generate session ID in sessionStorage
    let sid = sessionStorage.getItem("visitor_session_id");
    if (!sid) {
      sid = "session_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem("visitor_session_id", sid);
    }

    // 2. Avoid double logging on initial layout mounts
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;

    // 3. Exclude the analytics page itself from counting as a visitor pageview
    if (pathname === "/analytics") return;

    // 4. Gather performance metrics and dispatch hit
    const sendTelemetry = () => {
      let loadTime = null;
      let ttfb = null;
      let fcp = null;

      try {
        const [navEntry] = performance.getEntriesByType("navigation");
        if (navEntry) {
          ttfb = Math.round(navEntry.responseStart);
          loadTime = Math.round(navEntry.duration || navEntry.loadEventEnd);
        } else {
          const timing = performance.timing;
          if (timing) {
            ttfb = Math.max(0, timing.responseStart - timing.navigationStart);
            loadTime = Math.max(0, timing.loadEventEnd - timing.navigationStart);
          }
        }

        const paintEntries = performance.getEntriesByType("paint");
        const fcpEntry = paintEntries.find(entry => entry.name === "first-contentful-paint");
        if (fcpEntry) {
          fcp = Math.round(fcpEntry.startTime);
        }
      } catch (e) {
        console.warn("Performance API skipped:", e);
      }

      const payload = {
        page_path: pathname,
        referrer: document.referrer || "Direct",
        session_id: sid,
        load_time: loadTime && loadTime > 0 && loadTime < 60000 ? loadTime : null,
        ttfb: ttfb && ttfb > 0 && ttfb < 60000 ? ttfb : null,
        fcp: fcp && fcp > 0 && fcp < 60000 ? fcp : null
      };

      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).catch((err) => {
        console.warn("Analytics logger fail:", err);
      });
    };

    // If page is fully loaded, send after a small tick; otherwise wait for load event
    if (document.readyState === "complete") {
      const timer = setTimeout(sendTelemetry, 150);
      return () => clearTimeout(timer);
    } else {
      const handleLoad = () => {
        setTimeout(sendTelemetry, 150);
        window.removeEventListener("load", handleLoad);
      };
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }

  }, [pathname]);

  return null;
}
