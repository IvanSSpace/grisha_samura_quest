import { useEffect, useState } from 'react'

// Защита от случайного клика: чтобы отметить клинок собранным,
// нужно осознанно подтвердить (две ступени) — мисклик не сработает.
export default function ConfirmModal({ open, questName, onConfirm, onCancel }) {
  const [armed, setArmed] = useState(false)

  useEffect(() => {
    if (!open) setArmed(false)
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-fadein"
      onClick={onCancel}
    >
      <div
        className="frame w-full max-w-md p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-title text-xl gold-text tracking-wide">Подтверди обет</h3>
        <div className="divider my-4" />
        <p className="font-body text-parch/90 leading-relaxed">
          Ты держишь в руках <span className="text-gold">«{questName}»</span>?
          <br />
          Отметить клинок собранным можно лишь однажды — назад пути не будет.
        </p>

        {!armed ? (
          <button
            onClick={() => setArmed(true)}
            className="mt-6 w-full rounded border border-ember/40 bg-ash px-4 py-3 font-title tracking-wide text-gold transition hover:bg-ember/10 hover:shadow-glow"
          >
            Да, клинок у меня
          </button>
        ) : (
          <div className="mt-6 animate-fadein">
            <p className="mb-3 font-body text-sm text-bloodlight">
              Нажми ещё раз, чтобы скрепить обет кровью.
            </p>
            <button
              onClick={onConfirm}
              className="w-full rounded border border-blood bg-blood/20 px-4 py-3 font-title tracking-wide text-bloodlight transition hover:bg-blood/40 hover:shadow-bloodglow"
            >
              Скрепить обет
            </button>
          </div>
        )}

        <button
          onClick={onCancel}
          className="mt-3 w-full rounded px-4 py-2 font-body text-sm text-fog transition hover:text-parch"
        >
          Ещё не время
        </button>
      </div>
    </div>
  )
}
