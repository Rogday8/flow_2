import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect } from 'react'
import { Daisy } from './Logo'

/** Загрузка: счётчик до 100, стебель растёт снизу, на вершине раскрывается ромашка */
export function Loader({ onDone }: { onDone: () => void }) {
  const p = useMotionValue(0)
  const pct = useTransform(p, (v) => Math.round(v).toString().padStart(2, '0'))
  const stem = useTransform(p, [0, 100], [0, 1])
  const bloom = useTransform(p, [70, 100], [0, 1])

  useEffect(() => {
    const c = animate(p, 100, { duration: 1.9, ease: [0.65, 0, 0.35, 1], onComplete: onDone })
    const skip = () => onDone()
    window.addEventListener('pointerdown', skip)
    return () => {
      c.stop()
      window.removeEventListener('pointerdown', skip)
    }
  }, [p, onDone])

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col justify-between overflow-hidden bg-sun p-6 text-ink sm:p-10"
      exit={{ y: '-100%', borderBottomLeftRadius: '50% 20%', borderBottomRightRadius: '50% 20%' }}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="flex items-start justify-between font-display text-sm font-bold uppercase">
        <span>ПОЛЕ</span>
        <span className="text-right">
          цветочная
          <br />
          лавка
        </span>
      </div>

      <svg viewBox="0 0 100 160" className="absolute bottom-0 left-1/2 h-[70vh] -translate-x-1/2" aria-hidden>
        <motion.path d="M50 160 C 46 120, 58 90, 50 40" stroke="#2f4a33" strokeWidth="3" fill="none" strokeLinecap="round" style={{ pathLength: stem }} />
        <motion.path d="M50 110 C 38 100, 30 104, 26 96 C 36 92, 46 98, 50 110Z" fill="#6f9a5a" style={{ scale: stem, originX: '50px', originY: '110px' }} />
        <motion.path d="M51 85 C 62 76, 72 80, 76 72 C 64 68, 55 76, 51 85Z" fill="#6f9a5a" style={{ scale: stem, originX: '51px', originY: '85px' }} />
        <motion.g style={{ scale: bloom, originX: '50px', originY: '40px' }}>
          <foreignObject x="30" y="20" width="40" height="40">
            <Daisy className="h-full w-full" petal="#fbf8f1" />
          </foreignObject>
        </motion.g>
      </svg>

      <div className="relative flex items-end justify-between">
        <motion.span className="font-display text-[26vw] font-black leading-[0.75] tracking-tighter sm:text-[18vw]">{pct}</motion.span>
        <span className="mb-3 font-hand text-2xl sm:text-3xl">срезаем свежее…</span>
      </div>
    </motion.div>
  )
}
