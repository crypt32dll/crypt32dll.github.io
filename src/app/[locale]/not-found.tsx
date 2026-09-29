import { Link } from '@/i18n/navigation'

export default function NotFound() {
  return (
    <div className="container-site flex min-h-[60dvh] flex-col items-start justify-center py-24">
      <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        404
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-ink">Not found</h1>
      <p className="mt-3 max-w-md text-ink-muted">The page you requested does not exist.</p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-11 items-center font-display text-sm font-semibold text-accent underline-offset-4 hover:underline"
      >
        Home
      </Link>
    </div>
  )
}
