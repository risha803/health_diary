'use client'
import { FormField } from './ui/Formfield'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { entryClientSchema, EntryFormData } from '@/lib/validators/entry.client'

import { NumberInput } from './ui/NumberInput'
import { Checkbox } from './ui/Checkbox'
import { AutocompleteInput } from './ui/AutoComplete'

export function EntryForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<EntryFormData>({
    resolver: zodResolver(entryClientSchema),
    defaultValues: {
      feeling: 3,
      headache: false,
    },
  })

  const watchedSymptoms = watch('symptoms', '')

  const onSubmit = async (data: EntryFormData) => {
    const payload = {
      ...data,
      userId: 'demo-user-id',
      date: new Date(),
    }

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
      className="max-w-md mx-auto mt-10 space-y-4 rounded bg-white p-6 shadow"
    >
      <h1 className="text-2xl font-bold">Новая запись</h1>

      <NumberInput
        label="Самочувствие (1–5)"
        min={1}
        max={5}
        {...register('feeling', { valueAsNumber: true })}
        error={errors.feeling?.message}
      />
      <NumberInput
        label="Температура (°C)"
        step="0.1"
        {...register('temperature', {
          setValueAs: v => (v === '' ? null : Number(v)),
        })}
        error={errors.temperature?.message}
      />
      <Checkbox
        label="Головная боль"
        {...register('headache')}
      />
      <FormField
        label="Симптомы"
        error={errors.symptoms?.message}
      >
        <AutocompleteInput
          value={watchedSymptoms ?? ''}
          onChange={val => setValue('symptoms', val)}
          placeholder="Начните вводить симптом..."
        />
      </FormField>
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        Сохранить
      </button>
    </form>
  )
}
