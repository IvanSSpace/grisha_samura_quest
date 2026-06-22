import { useEffect, useState } from 'react'
import ItemImage from './ItemImage'

// Всплывающее окно в момент сбора: клинок проявляется из чёрного силуэта в цвет.
export default function CollectReveal({ quest, onDone }) {
  const [lit, setLit] = useState(false)

  useEffect(() => {
    if (!quest) return
    setLit(false)
    const t = setTimeout(() => setLit(true), 400) // дать окну влететь, затем проявить клинок
    return () => clearTimeout(t)
  }, [quest])

  if (!quest) return null
  const isArmor = quest.type === 'armor'

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/85 p-4">
      <div className="frame animate-popin w-full max-w-md p-6 text-center">
        <p className="font-title text-xs tracking-[0.3em] text-ember/80">
          {isArmor ? 'ОБЛАЧЕНИЕ ОБРЕТЕНО' : 'КЛИНОК ОБРЕТЁН'}
        </p>

        <div className="relative mx-auto mt-5 h-56 w-56">
          <ItemImage
            src={quest.image}
            alt={quest.name}
            kind={isArmor ? 'комплект' : 'катана'}
            className={`relative h-full w-full object-contain transition-all duration-[1400ms] ease-out ${
              lit
                ? 'scale-100 brightness-100 contrast-100'
                : 'scale-90 brightness-0 contrast-200'
            }`}
          />
        </div>

        <h2 className="mt-5 font-title text-2xl gold-text">{quest.name}</h2>
        <p className="font-body text-sm italic text-fog">{quest.nameEn}</p>

        <button
          onClick={onDone}
          className="mt-6 rounded border border-ember/50 bg-ash px-7 py-2.5 font-title tracking-wide text-gold transition hover:shadow-glow"
        >
          ⟡ Принять
        </button>
      </div>
    </div>
  )
}
