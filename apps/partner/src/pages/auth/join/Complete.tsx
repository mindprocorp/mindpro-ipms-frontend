import OnlyForm from '@shared/router/layout/page/OnlyForm'
import Complete from '@widgets/auth/join-form/ui/Complete'

const JoinComplete = () => {
  return (
    <OnlyForm className="items-center [&>div]:w-[315px]">
      <Complete />
    </OnlyForm>
  )
}

export default JoinComplete
