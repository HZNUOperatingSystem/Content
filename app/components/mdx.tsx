import defaultMdxComponents from 'fumadocs-ui/mdx'
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion'
import {
  CalloutContainer,
  CalloutDescription as FumadocsCalloutDescription,
  CalloutTitle as FumadocsCalloutTitle,
  type CalloutContainerProps,
} from 'fumadocs-ui/components/callout'
import * as TabsComponents from 'fumadocs-ui/components/tabs'
import type { MDXComponents } from 'mdx/types'
import type { ComponentProps, ReactNode } from 'react'
import { LabNote } from './page-lab-note'
import { Spoiler } from './spoiler'

type CalloutProps = {
  title?: ReactNode
} & Omit<CalloutContainerProps, 'title'>

function cn(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(' ')
}

function CalloutTitle(props: ComponentProps<'p'>) {
  return (
    <FumadocsCalloutTitle
      {...props}
      className={cn(
        '[color:var(--tw-prose-body,var(--color-fd-card-foreground))]',
        props.className,
      )}
    />
  )
}

function CalloutDescription(props: ComponentProps<'div'>) {
  return <FumadocsCalloutDescription {...props} />
}

function Callout({ children, title, ...props }: CalloutProps) {
  return (
    <CalloutContainer {...props}>
      {title ? <CalloutTitle>{title}</CalloutTitle> : null}
      <CalloutDescription>{children}</CalloutDescription>
    </CalloutContainer>
  )
}

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Accordion,
    Accordions,
    Callout,
    CalloutContainer,
    CalloutTitle,
    CalloutDescription,
    LabNote,
    Spoiler,
    ...TabsComponents,
    ...components,
  } satisfies MDXComponents
}

export const useMDXComponents = getMDXComponents

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>
}
