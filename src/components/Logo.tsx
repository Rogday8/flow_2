import { motion } from 'motion/react'

/** Знак ПОЛЯ: ромашка-солнце из 12 лучей с томатной серединой */
export function Daisy({ className = 'h-9 w-9', petal = '#ffc933', core = '#ff5b2e', spin = true }: { className?: string; petal?: string; core?: string; spin?: boolean }) {
  return (
    <svg viewBox="-32 -32 64 64" className={className} aria-hidden>
      <g className={spin ? 'animate-spin-slow' : undefined} style={{ transformOrigin: 'center', transformBox: 'fill-box' }}>
        {Array.from({ length: 12 }, (_, i) => (
          <ellipse key={i} cx="0" cy="-17" rx="4.6" ry="10" fill={petal} transform={`rotate(${i * 30})`} />
        ))}
      </g>
      <circle r="9" fill={core} />
      <circle r="9" fill="url(#daisy-dots)" opacity="0.35" />
      <defs>
        <pattern id="daisy-dots" width="3" height="3" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="0.7" fill="#16261c" />
        </pattern>
      </defs>
    </svg>
  )
}

export function Logo() {
  return (
    <a href="#top" className="group flex items-center gap-2.5" aria-label="ПОЛЕ — на главную">
      <motion.span whileHover={{ scale: 1.15, rotate: 90 }} transition={{ type: 'spring', stiffness: 300, damping: 12 }}>
        <Daisy className="h-9 w-9" />
      </motion.span>
      <span className="font-display text-2xl font-black tracking-tight">ПОЛЕ</span>
      <span className="hidden font-hand text-xl leading-none text-moss/70 sm:block">цветочная лавка</span>
    </a>
  )
}
