'use client'

import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { contactPage } from '@/content/pages'
import { site } from '@/content/site'
import { t, type Locale } from '@/content/types'
import { cn } from '@/lib/utils'

type Props = { locale: Locale }

type Status = 'idle' | 'sending' | 'success' | 'error'

export function ContactForm({ locale }: Props) {
  const labels = contactPage.form
  const [status, setStatus] = useState<Status>('idle')
  const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || site.email

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    // Honeypot
    if (String(data.get('website') || '').trim()) {
      setStatus('success')
      return
    }

    const name = String(data.get('name') || '').trim()
    const email = String(data.get('email') || '').trim()
    const message = String(data.get('message') || '').trim()
    const privacy = data.get('privacy') === 'on'

    if (!name || !email || !message || !privacy) {
      setStatus('error')
      return
    }

    setStatus('sending')

    try {
      if (formspreeId) {
        const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: data,
        })
        if (!res.ok) throw new Error('formspree failed')
        setStatus('success')
        form.reset()
        return
      }

      const subject = encodeURIComponent(`Portfolio contact — ${name}`)
      const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`)
      window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const fieldClass =
    'mt-2 w-full min-h-11 rounded-[var(--radius)] border border-line bg-paper-elevated px-3 py-2 text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-accent'

  return (
    <form className="space-y-6" onSubmit={onSubmit} noValidate>
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label htmlFor="name" className="font-display text-sm font-medium text-ink">
          {t(labels.name, locale)}
        </label>
        <input id="name" name="name" type="text" required autoComplete="name" className={fieldClass} />
      </div>

      <div>
        <label htmlFor="email" className="font-display text-sm font-medium text-ink">
          {t(labels.email, locale)}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="message" className="font-display text-sm font-medium text-ink">
          {t(labels.message, locale)}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          className={cn(fieldClass, 'min-h-32 resize-y')}
        />
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-sm text-ink-muted">
        <input
          type="checkbox"
          name="privacy"
          required
          className="mt-1 size-4 cursor-pointer accent-accent"
        />
        <span>
          {t(labels.privacy, locale)}{' '}
          <a href={`/${locale}/datenschutz/`} className="underline underline-offset-2 hover:text-accent">
            {locale === 'de' ? 'Datenschutz' : 'Privacy'}
          </a>
        </span>
      </label>

      <Button type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? t(labels.sending, locale) : t(labels.submit, locale)}
      </Button>

      {status === 'success' ? (
        <p className="text-sm text-accent" role="status">
          {t(labels.success, locale)}
        </p>
      ) : null}
      {status === 'error' ? (
        <p className="text-sm text-red-700" role="alert">
          {t(labels.error, locale)}
        </p>
      ) : null}
    </form>
  )
}
