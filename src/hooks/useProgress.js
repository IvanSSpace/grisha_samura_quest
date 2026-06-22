import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'kojiro-quest-progress-v1'

// Хранит множество id собранных квестов в localStorage.
export function useProgress() {
  const [collected, setCollected] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? new Set(JSON.parse(raw)) : new Set()
    } catch {
      return new Set()
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...collected]))
    } catch {
      /* запись недоступна — игнорируем */
    }
  }, [collected])

  const markCollected = useCallback((id) => {
    setCollected((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }, [])

  const reset = useCallback(() => setCollected(new Set()), [])

  const isCollected = useCallback((id) => collected.has(id), [collected])

  return { collected, markCollected, isCollected, reset }
}
