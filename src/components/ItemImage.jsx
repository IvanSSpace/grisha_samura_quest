import { useState } from 'react'

// Картинка предмета/метки с изящным плейсхолдером, пока ты не подставил своё фото.
export default function ItemImage({ src, alt, kind = 'предмет', className = '' }) {
  const [failed, setFailed] = useState(false)

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-1 border border-dashed border-ember/30 bg-ash/60 text-center ${className}`}
      >
        <span className="font-title text-2xl text-ember/40">侍</span>
        <span className="px-2 font-body text-xs text-fog">фото · {alt || kind}</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  )
}
