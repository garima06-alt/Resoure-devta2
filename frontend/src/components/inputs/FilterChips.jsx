import { cn } from '../../utils/cn.js'

export default function FilterChips({ options, value, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset transition',
              active
                ? 'bg-brand-700 text-white ring-brand-700'
                : 'bg-white text-slate-700 ring-slate-200 hover:bg-slate-50',
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

