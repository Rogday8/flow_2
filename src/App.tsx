import Lenis from 'lenis'
import { AnimatePresence } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'
import { Care } from './components/Care'
import { Catalog } from './components/Catalog'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Loader } from './components/Loader'
import { Nav } from './components/Nav'
import { Deadline, Notes } from './components/Notes'
import { Quiz } from './components/Quiz'
import { Receipt } from './components/Receipt'
import { Season } from './components/Season'
import { Swipe } from './components/Swipe'
import { Ticker } from './components/ui'
import { Wall } from './components/Wall'
import { sticker, type FlowerName } from './data/media'
import { CartProvider, useCart } from './state/cart'

export default function App() {
  return (
    <CartProvider>
      <Site />
    </CartProvider>
  )
}

function Site() {
  const [loading, setLoading] = useState(true)
  const done = useCallback(() => setLoading(false), [])
  const { open } = useCart()
  useSmoothScroll(loading || open)

  return (
    <>
      <AnimatePresence>{loading && <Loader key="loader" onDone={done} />}</AnimatePresence>
      <Nav />
      <main>
        <Hero ready={!loading} />
        <FlowerTicker />
        <Swipe />
        <Quiz />
        <Catalog />
        <Deadline />
        <Season />
        <Care />
        <Wall />
        <Notes />
      </main>
      <Footer />
      <Receipt />
    </>
  )
}

const WORDS: [string, FlowerName][] = [
  ['подсолнухи', 'sunflower'],
  ['космея', 'cosmos'],
  ['маки', 'poppies'],
  ['ромашки', 'daisy'],
  ['герберы', 'gerbera-red'],
  ['люпины', 'lupine'],
  ['анемоны', 'anemone'],
]

function FlowerTicker() {
  return (
    <div className="relative z-10 border-y-2 border-ink bg-cosmos py-3">
      <Ticker>
        {WORDS.map(([w, f]) => (
          <span key={w} className="flex items-center gap-5 px-5">
            <span className="font-display text-3xl font-black uppercase sm:text-4xl">{w}</span>
            <img src={sticker(f)} alt="" className="sticker h-12 w-12 animate-wiggle object-contain" />
          </span>
        ))}
      </Ticker>
    </div>
  )
}

/** Инерционный скролл; на время загрузки и открытого чека — стоп */
function useSmoothScroll(paused: boolean) {
  const [lenis, setLenis] = useState<Lenis | null>(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const l = new Lenis({ duration: 1.1, smoothWheel: true, anchors: { offset: -70 } })
    let raf = 0
    const loop = (t: number) => {
      l.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    setLenis(l)
    return () => {
      cancelAnimationFrame(raf)
      l.destroy()
    }
  }, [])
  useEffect(() => {
    if (!lenis) {
      document.body.style.overflow = paused ? 'hidden' : ''
      return
    }
    if (paused) lenis.stop()
    else lenis.start()
  }, [lenis, paused])
}
