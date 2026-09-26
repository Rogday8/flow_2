import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useEffect, useState } from 'react'
import { useCart } from '../state/cart'
import { Logo } from './Logo'

const LINKS = [
  { href: '#swipe', label: 'Свайп' },
  { href: '#quiz', label: 'Подбор' },
  { href: '#catalog', label: 'Каталог' },
  { href: '#season', label: 'Сезон' },
  { href: '#care', label: 'Уход' },
]

/** Живые часы: сейчас и время, к которому успеем привезти (плюс час) */
function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 15000)
    return () => window.clearInterval(t)
  }, [])
  const f = (d: Date) => d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  return { now: f(now), eta: f(new Date(now.getTime() + 60 * 60 * 1000)) }
}

export function Nav() {
  const { scrollY } = useScroll()
  const [solid, setSolid] = useState(false)
  const [menu, setMenu] = useState(false)
  const { count, setOpen, pulse } = useCart()
  const { now, eta } = useClock()

  useMotionValueEvent(scrollY, 'change', (y) => setSolid(y > 30))

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${solid ? 'bg-paper/85 shadow-[0_1px_0_rgba(22,38,28,0.12)] backdrop-blur-md' : ''}`}>
        <nav className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <Logo />

          <ul className="hidden items-center gap-7 text-sm font-medium lg:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="group relative py-1">
                  {l.label}
                  <span className="absolute -bottom-0.5 left-0 h-[3px] w-full origin-right scale-x-0 rounded-full bg-tomato transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-ink/15 px-3.5 py-2 text-xs md:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-leaf opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-leaf" />
              </span>
              {now} · привезём к <b>{eta}</b>
            </span>
            <button onClick={() => setOpen(true)} className="flex items-center gap-2 rounded-full bg-ink py-2 pl-4 pr-2 text-sm font-semibold text-cream transition-colors hover:bg-tomato">
              Корзина
              <motion.span
                key={pulse}
                initial={{ scale: 1.9, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 11 }}
                className="grid h-7 min-w-7 place-items-center rounded-full bg-sun px-1.5 text-xs text-ink"
              >
                {count}
              </motion.span>
            </button>
            <button onClick={() => setMenu(true)} className="grid h-11 w-11 place-items-center rounded-full border-2 border-ink lg:hidden" aria-label="Меню">
              <span className="block h-0.5 w-4 bg-ink shadow-[0_5px_0_#16261c,0_-5px_0_#16261c]" />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {menu && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-sun p-6 lg:hidden"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="flex justify-end">
              <button onClick={() => setMenu(false)} className="grid h-11 w-11 place-items-center rounded-full border-2 border-ink text-xl" aria-label="Закрыть">
                ×
              </button>
            </div>
            <ul className="mt-10 space-y-1">
              {LINKS.map((l, i) => (
                <motion.li key={l.href} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.06 }}>
                  <a href={l.href} onClick={() => setMenu(false)} className="font-display text-5xl font-black uppercase">
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <p className="mt-auto font-hand text-2xl">
              сейчас {now} — привезём к {eta}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
