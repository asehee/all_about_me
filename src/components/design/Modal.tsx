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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#111827] p-6 shadow-2xl">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        {description ? <p className="mt-3 text-sm text-white/70">{description}</p> : null}
        {children}
        {actions ? <div className="mt-6 flex justify-end gap-2">{actions}</div> : null}
      </div>
    </div>
  )
}
