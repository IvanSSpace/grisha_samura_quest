import { useEffect, useMemo, useState } from 'react'
import { quests, samurai } from './data/quests'
import { useProgress } from './hooks/useProgress'
import ProgressTrail from './components/ProgressTrail'
import QuestPanel from './components/QuestPanel'
import SamuraiDialogue from './components/SamuraiDialogue'
import ConfirmModal from './components/ConfirmModal'
import FinalReward from './components/FinalReward'

const INTRO_KEY = 'kojiro-intro-seen-v1'
const BRIEFED_KEY = 'kojiro-briefed-v1'

export default function App() {
  const { isCollected, markCollected, reset, collected } = useProgress()

  const [showIntro, setShowIntro] = useState(() => !localStorage.getItem(INTRO_KEY))
  const [modalOpen, setModalOpen] = useState(false)
  const [justCollected, setJustCollected] = useState(null) // quest, чью реакцию показываем
  const [selected, setSelected] = useState(null) // ручной выбор в тропе

  // Какие квесты уже «отбрифованы» — самурай рассказал о них в диалоге.
  const [briefed, setBriefed] = useState(() => {
    try {
      const raw = localStorage.getItem(BRIEFED_KEY)
      return raw ? new Set(JSON.parse(raw)) : new Set()
    } catch {
      return new Set()
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(BRIEFED_KEY, JSON.stringify([...briefed]))
    } catch {
      /* ignore */
    }
  }, [briefed])
  const markBriefed = (id) => setBriefed((p) => (p.has(id) ? p : new Set(p).add(id)))
  const isBriefed = (id) => briefed.has(id)

  // Индекс активного квеста: первый несобранный
  const activeIndex = useMemo(() => {
    const idx = quests.findIndex((q) => !isCollected(q.id))
    return idx === -1 ? quests.length : idx
  }, [collected, isCollected])

  const allDone = activeIndex === quests.length

  // Что показываем в панели: выбранное вручную (если допустимо) или активное
  const viewIndex = selected != null && selected <= activeIndex ? selected : activeIndex

  // Сброс ручного выбора при продвижении
  useEffect(() => {
    setSelected(null)
  }, [activeIndex])

  function handleConfirm() {
    const q = quests[activeIndex]
    setModalOpen(false)
    markCollected(q.id)
    setJustCollected(q) // показать реакцию мастера
  }

  function dismissIntro() {
    localStorage.setItem(INTRO_KEY, '1')
    setShowIntro(false)
  }

  const viewedQuest = viewIndex < quests.length ? quests[viewIndex] : null
  const viewedDone = viewedQuest ? isCollected(viewedQuest.id) : false

  // Брифинг-оверлей активен, пока текущий квест не отбрифован
  const briefingOpen =
    !allDone && viewedQuest && !(viewedDone || isBriefed(viewedQuest.id))

  // Блокируем прокрутку фона, когда открыт любой модальный оверлей
  const anyOverlay = showIntro || !!justCollected || modalOpen || briefingOpen
  useEffect(() => {
    document.body.style.overflow = anyOverlay ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [anyOverlay])

  return (
    <div className="min-h-screen">
      {/* Шапка */}
      <header className="border-b border-ember/20 bg-ink/70 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="font-title text-xl tracking-wide gold-text md:text-2xl">
              Путь клинка
            </h1>
            <p className="font-body text-xs italic text-fog">
              Квест мастера Кодзиро · клинки Страны тростника
            </p>
          </div>
          <button
            onClick={() => {
              if (confirm('Забыть весь путь и начать заново?')) {
                reset()
                setSelected(null)
                setJustCollected(null)
                setBriefed(new Set())
                localStorage.removeItem(BRIEFED_KEY)
                localStorage.removeItem(INTRO_KEY)
                setShowIntro(true)
              }
            }}
            className="rounded border border-fog/30 px-3 py-1.5 font-body text-xs text-fog transition hover:border-blood/60 hover:text-bloodlight"
          >
            Начать заново
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-[280px_1fr]">
        <aside className="md:sticky md:top-6 md:self-start">
          <ProgressTrail
            quests={quests}
            activeIndex={activeIndex}
            isCollected={isCollected}
            onSelect={(i) => setSelected(i)}
          />
        </aside>

        <section className="min-w-0">
          {allDone ? (
            <FinalReward />
          ) : (
            <QuestPanel
              key={viewedQuest.id}
              quest={viewedQuest}
              done={viewedDone}
              briefed={viewedDone || isBriefed(viewedQuest.id)}
              onBriefed={() => markBriefed(viewedQuest.id)}
              onCollectClick={() => setModalOpen(true)}
            />
          )}
        </section>
      </main>

      <footer className="border-t border-ember/10 py-6 text-center font-body text-xs text-fog/70">
        侍 Да признает сталь твою руку, Погасший.
      </footer>

      {/* Вступление */}
      {showIntro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/85 p-4">
          <div className="w-full max-w-2xl">
            <SamuraiDialogue lines={samurai.intro} onDone={dismissIntro} />
          </div>
        </div>
      )}

      {/* Реакция мастера на собранный клинок */}
      {justCollected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/85 p-4">
          <div className="w-full max-w-2xl">
            <SamuraiDialogue
              lines={justCollected.completeDialogue}
              onDone={() => setJustCollected(null)}
            />
          </div>
        </div>
      )}

      {/* Подтверждение сбора (защита от мисклика) */}
      <ConfirmModal
        open={modalOpen}
        questName={quests[activeIndex]?.name}
        onConfirm={handleConfirm}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  )
}
