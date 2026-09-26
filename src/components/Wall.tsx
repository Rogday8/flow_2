import { motion } from 'motion/react'
import { useRef } from 'react'
import { photo, sticker, type FlowerName, type PhotoName } from '../data/media'
import { Headline, Label } from './ui'

type Tile = { img: PhotoName; x: number; y: number; w: number; r: number; note?: string }

/** Раскладка «стола» — координаты в пикселях холста 2200×1400 */
const TILES: Tile[] = [
  { img: 'sunflower-girl', x: 60, y: 80, w: 330, r: -3, note: 'рынок, суббота' },
  { img: 'yellow-bike', x: 440, y: 40, w: 280, r: 2 },
  { img: 'market-book', x: 770, y: 110, w: 380, r: -1.5, note: 'наш флорист Ира' },
  { img: 'woman-flowers', x: 1200, y: 30, w: 300, r: 3 },
  { img: 'dark-flatlay', x: 1550, y: 90, w: 340, r: -2 },
  { img: 'field-person', x: 1920, y: 40, w: 250, r: 2 },
  { img: 'coffee-flowers', x: 100, y: 540, w: 260, r: 2.5 },
  { img: 'tulips-window', x: 400, y: 470, w: 360, r: -2, note: 'утро в лавке' },
  { img: 'petals-hands', x: 810, y: 560, w: 250, r: 3 },
  { img: 'red-bike', x: 1110, y: 470, w: 330, r: -1 },
  { img: 'girl-skirt', x: 1490, y: 520, w: 290, r: 2 },
  { img: 'sunset-field', x: 1830, y: 470, w: 330, r: -3, note: 'поле под Коломной' },
  { img: 'snapdragons', x: 60, y: 950, w: 340, r: -2 },
  { img: 'daisy-hand', x: 450, y: 960, w: 300, r: 2 },
  { img: 'wall-bike', x: 800, y: 930, w: 280, r: -3 },
  { img: 'sunflower-coffee', x: 1130, y: 980, w: 330, r: 1.5 },
  { img: 'pink-vase', x: 1510, y: 960, w: 300, r: -2 },
  { img: 'windmill', x: 1860, y: 930, w: 300, r: 3 },
]

const PINS: { name: FlowerName; x: number; y: number; w: number }[] = [
  { name: 'gerbera-red', x: 360, y: 400, w: 120 },
  { name: 'lupine', x: 1080, y: 380, w: 90 },
  { name: 'cosmos', x: 1780, y: 380, w: 130 },
  { name: 'bouquet-hand', x: 720, y: 820, w: 140 },
  { name: 'sunflower-vase', x: 1440, y: 820, w: 140 },
  { name: 'daisy', x: 2050, y: 820, w: 120 },
]

export function Wall() {
  const box = useRef<HTMLDivElement>(null)
  return (
    <section className="relative overflow-hidden bg-ink py-24 text-cream sm:py-32">
      <div className="mx-auto flex max-w-[1500px] flex-col justify-between gap-6 px-5 sm:px-8 md:flex-row md:items-end">
        <div>
          <Label n="06" className="text-sun">
            жизнь лавки
          </Label>
          <Headline lines={['Стол', <span key="w" className="text-sun">с фотками</span>]} className="mt-6 text-[clamp(2.4rem,6vw,5.6rem)]" />
        </div>
        <p className="font-hand text-3xl text-sun">← тащите стол в любую сторону →</p>
      </div>

      <div ref={box} className="relative mt-12 h-[70svh] overflow-hidden border-y border-cream/10 bg-[radial-gradient(circle,rgba(251,248,241,0.08)_1px,transparent_1px)] [background-size:28px_28px]">
        <motion.div
          drag
          dragConstraints={{ left: -1400, right: 0, top: -700, bottom: 0 }}
          dragElastic={0.15}
          dragTransition={{ power: 0.25, timeConstant: 300 }}
          className="absolute left-0 top-0 h-[1400px] w-[2200px] cursor-grab active:cursor-grabbing"
          initial={{ x: -300, y: -120 }}
        >
          {TILES.map((t, i) => (
            <motion.figure
              key={t.img}
              className="absolute bg-cream p-2.5 pb-10 shadow-2xl"
              style={{ left: t.x, top: t.y, width: t.w, rotate: t.r }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 6) * 0.05, type: 'spring', stiffness: 140, damping: 16 }}
              whileHover={{ scale: 1.05, rotate: 0, zIndex: 20 }}
            >
              <img src={photo(t.img)} alt="" draggable={false} className="pointer-events-none w-full" />
              {t.note && <figcaption className="absolute bottom-1.5 left-3 font-hand text-2xl text-ink">{t.note}</figcaption>}
            </motion.figure>
          ))}
          {PINS.map((p) => (
            <img key={p.name} src={sticker(p.name)} alt="" draggable={false} className="sticker pointer-events-none absolute z-10" style={{ left: p.x, top: p.y, width: p.w }} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
