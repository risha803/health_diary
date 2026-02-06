import { ReactNode } from 'react'

type Props = {
  label: string
  error?: string
  children: ReactNode
}

export function FormField({ label, error, children }: Props) {
  return (
    <label className="block">
      <span className="mb-1 block font-medium">{label}</span>

      {children}

      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </label>
  )
}
