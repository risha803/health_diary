import { HealthEntry, User } from "@prisma/client";

type EntryWithUser = HealthEntry & {user: User};

async function getEntries(): Promise<EntryWithUser[]> {
  const res = await fetch('http://localhost:3000/api/entries', {
    cache: 'no-store',
  })

  if (!res.ok) throw new Error('Failed to fetch entries')
    return res.json()
}

export default async function EntriesPage() {
  const entries = await getEntries()

  return (
    <div className="" style={{padding: 24}}>
      <h1>Дневник здоровья</h1>

      {entries.map((entry) => (
        <div key={entry.id} style={{border: '1px solid #ccc', marginBottom: 12, padding: 12}}>
          <div>Дата: {new Date(entry.date).toLocaleDateString()}</div>
          <div>Шкала самочувствия: {entry.feeling}/5</div>
          <div>Температура: {entry.temperature ?? '-'}</div>
          <div>Давление: {entry.pressureSystolic}/{entry.pressureDiastolic}</div>
          <div>Пульс: {entry.pulse}</div>
          <div>Головная боль: {entry.headache ? 'Да' : 'Нет'}</div>
          <div>Симптомы: {entry.symptoms}</div>
        </div>
      ))}
    </div>
  )
}