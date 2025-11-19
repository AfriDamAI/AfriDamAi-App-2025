interface HealthIndicatorProps {
  label: string
  value: string
  color?: "blue" | "green" | "orange" | "red"
}

export function HealthIndicator({ label, value, color = "blue" }: HealthIndicatorProps) {
  const colors = {
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200",
    green: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200",
    orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200",
    red: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200",
  }

  return (
    <div className={`p-3 rounded-lg ${colors[color]}`}>
      <p className="text-xs font-medium opacity-75">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  )
}
