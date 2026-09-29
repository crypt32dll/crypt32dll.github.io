import path from 'node:path'
import { fileURLToPath } from 'node:url'
import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/**
 * Static export for GitHub Pages (crypt32dll.github.io).
 * No Node server, no Payload runtime, no API routes.
 */
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    localPatterns: [
      { pathname: '/images/**' },
      { pathname: '/favicon.png' },
      { pathname: '/og.png' },
    ],
  },
  experimental: {
    optimizePackageImports: ['@phosphor-icons/react', 'three'],
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withNextIntl(nextConfig)
