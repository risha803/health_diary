import { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' }: Props) {
  return (
    <div
      className={`rounded-lg border border-gray-300 bg-white p-4 shadow-sm transition-shadow hover:shadow-md ${className}`}
    >
      {children}
    </div>
  )
}
