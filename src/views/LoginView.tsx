import React, { useState } from "react";
import { PageView } from "../types";

interface LoginViewProps {
  setActiveView: (view: PageView) => void;
  onLogin: (email: string, password: string) => Promise<void>;
  onSignup: (name: string, email: string, password: string) => Promise<void>;
  /** Shown above the form, e.g. when the fan was sent here from checkout. */
  notice?: string;
}

const inputClass =
  "w-full bg-white dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#007A4D] dark:focus:border-[#CCFF00] transition-colors";
const labelClass = "text-xs font-bold uppercase tracking-wider text-slate-500";

export const LoginView: React.FC<LoginViewProps> = ({ setActiveView, onLogin, onSignup, notice }) => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const switchMode = (m: "login" | "signup") => {
    setMode(m);
    setError("");
    setPassword("");
    setConfirm("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (mode === "signup") {
      if (password.length < 8) return setError("Password must be at least 8 characters.");
      if (password !== confirm) return setError("Passwords do not match.");
    }
    setBusy(true);
    try {
      if (mode === "login") await onLogin(email, password);
      else await onSignup(name, email, password);
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
      setBusy(false);
    }
  };

  const isLogin = mode === "login";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="glass-card rounded-3xl p-8 md:p-10 max-w-md w-full shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#007A4D]/10 dark:bg-[#CCFF00]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-6 relative">
          <h1 className="font-sans font-extrabold text-3xl md:text-4xl text-slate-900 dark:text-white mb-2">
            {isLogin ? "Welcome back" : "Join FootVerse"}
          </h1>
          <p className="text-sm text-slate-600 dark:text-gray-400">
            {isLogin ? "Log in to your football command center" : "Create your free fan account"}
          </p>
        </div>

        <div role="tablist" className="grid grid-cols-2 gap-1 p-1 mb-6 rounded-2xl bg-slate-200/70 dark:bg-white/5 relative">
          {(["login", "signup"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => switchMode(m)}
              className={`py-2 rounded-xl text-sm font-bold transition-colors ${
                mode === m
                  ? "bg-white dark:bg-[#CCFF00] text-slate-900 dark:text-[#0A0A0A] shadow"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {m === "login" ? "Log in" : "Sign up"}
            </button>
          ))}
        </div>

        {notice && (
          <p className="mb-4 text-sm font-semibold text-[#007A4D] dark:text-[#CCFF00] bg-[#007A4D]/10 dark:bg-[#CCFF00]/10 rounded-xl px-4 py-3">
            {notice}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 relative" noValidate>
          {!isLogin && (
            <div className="space-y-2">
              <label htmlFor="auth-name" className={labelClass}>Full name</label>
              <input id="auth-name" type="text" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={inputClass} />
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="auth-email" className={labelClass}>Email</label>
            <input id="auth-email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass} />
          </div>

          <div className="space-y-2">
            <label htmlFor="auth-password" className={labelClass}>Password</label>
            <div className="relative">
              <input
                id="auth-password"
                type={showPw ? "text" : "password"}
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isLogin ? "Your password" : "At least 8 characters"}
                className={`${inputClass} pr-12`}
              />
              <button type="button" onClick={() => setShowPw((v) => !v)} aria-label={showPw ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white">
                <span className="material-symbols-outlined text-xl">{showPw ? "visibility_off" : "visibility"}</span>
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <label htmlFor="auth-confirm" className={labelClass}>Confirm password</label>
              <input id="auth-confirm" type={showPw ? "text" : "password"} autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat password" className={inputClass} />
            </div>
          )}

          {error && (
            <p role="alert" className="text-sm font-semibold text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full py-4 bg-[#007A4D] hover:bg-[#005c3a] dark:bg-[#CCFF00] dark:hover:bg-[#b3e600] text-white dark:text-[#0A0A0A] font-bold rounded-2xl transition-all shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {busy ? "Please wait…" : isLogin ? "Log in" : "Create account"}
          </button>
        </form>

        {isLogin && (
          <button
            type="button"
            onClick={() => { setEmail("manager@footverse.com"); setPassword("footverse123"); setError(""); }}
            className="mt-4 w-full text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Demo account? <span className="font-bold underline">Fill in demo login</span>
          </button>
        )}

        <div className="mt-6 text-center">
          <button onClick={() => setActiveView("home")} className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            &larr; Continue as guest
          </button>
        </div>
      </div>
    </div>
  );
};
