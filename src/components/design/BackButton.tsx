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
      type="button"
      className={cn(
        'inline-flex h-11 items-center gap-2 text-muted-foreground transition-colors hover:text-primary',
        className
      )}
      {...props}
    >
      <ArrowLeft aria-hidden="true" className="h-4 w-4" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  )
}
