"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Later, point this at your own API, e.g. http://localhost:5000/api/auth/login
const LOGIN_URL = "https://fakestoreapi.com/auth/login";

const fieldClass =
  "w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-600";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const trimmedUser = username.trim();
      const isAdminDemo = trimmedUser === "admin" && password === "admin123";

      if (isAdminDemo) {
        localStorage.setItem(
          "auth",
          JSON.stringify({ username: trimmedUser, token: "demo-admin-token", role: "admin" })
        );
        window.dispatchEvent(new Event("auth-change"));
        router.push("/admin");
        return;
      }

      const res = await fetch(LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: trimmedUser, password }),
      });

      if (!res.ok) {
        setError("Username or password is incorrect.");
        return;
      }

      const data = await res.json();
      localStorage.setItem(
        "auth",
        JSON.stringify({ username: trimmedUser, token: data.token, role: "customer" })
      );
      window.dispatchEvent(new Event("auth-change"));
      router.push("/store/home");
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-md px-6 pt-10 text-neutral-900">
      <h1 className="mb-6 text-3xl font-bold">Log in</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-neutral-200 p-6"
      >
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Username</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className={fieldClass}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={fieldClass}
          />
        </label>

        {error && <p className="text-sm font-medium text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
        >
          {submitting ? "Logging in..." : "Log in"}
        </button>
      </form>

      <div className="mt-4 space-y-2 text-sm text-neutral-500">
        <p>
          Demo customer login: username <b>mor_2314</b>, password <b>83r5^_</b>
        </p>
        <p>
          Demo admin login: username <b>admin</b>, password <b>admin123</b>
        </p>
      </div>
    </main>
  );
}