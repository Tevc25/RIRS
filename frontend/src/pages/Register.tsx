import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { apiUrl } from '../lib/api.js';

const RegisterSchema = z.object({
  name: z.string().min(1, 'Vnesi ime'),
  email: z.string().email('Neveljaven email'),
  password: z.string().min(8, 'Najmanj 8 znakov'),
});

type RegisterInput = z.infer<typeof RegisterSchema>;

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({ resolver: zodResolver(RegisterSchema) });
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true);
    setServerError(null);
    setSuccess(false);
    try {
      const res = await fetch(apiUrl('/api/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = '/login';
        }, 800);
      } else {
        const { error } = await res.json();
        setServerError(error || 'Napaka pri registraciji');
      }
    } catch (e) {
      setServerError('Napaka omrežja');
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
        <div className="text-sm text-gray-700">Že imaš račun? <Link to="/login" className="text-primary hover:underline">Prijava</Link></div>
      </div>

      <div className="max-w-md mx-auto mt-6 p-6 bg-white border rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold">Ustvari račun</h2>
        <p className="text-gray-600 mt-1">Začni organizirati dogodke v minuti.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="block mb-1 text-sm">Ime</label>
            <input {...register('name')} className="border rounded w-full p-2" placeholder="Janez Novak" />
            {errors.name && <div className="text-red-600 text-sm mt-1">{errors.name.message}</div>}
          </div>
          <div>
            <label className="block mb-1 text-sm">Email</label>
            <input type="email" {...register('email')} className="border rounded w-full p-2" placeholder="janez@example.com" />
            {errors.email && <div className="text-red-600 text-sm mt-1">{errors.email.message}</div>}
          </div>
          <div>
            <label className="block mb-1 text-sm">Geslo</label>
            <input type="password" {...register('password')} className="border rounded w-full p-2" placeholder="••••••••" />
            {errors.password && <div className="text-red-600 text-sm mt-1">{errors.password.message}</div>}
          </div>
          {serverError && <div className="text-red-600 text-sm">{serverError}</div>}
          {success && <div className="text-green-600 text-sm">Račun ustvarjen! Preusmerjam...</div>}
          <button type="submit" disabled={loading} className="bg-primary text-white px-4 py-2 rounded w-full">{loading ? 'Ustvarjam...' : 'Ustvari račun'}</button>
        </form>
      </div>
    </div>
  );
}
