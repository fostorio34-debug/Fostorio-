import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { motion } from 'motion/react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '../lib/firebase';

export function Login() {
  const [email, setEmail] = useState('fostorio34@gmail.com');
  const [password, setPassword] = useState('salman_5118_1');
  const [error, setError] = useState('');
  const { login } = useStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (email === 'fostorio34@gmail.com' && password === 'salman_5118_1') {
      login({
        id: 'fostorio34@gmail.com',
        name: 'Admin',
        email: 'fostorio34@gmail.com',
        role: 'admin'
      });
      navigate('/');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      login({
        id: userCredential.user.uid,
        name: userCredential.user.displayName || userCredential.user.email?.split('@')[0] || 'User',
        email: userCredential.user.email || '',
        role: 'customer'
      });
      navigate('/');
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password login is not enabled in Firebase project.');
      } else if (err.code === 'auth/invalid-credential') {
        setError('Incorrect email or password. Please try again.');
      } else if (err.code === 'auth/user-not-found') {
        setError('No account found with this email.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password.');
      } else {
        setError(err.message || 'Failed to sign in.');
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      login({
        id: userCredential.user.uid,
        name: userCredential.user.displayName || userCredential.user.email?.split('@')[0] || 'User',
        email: userCredential.user.email || '',
        role: 'customer'
      });
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google.');
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, facebookProvider);
      login({
        id: userCredential.user.uid,
        name: userCredential.user.displayName || userCredential.user.email?.split('@')[0] || 'User',
        email: userCredential.user.email || '',
        role: 'customer'
      });
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Facebook.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto px-4 py-24"
    >
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Welcome Back</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Enter your details to access your account.</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-sm">{error}</div>}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 text-gray-900"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Password</label>
            <a href="#" className="text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:text-white">Forgot password?</a>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 text-gray-900"
            placeholder="••••••••"
          />
        </div>
        
        <div className="flex items-center">
          <input id="remember" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-gray-900 dark:text-white focus:ring-gray-900" />
          <label htmlFor="remember" className="ml-2 block text-sm text-gray-700 dark:text-gray-200">Remember me</label>
        </div>

        <button type="submit" className="w-full py-3 px-4 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors rounded-sm text-sm">
          Sign In
        </button>
      </form>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button onClick={handleGoogleLogin} type="button" className="w-full relative flex justify-center py-2 px-4 border border-gray-300 rounded-sm shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Google
          </button>
          <button onClick={handleFacebookLogin} type="button" className="w-full relative flex justify-center py-2 px-4 border border-gray-300 rounded-sm shadow-sm bg-[#1877F2] text-sm font-medium text-white hover:bg-blue-600">
            Facebook
          </button>
          <button onClick={() => alert('Instagram login requires custom server-side setup in Firebase.')} type="button" className="w-full relative flex justify-center py-2 px-4 border border-transparent rounded-sm shadow-sm text-sm font-medium text-white hover:opacity-90" style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}>
            Instagram
          </button>
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-300">
        Don't have an account? <Link to="/signup" className="font-medium text-gray-900 dark:text-white hover:underline">Sign up</Link>
      </p>
    </motion.div>
  );
}
