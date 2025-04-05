import { signIn } from "next-auth/react";
import Head from "next/head";
import { useState, useEffect } from "react";
import { GitHubLoginButton, GoogleLoginButton } from "../components/loginButton";
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { data: session } = useSession();
  const router = useRouter();
  const { callbackUrl } = router.query;

  // If already logged in, redirect to study guide
  useEffect(() => {
    if (session) {
      router.push('/mainpage');
    }
  }, [session, router]);

  useEffect(() => {
    console.log("Login page loaded, session:", session);
    console.log("Callback URL:", callbackUrl);
  }, []);

  const handleSuccessfulLogin = () => {
    const redirectUrl = typeof callbackUrl === 'string' ? callbackUrl : '/mainpage';
    console.log(`Redirecting to: ${redirectUrl}`);
    router.push(redirectUrl);
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      
      console.log("Login result:", result);
      
      if (result?.error) {
        setError(`Login failed: ${result.error}`);
      } else if (result?.ok) {
        router.push(typeof callbackUrl === 'string' ? callbackUrl : '/mainpage');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Validate user credentials against your backend
  const validateUserCredentials = async (email, password) => {
    try {
      // Make an API call to your authentication endpoint
      const response = await fetch('/api/auth/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Validation error:', error);
      return false;
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Basic validation
    if (!email || !password || !confirmPassword) {
      setError('All fields are required');
      setIsLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }
    
    try {
      // Register the user first
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.message || 'Registration failed');
        setIsLoading(false);
        return;
      }
      
      // Now sign in
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      
      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        handleSuccessfulLogin();
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{showSignup ? "Sign Up" : "Sign In"} - TriLearn</title>
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              {showSignup ? "Create Account" : "Welcome back"}
            </h1>
            <p className="mt-3 text-gray-500">
              {showSignup ? "Sign up to start learning with TriLearn" : "Sign in to continue to TriLearn"}
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {showSignup ? (
            // Signup Form
            <form onSubmit={handleSignup} className="mt-8 space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="signup-email">
                  Email
                </label>
                <input
                  id="signup-email"
                  type="email"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="signup-password">
                  Password
                </label>
                <input
                  id="signup-password"
                  type="password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm-password">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="********"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Sign Up"}
              </button>
              
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setShowSignup(false)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Already have an account? Sign in
                </button>
              </div>
            </form>
          ) : (
            // Login Options
            <>
              <div className="mt-8 space-y-4">
                {/* Email Login Form */}
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="login-email">
                      Email
                    </label>
                    <input
                      id="login-email"
                      type="email"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="login-password">
                      Password
                    </label>
                    <input
                      id="login-password"
                      type="password"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="********"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign in with Email"}
                  </button>
                </form>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <GoogleLoginButton isLoading={isLoading} setIsLoading={setIsLoading} />
                <GitHubLoginButton isLoading={isLoading} setIsLoading={setIsLoading} />
                
                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => setShowSignup(true)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Don't have an account? Sign up
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-500">
              By signing in, you agree to our{" "}
              <a href="/terms" className="text-blue-600 hover:text-blue-800">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-blue-600 hover:text-blue-800">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
} 