// src/app/page.tsx

"use client";
import { useUser } from "@clerk/nextjs";

import { HeroSection } from "@/components/HeroSection";
import DashboardPage from "./dashboard/page";

export default function LoginPage() {
  const { isSignedIn, isLoaded } = useUser();
  if (!isLoaded) return <div>Loading...</div>;

  return <main>{isSignedIn ? <DashboardPage /> : <HeroSection />}</main>;
}
