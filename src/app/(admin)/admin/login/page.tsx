"use client";

import { useActionState } from "react";
import { login } from "./actions";
import { FloralMark } from "@/components/brand/FloralMark";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, null);

  return (
    <div className="grid min-h-screen place-items-center px-6">
      <div className="w-full max-w-sm">
        <FloralMark className="mx-auto h-10 w-10 text-accent" aria-hidden />
        <h1 className="mt-6 text-center font-display text-2xl">
          Damascense CMS
        </h1>
        <form action={formAction} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="text-xs uppercase tracking-[0.14em] text-ivory/50">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              className="mt-2 w-full border border-line bg-transparent px-3 py-2.5 text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-xs uppercase tracking-[0.14em] text-ivory/50">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-2 w-full border border-line bg-transparent px-3 py-2.5 text-sm outline-none focus:border-accent"
            />
          </div>
          {state?.error && (
            <p role="alert" className="text-xs text-[#d98b7a]">
              {state.error}
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="w-full bg-ivory py-3 text-xs uppercase tracking-[0.16em] text-ink disabled:opacity-50"
          >
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
