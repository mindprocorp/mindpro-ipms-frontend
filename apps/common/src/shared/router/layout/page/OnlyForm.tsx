import logo from '@repo/assets/images/IPMS.png'
import { cn } from '@repo/ui'

type Props = {
  children: React.ReactNode
  className?: React.CSSProperties | string
}

const OnlyForm = ({ children, className }: Props) => {
  return (
    <div className={cn('flex min-h-screen justify-center py-10', className)}>
      <div className="w-[490px]">
        <div className="pb-10">
          <img src={logo} />
          <p className="text-text-200 pt-3 text-xs">
            당신의 지적재산을 위한 ALL CARE 서비스를 만나보세요
          </p>
        </div>
        {/* <Outlet /> */}
        {children}
      </div>
    </div>
  )
}

export default OnlyForm
