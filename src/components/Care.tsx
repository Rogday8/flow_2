import { motion, useTransform } from 'motion/react'
import { useRef } from 'react'
import { sticker } from '../data/media'
import { Headline, Label, Reveal, useSectionProgress } from './ui'

const TIPS = [
  { t: 'Подрежьте стебли', d: 'Острым ножом, наискосок, на 2–3 см. Под струёй воды — чтобы в стебель не попал воздух.', hint: '45°' },
  { t: 'Чистая ваза', d: 'Вымойте вазу с каплей средства. Бактерии — главный враг свежести, а не время.', hint: 'без мыла внутри' },
  { t: 'Прохладная вода', d: 'Не выше колена букета и не ниже его щиколотки. Меняйте каждый день.', hint: '18 °C' },
  { t: 'Подальше от фруктов', d: 'Яблоки и бананы выделяют этилен — цветы от него стареют в два раза быстрее.', hint: 'правда!' },
  { t: 'Ночью — в прохладу', d: 'На ночь переставьте вазу на балкон или ближе к окну. Утром букет скажет спасибо.', hint: '+2 дня' },
]

/** Уход: слева растёт стебель по мере прокрутки, на финише — распускается подсолнух */
export function Care() {
  const ref = useRef<HTMLElement>(null)
  const p = useSectionProgress(ref, ['start 60%', 'end 70%'])
  const len = useTransform(p, [0, 0.9], [0, 1])
  const leaf = (at: number) => ({ scale: useTransform(p, [at, at + 0.12], [0, 1]) })
  const bloomScale = useTransform(p, [0.8, 1], [0, 1])
  const bloomRot = useTransform(p, [0.8, 1], [-120, 0])
  const l1 = leaf(0.18)
  const l2 = leaf(0.38)
  const l3 = leaf(0.58)

  return (
    <section id="care" ref={ref} className="relative bg-cream px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto grid max-w-[1400px] gap-14 lg:grid-cols-[1fr_1.3fr]">
        <div className="lg:sticky lg:top-24 lg:h-[calc(100svh-8rem)]">
          <Label n="05">уход</Label>
          <Headline lines={['Как продлить', <span key="l" className="text-leaf">лето в вазе</span>]} className="mt-6 text-[clamp(2.2rem,5vw,4.8rem)]" />

          <div className="relative mx-auto mt-6 hidden h-[52vh] max-w-xs lg:block">
            <svg viewBox="0 0 120 300" className="absolute inset-0 h-full w-full overflow-visible">
              <motion.path d="M60 300 C 50 240, 72 190, 58 140 C 48 100, 66 70, 60 40" stroke="#2f4a33" strokeWidth="4" fill="none" strokeLinecap="round" style={{ pathLength: len }} />
              <motion.path d="M58 230 C 40 220, 26 226, 16 212 C 32 204, 50 212, 58 230Z" fill="#6f9a5a" style={{ ...l1, originX: '58px', originY: '230px' }} />
              <motion.path d="M62 170 C 80 158, 96 164, 106 150 C 88 142, 70 152, 62 170Z" fill="#6f9a5a" style={{ ...l2, originX: '62px', originY: '170px' }} />
              <motion.path d="M58 110 C 42 100, 30 104, 22 92 C 36 86, 52 94, 58 110Z" fill="#6f9a5a" style={{ ...l3, originX: '58px', originY: '110px' }} />
            </svg>
            <motion.img src={sticker('sunflower')} alt="" className="sticker absolute left-1/2 top-[-8%] w-44 -translate-x-1/2" style={{ scale: bloomScale, rotate: bloomRot }} />
          </div>
        </div>

        <ol className="space-y-5">
          {TIPS.map((t, i) => (
            <Reveal key={t.t} delay={0.05}>
              <li className="group relative grid grid-cols-[auto_1fr] gap-6 rounded-[2rem] border-2 border-ink bg-paper p-7 transition-colors duration-500 hover:bg-sun sm:p-9">
                <span className="font-display text-5xl font-black leading-none text-ink/15 transition-colors group-hover:text-ink sm:text-7xl">{i + 1}</span>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-display text-xl font-black uppercase sm:text-2xl">{t.t}</h3>
                    <span className="-rotate-3 rounded-full bg-ink px-3 py-0.5 font-hand text-lg text-sun">{t.hint}</span>
                  </div>
                  <p className="mt-3 text-ink/70">{t.d}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
