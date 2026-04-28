export default function BarChart({ labels, values }) {
  const w = 340
  const h = 180
  const pad = 18
  const innerW = w - pad * 2
  const innerH = h - pad * 2
  const max = Math.max(...values, 1)

  const barW = innerW / values.length
  const gap = Math.max(6, barW * 0.18)

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${w} ${h}`} className="h-[190px] w-full">
        {/* grid */}
        {Array.from({ length: 4 }).map((_, i) => {
          const yy = pad + (i / 3) * innerH
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

        {/* bars */}
        {values.map((v, i) => {
          const bh = (v / max) * innerH
          const x = pad + i * barW + gap / 2
          const y = pad + innerH - bh
          const width = barW - gap
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={width}
              height={bh}
              rx="10"
              fill="#3f51b5"
              opacity="0.95"
            />
          )
        })}
      </svg>
      <div className="mt-2 flex justify-between text-[11px] font-semibold text-slate-500">
        {labels.map((l) => (
          <div key={l} className="w-full text-center">
            {l}
          </div>
        ))}
      </div>
    </div>
  )
}

