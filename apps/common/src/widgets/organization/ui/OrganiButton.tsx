import { Button, cn, Icons } from '@repo/ui'

type ButtonProps = {
  className?: React.CSSProperties
}

const OrganiButton = ({ className }: ButtonProps) => {
  return (
    <Button variant="ghost" className="relative h-auto min-w-auto p-1">
      <Icons.Inbox className={cn('size-5 text-white', className)} />
      <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-red-500"></span>
    </Button>
  )
}

export default OrganiButton
