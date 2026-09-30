'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

type Props = {
  className?: string
  /** Pixel box for next/image */
  size?: number
  priority?: boolean
}

/**
 * Premium interlocking FS monogram — brushed bronze mark for header / intro / favicon.
 */
export function SiteLogo({ className, size = 40, priority = false }: Props) {
  return (
    <Image
      src="/logo.png"
      alt=""
      width={size}
      height={size}
      className={cn('object-contain select-none', className)}
      priority={priority}
      draggable={false}
    />
  )
}
