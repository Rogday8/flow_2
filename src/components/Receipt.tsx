import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState, type FormEvent } from 'react'
import { sticker } from '../data/media'
import { formatPrice } from '../data/shop'
import { useCart } from '../state/cart'

const DELIVERY = 390
const FREE_FROM = 5000

/** Корзина в виде бумажного чека: выезжает сверху справа, края «оторваны» зубчиками */
export function Receipt() {
  const { items, total, open, setOpen, change, clear } = useCart()
  const [step, setStep] = useState<'list' | 'form' | 'done'>('list')
  const delivery = total >= FREE_FROM || !total ? 0 : DELIVERY
  const no = String(1000 + ((total * 7) % 9000)).slice(0, 4)

  useEffect(() => {
    if (!open) return
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [open, setOpen])

  const close = () => {
    setOpen(false)
    if (step === 'done') window.setTimeout(() => setStep('list'), 500)
  }
  const submit = (e: FormEvent) => {
    e.preventDefault()
    clear()
    setStep('done')
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-[120] bg-ink/40 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} />
          <motion.aside
            role="dialog"
            aria-label="Корзина"
            className="fixed right-3 top-3 z-[130] flex max-h-[calc(100svh-1.5rem)] w-[calc(100%-1.5rem)] max-w-[400px] flex-col font-mono"
            initial={{ y: '-110%', rotate: 3 }}
            animate={{ y: 0, rotate: 0 }}
            exit={{ y: '-110%', rotate: -3 }}
            transition={{ type: 'spring', stiffness: 110, damping: 17 }}
          >
            <div className="flex min-h-0 flex-col overflow-hidden bg-cream shadow-2xl">
              <header className="flex items-start justify-between border-b-2 border-dashed border-ink/30 p-6">
                <div>
                  <p className="font-display text-2xl font-black">ПОЛЕ</p>
                  <p className="text-xs text-ink/60">чек №{no} · {new Date().toLocaleDateString('ru-RU')}</p>
                </div>
                <button onClick={close} className="grid h-9 w-9 place-items-center rounded-full border-2 border-ink text-lg" aria-label="Закрыть">
                  ×
                </button>
              </header>

              {step === 'done' ? (
                <div className="p-8 text-center">
                  <motion.img src={sticker('bouquet-hand')} alt="" className="sticker mx-auto h-40" initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 150, damping: 10 }} />
                  <p className="mt-4 font-display text-2xl font-black uppercase">Заказ принят!</p>
                  <p className="mt-2 font-hand text-2xl">флорист уже бежит за цветами</p>
                  <button onClick={close} className="mt-6 w-full rounded-full bg-ink py-3.5 font-sans text-sm font-semibold text-cream">
                    Спасибо!
                  </button>
                </div>
              ) : !items.length ? (
                <div className="p-8 text-center">
                  <img src={sticker('droopy')} alt="" className="sticker mx-auto h-32" />
                  <p className="mt-4 text-sm">В чеке пусто — цветок грустит.</p>
                  <a href="#swipe" onClick={close} className="mt-5 inline-block rounded-full bg-sun px-6 py-3 font-sans text-sm font-semibold">
                    Смахнуть букет
                  </a>
                </div>
              ) : step === 'list' ? (
                <>
                  <ul className="min-h-0 flex-1 divide-y divide-dashed divide-ink/20 overflow-y-auto px-6" data-lenis-prevent>
                    {items.map((it) => (
                      <li key={it.key} className="flex gap-3 py-4 text-sm">
                        <img src={it.image} alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold uppercase">{it.title}</p>
                          <div className="mt-1 flex items-center gap-2 text-xs">
                            <button onClick={() => change(it.key, -1)} className="h-6 w-6 rounded-full border border-ink/30" aria-label="Меньше">
                              −
                            </button>
                            {it.qty} шт.
                            <button onClick={() => change(it.key, 1)} className="h-6 w-6 rounded-full border border-ink/30" aria-label="Больше">
                              +
                            </button>
                          </div>
                        </div>
                        <span className="whitespace-nowrap font-bold">{formatPrice(it.price * it.qty)}</span>
                      </li>
                    ))}
                  </ul>
                  <Totals total={total} delivery={delivery} />
                  <div className="p-6 pt-0">
                    <button onClick={() => setStep('form')} className="w-full rounded-full bg-tomato py-4 font-sans text-sm font-bold text-cream transition-colors hover:bg-ink">
                      Оформить →
                    </button>
                  </div>
                </>
              ) : (
                <form onSubmit={submit} className="flex min-h-0 flex-col">
                  <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-6" data-lenis-prevent>
                    {[
                      ['Имя', 'name', 'text', 'Как к вам обращаться'],
                      ['Телефон', 'phone', 'tel', '+7'],
                      ['Адрес', 'address', 'text', 'Улица, дом, квартира'],
                    ].map(([l, n, t, ph]) => (
                      <label key={n} className="block text-xs uppercase">
                        {l}
                        <input required name={n} type={t} placeholder={ph} className="mt-1 w-full border-b-2 border-dashed border-ink/30 bg-transparent py-2 font-sans text-base normal-case outline-none focus:border-tomato" />
                      </label>
                    ))}
                    <label className="block text-xs uppercase">
                      Записка
                      <textarea name="note" rows={2} placeholder="пара тёплых слов" className="mt-1 w-full resize-none border-b-2 border-dashed border-ink/30 bg-transparent py-2 font-hand text-2xl normal-case outline-none focus:border-tomato" />
                    </label>
                    <button type="button" onClick={() => setStep('list')} className="text-xs underline">
                      ← к чеку
                    </button>
                  </div>
                  <Totals total={total} delivery={delivery} />
                  <div className="p-6 pt-0">
                    <button className="w-full rounded-full bg-ink py-4 font-sans text-sm font-bold text-cream transition-colors hover:bg-tomato">Подтвердить заказ</button>
                  </div>
                </form>
              )}
            </div>
            {/* оторванный край чека */}
            <svg viewBox="0 0 400 14" preserveAspectRatio="none" className="h-3.5 w-full" aria-hidden>
              <path d={`M0 0 ${Array.from({ length: 20 }, (_, i) => `L${i * 20 + 10} 14 L${i * 20 + 20} 0`).join(' ')} Z`} fill="#fbf8f1" />
            </svg>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function Totals({ total, delivery }: { total: number; delivery: number }) {
  return (
    <div className="space-y-1 border-t-2 border-dashed border-ink/30 p-6 text-sm">
      <div className="flex justify-between">
        <span>букеты</span>
        <span>{formatPrice(total)}</span>
      </div>
      <div className="flex justify-between">
        <span>доставка</span>
        <span>{delivery ? formatPrice(delivery) : 'бесплатно'}</span>
      </div>
      {total < FREE_FROM && <p className="text-xs text-ink/50">бесплатная доставка от {formatPrice(FREE_FROM)}</p>}
      <div className="flex justify-between pt-2 font-display text-xl font-black">
        <span>ИТОГО</span>
        <span>{formatPrice(total + delivery)}</span>
      </div>
    </div>
  )
}
