import { motion, useScroll, useTransform } from 'motion/react'
import type { ReactNode, RefObject } from 'react'

export const EASE = [0.22, 1, 0.36, 1] as const

/** Появление при попадании в экран */
export function Reveal({ children, delay = 0, y = 40, className }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * Крупный заголовок: строки выезжают снизу из-под маски.
 * Видимость отслеживает сам h2 — у спрятанной под маской строки пересечения с экраном нет.
 */
export function Headline({ lines, className = '' }: { lines: ReactNode[]; className?: string }) {
  return (
    <motion.h2
      className={`font-display font-black uppercase leading-[0.9] tracking-[-0.03em] ${className}`}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: '-8% 0px' }}
    >
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.06em]">
          <motion.span
            className="block"
            variants={{ hidden: { y: '110%' }, shown: { y: '0%' } }}
            transition={{ duration: 1, delay: i * 0.08, ease: EASE }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </motion.h2>
  )
}

/** Метка секции: номер и подпись, как в журнале */
export function Label({ n, children, className = '' }: { n: string; children: ReactNode; className?: string }) {
  return (
    <Reveal className={`flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] ${className}`}>
      <span className="grid h-7 min-w-7 place-items-center rounded-full border border-current px-2 text-[0.65rem]">{n}</span>
      {children}
    </Reveal>
  )
}

/** Бегущая строка */
export function Ticker({ children, reverse = false, className = '' }: { children: ReactNode; reverse?: boolean; className?: string }) {
  return (
    <div className={`flex overflow-hidden ${className}`}>
      <div className={`flex w-max shrink-0 ${reverse ? 'animate-marquee-rev' : 'animate-marquee'}`}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  )
}

type ScrollOffset = NonNullable<Parameters<typeof useScroll>[0]>['offset']

/**
 * Прогресс прокрутки секции, всегда считаемый в JS: функция-прослойка не даёт Motion
 * отдать анимацию браузерному ScrollTimeline, который расходится с Lenis и sticky-блоками.
 */
export function useSectionProgress(target: RefObject<HTMLElement | null>, offset: ScrollOffset) {
  const { scrollYProgress } = useScroll({ target, offset })
  return useTransform(scrollYProgress, (v) => v)
}

/** Кнопка-таблетка с заливкой снизу при наведении */
export function Pill({
  children,
  href,
  onClick,
  tone = 'ink',
  className = '',
}: {
  children: ReactNode
  href?: string
  onClick?: () => void
  tone?: 'ink' | 'sun' | 'line'
  className?: string
}) {
  const base = {
    ink: 'bg-ink text-cream',
    sun: 'bg-sun text-ink',
    line: 'border-2 border-ink text-ink',
  }[tone]
  const fill = tone === 'ink' ? 'bg-tomato' : tone === 'sun' ? 'bg-ink' : 'bg-ink'
  const hoverText = tone === 'ink' ? 'group-hover:text-ink' : 'group-hover:text-cream'
  const inner = (
    <>
      <span className={`absolute inset-0 translate-y-full rounded-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 ${fill}`} />
      <span className={`relative flex items-center gap-2 transition-colors duration-300 ${hoverText}`}>{children}</span>
    </>
  )
  const cls = `group relative inline-flex items-center justify-center overflow-hidden rounded-full px-7 py-4 text-sm font-semibold ${base} ${className}`
  return href ? (
    <a href={href} className={cls}>
      {inner}
    </a>
  ) : (
    <button onClick={onClick} className={cls}>
      {inner}
    </button>
  )
}
