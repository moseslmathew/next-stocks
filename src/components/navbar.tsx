//src/components/navbar.tsx

import React from "react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md px-4 sm:px-6 py-3 flex justify-between items-center">
      {/* Logo / Brand */}
      <div className="text-xl font-bold text-[#6c47ff] cursor-pointer">
        StockPilot
      </div>

      {/* Auth Buttons */}
      <div className="flex items-center gap-3">
        <SignedOut>
          <SignInButton>
            <button className="border border-[#6c47ff] text-[#6c47ff] rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer hover:bg-[#f5f3ff] transition">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton>
            <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer hover:bg-[#5a3dd6] transition">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
};
