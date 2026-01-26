'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { entryClientSchema, EntryFormData } from '@/lib/validators/entry.client';
import { useState } from 'react';

export default function NewEntryPage() {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = useForm<EntryFormData>({
    resolver: zodResolver(entryClientSchema),
    defaultValues: { feeling: 3, headache: false },
  });

  async function fetchSuggestions(q: string) {
    if (!q) return setSuggestions([]);
    const res = await fetch(`/api/symptoms?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setSuggestions(data.map((s: { name: string }) => s.name));
  }

  async function onSubmit(data: EntryFormData) {
    // создаем запись
    const res = await fetch('/api/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, userId: 'demo-user-id', date: new Date() }),
    });
    if (!res.ok) {
      console.error(await res.json());
      return;
    }

    if (data.symptoms) {
      await fetch('/api/symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.symptoms }),
      });
    }

    reset();
    setSuggestions([]);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ padding: 24, maxWidth: 400 }}>
      <h1>Новая запись</h1>

      <label>
        Самочувствие
        <input type="number" {...register('feeling', { valueAsNumber: true })} />
        {errors.feeling && <p>{errors.feeling.message}</p>}
      </label>

      <label>
        Температура
        <input type="number" step="0.1" {...register('temperature', { valueAsNumber: true })} />
        {errors.temperature && <p>{errors.temperature.message}</p>}
      </label>

      <label>
        Головная боль
        <input type="checkbox" {...register('headache')} />
      </label>

      <label style={{ position: 'relative' }}>
        Симптомы
        <input
          type="text"
          {...register('symptoms')}
          onChange={e => {
            setValue('symptoms', e.target.value);
            fetchSuggestions(e.target.value);
          }}
          autoComplete="off"
        />
        {suggestions.length > 0 && (
          <ul style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            border: '1px solid #ccc',
            backgroundColor: '#fff',
            margin: 0,
            padding: 4,
            listStyle: 'none',
            zIndex: 10,
            maxHeight: 120,
            overflowY: 'auto',
          }}>
            {suggestions.map(s => (
              <li
                key={s}
                style={{ padding: 4, cursor: 'pointer' }}
                onClick={() => {
                  setValue('symptoms', s);
                  setSuggestions([]);
                }}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </label>

      <button disabled={isSubmitting}>Сохранить</button>
    </form>
  );
}
