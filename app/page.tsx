"use client";
import React, { useState, useEffect } from "react";
import Explore from "./explore/page";
import WelcomeTour from "@/components/WelcomeTour";

export default function Home() {
  const [isTourOpen, setIsTourOpen] = useState(false);

  useEffect(() => {
    // Automatically trigger welcome onboarding tour if it is a user's first visit
    const tourCompleted = localStorage.getItem("cs_site_tour_completed");
    if (!tourCompleted) {
      setIsTourOpen(true);
      // Mark as completed immediately so reloading/refreshing doesn't show it again
      localStorage.setItem("cs_site_tour_completed", "true");
    }
  }, []);

  return (
    <>
      <Explore />
      <WelcomeTour isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} />
    </>
  );
}