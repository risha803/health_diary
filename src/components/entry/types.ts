export type HealthEntryUI = {
  id: number
  date: string
  feeling: number
  temperature: number | null
  pulse: number | null
  pressureSystolic: number | null
  pressureDiastolic: number | null
  headache: boolean | null
  symptoms: string | null
}
