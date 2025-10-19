///src/components/navbar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { LineChart, LayoutDashboard, TrendingUp, Globe } from "lucide-react";

export const Navbar = () => {
  const pathname = usePathname();

  const navLinks = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      color: "emerald",
    },
    { href: "/watchlist", label: "Watchlist", icon: TrendingUp, color: "blue" },
    {
      href: "/global-trends",
      label: "Global Trends",
      icon: Globe,
      color: "purple",
    },
  ];

  const isActive = (href: string) => pathname === href;

  const getColorClasses = (color: string, active: boolean) => {
    const colors: Record<string, string> = {
      emerald: active
        ? "text-emerald-300 bg-emerald-500/10 border border-emerald-500/30"
        : "text-slate-300 hover:text-white hover:bg-slate-700/50",
      blue: active
        ? "text-blue-300 bg-blue-500/10 border border-blue-500/30"
        : "text-slate-300 hover:text-white hover:bg-slate-700/50",
      purple: active
        ? "text-purple-300 bg-purple-500/10 border border-purple-500/30"
        : "text-slate-300 hover:text-white hover:bg-slate-700/50",
    };
    return colors[color];
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-md border-b border-slate-700 shadow-lg px-4 sm:px-6 py-4 flex justify-between items-center">
      {/* Logo / Brand */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="p-2 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-lg group-hover:shadow-lg group-hover:shadow-blue-500/50 transition-all">
          <LineChart className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-emerald-200 to-blue-300 bg-clip-text text-transparent tracking-tight">
          StockWatch
        </span>
      </Link>

      {/* Navigation Menu - Hidden on mobile, shown on signed in */}
      <SignedIn>
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          {navLinks.map(({ href, label, icon: Icon, color }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium transition-all flex items-center gap-1.5 px-3 py-2 rounded-lg ${getColorClasses(
                color,
                isActive(href)
              )}`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden lg:inline">{label}</span>
            </Link>
          ))}
        </div>
      </SignedIn>

      {/* Auth Buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
        <SignedOut>
          <SignInButton>
            <button className="border border-emerald-400 text-emerald-300 rounded-lg font-medium text-sm px-3 sm:px-4 py-2 cursor-pointer hover:bg-emerald-500/10 transition">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton>
            <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium text-sm px-3 sm:px-4 py-2 cursor-pointer transition shadow-lg hover:shadow-blue-500/50">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </nav>
  );
};
