import { useEffect, useState } from 'react'
import { Modal } from '../../components/Modal'
import type { Contact } from '../../types'

export interface ContactFormValues {
  name: string
  email: string
  phone: string
}

interface ContactFormModalProps {
  open: boolean
  editing: Contact | null
  saving: boolean
  error?: string | null
  onClose: () => void
  onSubmit: (values: ContactFormValues) => void
}

export function ContactFormModal({
  open,
  editing,
  saving,
  error,
  onClose,
  onSubmit,
}: ContactFormModalProps) {
  const [values, setValues] = useState<ContactFormValues>({
    name: '',
    email: '',
    phone: '',
  })

  // Re-seed the form whenever it opens (for add) or the target changes (edit).
  useEffect(() => {
    if (open) {
      setValues({
        name: editing?.name ?? '',
        email: editing?.email ?? '',
        phone: editing?.phone ?? '',
      })
    }
  }, [open, editing])

  const field = (key: keyof ContactFormValues) => ({
    value: values[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setValues((v) => ({ ...v, [key]: e.target.value })),
  })

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? 'Edit contact' : 'Add contact'}
      footer={
        <>
          <button
            onClick={onClose}
            className="rounded-md border border-line px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(values)}
            disabled={saving}
            className="rounded-md bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-hover disabled:opacity-60"
          >
            {saving ? 'Saving…' : editing ? 'Save changes' : 'Add contact'}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <label className="block text-sm text-muted">
          Name
          <input
            {...field('name')}
            className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none"
          />
        </label>
        <label className="block text-sm text-muted">
          Email
          <input
            {...field('email')}
            type="email"
            className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none"
          />
        </label>
        <label className="block text-sm text-muted">
          Phone
          <input
            {...field('phone')}
            className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </Modal>
  )
}
