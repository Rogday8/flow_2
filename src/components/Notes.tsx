import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { sticker, type FlowerName } from '../data/media'
import { Headline, Label, Ticker } from './ui'

const NOTES: { text: string; name: string; color: string; r: number; pin: FlowerName }[] = [
  { text: 'Подсолнухи стояли две недели! Кухня как будто на даче.', name: 'Катя, Сокол', color: '#ffc933', r: -4, pin: 'sunflower' },
  { text: 'Смахнул «Жару» вправо в 18:40 — в 19:35 уже дарил. Магия.', name: 'Дима, Таганка', color: '#ff7eb6', r: 3, pin: 'poppies' },
  { text: 'Квиз выдал «Космею» для мамы. Она плакала. Хорошими слезами.', name: 'Аня, Химки', color: '#c9b6ff', r: -2, pin: 'cosmos' },
  { text: 'Беру «Рынок» каждую пятницу. Ни разу не повторились.', name: 'Олег, Арбат', color: '#bfe0ff', r: 5, pin: 'gerbera-red' },
  { text: 'Записку написали от руки и с ошибкой в моём имени — как я и просила 😄', name: 'Лёля, Марьино', color: '#fbf8f1', r: -3, pin: 'daisy' },
]

/** Отзывы-стикеры на пробковой доске — их можно передвигать */
export function Notes() {
  const board = useRef<HTMLDivElement>(null)
  return (
    <section className="relative overflow-hidden bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <Label n="07">отзывы</Label>
        <Headline lines={['Нам пишут', <span key="n" className="text-cosmos">на стикерах</span>]} className="mt-6 text-[clamp(2.4rem,6vw,5.6rem)]" />
        <p className="mt-4 font-hand text-2xl text-ink/60">их можно переставлять, мы не обидимся</p>

        <div ref={board} className="relative mt-12 grid min-h-[520px] gap-6 sm:grid-cols-2 lg:block lg:h-[560px]">
          {NOTES.map((n, i) => (
            <motion.div
              key={n.name}
              drag
              dragConstraints={board}
              dragElastic={0.1}
              whileDrag={{ scale: 1.06, rotate: 0, zIndex: 40, boxShadow: '0 30px 50px -20px rgba(22,38,28,.45)' }}
              initial={{ opacity: 0, y: 60, rotate: n.r * 3 }}
              whileInView={{ opacity: 1, y: 0, rotate: n.r }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 120, damping: 14 }}
              className="relative cursor-grab p-7 pt-10 shadow-[0_18px_30px_-18px_rgba(22,38,28,.5)] active:cursor-grabbing lg:absolute lg:w-[300px]"
              style={{ backgroundColor: n.color, left: `${4 + i * 19}%`, top: `${i % 2 ? 36 : 4}%` }}
            >
              <img src={sticker(n.pin)} alt="" draggable={false} className="sticker pointer-events-none absolute -top-8 left-1/2 w-16 -translate-x-1/2" />
              <p className="font-hand text-[1.7rem] leading-[1.15]">«{n.text}»</p>
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.15em] text-ink/60">— {n.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/** Жёлтая полоса: обратный отсчёт до конца приёма заказов на сегодня */
export function Deadline() {
  const [left, setLeft] = useState('')
  const today = useRef(true)
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const cut = new Date(now)
      cut.setHours(21, 0, 0, 0)
      today.current = now < cut
      if (!today.current) cut.setDate(cut.getDate() + 1)
      const s = Math.max(0, Math.floor((cut.getTime() - now.getTime()) / 1000))
      const hh = String(Math.floor(s / 3600)).padStart(2, '0')
      const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
      const ss = String(s % 60).padStart(2, '0')
      setLeft(`${hh}:${mm}:${ss}`)
    }
    tick()
    const t = window.setInterval(tick, 1000)
    return () => window.clearInterval(t)
  }, [])

  return (
    <div className="relative z-10 -my-6 rotate-[-1.5deg] border-y-2 border-ink bg-sun py-4">
      <Ticker>
        {Array.from({ length: 3 }, (_, i) => (
          <span key={i} className="flex items-center gap-6 px-6 font-display text-xl font-black uppercase sm:text-2xl">
            {today.current ? 'доставим сегодня — успейте за' : 'заказы на завтра — приём закроется через'}
            <span className="rounded-full bg-ink px-4 py-1 tabular-nums text-sun">{left}</span>
            <span className="text-tomato">✺</span>
          </span>
        ))}
      </Ticker>
    </div>
  )
}
