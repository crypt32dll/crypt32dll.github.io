'use client'

import dynamic from 'next/dynamic'

const CustomCursor = dynamic(
  () =>
    import('@/components/experience/CustomCursor').then((m) => ({
      default: m.CustomCursor,
    })),
  { ssr: false },
)

const AudioBus = dynamic(
  () =>
    import('@/components/experience/AudioBus').then((m) => ({
      default: m.AudioBus,
    })),
  { ssr: false },
)

/** Non-critical chrome — keep gsap/audio off the first paint graph. */
export function ClientChrome() {
  return (
    <>
      <CustomCursor />
      <AudioBus />
    </>
  )
}
