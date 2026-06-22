import { Button } from '@repo/ui'
import { logoutWithConfirm } from '@shared/util/logout'

const Dashboard = () => {
  return (
    <div>
      대쉬보드<Button onClick={logoutWithConfirm}>로그아웃</Button>
    </div>
  )
}

export default Dashboard
