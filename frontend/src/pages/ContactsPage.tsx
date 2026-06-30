import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Pencil, Trash2, Plus, Mail, Phone } from 'lucide-react'
import { contactsApi } from '../lib/api'
import type { Contact } from '../types'
import {
  ContactFormModal,
  type ContactFormValues,
} from '../features/contacts/ContactFormModal'

export function ContactsPage() {
  const qc = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Contact | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: contactsApi.list,
  })

  const invalidate = () => qc.invalidateQueries({ queryKey: ['contacts'] })

  const errorMessage = (e: unknown) => {
    const ax = e as AxiosError<{ errors?: string[] }>
    return ax.response?.data?.errors?.join(', ') ?? 'Something went wrong'
  }

  const saveMutation = useMutation({
    mutationFn: (values: ContactFormValues) =>
      editing
        ? contactsApi.update(editing.id, values)
        : contactsApi.create(values),
    onSuccess: () => {
      invalidate()
      closeModal()
    },
    onError: (e) => setFormError(errorMessage(e)),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => contactsApi.remove(id),
    onSuccess: invalidate,
  })

  const openAdd = () => {
    setEditing(null)
    setFormError(null)
    setModalOpen(true)
  }
  const openEdit = (c: Contact) => {
    setEditing(c)
    setFormError(null)
    setModalOpen(true)
  }
  const closeModal = () => {
    setModalOpen(false)
    setEditing(null)
    setFormError(null)
  }

  return (
    <div className="mx-auto max-w-5xl px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Contacts</h1>
          <p className="mt-1 text-sm text-muted">
            Save recipients once and reuse them when sending rewards.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-hover"
        >
          <Plus className="h-4 w-4" /> Add contact
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-line">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-gray-50 text-left text-xs font-medium text-muted">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted">
                  Loading…
                </td>
              </tr>
            ) : contacts.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-muted">
                  No contacts yet. Click <strong>Add contact</strong> to create
                  one.
                </td>
              </tr>
            ) : (
              contacts.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-line last:border-b-0 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium text-ink">{c.name}</td>
                  <td className="px-4 py-3 text-muted">
                    <span className="inline-flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5" /> {c.email}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {c.phone ? (
                      <span className="inline-flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5" /> {c.phone}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openEdit(c)}
                        className="rounded-md p-2 text-muted hover:bg-gray-100 hover:text-ink"
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(c.id)}
                        className="rounded-md p-2 text-muted hover:bg-gray-100 hover:text-red-600"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ContactFormModal
        open={modalOpen}
        editing={editing}
        saving={saveMutation.isPending}
        error={formError}
        onClose={closeModal}
        onSubmit={(values) => {
          setFormError(null)
          saveMutation.mutate(values)
        }}
      />
    </div>
  )
}
