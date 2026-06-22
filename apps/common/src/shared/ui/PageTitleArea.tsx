import { cn, FlexBox } from '@repo/ui'
import React from 'react'

type Props = {
  title: string
  desc?: string
  className?: string
  actions?: React.ReactNode
  children?: React.ReactNode
}

const PageTitleArea = ({ title, desc, className, actions, children }: Props) => {
  return (
    <FlexBox className={cn('flex items-center justify-between', className)}>
      <FlexBox>
        <h2>{title}</h2>
        {desc && <p>{desc}</p>}
      </FlexBox>

      <FlexBox>
        {actions && (
          <ul className="flex items-center gap-2">
            <li>{actions}</li>
          </ul>
        )}
        {children}
      </FlexBox>
    </FlexBox>
  )
}

export default PageTitleArea
