'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { entryClientSchema, EntryFormData } from '@/lib/validators/entry.client'

import { NumberInput } from '../components/ui/NumberInput'
import { Checkbox } from './ui/Checkbox'
import { AutocompleteInput } from './ui/AutoComplete'
import { FormField } from '../components/ui/Formfield'

type Props = {
  initialData?: Partial<EntryFormData>
  onSubmit: (data: EntryFormData) => Promise<void>
}

export function EntryForm({ initialData, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<EntryFormData>({
    resolver: zodResolver(entryClientSchema),
    defaultValues: {
      feeling: 3,
      headache: false,
      ...initialData,
    },
  })

  const watchedSymptoms = watch('symptoms', '')

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto space-y-4 rounded bg-white p-6 shadow"
    >
      <FormField
        label="Самочувствие (1–5)"
        error={errors.feeling?.message}
      >
        <NumberInput
          label="Самочувствие (1-5)"
          {...register('feeling', { valueAsNumber: true })}
          min={1}
          max={5}
        />
      </FormField>

      <FormField
        label="Температура (°C)"
        error={errors.temperature?.message}
      >
        <NumberInput
        label="Температура"
          step="0.1"
          {...register('temperature', {
            setValueAs: v => (v === '' ? null : Number(v)),
          })}
        />
      </FormField>

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
