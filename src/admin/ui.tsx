import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'
import { Check, Loader2 } from 'lucide-react'

const inputClass =
  'w-full rounded-xl border border-ink-100 bg-white px-3.5 py-2.5 text-sm text-ink-900 outline-none transition placeholder:text-ink-200 focus:border-sand-400 focus:ring-4 focus:ring-sand-100'

export function Field({
  label, hint, children,
}: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-800">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-ink-400">{hint}</span>}
    </label>
  )
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${props.className ?? ''}`} />
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputClass} resize-y ${props.className ?? ''}`} />
}

export function Toggle({
  checked, onChange, label, hint,
}: { checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-xl border border-ink-100 bg-white px-3.5 py-3 text-left transition hover:border-sand-400"
    >
      <span>
        <span className="block text-sm font-medium text-ink-800">{label}</span>
        {hint && <span className="mt-0.5 block text-xs text-ink-400">{hint}</span>}
      </span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? 'bg-ink-900' : 'bg-ink-100'}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            checked ? 'left-5.5' : 'left-0.5'
          }`}
        />
      </span>
    </button>
  )
}

export function Card({ title, description, children }: { title?: string; description?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm shadow-ink-900/[0.03]">
      {title && (
        <header className="mb-4">
          <h2 className="font-semibold text-ink-900">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-ink-400">{description}</p>}
        </header>
      )}
      <div className="space-y-4">{children}</div>
    </section>
  )
}

export function PanelHeader({ title, description }: { title: string; description: string }) {
  return (
    <header className="mb-6">
      <h1 className="font-display text-2xl font-bold text-ink-900">{title}</h1>
      <p className="mt-1 text-sm text-ink-400">{description}</p>
    </header>
  )
}

export function Button({
  children, onClick, type = 'button', variant = 'primary', disabled, busy, className = '',
}: {
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  variant?: 'primary' | 'ghost' | 'danger' | 'outline'
  disabled?: boolean
  busy?: boolean
  className?: string
}) {
  const variants = {
    primary: 'bg-ink-900 text-white hover:bg-ink-800',
    outline: 'border border-ink-100 bg-white text-ink-800 hover:border-ink-400',
    ghost: 'text-ink-400 hover:bg-ink-50 hover:text-ink-900',
    danger: 'text-ink-400 hover:bg-red-50 hover:text-red-600',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || busy}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {busy && <Loader2 size={15} className="animate-spin" />}
      {children}
    </button>
  )
}

export function IconButton({
  children, onClick, label, tone = 'default', disabled,
}: {
  children: ReactNode
  onClick: () => void
  label: string
  tone?: 'default' | 'danger'
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      disabled={disabled}
      className={`rounded-lg p-2 text-ink-400 transition disabled:opacity-30 ${
        tone === 'danger' ? 'hover:bg-red-50 hover:text-red-600' : 'hover:bg-ink-50 hover:text-ink-900'
      }`}
    >
      {children}
    </button>
  )
}

/** Sticky bar that only shows once something changed, so saving is never a guess. */
export function SaveBar({ dirty, saving, onSave, onReset }: {
  dirty: boolean
  saving: boolean
  onSave: () => void
  onReset: () => void
}) {
  return (
    <div className="sticky bottom-4 z-20 mt-6 flex items-center justify-between gap-3 rounded-2xl border border-ink-100 bg-white/95 px-4 py-3 shadow-lg shadow-ink-900/5 backdrop-blur">
      <p className="text-sm text-ink-400">
        {dirty ? 'You have unsaved changes.' : (
          <span className="inline-flex items-center gap-1.5 text-ink-400">
            <Check size={14} /> Everything is saved.
          </span>
        )}
      </p>
      <div className="flex gap-2">
        {dirty && <Button variant="ghost" onClick={onReset}>Undo</Button>}
        <Button onClick={onSave} disabled={!dirty} busy={saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
    </div>
  )
}

export function EmptyHint({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-xl border border-dashed border-ink-100 bg-ink-50/50 px-4 py-6 text-center text-sm text-ink-400">
      {children}
    </p>
  )
}
