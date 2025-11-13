import React, { useState } from 'react';
import { UserPlus, Mail, Lock, ArrowLeft } from 'lucide-react';
import apiFetch from '../../src/utils/api';
import { toast } from 'react-hot-toast';

interface RegisterAccountPageProps {
  onBackToLogin: () => void;
  onRegistered: () => void;
}

const RegisterAccountPage: React.FC<RegisterAccountPageProps> = ({ onBackToLogin, onRegistered }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const password = String(formData.get('password') || '');
    const confirmPassword = String(formData.get('confirmPassword') || '');

    if (!name || !email || !password) {
      toast.error('Please fill out every field.');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const detailMessage = Array.isArray(body?.details) && body.details.length > 0
          ? body.details.map((issue: any) => issue.message).join(', ')
          : body?.error;
        throw new Error(detailMessage || 'Registration failed');
      }
      toast.success('Account created! Please sign in.');
      onRegistered();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-primary-600 p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your organizer account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Manage events, invite guests, and keep everything in one place.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Field label="Full name" name="name" type="text" icon={<UserPlus className="w-5 h-5 text-gray-400" />} />
            <Field label="Email address" name="email" type="email" icon={<Mail className="w-5 h-5 text-gray-400" />} autoComplete="email" />
            <Field label="Password" name="password" type="password" icon={<Lock className="w-5 h-5 text-gray-400" />} autoComplete="new-password" />
            <Field label="Confirm password" name="confirmPassword" type="password" icon={<Lock className="w-5 h-5 text-gray-400" />} autoComplete="new-password" />

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </form>
          <button
            type="button"
            onClick={onBackToLogin}
            className="mt-6 flex items-center justify-center text-sm font-medium text-primary-600 hover:text-primary-800 transition-colors duration-300 w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
};

const Field: React.FC<{
  label: string;
  name: string;
  type: string;
  icon: React.ReactNode;
  autoComplete?: string;
}> = ({ label, name, type, icon, autoComplete }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="mt-1 relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required
        className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-sm transition duration-300"
      />
    </div>
  </div>
);

export default RegisterAccountPage;
