'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { entryClientSchema, EntryFormData } from '@/lib/validators/entry.client'
import { AutocompleteInput } from './ui/AutoComplete'

export function EntryForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue, watch } = useForm<EntryFormData>({
    resolver: zodResolver(entryClientSchema),
    defaultValues: { feeling: 3, headache: false },
  })

  const watchedSymptoms = watch('symptoms', '')

  const onSubmit = async (data: EntryFormData) => {
    const payload = { ...data, userId: 'demo-user-id', date: new Date() }

    const res = await fetch('/api/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      console.error(await res.json())
      return
    }

    if (data.symptoms) {
      await fetch('/api/symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.symptoms }),
      })
    }

    reset()
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md p-6 bg-white rounded shadow space-y-4 mx-auto mt-10"
    >
      <h1 className="text-2xl font-bold mb-4">Новая запись</h1>

      {/* Самочувствие */}
      <label className="block">
        <span className="block mb-1 font-medium">Самочувствие (1-5)</span>
        <input
          type="number"
          {...register('feeling', { valueAsNumber: true })}
          min={1}
          max={5}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.feeling && <p className="text-red-600 text-sm mt-1">{errors.feeling.message}</p>}
      </label>

      {/* Температура */}
      <label className="block">
        <span className="block mb-1 font-medium">Температура (°C)</span>
        <input
          type="number"
          step="0.1"
          {...register('temperature', {
            setValueAs: v => (v === '' ? null : Number(v))
          })}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.temperature && <p className="text-red-600 text-sm mt-1">{errors.temperature.message}</p>}
      </label>

      {/* Головная боль */}
      <label className="block flex items-center space-x-2">
        <input type="checkbox" {...register('headache')} className="h-4 w-4" />
        <span className="font-medium select-none">Головная боль</span>
      </label>

      {/* Симптомы */}
      <label className="block">
        <span className="block mb-1 font-medium">Симптомы</span>
        <AutocompleteInput
          value={watchedSymptoms ?? ''}
          onChange={val => setValue('symptoms', val)}
          placeholder="Начните вводить симптом..."
        />
        {errors.symptoms && <p className="text-red-600 text-sm mt-1">{errors.symptoms.message}</p>}
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        Сохранить
      </button>
    </form>
  )
}
