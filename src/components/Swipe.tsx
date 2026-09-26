import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useState } from 'react'
import { photo, sticker } from '../data/media'
import { bouquets, formatPrice, type Bouquet } from '../data/shop'
import { useCart } from '../state/cart'
import { Headline, Label, Reveal } from './ui'

const DECK = bouquets.slice(0, 8)

/** Колода букетов: вправо — в корзину, влево — следующий */
export function Swipe() {
  const [index, setIndex] = useState(0)
  const [liked, setLiked] = useState<Bouquet[]>([])
  const { add } = useCart()
  const rest = DECK.slice(index, index + 3)

  const decide = (b: Bouquet, like: boolean) => {
    if (like) {
      add({ key: b.id, title: b.name, note: b.about, price: b.price, image: photo(b.photo) })
      setLiked((l) => [...l, b])
    }
    setIndex((i) => i + 1)
  }

  return (
    <section id="swipe" className="relative overflow-hidden bg-ink px-5 py-24 text-cream sm:px-8 sm:py-32">
      <div className="mx-auto grid max-w-[1400px] items-center gap-16 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <Label n="01" className="text-sun">
            свайп-букет
          </Label>
          <Headline lines={['Не знаешь,', <span key="w" className="text-sun">что выбрать?</span>, 'Смахни.']} className="mt-6 text-[clamp(2.4rem,6vw,5.6rem)]" />
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-md text-lg text-cream/70">
              Тяни карточку вправо — букет летит в корзину. Влево — показываем следующий. Как в приложении знакомств, только все букеты взаимны.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <span className="font-hand text-2xl text-sun">понравилось:</span>
              <AnimatePresence>
                {liked.map((b) => (
                  <motion.img
                    key={b.id}
                    src={sticker(b.sticker)}
                    alt={b.name}
                    title={b.name}
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="sticker h-14 w-14 object-contain"
                  />
                ))}
              </AnimatePresence>
              {!liked.length && <span className="text-sm text-cream/40">пока ничего</span>}
            </div>
          </Reveal>
        </div>

        <div className="relative mx-auto h-[540px] w-full max-w-[400px] sm:h-[600px]">
          <AnimatePresence>
            {rest
              .map((b, i) => <Card key={b.id} b={b} depth={i} onDecide={(like) => decide(b, like)} />)
              .reverse()}
          </AnimatePresence>

          {index >= DECK.length && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 grid place-items-center rounded-[2rem] border-2 border-dashed border-cream/25 text-center">
              <div>
                <p className="font-display text-3xl font-black uppercase">Колода всё</p>
                <p className="mt-2 font-hand text-2xl text-sun">загляните в корзину или начните заново</p>
                <button onClick={() => setIndex(0)} className="mt-6 rounded-full bg-sun px-6 py-3 text-sm font-semibold text-ink">
                  Перемешать ещё раз
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

function Card({ b, depth, onDecide }: { b: Bouquet; depth: number; onDecide: (like: boolean) => void }) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-250, 250], [-18, 18])
  const likeOpacity = useTransform(x, [30, 130], [0, 1])
  const nopeOpacity = useTransform(x, [-130, -30], [1, 0])
  const [gone, setGone] = useState<null | boolean>(null)
  const top = depth === 0

  const fly = (like: boolean) => {
    setGone(like)
    animate(x, like ? 600 : -600, { duration: 0.45, ease: [0.4, 0, 0.6, 1] }).then(() => onDecide(like))
  }

  return (
    <motion.div
      className="absolute inset-0 touch-none select-none"
      style={{ x, rotate, zIndex: 10 - depth }}
      initial={{ scale: 0.9, y: 30, opacity: 0 }}
      animate={{ scale: 1 - depth * 0.05, y: depth * 18, opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      drag={top && gone === null ? 'x' : false}
      dragSnapToOrigin
      dragElastic={0.9}
      onDragEnd={(_, info) => {
        if (info.offset.x > 120 || info.velocity.x > 600) fly(true)
        else if (info.offset.x < -120 || info.velocity.x < -600) fly(false)
      }}
    >
      <div className={`flex h-full flex-col overflow-hidden rounded-[2rem] bg-cream text-ink shadow-2xl ${top ? 'cursor-grab active:cursor-grabbing' : ''}`}>
        <div className="relative flex-1 overflow-hidden">
          <img src={photo(b.photo)} alt={b.name} draggable={false} className="h-full w-full object-cover" />
          <motion.span style={{ opacity: likeOpacity }} className="absolute left-5 top-6 -rotate-12 rounded-xl border-4 border-leaf bg-cream/80 px-3 py-1 font-display text-2xl font-black uppercase text-leaf">
            в корзину
          </motion.span>
          <motion.span style={{ opacity: nopeOpacity }} className="absolute right-5 top-6 rotate-12 rounded-xl border-4 border-tomato bg-cream/80 px-3 py-1 font-display text-2xl font-black uppercase text-tomato">
            дальше
          </motion.span>
          <img src={sticker(b.sticker)} alt="" className="sticker absolute -bottom-6 right-4 w-24 rotate-12" />
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <h3 className="min-w-0 font-display text-xl font-black uppercase leading-none [overflow-wrap:anywhere]">{b.name}</h3>
            <span className="shrink-0 whitespace-nowrap rounded-full bg-sun px-3 py-1 text-sm font-bold">{formatPrice(b.price)}</span>
          </div>
          <p className="mt-2 text-sm text-ink/60">
            {b.about} · {b.stems} стеблей
          </p>
          {top && (
            <div className="mt-5 flex gap-3">
              <button onClick={() => fly(false)} className="flex-1 rounded-full border-2 border-ink py-3 text-sm font-semibold transition-colors hover:bg-ink hover:text-cream">
                ✕ Дальше
              </button>
              <button onClick={() => fly(true)} className="flex-1 rounded-full bg-tomato py-3 text-sm font-semibold text-cream transition-colors hover:bg-ink">
                ♥ Беру
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
