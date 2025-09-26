import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { registerUser } from "../api/auth";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = { name, email, password, role };
      const response = await registerUser(payload);
      alert("Registration successful! Please login.");
      window.location.href = "/login";
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response) {
        // Server responded with error status
        setError(err.response?.data?.message || `Server error: ${err.response.status}`);
      } else if (err.request) {
        // Request was made but no response received
        setError("Cannot connect to server. Make sure backend is running on port 8000.");
      } else {
        // Something else happened
        setError("Registration failed: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300 dark:from-orange-950 dark:via-orange-900 dark:to-orange-800">
      <div className="bg-white dark:bg-background rounded-2xl shadow-2xl p-8 w-full max-w-md border border-border">
        <h1 className="text-3xl font-bold mb-6 text-center text-orange-700 dark:text-orange-400" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>Register</h1>
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-muted-foreground">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-orange-400 bg-background text-foreground"
            />
          </div>
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
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>
        <div className="mt-6 text-center text-muted-foreground">
          Already have an account? <a href="/login" className="text-orange-600 hover:underline">Login</a>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
