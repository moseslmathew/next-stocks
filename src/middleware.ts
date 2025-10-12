// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect(); // protects private routes
  }
});

export const config = {
  matcher: [
    "/((?!_next|.*\\.(?:css|js|png|jpg|svg|woff|ico)).*)",
    "/api/:path*",
  ],
};

// ⚠️ TEMPORARY: Clerk middleware fully disabled for debugging
// export default function middleware() {
//   // Simply allow all requests through — no auth checks
//   return;
// }

// export const config = {
//   matcher: [
//     "/((?!_next|.*\\.(?:css|js|png|jpg|svg|woff|ico)).*)",
//     "/api/:path*",
//   ],
// };
