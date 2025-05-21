import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProductStore } from '../store/store';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useProductStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await login({email,password});
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        setIsAuthenticated(true);
        navigate('/');
        toast.success('Login Successfully');
      } else {
        setError(response.message || 'Login failed');
        toast.error('An error occurred. Please try again.');
      }
    } catch (err) {
      toast.error('An error occurred. Please try again.');
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }
  const handleGoogleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
  
    try {
      const response = await axios.post('http://localhost:3000/api/auth/google-login', { token });
  
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setIsAuthenticated(true);
        navigate('/');
        toast.success('Login Successfully');
      } else {
        setError(response.data.message || 'Login failed');
        toast.error('An error occurred. Please try again.');
      }
    } catch (err) {
      console.error('Google login failed:', err);
      toast.error('Google login failed');
    }
  };
  
  const handleGoogleError = () => {
    toast.error('Google Login failed');
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[#1e1e1e] p-8 rounded-xl shadow-lg border border-[#2c2c2c]">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Sign in to your account
          </h2>
        </div>
        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded-lg" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 bg-[#2c2c2c] border border-[#3d3d3d] placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#43CBFF] focus:border-transparent sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 bg-[#2c2c2c] border border-[#3d3d3d] placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#43CBFF] focus:border-transparent sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[#43CBFF] focus:ring-[#43CBFF] border-gray-600 rounded bg-[#2c2c2c]"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                Remember me
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-[#43CBFF] to-[#9708CC] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#43CBFF] transition-all ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign in'}
            </button>
          </div>
        </form>
        <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
      />
        <div className="text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-[#43CBFF] hover:text-[#38b6ff]">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;