'use client'

import { useEffect, useState } from 'react'

type AuthorsValue = string | string[] | undefined

type GithubUser = {
  name: string | null
}

type GithubUserCardState = {
  displayName: string
  showAvatar: boolean
}

const userCache = new Map<string, Promise<GithubUser | null>>()
const avatarCache = new Map<string, Promise<boolean>>()

async function getGithubUser(username: string, signal: AbortSignal) {
  const cached = userCache.get(username)
  if (cached) return cached

  const promise = fetch(`https://api.github.com/users/${username}`, {
    signal,
  })
    .then(async (response) => {
      if (!response.ok) return null
      return (await response.json()) as GithubUser
    })
    .catch(() => null)

  userCache.set(username, promise)
  return promise
}

function preloadAvatar(src: string) {
  const cached = avatarCache.get(src)
  if (cached) return cached

  const promise = new Promise<boolean>((resolve) => {
    const image = new Image()

    image.onload = () => resolve(true)
    image.onerror = () => resolve(false)
    image.src = src
  })

  avatarCache.set(src, promise)
  return promise
}

async function getGithubUserCardState(
  username: string,
  avatarSrc: string,
  signal: AbortSignal,
): Promise<GithubUserCardState> {
  const [user, showAvatar] = await Promise.all([
    getGithubUser(username, signal),
    preloadAvatar(avatarSrc),
  ])

  return {
    displayName: user?.name?.trim() || username,
    showAvatar,
  }
}

function GithubUserCardSkeleton() {
  return (
    <div className="h-16 min-w-[11rem] rounded-xl border border-fd-border bg-fd-card/65 px-3 py-3 shadow-sm">
      <div className="flex h-full items-center gap-3">
        <div className="size-10 shrink-0 animate-pulse rounded-full bg-fd-accent" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-3.5 w-24 animate-pulse rounded-full bg-fd-accent" />
          <div className="h-3 w-20 animate-pulse rounded-full bg-fd-accent/80" />
        </div>
      </div>
    </div>
  )
}

function GithubUserCard({ username }: { username: string }) {
  const avatarSrc = `https://github.com/${username}.png?size=80`
  const [user, setUser] = useState<GithubUserCardState>()

  useEffect(() => {
    const controller = new AbortController()
    let stale = false

    async function loadUser() {
      const nextUser = await getGithubUserCardState(
        username,
        avatarSrc,
        controller.signal,
      )

      if (!stale) setUser(nextUser)
    }

    setUser(undefined)
    void loadUser()

    return () => {
      stale = true
      controller.abort()
    }
  }, [avatarSrc, username])

  if (!user) return <GithubUserCardSkeleton />

  return (
    <a
      href={`https://github.com/${username}`}
      target="_blank"
      rel="noreferrer"
      className="group block h-16 min-w-[11rem] rounded-xl border border-fd-border bg-fd-card px-3 py-3 shadow-sm transition-all duration-200 hover:border-fd-primary/35 hover:bg-fd-card/90 hover:shadow-md"
    >
      <div className="flex h-full items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-fd-accent">
          {user.showAvatar ? (
            <img
              src={avatarSrc}
              alt={`${username} avatar`}
              className="size-full object-cover"
              loading="lazy"
              decoding="async"
              width={40}
              height={40}
            />
          ) : (
            <span className="text-sm font-semibold text-fd-muted-foreground">
              {username.slice(0, 1).toUpperCase()}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-fd-foreground transition-colors group-hover:text-fd-primary">
            {user.displayName}
          </p>
          <p className="truncate text-xs text-fd-muted-foreground">
            @{username}
          </p>
        </div>
      </div>
    </a>
  )
}

export function DocAuthors({ authors }: { authors: AuthorsValue }) {
  const items = Array.isArray(authors) ? authors : authors ? [authors] : []
  if (items.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((username) => (
        <GithubUserCard key={username} username={username} />
      ))}
    </div>
  )
}
