import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { apiUrl } from '../lib/api.js';

const EventSchema = z.object({
  name: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  location: z.string().min(1),
  description: z.string().min(1),
  rsvpDeadline: z.string().optional(),
});
type EventInput = z.infer<typeof EventSchema>;

export default function EventCreatePage() {
  const { register, handleSubmit, formState: { errors } } = useForm<EventInput>({ resolver: zodResolver(EventSchema) });
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: EventInput) => {
    setLoading(true);
    setServerError(null);
    try {
      const res = await fetch(apiUrl('/api/events'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => window.location.href = '/', 1000);
      } else {
        const resp = await res.json();
        setServerError(resp.error || 'Napaka pri ustvarjanju dogodka');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Nov dogodek</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Ime dogodka</label>
          <input {...register('name')} className="border rounded w-full p-2" />
          {errors.name && <div className="text-red-600 text-sm">{errors.name.message}</div>}
        </div>
        <div>
          <label className="block mb-1">Datum (YYYY-MM-DD)</label>
          <input type="date" {...register('date')} className="border rounded w-full p-2" />
          {errors.date && <div className="text-red-600 text-sm">{errors.date.message}</div>}
        </div>
        <div>
          <label className="block mb-1">Ura</label>
          <input type="time" {...register('time')} className="border rounded w-full p-2" />
          {errors.time && <div className="text-red-600 text-sm">{errors.time.message}</div>}
        </div>
        <div>
          <label className="block mb-1">Lokacija</label>
          <input {...register('location')} className="border rounded w-full p-2" />
          {errors.location && <div className="text-red-600 text-sm">{errors.location.message}</div>}
        </div>
        <div>
          <label className="block mb-1">Opis</label>
          <textarea {...register('description')} className="border rounded w-full p-2" />
          {errors.description && <div className="text-red-600 text-sm">{errors.description.message}</div>}
        </div>
        <div>
          <label className="block mb-1">Rok za RSVP (neobvezno)</label>
          <input type="datetime-local" {...register('rsvpDeadline')} className="border rounded w-full p-2" />
          {errors.rsvpDeadline && <div className="text-red-600 text-sm">{errors.rsvpDeadline.message}</div>}
        </div>
        {serverError && <div className="text-red-600 text-sm">{serverError}</div>}
        {success && <div className="text-green-600 text-sm">Dogodek ustvarjen!</div>}
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded w-full">{loading ? 'Shranjujem...' : 'Ustvari dogodek'}</button>
      </form>
    </div>
  );
}
