export default function DonutChart({ items }) {
  const size = 160
  const stroke = 18
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r

  let offset = 0
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label="Issue categories"
    >
      <g transform={`translate(${size / 2} ${size / 2})`}>
        {items.map((it) => {
          const frac = it.value / 100
          const dash = c * frac
          const el = (
            <circle
              key={it.label}
              r={r}
              cx="0"
              cy="0"
              fill="transparent"
              stroke={it.color}
              strokeWidth={stroke}
              strokeDasharray={`${dash} ${c - dash}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
              transform="rotate(-90)"
            />
          )
          offset += dash
          return el
        })}
        <circle r={r - stroke / 2} fill="white" />
      </g>
    </svg>
  )
}

