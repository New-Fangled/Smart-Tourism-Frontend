import React, { useState } from "react";
import { useGoogleLogin } from '@react-oauth/google';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../api/authapi";
import api from "../api/axios";

function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(credentials);
      
      // Store the access token
      if (response.access_token) {
        localStorage.setItem('access_token', response.access_token);
      }
      
      setUser(response.user);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      alert(error.response?.data?.detail || 'Login failed. Please try again.');
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log('Google login success:', tokenResponse);
      try {
        // Send the token to your backend
        const response = await api.post('/auth/google', {
          code: tokenResponse.code,
          scope: tokenResponse.scope
        });
        
        console.log('Backend response:', response.data);
        
        if (response.data && response.data.user) {
          // Update the auth context with the user data
          setUser(response.data.user);
          
          // Redirect to dashboard on successful login
          navigate('/dashboard');
        } else {
          console.error('Invalid response format:', response.data);
          alert('Server response format invalid. Please try again.');
        }
      } catch (error) {
        console.error('Failed to authenticate with backend:', error);
        if (error.response) {
          // The request was made and the server responded with a status
          alert(`Authentication failed: ${error.response.data.message || 'Please try again.'}`);
        } else if (error.request) {
          // The request was made but no response was received
          alert('Unable to reach authentication server. Please check your connection.');
        } else {
          // Something happened in setting up the request
          alert('Authentication process failed. Please try again.');
        }
      }
    },
    onError: (errorResponse) => {
      console.error('Google login failed:', errorResponse);
      alert('Google login failed. Please try again.');
    },
    flow: 'auth-code',
    scope: 'email profile',
  });

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1629184950099-3eb7993b5f48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBoaW1hbGF5YXMlMjBtb3VudGFpbiUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NTc2Nzc2ODB8MA&ixlib=rb-4.1.0&q=80&w=1080')] bg-cover bg-center flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      
      <Card className="w-full max-w-md mx-4 bg-card/90 backdrop-blur-sm border-border">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-serif">TraviGo</CardTitle>
          <p className="text-muted-foreground">Enter your credentials to login</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                className="h-12"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                className="h-12"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500"
            >
              Login
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <Button
              type="button"
              onClick={() => googleLogin()}
              className="w-full h-12 bg-white text-gray-600 hover:bg-gray-100 flex items-center justify-center gap-2 mt-4"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              Sign in with Google
            </Button>

            <a href="/forgot-password" className="text-orange-500 hover:underline block mt-4">
              Forgot password?
            </a>
            <p className="mt-2 text-muted-foreground">
              Don't have an account?{" "}
              <a href="/register" className="text-orange-500 hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginPage;
