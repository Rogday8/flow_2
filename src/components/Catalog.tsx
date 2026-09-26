import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { photo, sticker } from '../data/media'
import { bouquets, formatPrice, tones, type Bouquet, type Tone } from '../data/shop'
import { useCart } from '../state/cart'
import { EASE, Headline, Label } from './ui'

/** Каталог: фильтр по цвету, «журнальная» сетка — первый букет крупнее */
export function Catalog() {
  const [tone, setTone] = useState<Tone | 'all'>('all')
  const list = tone === 'all' ? bouquets : bouquets.filter((b) => b.tone === tone)

  return (
    <section id="catalog" className="relative px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-col justify-between gap-10 border-b-2 border-ink pb-8 lg:flex-row lg:items-end">
          <div>
            <Label n="03">каталог</Label>
            <Headline lines={['Букеты', <span key="c" className="text-tomato">по цвету</span>]} className="mt-6 text-[clamp(2.6rem,7vw,6.5rem)]" />
          </div>
          <div className="flex flex-wrap gap-2 lg:max-w-2xl lg:justify-end">
            {tones.map((t) => (
              <button
                key={t.id}
                onClick={() => setTone(t.id)}
                className={`flex items-center gap-2 rounded-full border-2 px-4 py-2.5 text-sm font-semibold transition-all ${
                  tone === t.id ? 'border-ink bg-ink text-cream' : 'border-ink/15 hover:border-ink'
                }`}
              >
                <span className="h-4 w-4 rounded-full border border-ink/20" style={{ background: t.dot }} />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {list.map((b, i) => (
              <motion.div
                key={b.id}
                layout
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, delay: (i % 4) * 0.05, ease: EASE }}
                className={i === 0 ? 'sm:col-span-2 sm:row-span-2' : ''}
              >
                <Card b={b} n={i + 1} big={i === 0} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

function Card({ b, n, big }: { b: Bouquet; n: number; big: boolean }) {
  const { add } = useCart()
  const [done, setDone] = useState(false)
  const onAdd = () => {
    add({ key: b.id, title: b.name, note: b.about, price: b.price, image: photo(b.photo) })
    setDone(true)
    window.setTimeout(() => setDone(false), 1300)
  }

  return (
    <article className="group relative flex h-full flex-col">
      <div className={`relative overflow-hidden rounded-[1.75rem] bg-cream ${big ? 'aspect-square sm:aspect-auto sm:flex-1' : 'aspect-[4/5]'}`}>
        <img
          src={photo(b.photo)}
          alt={b.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-cream px-3 py-1 font-display text-xs font-bold">№{String(n).padStart(2, '0')}</span>
        <img
          src={sticker(b.sticker)}
          alt=""
          className="sticker absolute -bottom-10 -right-6 w-32 rotate-45 opacity-0 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:bottom-3 group-hover:right-3 group-hover:rotate-6 group-hover:opacity-100"
        />
        <button
          onClick={onAdd}
          className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-cream transition-all duration-500 hover:bg-tomato lg:translate-y-20 lg:group-hover:translate-y-0"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={done ? 'ok' : 'add'} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }}>
              {done ? '✓ В корзине' : '+ В корзину'}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
      <div className="mt-4 flex items-start justify-between gap-3 px-1">
        <div className="min-w-0">
          <h3 className={`font-display font-black uppercase leading-none [overflow-wrap:anywhere] ${big ? 'text-2xl sm:text-4xl' : 'text-lg sm:text-xl'}`}>{b.name}</h3>
          <p className="mt-1.5 text-sm text-ink/55">{b.about}</p>
        </div>
        <span className="shrink-0 whitespace-nowrap rounded-full border-2 border-ink px-3 py-1 text-sm font-bold">{formatPrice(b.price)}</span>
      </div>
    </article>
  )
}
