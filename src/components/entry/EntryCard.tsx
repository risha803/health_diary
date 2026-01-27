import { HealthEntryUI } from "./types"

type Props = {
  entry: HealthEntryUI
}

export function EntryCard({entry}: Props) {
  return (
    <div className="border border-gray-300 rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="text-sm text-gray-500">
        {new Date(entry.date).toLocaleDateString()}
      </div>

      <div className="mt-2">
        <strong>Самочувствие:</strong> {entry.feeling}/5
      </div>

      {entry.temperature !== null && (
        <div>
          <strong>Температура:</strong> {entry.temperature}°C
        </div>
      )}

      {entry.pressureSystolic && entry.pressureDiastolic && (
        <div>
          <strong>Давление:</strong> {entry.pressureSystolic}/{entry.pressureDiastolic}
        </div>
      )}

      {entry.pulse && (
        <div>
          <strong>Пульс:</strong> {entry.pulse}
        </div>
      )}

      {entry.headache !== null && (
        <div>
          <strong>Головная боль:</strong> {entry.headache ? 'Да' : 'Нет'}
        </div>
      )}

      {entry.symptoms && (
        <div>
          <strong>Симптомы:</strong> {entry.symptoms}
        </div>
      )}
    </div>
  )
}