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

type LabTodoEntry = {
  id: string
  order: number
  title?: ReactNode
  children: ReactNode
}

type LabTodoContextValue = {
  entries: LabTodoEntry[]
  open: boolean
  setOpen: (value: boolean) => void
  upsertEntry: (entry: LabTodoEntry) => void
  removeEntry: (id: string) => void
}

type LabTodoProviderProps = {
  pageKey: string
  children: ReactNode
}

type LabTodoProps = {
  title?: ReactNode
  children: ReactNode
}

const LabTodoContext = createContext<LabTodoContextValue | null>(null)

let nextLabTodoOrder = 0

function cn(...values: Array<string | undefined | false>) {
  return values.filter(Boolean).join(' ')
}

function useLabTodoContext() {
  const value = useContext(LabTodoContext)
  if (!value) {
    throw new Error('LabTodo components must be used inside LabTodoProvider.')
  }

  return value
}

function LabTodoModal() {
  const { entries, open, setOpen } = useLabTodoContext()
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
        'lab-todo-overlay fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-3 backdrop-blur-[2px] sm:items-center sm:p-4',
        visible ? 'lab-todo-overlay-open' : 'lab-todo-overlay-closed',
      )}
      onClick={close}
    >
      <div
        className={cn(
          'lab-todo-panel flex w-full max-w-3xl flex-col overflow-hidden border border-fd-border bg-fd-background shadow-2xl',
          'max-h-[min(82vh,52rem)] rounded-t-[1.4rem] sm:rounded-2xl',
          visible ? 'lab-todo-panel-open' : 'lab-todo-panel-closed',
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-fd-border sm:hidden" />
        <div className="flex items-center justify-between border-b border-fd-border px-4 py-4 sm:px-5">
          <div>
            <p className="text-sm text-fd-muted-foreground">本页实验任务</p>
            <h2 className="text-base font-semibold text-fd-foreground sm:text-lg">
              Lab Todo · {entries.length} 项
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

        <div className="overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
          <div className="space-y-3 sm:space-y-4">
            {entries.map((entry, index) => (
              <section
                key={entry.id}
                className="rounded-xl border border-fd-border bg-fd-card p-3 sm:p-4"
              >
                {entry.title ? (
                  <h3 className="mb-2 text-sm font-medium text-fd-foreground">
                    {entry.title}
                  </h3>
                ) : (
                  <p className="mb-2 text-sm font-medium text-fd-muted-foreground">
                    Lab Todo {index + 1}
                  </p>
                )}
                <div className="prose prose-no-margin max-w-none text-sm leading-7">
                  {entry.children}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export function CollectProvider({ pageKey, children }: LabTodoProviderProps) {
  const [entries, setEntries] = useState<LabTodoEntry[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setEntries([])
    setOpen(false)
  }, [pageKey])

  const value = useMemo<LabTodoContextValue>(
    () => ({
      entries,
      open,
      setOpen,
      upsertEntry(entry) {
        setEntries((prev) =>
          [...prev.filter((item) => item.id !== entry.id), entry].sort(
            (a, b) => a.order - b.order,
          ),
        )
      },
      removeEntry(id) {
        setEntries((prev) => prev.filter((item) => item.id !== id))
      },
    }),
    [entries, open],
  )

  return (
    <LabTodoContext.Provider value={value}>
      {children}
      <LabTodoModal />
    </LabTodoContext.Provider>
  )
}

export function CollectFloatingButton() {
  const { entries, setOpen } = useLabTodoContext()
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
        <span>Lab Todo</span>
        <span className="text-xs text-fd-muted-foreground">
          {entries.length}
        </span>
      </button>
    </div>
  )
}

export function LabTodo({ title, children }: LabTodoProps) {
  const { upsertEntry, removeEntry } = useLabTodoContext()
  const id = useId()
  const orderRef = useRef(nextLabTodoOrder++)

  useEffect(() => {
    upsertEntry({
      id,
      order: orderRef.current,
      title,
      children,
    })

    return () => {
      removeEntry(id)
    }
  }, [children, id, removeEntry, title, upsertEntry])

  return (
    <section className="not-prose my-4 rounded-xl border border-fd-border bg-fd-card shadow-sm">
      <div className="flex items-center gap-2 border-b border-fd-border px-4 py-2.5">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-fd-muted-foreground">
          Lab Todo
        </span>
        {title ? (
          <span className="truncate text-sm font-medium text-fd-foreground">
            {title}
          </span>
        ) : null}
      </div>
      <div className="prose prose-no-margin max-w-none px-4 py-3 text-sm leading-7 text-fd-card-foreground">
        {children}
      </div>
    </section>
  )
}

export function Collect(props: LabTodoProps) {
  return <LabTodo {...props} />
}
