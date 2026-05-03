import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { motion } from 'motion/react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useStore();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    // Mock authentication
    if (email === 'admin@example.com') {
      login({ id: 'a1', name: 'Admin User', email, role: 'admin' });
    } else {
      login({ id: 'u1', name: 'Test User', email, role: 'customer' });
    }
    navigate('/');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto px-4 py-24"
    >
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome Back</h1>
        <p className="mt-2 text-sm text-gray-600">Enter your details to access your account.</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-sm">{error}</div>}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <a href="#" className="text-xs font-medium text-gray-600 hover:text-gray-900">Forgot password?</a>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
            placeholder="••••••••"
          />
        </div>
        
        <div className="flex items-center">
          <input id="remember" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
          <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">Remember me</label>
        </div>

        <button type="submit" className="w-full py-3 px-4 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors rounded-sm text-sm">
          Sign In
        </button>

        <p className="text-center text-sm text-gray-600">
          Don't have an account? <Link to="/signup" className="font-medium text-gray-900 hover:underline">Sign up</Link>
        </p>
      </form>
    </motion.div>
  );
}
