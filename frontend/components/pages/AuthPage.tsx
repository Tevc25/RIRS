import React from 'react';
import apiFetch from '../../src/utils/api';
import { Mail, Lock, User, LogIn } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface AuthPageProps {
  // on successful login, pass user object and token
  onLogin: (user: { id: number; email: string; role?: string }, token: string) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const email = String(formData.get('email') || '');
    const password = String(formData.get('password') || '');
    const remember = formData.get('remember-me') === 'on';

    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const err = body?.error || res.statusText || 'Login failed';
        toast.error(String(err));
        return;
      }
      const body = await res.json();
      const { token, user } = body as { token: string; user: { id: number; email: string; role?: string } };
      if (!token || !user) {
        toast.error('Invalid login response from server');
        return;
      }
      // persist token if remember checked, otherwise sessionStorage
      try {
        if (remember) localStorage.setItem('token', token);
        else sessionStorage.setItem('token', token);
      } catch (err) {
        // ignore storage errors
      }
      toast.success('Logged in successfully');
      onLogin(user, token);
    } catch (err) {
      console.error(err);
      toast.error('Failed to login (network error)');
    }
  };

  return (
    <div 
        className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8"
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-primary-600 p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
             <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome to EventSphere
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to create and discover events
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  defaultValue="user@example.com"
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-sm transition duration-300"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  defaultValue="password"
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-sm transition duration-300"
                  placeholder="********"
                />
              </div>
            </div>

             <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"/>
                <label htmlFor="remember-me" className="ml-2 block text-sm text-primary-600 font-bold">Remember me</label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-bold text-primary-600 hover:text-primary-800 transition-colors duration-300">Forgot your password?</a>
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-transform transform hover:scale-105 duration-300"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
