import { cn } from '../../utils/cn.js'

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none'
  const variants = {
    primary:
      'bg-brand-700 text-white shadow-sm hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-300',
    secondary:
      'bg-white text-slate-900 border border-slate-200 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200',
    ghost:
      'bg-transparent text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200',
    danger:
      'bg-rose-600 text-white shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-200',
  }
  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 text-sm',
    lg: 'h-12 px-5 text-base',
  }

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  )
}

