import { useId, type ReactNode } from 'react'

interface ModalProps {
  open: boolean
  title: string
  description?: ReactNode
  children?: ReactNode
  actions?: ReactNode
}

export default function Modal({
  open,
  title,
  description,
  children,
  actions,
}: ModalProps) {
  const titleId = useId()
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/25 px-4 backdrop-blur-sm">
      <div role="dialog" aria-modal="true" aria-labelledby={titleId} className="w-full max-w-md border border-border bg-background p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
        <h3 id={titleId} className="text-lg font-semibold tracking-tight text-foreground md:text-xl">{title}</h3>
        {description ? <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p> : null}
        {children}
        {actions ? <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-border pt-4">{actions}</div> : null}
      </div>
    </div>
  )
}
