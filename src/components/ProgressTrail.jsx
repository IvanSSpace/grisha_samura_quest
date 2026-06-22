// Боковая «тропа клинков» — список квестов со статусами.
export default function ProgressTrail({ quests, activeIndex, isCollected, onSelect }) {
  return (
    <nav className="frame p-4">
      <h2 className="mb-1 font-title text-sm tracking-widest text-ember/90">ТРОПА КЛИНКОВ</h2>
      <p className="mb-4 font-body text-xs italic text-fog">
        Собрано: {quests.filter((q) => isCollected(q.id)).length} / {quests.length}
      </p>
      <ol className="space-y-1">
        {quests.map((q, i) => {
          const done = isCollected(q.id)
          const active = i === activeIndex && !done
          const locked = i > activeIndex && !done
          return (
            <li key={q.id}>
              <button
                disabled={locked}
                onClick={() => onSelect(i)}
                className={`flex w-full items-center gap-3 rounded px-3 py-2 text-left transition ${
                  active
                    ? 'border border-ember/40 bg-ember/10 shadow-glow'
                    : locked
                      ? 'cursor-not-allowed opacity-40'
                      : 'hover:bg-ember/5'
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs ${
                    done
                      ? 'border-blood bg-blood/20 text-bloodlight'
                      : active
                        ? 'border-ember text-ember'
                        : 'border-fog/40 text-fog'
                  }`}
                >
                  {done ? '✦' : locked ? '🔒' : i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={`block truncate font-body text-sm ${
                      done ? 'text-bloodlight/90 line-through' : active ? 'text-gold' : 'text-parch'
                    }`}
                  >
                    {locked ? '? ? ?' : q.name}
                  </span>
                  <span className="block truncate font-body text-[11px] text-fog">
                    {q.type === 'armor' ? 'облачение' : locked ? 'запечатано' : 'катана'}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
