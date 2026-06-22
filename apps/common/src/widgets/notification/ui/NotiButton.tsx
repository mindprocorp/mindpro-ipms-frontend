import { Button, cn, Icons } from '@repo/ui'
import Notification from '@repo/assets/images/line/media/notification-3-line.svg?react'

type ButtonProps = {
  className?: React.CSSProperties
}

const NotiButton = ({ className }: ButtonProps) => {
  return (
    <Button variant="ghost" className="relative h-auto min-w-auto p-1">
      {/* <Notification className={cn('text-text size-6', className)} /> */}
      <Icons.Bell className={cn('size-5 text-white', className)} />
      <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-red-500"></span>
    </Button>
  )
}

export default NotiButton
