import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const response = NextResponse.next();
    return response;
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Allow public routes
        if (
          req.nextUrl.pathname.startsWith("/auth") ||
          req.nextUrl.pathname === "/"
        ) {
          return true;
        }
        // Require authentication for other routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/learn/:path*",
    "/quizzes/:path*",
    "/tutor/:path*",
    "/api/learn/:path*",
    "/api/quiz/:path*",
    "/api/tutor/:path*",
  ],
};
