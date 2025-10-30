import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiUrl } from '../lib/api.js';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

type LoginInput = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema)
  });
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    setServerError(null);
    try {
      const res = await fetch(apiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      if (res.ok) {
        window.location.href = '/';
      } else {
        const { error } = await res.json();
        setServerError(error || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary" />
          <span className="font-semibold text-lg">RIRS</span>
        </Link>
        <div className="text-sm text-gray-700">Nimaš računa? <Link to="/register" className="text-primary hover:underline">Ustvari račun</Link></div>
      </div>

      <div className="max-w-md mx-auto mt-6 p-6 bg-white border rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold mb-1">Prijava</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input { ...register('email') } type="email" className="border rounded w-full p-2" />
          {errors.email && <div className="text-red-600 text-sm">{errors.email.message}</div>}
        </div>
        <div>
          <label className="block mb-1">Geslo</label>
          <input { ...register('password') } type="password" className="border rounded w-full p-2" />
          {errors.password && <div className="text-red-600 text-sm">{errors.password.message}</div>}
        </div>
        {serverError && <div className="text-red-600 text-sm">{serverError}</div>}
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded w-full">{loading ? 'Prijavljam...' : 'Prijava'}</button>
        </form>
      </div>
    </div>
  );
}
