import SamuraiDialogue from './SamuraiDialogue'
import ItemImage from './ItemImage'
import { finalReward, samurai } from '../data/quests'

// Финал: все катаны собраны — самурай открывает последний дар (спящий дракон).
export default function FinalReward() {
  return (
    <article className="animate-fadein space-y-6">
      <div className="frame p-6 text-center">
        <p className="font-title text-xs tracking-[0.4em] text-ember/80">ПУТЬ ЗАВЕРШЁН</p>
        <h1 className="mt-2 font-title text-4xl gold-text">Последний дар</h1>
        <div className="divider mx-auto my-4 max-w-xs" />
        <p className="font-body italic text-fog">
          Все клинки Страны тростника вновь обрели хозяина.
        </p>
      </div>

      <SamuraiDialogue lines={samurai.allCollected} compact />

      <div className="frame overflow-hidden">
        <div className="flex flex-col gap-5 p-6 md:flex-row">
          <ItemImage
            src={finalReward.image}
            alt={finalReward.name}
            kind="спящий дракон"
            className="h-48 w-full rounded object-cover md:w-56"
          />
          <div className="flex-1">
            <h2 className="font-title text-2xl gold-text">{finalReward.name}</h2>
            <div className="divider my-3" />
            <div className="space-y-2">
              {finalReward.dialogue.map((d, i) => (
                <p key={i} className="font-body leading-relaxed text-parch/90">
                  {d}
                </p>
              ))}
            </div>
            <p className="mt-4 border-l-2 border-blood/50 pl-3 font-body text-sm text-bloodlight/90">
              {finalReward.howTo}
            </p>
          </div>
        </div>
        <div className="border-t border-ember/20 bg-ash/60 p-4">
          <ItemImage
            src={finalReward.mapImage}
            alt="Карта · спящий дракон"
            kind="метка на карте"
            className="h-44 w-full rounded object-cover"
          />
        </div>
      </div>
    </article>
  )
}
