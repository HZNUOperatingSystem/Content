import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type SpoilerProps = {
  children: ReactNode
} & Omit<ComponentPropsWithoutRef<'span'>, 'children'>

export function Spoiler({ children, className, ...props }: SpoilerProps) {
  return (
    <span
      tabIndex={0}
      className={[
        'group box-decoration-clone inline rounded-[0.16em] bg-current px-[0.08em] align-baseline text-inherit transition-colors duration-150 ease-out hover:bg-transparent focus-visible:bg-transparent focus-visible:outline-none',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      <span className="text-transparent transition-colors duration-150 ease-out group-hover:text-inherit group-focus-visible:text-inherit">
        {children}
      </span>
    </span>
  )
}
