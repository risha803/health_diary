import { EntryForm } from '@/components/EntryForm'

export default function NewEntryPage() {
  const handleCreate = async (data: any) => {
    await fetch('/api/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        userId: 'demo-user-id',
        date: new Date(),
      }),
    })
  }

  return (
    <main className="p-6">
      <EntryForm onSubmit={handleCreate} />
    </main>
  )
}
