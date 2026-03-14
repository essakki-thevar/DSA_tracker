"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { UserPlus, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const err = await register(username, email, password);
    if (err) {
      setError(err);
      setIsLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
            <UserPlus size={32} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Create an Account</h1>
          <p className="text-sm text-foreground/60 mt-1">Join DSA Tracker and crush your interviews</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 bg-red-100 text-red-600 rounded-lg text-sm">{error}</div>}
          
          <div className="space-y-1">
            <label className="text-sm font-semibold text-foreground/80">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-black/50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="e.g. coder123"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-foreground/80">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-black/50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-foreground/80">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-black/50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white font-bold hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? "Creating account..." : "Register"}
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="text-center text-sm text-foreground/60 mt-8">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
