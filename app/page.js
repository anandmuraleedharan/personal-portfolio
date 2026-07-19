import React from "react";
import DesktopLayout from "../components/DesktopLayout";
import MobileLayout from "../components/MobileLayout";

export default function Home() {
  return (
    <>
      <div className="desktopView">
        <DesktopLayout />
      </div>
      <div className="mobileView">
        <MobileLayout />
      </div>
    </>
  );
}
