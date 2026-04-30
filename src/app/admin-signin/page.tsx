"use client";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";

function SignInInner() {
  const params = useSearchParams();
  const error = params?.get("error");
  const [devPw, setDevPw] = useState("");
  const [loading, setLoading] = useState(false);

  const hasGoogle = true; // button always visible; if OAuth not configured, will just error
  const hasDev = true;     // show dev-password option; if not enabled server-side, will error

  async function handleDev(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await signIn("dev-password", { password: devPw, callbackUrl: "/admin" });
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-ivory">
      <div className="w-full max-w-sm bg-cream border border-sand rounded-md p-8">
        <div className="text-center mb-6">
          <div className="text-[11px] text-rose tracking-[0.2em] uppercase">Admin access</div>
          <h1 className="font-serif text-2xl text-burgundy mt-1">Sign in to continue</h1>
          <p className="text-stone text-[12px] mt-1">Restricted to authorized Adore Decors team.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-[12px] rounded">
            {error === "AccessDenied"
              ? "This email is not on the admin allowlist. Ask Naresh to add it to ADMIN_EMAILS."
              : `Sign-in error: ${error}`}
          </div>
        )}

        {hasGoogle && (
          <button
            onClick={() => signIn("google", { callbackUrl: "/admin" })}
            className="w-full flex items-center justify-center gap-3 py-3 bg-white border border-sand rounded hover:bg-blush/20 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            <span className="text-[14px] text-burgundy">Continue with Google</span>
          </button>
        )}

        {hasDev && (
          <div className="mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-sand" />
              <div className="text-[11px] text-stone tracking-[0.12em] uppercase">Or dev password</div>
              <div className="flex-1 h-px bg-sand" />
            </div>
            <form onSubmit={handleDev} className="space-y-2">
              <input
                type="password"
                placeholder="Dev admin password"
                value={devPw}
                onChange={(e) => setDevPw(e.target.value)}
                className="w-full py-2.5 px-3 bg-ivory border border-sand rounded-sm text-[14px] text-burgundy"
              />
              <button
                disabled={loading || !devPw}
                className="w-full bg-burgundy text-cream py-2.5 rounded-sm text-[13px] hover:bg-burgundy-dark transition-colors disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
              <p className="text-[10px] text-stone text-center">
                Dev password only works when <code>ADMIN_DEV_PASSWORD</code> is set in <code>.env</code>.
              </p>
            </form>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/" className="text-[12px] text-rose hover:text-burgundy">
            ← Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SignInInner />
    </Suspense>
  );
}
