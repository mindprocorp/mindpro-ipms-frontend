import OnlyForm from '@shared/router/layout/page/OnlyForm'
import Complete from '@widgets/auth/joinForm/ui/Complete'

const JoinComplete = () => {
  return (
    <OnlyForm className="items-center [&>div]:w-[400px]">
      <Complete />
    </OnlyForm>
  )
}

export default JoinComplete
