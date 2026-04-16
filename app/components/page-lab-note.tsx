'use client'

import { buttonVariants } from 'fumadocs-ui/components/ui/button'
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'

type LabNoteEntry = {
  id: string
  order: number
  children: ReactNode
}

type LabNoteContextValue = {
  entries: LabNoteEntry[]
  open: boolean
  setOpen: (value: boolean) => void
  upsertEntry: (entry: LabNoteEntry) => void
  removeEntry: (id: string) => void
}

type LabNoteProviderProps = { children: ReactNode }

type LabNoteProps = {
  children: ReactNode
}

const LabNoteContext = createContext<LabNoteContextValue | null>(null)

let nextLabNoteOrder = 0

function cn(...values: Array<string | undefined | false>) {
  return values.filter(Boolean).join(' ')
}

function useLabNoteContext() {
  const value = useContext(LabNoteContext)
  if (!value) {
    throw new Error('LabNote components must be used inside LabNoteProvider.')
  }

  return value
}

function LabNoteModal() {
  const { entries, open, setOpen } = useLabNoteContext()
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return
    setVisible(true)
  }, [open])

  const close = useCallback(() => {
    setVisible(false)
    window.setTimeout(() => setOpen(false), 220)
  }, [setOpen])

  useEffect(() => {
    if (!open) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') close()
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [close, open])

  if (!mounted || !open) return null

  return createPortal(
    <div
      className={cn(
        'lab-note-overlay fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-3 backdrop-blur-[2px] sm:items-center sm:p-4',
        visible ? 'lab-note-overlay-open' : 'lab-note-overlay-closed',
      )}
      onClick={close}
    >
      <div
        className={cn(
          'lab-note-panel flex w-full max-w-3xl flex-col overflow-hidden border border-fd-border bg-fd-background shadow-2xl',
          'min-h-[22rem] max-h-[min(84vh,48rem)] rounded-t-xl sm:min-h-[24rem] sm:rounded-xl',
          visible ? 'lab-note-panel-open' : 'lab-note-panel-closed',
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-fd-border sm:hidden" />
        <div className="flex items-center justify-between border-b border-fd-border px-3 py-3 sm:px-4 sm:py-3">
          <div>
            <p className="text-xs text-fd-muted-foreground">本页实验注记</p>
            <h2 className="text-sm font-semibold text-fd-foreground sm:text-base">
              Lab Note · {entries.length} 项
            </h2>
          </div>
          <button
            type="button"
            className={buttonVariants({
              color: 'ghost',
              size: 'sm',
            })}
            onClick={close}
          >
            关闭
          </button>
        </div>

        <div className="overflow-y-auto px-3 py-3 sm:px-4 sm:py-4">
          <div className="space-y-4 sm:space-y-5">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="prose prose-no-margin max-w-none text-sm leading-6"
              >
                {entry.children}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export function LabNoteProvider({ children }: LabNoteProviderProps) {
  const [entries, setEntries] = useState<LabNoteEntry[]>([])
  const [open, setOpen] = useState(false)

  const upsertEntry = useCallback((entry: LabNoteEntry) => {
    setEntries((prev) => {
      const current = prev.find((item) => item.id === entry.id)
      if (
        current &&
        current.order === entry.order &&
        current.children === entry.children
      ) {
        return prev
      }

      return [...prev.filter((item) => item.id !== entry.id), entry].sort(
        (a, b) => a.order - b.order,
      )
    })
  }, [])

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => {
      const next = prev.filter((item) => item.id !== id)
      return next.length === prev.length ? prev : next
    })
  }, [])

  const value = useMemo<LabNoteContextValue>(
    () => ({
      entries,
      open,
      setOpen,
      upsertEntry,
      removeEntry,
    }),
    [entries, open, removeEntry, upsertEntry],
  )

  return (
    <LabNoteContext.Provider value={value}>
      {children}
      <LabNoteModal />
    </LabNoteContext.Provider>
  )
}

export function LabNoteFloatingButton() {
  const { entries, setOpen } = useLabNoteContext()
  if (entries.length === 0) return null

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6">
      <button
        type="button"
        className={buttonVariants({
          color: 'secondary',
          className:
            'pointer-events-auto h-11 rounded-full border border-fd-border bg-fd-background/95 px-4 shadow-lg backdrop-blur supports-[padding:max(0px)]:mb-[env(safe-area-inset-bottom)]',
        })}
        onClick={() => setOpen(true)}
      >
        <span>Lab Note</span>
        <span className="pl-1.5 text-xs text-fd-muted-foreground">
          {entries.length}
        </span>
      </button>
    </div>
  )
}

export function LabNote({ children }: LabNoteProps) {
  const { upsertEntry, removeEntry } = useLabNoteContext()
  const id = useId()
  const orderRef = useRef(nextLabNoteOrder++)

  useEffect(() => {
    upsertEntry({
      id,
      order: orderRef.current,
      children,
    })

    return () => {
      removeEntry(id)
    }
  }, [children, id, removeEntry, upsertEntry])

  return (
    <section className="lab-note-inline my-4 w-full overflow-hidden rounded-xl border bg-fd-card shadow-sm">
      <div className="not-prose flex items-center border-b border-fd-border px-4 py-2.5">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-fd-muted-foreground">
          Lab Note
        </span>
      </div>
      <div className="lab-note-inline-content prose-no-margin px-4 py-3">
        {children}
      </div>
    </section>
  )
}
