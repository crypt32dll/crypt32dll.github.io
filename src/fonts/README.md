# Self-hosted fonts

Latin subset WOFF2 files for Archivo and Space Grotesk (SIL Open Font License 1.1).

Vendored so `next build` does not fetch Google Fonts at compile time — Google
occasionally returns extensionless `/l/font?kit=…` URLs that break Next.js
`next/font/google` on Turbopack (see vercel/next.js#99114).
