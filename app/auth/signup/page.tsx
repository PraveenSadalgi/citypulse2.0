"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";

export default function SignIn() {
  const router = useRouter();
  const [supabase, setSupabase] = useState<any>(null);
  const [isConfigured, setIsConfigured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Initialize Supabase client
  useEffect(() => {
    const hasConfig =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (hasConfig) {
      setSupabase(createClientComponentClient());
      setIsConfigured(true);
    } else {
      setError("Supabase configuration missing. Check .env.local file.");
    }
  }, []);

  // ✅ Check session
  useEffect(() => {
    if (!supabase) return;
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) router.push("/home");
    })();
  }, [supabase, router]);

  // ✅ Email Sign-In
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setError(null);
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) throw error;
      
      if (data.session) {
        // Store session in localStorage
        localStorage.setItem('supabase.auth.token', JSON.stringify({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at
        }));
        
        // Get the redirect URL from query params or default to '/home'
        const searchParams = new URLSearchParams(window.location.search);
        const redirectUrl = searchParams.get('redirectedFrom') || '/home';
        
        // Use router.push for client-side navigation
        router.push(redirectUrl);
        router.refresh(); // Ensure the page updates with the new auth state
      } else {
        // If no session but no error, user needs to verify email
        router.push('/auth/verify-email');
      }
    } catch (err: any) {
      setError(err.message || "Error creating account");
      setLoading(false);
    }
  };

  // ✅ Google OAuth
  const handleGoogleSignIn = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Error signing in with Google");
      setLoading(false);
    }
  };

  if (!isConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div className="max-w-md bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold text-center text-gray-800">
            ⚙️ Configuration Required
          </h2>
          <p className="text-sm text-gray-600 mt-2 text-center">
            Add these to your <code>.env.local</code>:
          </p>
          <pre className="mt-4 bg-gray-100 p-3 rounded text-xs text-gray-800">
            NEXT_PUBLIC_SUPABASE_URL=your-supabase-url{"\n"}
            NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-indigo-50 to-indigo-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Welcome Back 👋
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account or{" "}
            <a
              href="/auth/signup"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              create a new one
            </a>
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Google Sign-In */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium transition disabled:opacity-60"
        >
          <FcGoogle className="text-lg" /> Continue with Google
        </button>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-3 text-gray-500">or continue with</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSignUp} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2 text-gray-700">
              <input
                type="checkbox"
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <span>Remember me</span>
            </label>
            <a
              href="#"
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 text-sm font-medium text-white rounded-md transition ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            }`}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
