import User from '@repo/assets/images/user.png'
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui'

const AvatarWrap = () => {
  return (
    <Avatar>
      <AvatarImage src={User} alt="@shadcn" />
      <AvatarFallback>A</AvatarFallback>
    </Avatar>
  )
}

export default AvatarWrap
