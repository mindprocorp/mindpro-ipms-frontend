import Gnb from '@shared/ui/gnb'
import { Outlet } from 'react-router-dom'

const OnlyTop = () => {
  return (
    <div>
      <Gnb />
      <Outlet />
    </div>
  )
}

export default OnlyTop
