// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "./components/ThemeProvider";
import { Navbar } from "./components/Navbar";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { HeroSection } from "./components/HeroSection";
import EnhancedDestinationsSection from "./components/EnhancedDestinationsSection";
import { TravelNews } from "./components/TravelNews";
import { ParallaxSection } from "./components/ParallaxSection";
import { AuthProvider } from "./context/AuthContext";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID as string;

function App() {
  if (!GOOGLE_CLIENT_ID) {
    console.error(
      "Google Client ID is not configured. Please check if REACT_APP_GOOGLE_CLIENT_ID is set in .env"
    );
    throw new Error("Google Client ID is required");
  }

  return (
    <React.StrictMode>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <Router>
            <ThemeProvider>
              <div
                className="relative min-h-screen bg-background text-foreground"
                style={{ fontFamily: "Crimson Text, Georgia, serif" }}
              >
                {/* Navigation */}
                <Navbar />

                <Routes>
                  {/* Public Auth Routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Protected Dashboard */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Landing Page */}
                  <Route
                    path="/"
                    element={
                      <>
                        <HeroSection />
                        <EnhancedDestinationsSection />
                        <TravelNews />
                        <ParallaxSection speed={0.1}>
                          <section className="bg-gradient-to-b from-background to-orange-950/10 dark:to-orange-950/20 py-20 border-t border-border">
                            <div className="mx-auto max-w-4xl px-8 text-center">
                              <h2
                                className="mb-6 text-4xl text-foreground"
                                style={{
                                  fontFamily:
                                    "Playfair Display, Georgia, serif",
                                }}
                              >
                                Start Your Indian Adventure
                              </h2>
                              <p
                                className="mb-8 text-lg text-muted-foreground"
                                style={{
                                  fontFamily: "Crimson Text, Georgia, serif",
                                }}
                              >
                                Discover the incredible diversity of India with
                                our expert guides and authentic local
                                experiences.
                              </p>
                              <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
                                <div className="rounded-xl bg-card/90 backdrop-blur-sm border border-border p-8 max-w-md shadow-xl">
                                  <div className="mb-4">
                                    <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                                      <span className="text-white text-xl">
                                        🏔️
                                      </span>
                                    </div>
                                  </div>
                                  <p
                                    className="text-sm text-muted-foreground mb-2"
                                    style={{
                                      fontFamily:
                                        "Crimson Text, Georgia, serif",
                                    }}
                                  >
                                    Ready to explore incredible India?
                                  </p>
                                  <p
                                    className="text-foreground font-medium"
                                    style={{
                                      fontFamily:
                                        "Playfair Display, Georgia, serif",
                                    }}
                                  >
                                    Contact us to plan your authentic Indian
                                    journey
                                  </p>
                                  <button className="mt-4 w-full px-6 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-400 hover:to-red-500 transition-all duration-300">
                                    Get Started
                                  </button>
                                </div>
                              </div>
                            </div>
                          </section>
                        </ParallaxSection>
                      </>
                    }
                  />
                </Routes>
              </div>
            </ThemeProvider>
          </Router>
        </AuthProvider>
      </GoogleOAuthProvider>
    </React.StrictMode>
  );
}

export default App;
