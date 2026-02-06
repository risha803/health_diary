'use client'

import { useEffect, useState } from 'react'
import { EntryCard } from '../components/entry/EntryCard'
import { HealthEntryUI } from '../components/entry/types'

export function EntriesList() {
  const [entries, setEntries] = useState<HealthEntryUI[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await fetch('/api/entries')
        const data = await res.json()
        setEntries(data)
      } catch (e) {
        console.error('Ошибка загрузки записей', e)
      } finally {
        setLoading(false)
      }
    }

    fetchEntries()
  }, [])

  if (loading) {
    return <p className="text-center text-gray-500">Загрузка...</p>
  }

  if (entries.length === 0) {
    return (
      <p className="text-center text-gray-500">
        Пока нет записей. Добавь первую 👇
      </p>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-6">
      {entries.map(entry => (
        <EntryCard key={entry.id} entry={entry} />
      ))}
    </div>
  )
}
