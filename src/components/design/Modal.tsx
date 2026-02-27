import type { ReactNode } from 'react'

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
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/78 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md border border-white/15 bg-black p-6 shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
        <h3 className="text-lg font-semibold tracking-tight text-white md:text-xl">{title}</h3>
        {description ? <p className="mt-3 text-sm leading-relaxed text-white/65">{description}</p> : null}
        {children}
        {actions ? <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-white/10 pt-4">{actions}</div> : null}
      </div>
    </div>
  )
}
