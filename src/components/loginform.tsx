// src/components/Login.jsx
import  { useState } from 'react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
  event.preventDefault();
  
  // Basic validation
  if (!email.trim() || !password.trim()) {
    alert('Please fill in all fields');
    return;
  }

  // Enhanced email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address');
    return;
  }

  // Password length validation
  if (password.length < 6) {
    alert('Password must be at least 6 characters');
    return;
  }

    navigate("/home");
  // Handle login logic
  console.log('Email:', email);
  console.log('Password:', password);
  
  // Add your actual login/API call here
  // loginUser(email, password);
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-900 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-400">Enter your credentials to access your account</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-700 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-500 hover:text-indigo-400">
                Forgot password?
              </a>
            </div>
          </div>

          <div>
           <Button 
            onClick={handleSubmit} 
            size="lg" 
            className="w-full h-12 text-lg font-semibold"
            variant="cozy"
            >
            Submit 
          </Button>
          </div>
        </form>
        <div className="text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <a href="#" className="font-medium text-indigo-500 hover:text-indigo-400">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
