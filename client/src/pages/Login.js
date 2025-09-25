// Import the Button component
// ...existing code...


import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { loginUser } from "../api/auth";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = { email, password, role };
      let response;
      if (role === "user") {
        response = await loginUser(payload);
      } else {
        response = await loginUser(payload); // Use same endpoint but with role
      }
      // Save token to localStorage
      const { accessToken } = response.data;
      localStorage.setItem("accessToken", accessToken);
      // Redirect based on role
      if (role === "user") {
        window.location.href = "/user-dashboard";
      } else {
        window.location.href = "/authority-dashboard";
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300 dark:from-orange-950 dark:via-orange-900 dark:to-orange-800">
      <div className="bg-white dark:bg-background rounded-2xl shadow-2xl p-8 w-full max-w-md border border-border">
        <h1 className="text-3xl font-bold mb-6 text-center text-orange-700 dark:text-orange-400" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>Login</h1>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-muted-foreground">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-orange-400 bg-background text-foreground"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-muted-foreground">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-orange-400 bg-background text-foreground"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-muted-foreground">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-orange-400 bg-background text-foreground"
            >
              <option value="user">User</option>
              <option value="authority">Authority</option>
            </select>
          </div>
          {error && <div className="text-red-600 text-center font-medium">{error}</div>}
          <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg py-2 font-semibold text-lg shadow-md hover:from-orange-400 hover:to-red-500 transition-all duration-300">
            {loading ? "Logging in..." : "Log in"}
          </Button>
        </form>
        <div className="mt-6 text-center text-muted-foreground">
          Don't have an account? <a href="/register" className="text-orange-600 hover:underline">Register</a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
