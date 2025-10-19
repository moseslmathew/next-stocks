// // src/middleware.ts

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 🟢 Toggle this flag ON/OFF to enable or disable Clerk auth
const AUTH_ENABLED = true;

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

export default AUTH_ENABLED
  ? clerkMiddleware(async (auth, req) => {
      if (!isPublicRoute(req)) {
        await auth.protect();
      }
    })
  : function middleware() {
      // Auth disabled — all routes allowed
      console.log("🔓 Clerk auth is DISABLED (Postman/debug mode)");
      return;
    };

export const config = {
  matcher: [
    "/((?!_next|.*\\.(?:css|js|png|jpg|svg|woff|ico)).*)",
    "/api/:path*",
  ],
};
