/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import "./login.scss";
import { useState } from "react";
import { Navbar } from "../components/Navbar";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
  const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, firstName }),
      });
      const body = await res.json();
  if (!res.ok) throw new Error(body?.error || JSON.stringify(body));
  setMessage("Account created — you can now sign in.");
      setEmail("");
      setPassword("");
      setName("");
      setFirstName("");
      setMode("login");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error creating account";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || JSON.stringify(body));

      // backend returns { user }
      if (body?.user) {
        // simple session store
        localStorage.setItem("user", JSON.stringify(body.user));
        setMessage("Signed in — redirecting...");
        setTimeout(() => (window.location.href = "/"), 800);
      } else {
        setMessage("Sign in successful");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error signing in";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="login-page">
        <div className="card">
          <h1 className="title">{mode === "login" ? "Sign in" : "Sign up"}</h1>

        <div className="tabs">
          <button className={`tab ${mode === "login" ? "active" : ""}`} onClick={() => setMode("login")}>
            Email
          </button>
          <button className={`tab ${mode === "register" ? "active" : ""}`} onClick={() => setMode("register")}>
            Register
          </button>
        </div>

        {error && <div className="error">{error}</div>}
        {message && <div className="message">{message}</div>}

        {mode === "register" ? (
          <form onSubmit={handleRegister} className="form">
            <label htmlFor="FirstName">First name</label>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" className="input" />
            <label htmlFor="Name">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Last name" className="input" />
            <label htmlFor="Email">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="input" />
            <label htmlFor="Password">Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="input" />
            <button disabled={loading} type="submit" className="btn btn-primary">
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="form">
            <label htmlFor="Email">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="input" />
            <label htmlFor="Password">Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="input" />
            <button disabled={loading} type="submit" className="btn btn-primary">
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        )}
      </div>
    </main>
    </>
  );
}
