import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export default function AppCard({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/10',
        className
      )}
      {...props}
    />
  )
}
