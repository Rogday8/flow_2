import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { photo, sticker, type FlowerName } from '../data/media'
import { bouquets, formatPrice, type Mood, type Who } from '../data/shop'
import { useCart } from '../state/cart'
import { EASE, Headline, Label } from './ui'

type Answers = { who?: Who; mood?: Mood; budget?: number }

const STEPS = [
  {
    key: 'who' as const,
    q: 'Кому букет?',
    options: [
      { v: 'her', t: 'Ей', icon: 'cosmos' },
      { v: 'him', t: 'Ему', icon: 'sunflower' },
      { v: 'mom', t: 'Маме', icon: 'ranunculus' },
      { v: 'friend', t: 'Другу', icon: 'gerbera-red' },
      { v: 'me', t: 'Себе', icon: 'daisy' },
    ],
  },
  {
    key: 'mood' as const,
    q: 'Какое настроение?',
    options: [
      { v: 'joy', t: 'Радость', icon: 'sunflower-big' },
      { v: 'love', t: 'Любовь', icon: 'tulips' },
      { v: 'calm', t: 'Нежность', icon: 'anemone' },
      { v: 'wow', t: 'Вау-эффект', icon: 'poppies' },
    ],
  },
  {
    key: 'budget' as const,
    q: 'Какой бюджет?',
    options: [
      { v: 3500, t: 'до 3 500 ₽', icon: 'jug' },
      { v: 5000, t: 'до 5 000 ₽', icon: 'blue-bottle' },
      { v: 99999, t: 'не важно', icon: 'bottles' },
    ],
  },
] as const

export function Quiz() {
  const [step, setStep] = useState(0)
  const [a, setA] = useState<Answers>({})
  const { add, setOpen } = useCart()

  const result = useMemo(() => {
    if (step < 3) return null
    const scored = bouquets
      .map((b) => ({
        b,
        score: (a.who && b.who.includes(a.who) ? 2 : 0) + (a.mood && b.moods.includes(a.mood) ? 3 : 0) + (b.price <= (a.budget ?? 1e9) ? 2 : -5),
      }))
      .sort((x, y) => y.score - x.score || x.b.price - y.b.price)
    return { best: scored[0].b, alt: scored.slice(1, 3).map((s) => s.b) }
  }, [step, a])

  const pick = (key: keyof Answers, v: string | number) => {
    setA((prev) => ({ ...prev, [key]: v }))
    setStep((s) => s + 1)
  }

  return (
    <section id="quiz" className="paper-grain relative overflow-hidden bg-sun px-5 py-24 sm:px-8 sm:py-32">
      <div className="relative mx-auto max-w-[1400px]">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <Label n="02">подбор букета</Label>
            <Headline lines={['Три клика —', 'и букет готов']} className="mt-6 text-[clamp(2.4rem,6vw,5.6rem)]" />
          </div>
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <span key={i} className={`h-2 w-14 rounded-full transition-colors duration-500 ${i < step ? 'bg-ink' : 'bg-ink/15'}`} />
            ))}
          </div>
        </div>

        <div className="relative mt-14 min-h-[420px]">
          <AnimatePresence mode="wait">
            {step < 3 ? (
              <motion.div key={step} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.5, ease: EASE }}>
                <p className="font-hand text-4xl">
                  {step + 1}/3 · {STEPS[step].q}
                </p>
                <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                  {STEPS[step].options.map((o, i) => (
                    <motion.button
                      key={String(o.v)}
                      onClick={() => pick(STEPS[step].key, o.v)}
                      initial={{ opacity: 0, y: 40, rotate: i % 2 ? 3 : -3 }}
                      animate={{ opacity: 1, y: 0, rotate: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.6, ease: EASE }}
                      whileHover={{ y: -10, rotate: i % 2 ? 2 : -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="group relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-[1.75rem] bg-cream p-5 text-left shadow-[0_8px_0_#16261c] transition-shadow hover:shadow-[0_14px_0_#16261c]"
                    >
                      <span className="font-display text-xs font-bold uppercase text-ink/40">0{i + 1}</span>
                      <img src={sticker(o.icon as FlowerName)} alt="" className="sticker mx-auto h-[45%] object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12" />
                      <span className="font-display text-xl font-black uppercase leading-tight sm:text-2xl">{o.t}</span>
                    </motion.button>
                  ))}
                </div>
                {step > 0 && (
                  <button onClick={() => setStep((s) => s - 1)} className="mt-8 text-sm font-semibold underline underline-offset-4">
                    ← назад
                  </button>
                )}
              </motion.div>
            ) : (
              result && (
                <motion.div key="result" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: EASE }} className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                  <div className="relative grid overflow-hidden rounded-[2rem] bg-ink text-cream sm:grid-cols-2">
                    <div className="relative min-h-72">
                      <img src={photo(result.best.photo)} alt={result.best.name} className="absolute inset-0 h-full w-full object-cover" />
                    </div>
                    <div className="relative flex flex-col p-8">
                      <p className="font-hand text-3xl text-sun">вам подойдёт</p>
                      <h3 className="mt-2 font-display text-4xl font-black uppercase leading-none">{result.best.name}</h3>
                      <p className="mt-4 text-cream/70">{result.best.about}</p>
                      <p className="mt-6 font-display text-3xl font-bold">{formatPrice(result.best.price)}</p>
                      <div className="mt-auto flex flex-wrap gap-3 pt-8">
                        <button
                          onClick={() => {
                            const b = result.best
                            add({ key: b.id, title: b.name, note: b.about, price: b.price, image: photo(b.photo) })
                            setOpen(true)
                          }}
                          className="rounded-full bg-sun px-6 py-3.5 text-sm font-bold text-ink transition-colors hover:bg-tomato hover:text-cream"
                        >
                          В корзину
                        </button>
                        <button onClick={() => { setA({}); setStep(0) }} className="rounded-full border-2 border-cream/30 px-6 py-3.5 text-sm font-semibold hover:border-cream">
                          Пройти заново
                        </button>
                      </div>
                    </div>
                    {/* конфетти из наклеек */}
                    {(['sunflower', 'cosmos', 'daisy', 'gerbera-red', 'anemone', 'rudbeckia'] as FlowerName[]).map((f, i) => (
                      <motion.img
                        key={f}
                        src={sticker(f)}
                        alt=""
                        className="sticker pointer-events-none absolute left-1/2 top-1/2 w-16"
                        initial={{ x: 0, y: 0, scale: 0, rotate: 0 }}
                        animate={{ x: Math.cos(i) * 320, y: Math.sin(i * 1.7) * 200 - 60, scale: [0, 1.2, 0], rotate: 180 }}
                        transition={{ duration: 1.3, delay: 0.1 + i * 0.03, ease: 'easeOut' }}
                      />
                    ))}
                  </div>
                  <div className="flex flex-col gap-4">
                    <p className="font-hand text-3xl">ещё варианты</p>
                    {result.alt.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => add({ key: b.id, title: b.name, note: b.about, price: b.price, image: photo(b.photo) })}
                        className="group flex items-center gap-4 rounded-3xl bg-cream p-3 text-left transition-transform hover:-translate-y-1"
                      >
                        <img src={photo(b.photo)} alt="" className="h-20 w-20 rounded-2xl object-cover" />
                        <span className="flex-1">
                          <span className="block font-display text-lg font-black uppercase">{b.name}</span>
                          <span className="text-sm text-ink/60">{formatPrice(b.price)}</span>
                        </span>
                        <span className="mr-3 grid h-10 w-10 place-items-center rounded-full bg-ink text-cream transition-colors group-hover:bg-tomato">+</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
