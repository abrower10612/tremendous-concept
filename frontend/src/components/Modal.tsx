import { X } from 'lucide-react'
import type { ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
  width?: string
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  width = 'max-w-md',
}: ModalProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />
      <div
        className={`relative z-10 max-h-[90vh] w-full overflow-y-auto ${width} rounded-xl bg-white p-5 shadow-xl sm:p-6`}
      >
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-semibold text-ink">{title}</h2>
          <button onClick={onClose} className="text-muted hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-4">{children}</div>
        {footer && (
          <div className="mt-6 flex justify-end gap-3">{footer}</div>
        )}
      </div>
    </div>
  )
}
