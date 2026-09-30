'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { type RefObject, useEffect, useState } from 'react'
import {
  CHAPTER_SCRIPT,
  type ChapterId,
  setActiveChapter,
  setPointer,
  setScrollProgress,
  setScrollVelocity,
  setSmoothProgress,
} from '@/lib/experience-state'
import { progressSections, type SectionId, scrollToSection } from '@/lib/one-pager-navigation'
import {
  clampScrollVelocity,
  planChapterPins,
  readDocumentProgress,
  splitHeadlineWords,
} from '@/lib/scroll/adapters'
import { useReducedMotion } from '@/lib/use-reduced-motion'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type Props = {
  root: RefObject<HTMLElement | null>
  enabled: boolean
}

/**
 * Composes Lenis + ScrollTrigger. Pure math / pin plans live in `@/lib/scroll/adapters`.
 */
export function ScrollDirector({ root, enabled }: Props) {
  const reduced = useReducedMotion()
  const [active, setActive] = useState<SectionId>('hero')

  useEffect(() => {
    const onPointer = (event: PointerEvent) => {
      setPointer(
        (event.clientX / window.innerWidth) * 2 - 1,
        -((event.clientY / window.innerHeight) * 2 - 1),
      )
    }
    window.addEventListener('pointermove', onPointer, { passive: true })
    return () => window.removeEventListener('pointermove', onPointer)
  }, [])

  useGSAP(
    () => {
      const el = root.current
      if (!el || !enabled) return

      const chapters = gsap.utils.toArray<HTMLElement>('[data-chapter]', el)

      if (reduced) {
        chapters.forEach((chapter) => {
          gsap.set(chapter.querySelectorAll('[data-reveal]'), { clearProps: 'all' })
        })

        const syncProgress = () => {
          const p = readDocumentProgress(
            window.scrollY,
            document.documentElement.scrollHeight,
            window.innerHeight,
          )
          setScrollProgress(p)
          setSmoothProgress(p)
          setScrollVelocity(0)
        }
        syncProgress()
        window.addEventListener('scroll', syncProgress, { passive: true })

        const observers: IntersectionObserver[] = []
        chapters.forEach((chapter) => {
          const id = (chapter.dataset.chapter ?? 'hero') as ChapterId
          const io = new IntersectionObserver(
            ([entry]) => {
              if (entry?.isIntersecting) {
                setActive(id as SectionId)
                setActiveChapter(id)
              }
            },
            { rootMargin: '-40% 0px -40% 0px', threshold: 0 },
          )
          io.observe(chapter)
          observers.push(io)
        })

        return () => {
          window.removeEventListener('scroll', syncProgress)
          for (const io of observers) io.disconnect()
        }
      }

      const coarse = window.matchMedia('(pointer: coarse)').matches
      const narrow = window.matchMedia('(max-width: 768px)').matches

      let lenis: Lenis | null = null
      let ticker: ((time: number) => void) | null = null
      let removeNativeScroll: (() => void) | null = null

      if (!coarse) {
        lenis = new Lenis({
          smoothWheel: true,
          touchMultiplier: 1.25,
          lerp: 0.1,
        })

        lenis.on('scroll', () => {
          ScrollTrigger.update()
          const v = (lenis as unknown as { velocity: number }).velocity ?? 0
          setScrollVelocity(clampScrollVelocity(v))
        })

        ticker = (time: number) => {
          lenis?.raf(time * 1000)
        }
        gsap.ticker.add(ticker)
        // Allow GSAP to skip catch-up when a frame hitches — feels smoother than lagSmoothing(0)
        gsap.ticker.lagSmoothing(500, 33)
        document.documentElement.classList.add('lenis', 'lenis-smooth')
      } else {
        // Native touch scrolling — Lenis fights rubber-band + browser chrome resize
        const onScroll = () => {
          ScrollTrigger.update()
          setScrollVelocity(0)
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        removeNativeScroll = () => window.removeEventListener('scroll', onScroll)
      }

      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.85,
        onUpdate: (self) => {
          setScrollProgress(self.progress)
        },
      })

      // Vertical chapter pins are costly on mobile (address-bar resize / overscroll)
      if (!narrow) {
        const pinPlan = planChapterPins(CHAPTER_SCRIPT)
        for (const plan of pinPlan) {
          const chapter = el.querySelector<HTMLElement>(`[data-chapter="${plan.id}"]`)
          if (!chapter) continue
          ScrollTrigger.create({
            trigger: chapter,
            start: 'top top',
            end: plan.end,
            pin: true,
            scrub: 0.65,
            anticipatePin: 1,
          })
        }
      }

      for (const def of CHAPTER_SCRIPT) {
        const chapter = el.querySelector<HTMLElement>(`[data-chapter="${def.id}"]`)
        if (!chapter) continue

        ScrollTrigger.create({
          trigger: chapter,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => {
            setActive(def.id as SectionId)
            setActiveChapter(def.id)
          },
          onEnterBack: () => {
            setActive(def.id as SectionId)
            setActiveChapter(def.id)
          },
          onUpdate: (self) => {
            setActiveChapter(def.id, self.progress)
          },
        })
      }

      chapters.forEach((chapter) => {
        const reveals = chapter.querySelectorAll<HTMLElement>('[data-reveal]')
        if (!reveals.length) return

        if (chapter.dataset.chapter === 'hero') {
          const headline = chapter.querySelector<HTMLElement>('[data-split-headline]')
          const words = headline ? splitHeadlineWords(headline) : []

          gsap.set(chapter.querySelectorAll('.hero-clip'), {
            clipPath: 'inset(0 0 100% 0)',
          })
          gsap.from(reveals, {
            opacity: 0,
            y: 28,
            duration: 1.05,
            stagger: 0.09,
            ease: 'power3.out',
            delay: 0.1,
          })
          if (words.length) {
            gsap.from(words, {
              yPercent: 110,
              duration: 1.15,
              stagger: 0.045,
              ease: 'power4.out',
              delay: 0.2,
            })
          }
          gsap.to(chapter.querySelectorAll('.hero-clip'), {
            clipPath: 'inset(0 0 0% 0)',
            duration: 1.25,
            ease: 'power4.out',
            delay: 0.16,
          })
          return
        }

        const headlines = chapter.querySelectorAll<HTMLElement>('[data-split-headline]')
        headlines.forEach((h) => {
          const words = splitHeadlineWords(h)
          gsap.set(words, { yPercent: 110 })
          ScrollTrigger.create({
            trigger: h,
            start: 'top 80%',
            once: true,
            onEnter: () => {
              gsap.to(words, {
                yPercent: 0,
                duration: 0.95,
                stagger: 0.04,
                ease: 'power3.out',
              })
            },
          })
        })

        gsap.set(reveals, { opacity: 0, y: 36 })
        ScrollTrigger.create({
          trigger: chapter,
          start: 'top 78%',
          end: 'top 42%',
          scrub: 0.55,
          onUpdate: (self) => {
            gsap.set(reveals, {
              opacity: self.progress,
              y: 36 * (1 - self.progress),
            })
          },
        })
      })

      requestAnimationFrame(() => ScrollTrigger.refresh())

      return () => {
        if (ticker) gsap.ticker.remove(ticker)
        document.documentElement.classList.remove('lenis', 'lenis-smooth')
        lenis?.destroy()
        removeNativeScroll?.()
        ScrollTrigger.getAll().forEach((trigger) => {
          trigger.kill()
        })
      }
    },
    { scope: root, dependencies: [reduced, enabled], revertOnUpdate: true },
  )

  return (
    <nav className="section-progress" aria-label="Sections">
      {progressSections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          aria-current={active === section.id ? 'true' : undefined}
          onClick={(event) => {
            event.preventDefault()
            scrollToSection(section.id)
          }}
        >
          <span className="sr-only">{section.id}</span>
        </a>
      ))}
    </nav>
  )
}
