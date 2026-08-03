import type { NextAuthConfig } from "next-auth";

// Edge-safe config used by middleware. No providers that touch the database
// or Node-only modules live here — those belong in auth.ts, which only runs
// in the Node runtime (API route, server components).
export const authConfig: NextAuthConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      if (request.nextUrl.pathname.startsWith("/login")) {
        return true;
      }
      return isLoggedIn;
    },
  },
};
