type Props = {
  label: string
  error?: string
} & React.InputHTMLAttributes<HTMLInputElement>

export function NumberInput({ label, error, ...props }: Props) {
  return (
    <label className="block">
      <span className="block mb-1 font-medium">{label}</span>
      <input
        type="number"
        {...props}
        className="w-full border border-gray-300 rounded px-3 py-2
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </label>
  )
}
