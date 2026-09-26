import { AnimatePresence, animate, motion, useMotionValue } from 'motion/react'
import { useRef, useState } from 'react'
import { sticker } from '../data/media'
import { seasons } from '../data/shop'
import { EASE, Headline, Label, Reveal } from './ui'

const STEP = 360 / 12

/** Сезонный круг: крутится пальцем или мышкой, выбранный месяц — наверху под стрелкой */
export function Season() {
  const [index, setIndex] = useState(new Date().getMonth())
  const rot = useMotionValue(-new Date().getMonth() * STEP)
  const wheel = useRef<HTMLDivElement>(null)
  const drag = useRef<{ a: number; total: number; moved: boolean } | null>(null)
  const m = seasons[index]

  const go = (i: number) => {
    // крутим кратчайшим путём к нужному месяцу
    const target = -i * STEP
    const cur = rot.get()
    const diff = ((((target - cur) % 360) + 540) % 360) - 180
    animate(rot, cur + diff, { type: 'spring', stiffness: 120, damping: 18 })
    setIndex(((i % 12) + 12) % 12)
  }

  const angle = (e: React.PointerEvent) => {
    const r = wheel.current!.getBoundingClientRect()
    return (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) / Math.PI
  }

  return (
    <section id="season" className="relative overflow-hidden px-5 py-24 transition-colors duration-700 sm:px-8 sm:py-32" style={{ backgroundColor: `${m.color}55` }}>
      <div className="mx-auto grid max-w-[1400px] items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <Label n="04">сезонный круг</Label>
          <Headline lines={['Что цветёт', 'прямо сейчас']} className="mt-6 text-[clamp(2.4rem,6vw,5.6rem)]" />
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md text-lg text-ink/70">Покрутите круг. Сезонные цветы дешевле, свежее и стоят дольше — мы всегда подскажем, что сейчас на пике.</p>
          </Reveal>

          <div className="mt-10 min-h-44">
            <AnimatePresence mode="wait">
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease: EASE }}>
                <p className="font-display text-5xl font-black uppercase">{m.month}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {m.flowers.map((f) => (
                    <span key={f} className="rounded-full border-2 border-ink bg-cream px-4 py-2 text-sm font-semibold">
                      {f}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-4 flex gap-3">
            <button onClick={() => go(index - 1)} className="grid h-12 w-12 place-items-center rounded-full border-2 border-ink text-lg hover:bg-ink hover:text-cream" aria-label="Предыдущий месяц">
              ←
            </button>
            <button onClick={() => go(index + 1)} className="grid h-12 w-12 place-items-center rounded-full border-2 border-ink text-lg hover:bg-ink hover:text-cream" aria-label="Следующий месяц">
              →
            </button>
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[560px]">
          {/* стрелка-указатель */}
          <div className="absolute left-1/2 top-[-6px] z-20 h-0 w-0 -translate-x-1/2 border-x-[14px] border-t-[22px] border-x-transparent border-t-tomato" />

          <motion.div
            ref={wheel}
            className="absolute inset-0 cursor-grab touch-none rounded-full border-2 border-ink bg-cream active:cursor-grabbing"
            style={{ rotate: rot }}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId)
              drag.current = { a: angle(e), total: 0, moved: false }
            }}
            onPointerMove={(e) => {
              if (!drag.current) return
              // приращение угла, нормализованное — чтобы не прыгать на границе ±180°
              const now = angle(e)
              const d = ((now - drag.current.a + 540) % 360) - 180
              drag.current.a = now
              drag.current.total += Math.abs(d)
              if (drag.current.total > 3) drag.current.moved = true
              rot.set(rot.get() + d)
            }}
            onPointerUp={(e) => {
              if (!drag.current) return
              const { moved } = drag.current
              drag.current = null
              if (moved) return go(Math.round(-rot.get() / STEP))
              // простой клик: какой месяц под пальцем с учётом поворота круга
              go(Math.round((angle(e) + 90 - rot.get()) / STEP))
            }}
          >
            {/* сектора */}
            <svg viewBox="-100 -100 200 200" className="absolute inset-0 h-full w-full">
              {seasons.map((s, i) => {
                const a0 = ((i * STEP - 90 - STEP / 2) * Math.PI) / 180
                const a1 = ((i * STEP - 90 + STEP / 2) * Math.PI) / 180
                return (
                  <path
                    key={s.short}
                    d={`M0 0 L ${Math.cos(a0) * 99} ${Math.sin(a0) * 99} A 99 99 0 0 1 ${Math.cos(a1) * 99} ${Math.sin(a1) * 99} Z`}
                    fill={i === index ? s.color : 'transparent'}
                    stroke="#16261c"
                    strokeOpacity="0.15"
                    strokeWidth="0.5"
                    style={{ transition: 'fill .5s' }}
                  />
                )
              })}
              <circle r="42" fill="#fbf8f1" stroke="#16261c" strokeWidth="0.8" />
            </svg>
            {seasons.map((s, i) => {
              const t = ((i * STEP - 90) * Math.PI) / 180
              return (
                <span
                  key={s.short}
                  className="pointer-events-none absolute font-display text-xs font-black uppercase sm:text-sm"
                  style={{ left: `${50 + Math.cos(t) * 36}%`, top: `${50 + Math.sin(t) * 36}%`, transform: `translate(-50%,-50%) rotate(${i * STEP}deg)` }}
                >
                  {s.short}
                </span>
              )
            })}
          </motion.div>

          {/* центр не крутится */}
          <div className="pointer-events-none absolute inset-[29%] grid place-items-center">
            <AnimatePresence mode="popLayout">
              <motion.img
                key={index}
                src={sticker(m.hero)}
                alt=""
                className="sticker max-h-full max-w-full object-contain"
                initial={{ scale: 0, rotate: -120 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 120 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
