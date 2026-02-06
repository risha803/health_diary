type Props = {
  label: string
} & React.InputHTMLAttributes<HTMLInputElement>

export function Checkbox({ label, ...props }: Props) {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        {...props}
        className="h-4 w-4 text-blue-600"
      />
      <span className="select-none font-medium">{label}</span>
    </label>
  )
}
