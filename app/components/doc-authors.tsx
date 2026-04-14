'use client'

import { useEffect, useState } from 'react'
import { buttonVariants } from 'fumadocs-ui/components/ui/button'

type AuthorsValue = string | string[] | undefined

type AuthorChipState = {
  displayName: string
  showAvatar: boolean
}

type GithubUser = {
  name: string | null
}

async function getGithubUser(username: string, signal: AbortSignal) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      signal,
    })
    if (!response.ok) return null

    return (await response.json()) as GithubUser
  } catch {
    return null
  }
}

function preloadImage(src: string) {
  return new Promise<boolean>((resolve) => {
    const image = new Image()

    image.onload = () => resolve(true)
    image.onerror = () => resolve(false)
    image.src = src
  })
}

async function getAuthorChipState(
  username: string,
  avatarSrc: string,
  signal: AbortSignal,
): Promise<AuthorChipState> {
  const [user, showAvatar] = await Promise.all([
    getGithubUser(username, signal),
    preloadImage(avatarSrc),
  ])

  return {
    displayName: user?.name?.trim() || username,
    showAvatar,
  }
}

function AuthorChip({ username }: { username: string }) {
  const avatarSrc = `https://github.com/${username}.png?size=40`
  const [author, setAuthor] = useState<AuthorChipState>()

  useEffect(() => {
    const controller = new AbortController()
    let stale = false

    async function loadAuthor() {
      const nextAuthor = await getAuthorChipState(
        username,
        avatarSrc,
        controller.signal,
      )

      if (!stale) setAuthor(nextAuthor)
    }

    setAuthor(undefined)
    void loadAuthor()

    return () => {
      stale = true
      controller.abort()
    }
  }, [avatarSrc, username])

  if (!author) return null

  return (
    <span
      className={buttonVariants({
        color: 'secondary',
        size: 'sm',
        className: 'overflow-hidden',
      })}
    >
      {author.showAvatar ? (
        <img
          src={avatarSrc}
          alt={`${username} avatar`}
          className="me-2 size-3.5 shrink-0 rounded-full"
          loading="lazy"
          decoding="async"
          width={14}
          height={14}
        />
      ) : null}
      <span className="truncate">
        {author.displayName} ({username})
      </span>
    </span>
  )
}

export function DocAuthors({ authors }: { authors: AuthorsValue }) {
  const items = Array.isArray(authors) ? authors : authors ? [authors] : []
  if (items.length === 0) return null

  return (
    <>
      {items.map((username) => (
        <AuthorChip key={username} username={username} />
      ))}
    </>
  )
}
