import { AnimatePresence, motion } from 'motion/react'
import { useState, type FormEvent } from 'react'
import { sticker, type FlowerName } from '../data/media'
import { Daisy } from './Logo'

const FALLING: { name: FlowerName; left: string; w: string; r: number }[] = [
  { name: 'sunflower', left: '4%', w: '13%', r: -14 },
  { name: 'cosmos', left: '21%', w: '10%', r: 10 },
  { name: 'gerbera-red', left: '46%', w: '9%', r: -6 },
  { name: 'anemone', left: '63%', w: '10%', r: 18 },
  { name: 'rudbeckia', left: '80%', w: '12%', r: -10 },
]

export function Footer() {
  const [sent, setSent] = useState(false)
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSent(true)
    e.currentTarget.reset()
  }

  return (
    <footer id="contacts" className="relative overflow-hidden bg-tomato text-ink">
      <div className="mx-auto grid max-w-[1500px] gap-12 px-5 pt-20 sm:px-8 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="font-display text-3xl font-black uppercase leading-tight sm:text-4xl">
            Раз в неделю — письмо
            <br />о том, что зацвело
          </p>
          <form onSubmit={submit} className="mt-8 flex max-w-md overflow-hidden rounded-full border-2 border-ink bg-cream">
            <input required type="email" placeholder="ваша почта" className="min-w-0 flex-1 bg-transparent px-6 py-4 text-sm outline-none placeholder:text-ink/40" />
            <button className="bg-ink px-6 text-sm font-semibold text-cream transition-colors hover:bg-sun hover:text-ink">Хочу</button>
          </form>
          <AnimatePresence>
            {sent && (
              <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 font-hand text-2xl">
                ура! первое письмо — в пятницу
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <div className="space-y-1 text-sm">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em]">Лавка</p>
          <p>Москва, ул. Покровка, 17</p>
          <p>каждый день 8:00 — 22:00</p>
          <a href="tel:+79990001122" className="block font-display text-xl font-bold hover:underline">
            +7 (999) 000-11-22
          </a>
          <a href="mailto:hello@pole.flowers" className="block hover:underline">
            hello@pole.flowers
          </a>
        </div>
        <div className="text-sm">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em]">Мы тут</p>
          <div className="flex flex-wrap gap-2">
            {['Telegram', 'VK', 'Instagram', 'Pinterest', 'WhatsApp'].map((s) => (
              <a key={s} href="#" className="rounded-full border-2 border-ink px-4 py-2 font-semibold transition-colors hover:bg-ink hover:text-tomato">
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* большое слово, в которое падают цветы */}
      <div className="relative mt-16">
        {FALLING.map((f, i) => (
          <motion.img
            key={f.name}
            src={sticker(f.name)}
            alt=""
            className="sticker pointer-events-none absolute z-10"
            style={{ left: f.left, width: f.w, top: '-6%' }}
            initial={{ y: -500, rotate: f.r * 4, opacity: 0 }}
            whileInView={{ y: 0, rotate: f.r, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ type: 'spring', stiffness: 90, damping: 9, delay: 0.1 + i * 0.12 }}
          />
        ))}
        <p className="select-none text-center font-display text-[25vw] font-black leading-[0.74] tracking-[-0.06em] text-ink">ПОЛЕ</p>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 bg-ink px-5 py-5 text-xs text-cream/70 sm:flex-row sm:px-8">
        <span className="flex items-center gap-2">
          <Daisy className="h-5 w-5" /> © {new Date().getFullYear()} ПОЛЕ — цветочная лавка
        </span>
        <a href="#top" className="hover:text-sun">
          наверх ↑
        </a>
      </div>
    </footer>
  )
}
