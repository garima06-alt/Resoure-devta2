export default function MiniLineChart({ labels, series }) {
  const w = 320
  const h = 160
  const pad = 18
  const innerW = w - pad * 2
  const innerH = h - pad * 2

  const all = series.flatMap((s) => s.data)
  const max = Math.max(...all, 1)
  const min = Math.min(...all, 0)
  const range = Math.max(1, max - min)

  function x(i) {
    if (labels.length <= 1) return pad
    return pad + (i / (labels.length - 1)) * innerW
  }

  function y(v) {
    const t = (v - min) / range
    return pad + (1 - t) * innerH
  }

  function pathFor(data) {
    return data
      .map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(2)} ${y(v).toFixed(2)}`)
      .join(' ')
  }

  const gridY = 4
  const gridLines = Array.from({ length: gridY + 1 }, (_, i) => i)

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-[170px] w-full overflow-visible"
        role="img"
        aria-label="Intervention trends"
      >
        {/* grid */}
        {gridLines.map((i) => {
          const yy = pad + (i / gridY) * innerH
          return (
            <line
              key={i}
              x1={pad}
              x2={pad + innerW}
              y1={yy}
              y2={yy}
              stroke="#e5e7eb"
              strokeDasharray="3 4"
            />
          )
        })}

        {/* axes */}
        <line x1={pad} x2={pad} y1={pad} y2={pad + innerH} stroke="#9ca3af" />
        <line
          x1={pad}
          x2={pad + innerW}
          y1={pad + innerH}
          y2={pad + innerH}
          stroke="#9ca3af"
        />

        {/* series */}
        {series.map((s) => (
          <g key={s.name}>
            <path
              d={pathFor(s.data)}
              fill="none"
              stroke={s.color}
              strokeWidth="3"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {s.data.map((v, i) => (
              <circle
                key={i}
                cx={x(i)}
                cy={y(v)}
                r="4.5"
                fill="white"
                stroke={s.color}
                strokeWidth="2.5"
              />
            ))}
          </g>
        ))}
      </svg>

      <div className="mt-2 flex items-center justify-center gap-4 text-sm font-semibold">
        {series.map((s) => (
          <div key={s.name} className="inline-flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            <span style={{ color: s.color }}>{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

