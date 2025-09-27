import React, { useEffect, useState, useCallback } from "react";
import { getUserProfile } from "../api/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | null;
}

function ProtectedRoute({ children, requiredRole = null }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("accessToken");
    
    if (!token) {
      setIsLoading(false);
      window.location.href = "/login";
      return;
    }

    try {
      const response = await getUserProfile();
      console.log("User profile response:", response.data);
      setIsAuthenticated(true);
      
      // Check role if required
      if (requiredRole && response.data.currentUser.role !== requiredRole) {
        console.error(`Access denied. User role: ${response.data.currentUser.role}, Required: ${requiredRole}`);
        alert("Access denied. Insufficient permissions.");
        window.location.href = "/login";
        return;
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    } finally {
      setIsLoading(false);
    }
  }, [requiredRole]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300 dark:from-orange-950 dark:via-orange-900 dark:to-orange-800">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          <p className="mt-2 text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return children;
}

export default ProtectedRoute;