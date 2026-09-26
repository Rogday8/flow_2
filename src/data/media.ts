// Картинки подключаются через glob — Vite сам захеширует их при сборке
const photoFiles = import.meta.glob<string>('../assets/photos/*.webp', { eager: true, import: 'default' })
const stickerFiles = import.meta.glob<string>('../assets/stickers/*.webp', { eager: true, import: 'default' })
const cutFiles = import.meta.glob<string>('../assets/cut/*.webp', { eager: true, import: 'default' })

const byName = (files: Record<string, string>) =>
  Object.fromEntries(Object.entries(files).map(([path, url]) => [path.split('/').pop()!.replace('.webp', ''), url]))

const photos = byName(photoFiles)
const stickers = byName(stickerFiles)
const cuts = byName(cutFiles)

export type PhotoName =
  | 'sunflower-girl' | 'market' | 'yellow-bike' | 'wall-bike' | 'red-bike' | 'coffee-flowers' | 'sunflower-coffee'
  | 'rose-table' | 'dark-flatlay' | 'dark-bouquet' | 'red-dahlias' | 'strawflowers' | 'bouquets-table'
  | 'sunflower-vase-dark' | 'sunflower-bucket' | 'sunflowers-rustic' | 'market-book' | 'tulips-window'
  | 'snapdragons' | 'snapdragons-news' | 'field-person' | 'sunset-field' | 'windmill' | 'daisy-hand'
  | 'blossom-hand' | 'petals-hands' | 'woman-flowers' | 'woman-peony' | 'girl-skirt' | 'daisy-bunch'
  | 'pink-vase' | 'ranunculus-vase' | 'cosmos-glass' | 'daffodils-mint' | 'daisies-card' | 'gerbera-orange'
  | 'poppies-field' | 'cosmos-field' | 'red-tulips' | 'bike-basket' | 'flatlay-tools' | 'rustic-snap'
  | 'sunflower-sky' | 'lupine-field'

export type FlowerName =
  | 'sunflower-vase' | 'anemone' | 'sunflower' | 'cosmos' | 'bouquet-hand' | 'bottles' | 'blue-bottle'
  | 'gerbera-pink' | 'sunflower-big' | 'jug' | 'lupine' | 'poppies' | 'ranunculus' | 'gerbera-red'
  | 'rudbeckia' | 'droopy' | 'daisy' | 'tulips'

export const photo = (n: PhotoName) => photos[n]
/** Цветок-наклейка с белой обводкой */
export const sticker = (n: FlowerName) => stickers[n]
/** Тот же цветок без обводки */
export const cut = (n: FlowerName) => cuts[n]
