import SamuraiDialogue from './SamuraiDialogue'
import ItemImage from './ItemImage'

// Главная панель квеста.
// Сначала самурай в диалоге зачитывает ВСЮ информацию по пунктам (брифинг),
// затем открываются карточки, которые остаются на экране.
export default function QuestPanel({ quest, done, briefed, onBriefed, onCollectClick }) {
  const isArmor = quest.type === 'armor'

  // Реплики брифинга: завязка → лор → навык/части → местоположение по пунктам.
  const briefingLines = [
    ...quest.giverDialogue,
    isArmor
      ? `Облачение собирается из частей: ${quest.parts.join(', ')}.`
      : `Навык клинка — «${quest.skill.name}». ${quest.skill.text}`,
    quest.note ? quest.note : null,
    'Теперь запомни, где искать. Слушай внимательно:',
    ...quest.location,
    isArmor
      ? 'Собери всё это — и предстань предо мной достойным воином.'
      : 'Ступай за клинком. А когда он будет в твоих руках — отметь это здесь.',
  ].filter(Boolean)

  return (
    <article className="animate-fadein space-y-6">
      {/* Заголовок предмета — виден всегда */}
      <header className="frame overflow-hidden">
        <div className="flex flex-col gap-5 p-5 md:flex-row md:p-6">
          <ItemImage
            src={quest.image}
            alt={quest.name}
            kind={isArmor ? 'комплект' : 'катана'}
            className="h-40 w-full rounded object-contain md:h-44 md:w-44"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 font-title text-xs tracking-[0.3em] text-ember/80">
              {isArmor ? 'ОБЛАЧЕНИЕ' : 'КАТАНА'}
              {done && (
                <span className="rounded-full border border-blood px-2 py-0.5 text-[10px] text-bloodlight">
                  ✦ собрано
                </span>
              )}
            </div>
            <h1 className="mt-1 font-title text-3xl gold-text md:text-4xl">{quest.name}</h1>
            <p className="font-body text-sm italic text-fog">{quest.nameEn}</p>
            {briefed && (
              <>
                <div className="divider my-4" />
                <p className="font-body text-base leading-relaxed text-parch/90">{quest.lore}</p>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ЭТАП 1 — брифинг: самурай рассказывает всё по пунктам */}
      {!briefed ? (
        <>
          <SamuraiDialogue lines={briefingLines} onDone={onBriefed} />
          <p className="text-center font-body text-xs italic text-fog">
            Выслушай мастера до конца — затем перед тобой раскроются свитки с подробностями.
          </p>
        </>
      ) : (
        /* ЭТАП 2 — карточки со всей информацией остаются на экране */
        <>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Навык / части комплекта */}
            <section className="frame p-5">
              {quest.skill ? (
                <>
                  <h3 className="font-title text-sm tracking-widest text-ember/90">
                    НАВЫК · {quest.skill.name}
                  </h3>
                  <div className="divider my-3" />
                  <p className="font-body leading-relaxed text-parch/90">{quest.skill.text}</p>
                </>
              ) : (
                <>
                  <h3 className="font-title text-sm tracking-widest text-ember/90">
                    ЧАСТИ КОМПЛЕКТА
                  </h3>
                  <div className="divider my-3" />
                  <ul className="space-y-2">
                    {quest.parts?.map((p) => (
                      <li key={p} className="flex items-center gap-2 font-body text-parch/90">
                        <span className="text-ember">◆</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {quest.note && (
                <p className="mt-4 border-l-2 border-blood/50 pl-3 font-body text-sm italic text-bloodlight/80">
                  {quest.note}
                </p>
              )}
            </section>

            {/* Местонахождение + метка на карте */}
            <section className="frame p-5">
              <h3 className="font-title text-sm tracking-widest text-ember/90">МЕСТОНАХОЖДЕНИЕ</h3>
              <div className="divider my-3" />
              <ul className="space-y-1.5">
                {quest.location.map((l, i) => (
                  <li key={i} className="font-body leading-relaxed text-parch/90">
                    {l}
                  </li>
                ))}
              </ul>
              <ItemImage
                src={quest.mapImage}
                alt={`Карта · ${quest.name}`}
                kind="метка на карте"
                className="mt-4 h-44 w-full rounded object-cover"
              />
            </section>
          </div>

          {/* Действие: отметить собранным */}
          {!done && (
            <div className="flex flex-col items-center gap-2 pt-2">
              <button
                onClick={onCollectClick}
                className="group relative overflow-hidden rounded border border-ember/50 bg-ash px-8 py-4 font-title text-lg tracking-wide text-gold transition hover:shadow-glow"
              >
                <span className="relative z-10">⟡ Я забрал этот клинок</span>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ember/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </button>
              <p className="font-body text-xs italic text-fog">
                Следующий квест откроется лишь когда клинок будет у тебя.
              </p>
            </div>
          )}
        </>
      )}
    </article>
  )
}
