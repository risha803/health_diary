'use client'

import { useState, useEffect } from 'react'

type AutocompleteInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function AutocompleteInput({ value, onChange, placeholder }: AutocompleteInputProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    if (!value.trim()) {
      setSuggestions([])
      return
    }

    async function fetchSuggestions() {
      const res = await fetch(`/api/symptoms?q=${encodeURIComponent(value)}`)
      if (res.ok) {
        const data = await res.json()
        setSuggestions(data)
        setShowSuggestions(true)
      }
    }

    fetchSuggestions()
  }, [value])

  return (
    <div className="relative">
      <input
        type="text"
        value={value ?? ''}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        onFocus={() => value.trim() && setShowSuggestions(true)}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        autoComplete="off"
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 rounded mt-1 w-full max-h-40 overflow-auto shadow-lg">
          {suggestions.map(s => (
            <li
              key={s}
              onClick={() => {
                onChange(s)
                setShowSuggestions(false)
              }}
              className="px-3 py-2 cursor-pointer hover:bg-blue-100"
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
