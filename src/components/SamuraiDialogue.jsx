import { useEffect, useRef, useState } from 'react'
import { samurai } from '../data/quests'
import ItemImage from './ItemImage'

// Диалоговое окно в духе Elden Ring: портрет + построчная подача реплик.
// mapImage + mapFromIndex — карта проявляется прямо в окне, когда самурай
// доходит до рассказа о местоположении.
export default function SamuraiDialogue({
  lines,
  onDone,
  compact = false,
  mapImage,
  mapAlt,
  mapFromIndex = Infinity,
}) {
  const [index, setIndex] = useState(0)
  const [shown, setShown] = useState('')
  const lineRef = useRef(lines)
  const intervalRef = useRef(null)

  // Сброс при смене набора реплик
  useEffect(() => {
    lineRef.current = lines
    setIndex(0)
    setShown('')
  }, [lines])

  // Печатающая анимация текущей строки
  useEffect(() => {
    const full = lines[index] ?? ''
    setShown('')
    let i = 0
    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      i += 1
      setShown(full.slice(0, i))
      if (i >= full.length) clearInterval(intervalRef.current)
    }, 18)
    return () => clearInterval(intervalRef.current)
  }, [index, lines])

  const last = index >= lines.length - 1
  const full = lines[index] ?? ''
  const typing = shown.length < full.length
  const mapVisible = mapImage && index >= mapFromIndex

  // Мгновенно дописать строку: ОБЯЗАТЕЛЬНО гасим таймер, иначе он снова
  // перезапишет текст куском и анимация «дёрнется».
  function completeLine() {
    clearInterval(intervalRef.current)
    setShown(full)
  }

  function advance() {
    if (typing) {
      completeLine()
      return
    }
    if (last) {
      onDone?.()
    } else {
      setIndex((v) => v + 1)
    }
  }

  return (
    <div
      className={`frame ${compact ? 'p-4' : 'p-5 md:p-6'} animate-fadein ${
        typing ? 'cursor-pointer' : ''
      }`}
      onClick={() => {
        if (typing) completeLine() // клик по любому месту окна допечатывает текст
      }}
    >
      <div className="flex items-start gap-4">
        <div className="shrink-0">
          <div className="relative h-16 w-16 md:h-20 md:w-20 overflow-hidden rounded-full border border-ember/40 shadow-glow">
            <img
              src={samurai.portrait}
              alt={samurai.name}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                e.currentTarget.parentElement.classList.add('bg-ash')
              }}
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center font-title text-2xl text-ember/30">
              侍
            </div>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="font-title text-sm tracking-widest text-ember/90">
            {samurai.name.toUpperCase()}
          </div>
          <div className="mb-2 font-body text-xs italic text-fog">{samurai.title}</div>
          {/* Призрак полной строки резервирует высоту — текст не скачет при печати */}
          <div
            className={`relative ${
              mapVisible ? 'min-h-[5rem]' : 'h-[18rem]'
            } select-none font-body text-lg leading-relaxed ${
              typing ? 'cursor-pointer' : 'cursor-default'
            }`}
            onClick={() => {
              if (typing) completeLine() // клик по тексту только дописывает строку
            }}
          >
            <p className="invisible" aria-hidden="true">
              {full}
              <span className="ml-0.5 inline-block">▍</span>
            </p>
            <p className="absolute inset-0 text-parch">
              {shown}
              <span className="ml-0.5 inline-block animate-flicker text-ember">▍</span>
            </p>
          </div>
        </div>
      </div>

      {mapImage && index >= mapFromIndex && (
        <div className="mt-4 animate-fadein">
          <div className="mb-1 font-title text-xs tracking-widest text-ember/80">
            ◆ МЕТКА НА КАРТЕ
          </div>
          <ItemImage
            src={mapImage}
            alt={mapAlt || 'Карта'}
            kind="метка на карте"
            className="h-56 w-full rounded border border-ember/20 object-cover md:h-72"
          />
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <div className="flex gap-1.5">
          {lines.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full ${
                i <= index ? 'bg-ember' : 'bg-ember/20'
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => {
            if (typing) return // кнопка неактивна, пока строка не допечаталась
            advance()
          }}
          aria-disabled={typing}
          className={`rounded border border-ember/30 px-4 py-1.5 font-title text-sm tracking-wide text-gold transition hover:bg-ember/10 ${
            typing ? 'cursor-default' : ''
          }`}
        >
          {last ? 'Принять ◆' : 'Дальше ▸'}
        </button>
      </div>
    </div>
  )
}
