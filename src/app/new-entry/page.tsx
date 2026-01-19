'use client';

import { useState, useEffect } from 'react';

export default function NewEntryPage() {
  const [feeling, setFeeling] = useState<number>(3);
  const [temperature, setTemperature] = useState<string>('');
  const [headache, setHeadache] = useState<boolean>(false);
  const [symptoms, setSymptoms] = useState<string>('');
  const [pulse, setPulse] = useState<string>('');
  const [pressureSystolic, setPressureSystolic] = useState<string>('');
  const [pressureDiastolic, setPressureDiastolic] = useState<string>('');

  const [suggestions, setSuggestions] = useState<string[]>([]);

    // автокомплит с бд
  async function fetchSuggestions(text: string) {
    if (!text) {
      setSuggestions([]);
      return;
    }
    const res = await fetch(`/api/symptoms?q=${encodeURIComponent(text)}`);
    const data = await res.json();
    setSuggestions(data.map((s: { name: string }) => s.name));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (feeling < 1 || feeling > 5) return alert('Самочувствие должно быть от 1 до 5');
    if (temperature && (Number(temperature) < 34 || Number(temperature) > 42))
      return alert('Температура должна быть от 34 до 42°C');
    if (pulse && (Number(pulse) < 30 || Number(pulse) > 200)) return alert('Пульс должен быть от 30 до 200');
    if (pressureSystolic && (Number(pressureSystolic) < 80 || Number(pressureSystolic) > 250))
      return alert('Систолическое давление должно быть от 80 до 250');
    if (pressureDiastolic && (Number(pressureDiastolic) < 50 || Number(pressureDiastolic) > 180))
      return alert('Диастолическое давление должно быть от 50 до 180');
    if (symptoms) {
      await fetch('/api/symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: symptoms }),
      });
    }

    try {
      //Делаем новую запись
      await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: new Date(),
          feeling,
          temperature: temperature ? Number(temperature) : null,
          headache,
          symptoms,
          pulse: pulse ? Number(pulse) : null,
          pressureSystolic: pressureSystolic ? Number(pressureSystolic) : null,
          pressureDiastolic: pressureDiastolic ? Number(pressureDiastolic) : null,
        }),
      });

      //Добавляю новый симптом в бд
      if (symptoms) {
        await fetch('/api/symptoms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: symptoms }),
        });
      }

      alert('Запись сохранена');

      //Reset формы
      setFeeling(3);
      setTemperature('');
      setHeadache(false);
      setSymptoms('');
      setPulse('');
      setPressureSystolic('');
      setPressureDiastolic('');
      setSuggestions([]);
    } catch (err) {
      console.error(err);
      alert('Ошибка при сохранении записи');
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding: 24 }}>
      <h1>Новая запись</h1>

      <label>
        Самочувствие (1–5)
        <input type="number" min={1} max={5} value={feeling} onChange={(e) => setFeeling(+e.target.value)} />
      </label>

      <label>
        Температура
        <input value={temperature} onChange={(e) => setTemperature(e.target.value)} />
      </label>

      <label>
        Пульс
        <input type="number" min={30} max={200} value={pulse} onChange={(e) => setPulse(e.target.value)} />
      </label>

      <label>
        Давление (Систолическое / Диастолическое)
        <input type="number" min={80} max={250} value={pressureSystolic} onChange={(e) => setPressureSystolic(e.target.value)} />
        <input type="number" min={50} max={180} value={pressureDiastolic} onChange={(e) => setPressureDiastolic(e.target.value)} />
      </label>

      <label>
        Головная боль
        <input type="checkbox" checked={headache} onChange={(e) => setHeadache(e.target.checked)} />
      </label>

      <label style={{ position: 'relative' }}>
        Симптомы
        <input
          value={symptoms}
          onChange={e => {
            setSymptoms(e.target.value);
            fetchSuggestions(e.target.value);
          }}
          autoComplete="off"
        />
        {suggestions.length > 0 && (
          <ul
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              border: '1px solid #ccc',
              backgroundColor: '#fff',
              margin: 0,
              padding: 4,
              listStyle: 'none',
              zIndex: 10,
              maxHeight: 100,
              overflowY: 'auto',
            }}
          >
            {suggestions.map(s => (
              <li
                key={s}
                style={{ padding: 4, cursor: 'pointer' }}
                onClick={() => setSymptoms(s)}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </label>

      <button type="submit">Сохранить</button>
    </form>
  );
}
