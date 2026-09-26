import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { useRef, useState } from 'react'
import { photo, sticker, type FlowerName, type PhotoName } from '../data/media'
import { Daisy } from './Logo'
import { EASE, Pill, useSectionProgress } from './ui'

const LETTERS: { l: string; img: PhotoName }[] = [
  { l: 'П', img: 'sunflower-sky' },
  { l: 'О', img: 'cosmos-field' },
  { l: 'Л', img: 'poppies-field' },
  { l: 'Е', img: 'lupine-field' },
]

/** Наклейки вокруг слова — их можно таскать мышкой */
const STICKERS: { name: FlowerName; x: string; y: string; w: string; r: number }[] = [
  { name: 'sunflower', x: '2%', y: '6%', w: 'clamp(64px,11vw,190px)', r: -12 },
  { name: 'gerbera-pink', x: '86%', y: '0%', w: 'clamp(52px,8vw,140px)', r: 14 },
  { name: 'poppies', x: '66%', y: '58%', w: 'clamp(80px,14vw,240px)', r: -6 },
  { name: 'anemone', x: '24%', y: '62%', w: 'clamp(58px,9vw,160px)', r: 8 },
  { name: 'blue-bottle', x: '92%', y: '44%', w: 'clamp(44px,6vw,110px)', r: 10 },
  { name: 'cosmos', x: '44%', y: '-4%', w: 'clamp(56px,8vw,140px)', r: -18 },
]

const TRAIL: FlowerName[] = ['sunflower', 'cosmos', 'gerbera-red', 'anemone', 'daisy', 'ranunculus', 'gerbera-pink', 'rudbeckia']

type Petal = { id: number; x: number; y: number; name: FlowerName; r: number; s: number }
let trailId = 0

export function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const last = useRef({ x: 0, y: 0 })
  const [trail, setTrail] = useState<Petal[]>([])
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const sx = useSpring(mx, { stiffness: 50, damping: 20 })
  const sy = useSpring(my, { stiffness: 50, damping: 20 })
  const bgPos = useTransform([sx, sy], ([a, b]) => `${(a as number) * 100}% ${(b as number) * 100}%`)

  const p = useSectionProgress(ref, ['start start', 'end start'])
  const wordY = useTransform(p, [0, 1], ['0%', '35%'])
  const wordScale = useTransform(p, [0, 1], [1, 0.85])

  /** Цветочный след: каждые ~110px пути курсора появляется наклейка и падает вниз */
  const onMove = (e: React.PointerEvent) => {
    const r = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    mx.set(x / r.width)
    my.set(y / r.height)
    if (e.pointerType !== 'mouse') return
    const d = Math.hypot(x - last.current.x, y - last.current.y)
    if (d < 110) return
    last.current = { x, y }
    const petal = { id: trailId++, x, y, name: TRAIL[trailId % TRAIL.length], r: Math.random() * 60 - 30, s: 0.7 + Math.random() * 0.6 }
    setTrail((t) => [...t.slice(-9), petal])
    window.setTimeout(() => setTrail((t) => t.filter((q) => q.id !== petal.id)), 1400)
  }

  return (
    <section id="top" ref={ref} onPointerMove={onMove} className="paper-grain relative flex min-h-[100svh] flex-col overflow-hidden bg-paper pt-24">
      {/* слово ПОЛЕ из фотографий */}
      <div className="flex flex-1 items-center">
      <motion.div ref={stage} className="relative mx-auto w-full px-3 sm:px-6" style={{ y: wordY, scale: wordScale }}>
        <h1 className="grid grid-cols-2 justify-items-center font-display font-black leading-[0.82] tracking-[-0.04em] sm:flex sm:justify-between" aria-label="ПОЛЕ">
          {LETTERS.map((L, i) => (
            <span key={L.l} className="block overflow-hidden">
              <motion.span
                className="block bg-cover bg-clip-text text-[44vw] text-transparent sm:text-[31vw] [-webkit-background-clip:text]"
                style={{ backgroundImage: `url(${photo(L.img)})`, backgroundPosition: bgPos, backgroundSize: '160%' }}
                initial={{ y: '100%' }}
                animate={ready ? { y: '0%' } : {}}
                transition={{ duration: 1.2, delay: 0.1 + i * 0.09, ease: EASE }}
              >
                {L.l}
              </motion.span>
            </span>
          ))}
        </h1>

        {STICKERS.map((s, i) => (
          <motion.div
            key={s.name}
            drag
            dragConstraints={stage}
            dragElastic={0.2}
            whileDrag={{ scale: 1.15, rotate: 0, zIndex: 50 }}
            whileHover={{ scale: 1.08 }}
            className="sticker absolute z-10 cursor-grab active:cursor-grabbing"
            style={{ left: s.x, top: s.y, width: s.w }}
            initial={{ scale: 0, rotate: s.r - 40 }}
            animate={ready ? { scale: 1, rotate: s.r } : {}}
            transition={{ type: 'spring', stiffness: 160, damping: 12, delay: 0.7 + i * 0.08 }}
          >
            <img src={sticker(s.name)} alt="" draggable={false} className="pointer-events-none w-full" />
          </motion.div>
        ))}
      </motion.div>
      </div>

      {/* подвал героя */}
      <motion.div
        className="relative z-20 mx-auto grid w-full max-w-[1500px] gap-8 px-5 pb-8 sm:px-8 md:grid-cols-[1.2fr_1fr_auto] md:items-end"
        initial={{ opacity: 0, y: 30 }}
        animate={ready ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.9, ease: EASE }}
      >
        <p className="max-w-md text-lg leading-snug sm:text-xl">
          Букеты, которые пахнут летом. Собираем из того, что утром привезли с полей, и везём по городу <b className="bg-sun px-1">за 60 минут</b>.
        </p>
        <div className="flex flex-wrap gap-3">
          <Pill href="#swipe" tone="ink">
            Смахнуть букет →
          </Pill>
          <Pill href="#quiz" tone="line">
            Подобрать за 3 клика
          </Pill>
        </div>
        <div className="relative hidden h-32 w-32 md:block">
          <svg viewBox="0 0 100 100" className="absolute inset-0 animate-spin-slow">
            <defs>
              <path id="badge-circle" d="M50 50 m-38 0 a38 38 0 1 1 76 0 a38 38 0 1 1 -76 0" />
            </defs>
            <text className="fill-ink font-display text-[8px] font-bold uppercase tracking-[0.1em]">
              <textPath href="#badge-circle">свежие цветы • каждый день •</textPath>
            </text>
          </svg>
          <Daisy className="absolute inset-[30%]" spin={false} />
        </div>
      </motion.div>

      <p className="pointer-events-none absolute bottom-3 left-1/2 z-20 hidden -translate-x-1/2 font-hand text-xl text-moss/70 lg:block">
        ↖ наклейки можно таскать, а за курсором растут цветы
      </p>

      {/* цветочный след */}
      <AnimatePresence>
        {trail.map((t) => (
          <motion.img
            key={t.id}
            src={sticker(t.name)}
            alt=""
            className="sticker pointer-events-none absolute z-30 w-24 -translate-x-1/2 -translate-y-1/2"
            style={{ left: t.x, top: t.y }}
            initial={{ scale: 0, rotate: t.r - 90, opacity: 1 }}
            animate={{ scale: t.s, rotate: t.r, y: [0, -10, 140], opacity: [1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: 'easeIn', scale: { type: 'spring', stiffness: 300, damping: 14 } }}
          />
        ))}
      </AnimatePresence>
    </section>
  )
}
