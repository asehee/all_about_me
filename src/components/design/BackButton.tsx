import type { ButtonHTMLAttributes } from 'react'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BackButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string
}

export default function BackButton({
  label = 'Back',
  className,
  ...props
}: BackButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex h-11 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 text-white/90 backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10',
        className
      )}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  )
}
