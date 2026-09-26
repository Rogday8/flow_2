import type { FlowerName, PhotoName } from './media'

export type Tone = 'yellow' | 'pink' | 'white' | 'red' | 'mix'
export type Mood = 'joy' | 'love' | 'calm' | 'wow'
export type Who = 'her' | 'him' | 'mom' | 'friend' | 'me'

export const tones: { id: Tone | 'all'; label: string; dot: string }[] = [
  { id: 'all', label: 'Все', dot: 'conic-gradient(#ffc933, #ff7eb6, #fbf8f1, #ff5b2e, #c9b6ff, #ffc933)' },
  { id: 'yellow', label: 'Солнечные', dot: '#ffc933' },
  { id: 'pink', label: 'Розовые', dot: '#ff7eb6' },
  { id: 'white', label: 'Белые', dot: '#fbf8f1' },
  { id: 'red', label: 'Огненные', dot: '#ff5b2e' },
  { id: 'mix', label: 'Микс', dot: 'linear-gradient(135deg,#c9b6ff,#bfe0ff)' },
]

export type Bouquet = {
  id: string
  name: string
  about: string
  price: number
  tone: Tone
  moods: Mood[]
  who: Who[]
  photo: PhotoName
  sticker: FlowerName
  stems: number
}

export const bouquets: Bouquet[] = [
  { id: 'sun', name: 'Солнцестояние', about: 'подсолнухи, рудбекия, колоски', price: 3900, tone: 'yellow', moods: ['joy', 'wow'], who: ['friend', 'him', 'me'], photo: 'sunflower-bucket', sticker: 'sunflower', stems: 15 },
  { id: 'picnic', name: 'Пикник', about: 'ромашки, ромашки и ещё раз ромашки', price: 2400, tone: 'white', moods: ['joy', 'calm'], who: ['friend', 'me', 'mom'], photo: 'daisy-bunch', sticker: 'daisy', stems: 25 },
  { id: 'cosmos', name: 'Космея', about: 'космея, анемоны, лаванда', price: 4600, tone: 'pink', moods: ['love', 'calm'], who: ['her', 'mom'], photo: 'cosmos-glass', sticker: 'cosmos', stems: 19 },
  { id: 'fire', name: 'Жара', about: 'маки, герберы, рыжие ранункулюсы', price: 5200, tone: 'red', moods: ['wow', 'love'], who: ['her', 'friend'], photo: 'poppies-field', sticker: 'poppies', stems: 21 },
  { id: 'market', name: 'Рынок', about: 'всё самое свежее сегодня — на вкус флориста', price: 4200, tone: 'mix', moods: ['joy', 'wow'], who: ['friend', 'me', 'him'], photo: 'bouquets-table', sticker: 'bouquet-hand', stems: 23 },
  { id: 'snap', name: 'Львиный зев', about: 'антирринум, эвкалипт, газетная упаковка', price: 3600, tone: 'pink', moods: ['calm', 'joy'], who: ['mom', 'her'], photo: 'snapdragons-news', sticker: 'gerbera-pink', stems: 17 },
  { id: 'tulip', name: 'Красные тюльпаны', about: '25 тюльпанов сорта Red Power', price: 3300, tone: 'red', moods: ['love'], who: ['her', 'mom'], photo: 'red-tulips', sticker: 'tulips', stems: 25 },
  { id: 'dusk', name: 'Сумерки', about: 'бордовые георгины, сухоцветы, ягоды', price: 6100, tone: 'mix', moods: ['wow', 'calm'], who: ['her', 'him'], photo: 'red-dahlias', sticker: 'gerbera-red', stems: 13 },
  { id: 'honey', name: 'Мёд', about: 'подсолнухи в стеклянной вазе', price: 4800, tone: 'yellow', moods: ['joy', 'calm'], who: ['mom', 'me', 'him'], photo: 'sunflower-vase-dark', sticker: 'sunflower-vase', stems: 9 },
  { id: 'blush', name: 'Румянец', about: 'пионовидные розы и ранункулюсы', price: 5600, tone: 'pink', moods: ['love', 'calm'], who: ['her', 'mom'], photo: 'rose-table', sticker: 'ranunculus', stems: 17 },
  { id: 'mint', name: 'Мята', about: 'нарциссы и белая ветка в мятной вазе', price: 3100, tone: 'white', moods: ['calm'], who: ['me', 'friend', 'mom'], photo: 'daffodils-mint', sticker: 'jug', stems: 11 },
  { id: 'straw', name: 'Гербарий', about: 'гелихризум и сухоцветы — стоит год', price: 3800, tone: 'mix', moods: ['calm', 'wow'], who: ['him', 'me', 'friend'], photo: 'strawflowers', sticker: 'droopy', stems: 31 },
]

export const formatPrice = (n: number) => n.toLocaleString('ru-RU').replace(/,/g, ' ') + ' ₽'

/** Что цветёт по месяцам — для сезонного круга */
export const seasons: { month: string; short: string; flowers: string[]; hero: FlowerName; color: string }[] = [
  { month: 'Январь', short: 'янв', flowers: ['амариллис', 'гиацинт', 'хризантема'], hero: 'anemone', color: '#bfe0ff' },
  { month: 'Февраль', short: 'фев', flowers: ['тюльпан', 'анемон', 'мимоза'], hero: 'tulips', color: '#ff7eb6' },
  { month: 'Март', short: 'мар', flowers: ['тюльпан', 'нарцисс', 'мимоза'], hero: 'tulips', color: '#ffc933' },
  { month: 'Апрель', short: 'апр', flowers: ['ранункулюс', 'гиацинт', 'сирень'], hero: 'ranunculus', color: '#c9b6ff' },
  { month: 'Май', short: 'май', flowers: ['пион', 'сирень', 'люпин'], hero: 'lupine', color: '#c9b6ff' },
  { month: 'Июнь', short: 'июн', flowers: ['пион', 'мак', 'ромашка'], hero: 'poppies', color: '#ff5b2e' },
  { month: 'Июль', short: 'июл', flowers: ['подсолнух', 'космея', 'ромашка'], hero: 'sunflower', color: '#ffc933' },
  { month: 'Август', short: 'авг', flowers: ['подсолнух', 'георгин', 'рудбекия'], hero: 'rudbeckia', color: '#f5a623' },
  { month: 'Сентябрь', short: 'сен', flowers: ['георгин', 'астра', 'гербера'], hero: 'gerbera-red', color: '#ff5b2e' },
  { month: 'Октябрь', short: 'окт', flowers: ['хризантема', 'сухоцветы', 'гербера'], hero: 'droopy', color: '#f5a623' },
  { month: 'Ноябрь', short: 'ноя', flowers: ['гербера', 'эустома', 'хлопок'], hero: 'gerbera-pink', color: '#ff7eb6' },
  { month: 'Декабрь', short: 'дек', flowers: ['амариллис', 'ель', 'хлопок'], hero: 'blue-bottle', color: '#bfe0ff' },
]
