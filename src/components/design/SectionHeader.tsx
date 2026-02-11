import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  accentClassName?: string
  className?: string
}

export default function SectionHeader({
  title,
  subtitle,
  accentClassName,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('mb-10', className)}>
      <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-3 text-sm text-white/60 md:text-base">{subtitle}</p>
      ) : null}
      <div
        className={cn(
          'mt-4 h-1 w-28 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500',
          accentClassName
        )}
      />
    </div>
  )
}
