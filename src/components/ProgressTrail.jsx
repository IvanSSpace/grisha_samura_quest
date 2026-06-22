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
                  {done ? (
                    '✦'
                  ) : locked ? (
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                      <path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm3 8H9V7a3 3 0 0 1 6 0v3Zm-3 5a1.5 1.5 0 0 1 .75 2.8V19a.75.75 0 0 1-1.5 0v-1.2A1.5 1.5 0 0 1 12 15Z" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={`block truncate font-body text-sm ${
                      done ? 'text-bloodlight/90' : active ? 'text-gold' : 'text-parch'
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
