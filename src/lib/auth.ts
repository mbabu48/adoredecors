import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const list = adminEmails();
  if (list.length === 0) return false;
  return list.includes(email.toLowerCase());
}

const hasGoogle = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

export const authOptions: NextAuthOptions = {
  providers: [
    ...(hasGoogle
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),
    // Dev-only fallback so admin page works before Google OAuth is set up.
    // Set ADMIN_DEV_PASSWORD in .env to enable.
    ...(process.env.ADMIN_DEV_PASSWORD
      ? [
          CredentialsProvider({
            id: "dev-password",
            name: "Dev Password",
            credentials: {
              password: { label: "Password", type: "password" },
            },
            async authorize(creds) {
              if (creds?.password && creds.password === process.env.ADMIN_DEV_PASSWORD) {
                return {
                  id: "dev-admin",
                  name: "Dev Admin",
                  email: adminEmails()[0] || "admin@local",
                };
              }
              return null;
            },
          }),
        ]
      : []),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/admin-signin", error: "/admin-signin" },
  callbacks: {
    async signIn({ user }) {
      return isAdminEmail(user?.email);
    },
    async jwt({ token, user }) {
      if (user) token.email = user.email;
      token.isAdmin = isAdminEmail(token.email as string | undefined);
      return token;
    },
    async session({ session, token }) {
      (session as any).isAdmin = Boolean((token as any).isAdmin);
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
