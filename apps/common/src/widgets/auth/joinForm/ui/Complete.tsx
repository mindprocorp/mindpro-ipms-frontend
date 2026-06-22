import { Alert, AlertTitle, AlertDescription, Icons, FlexBox, Button } from '@repo/ui'
const { AlertCircleIcon } = Icons

const Complete = () => {
  return (
    <div className="space-y-6">
      <p className="text-2xl">회원가입이 완료 되었습니다.</p>
      <Alert variant="success">
        <AlertCircleIcon />
        <AlertTitle className="text-md mb-1">가입정보</AlertTitle>
        <AlertDescription>
          <ul className="-indent-2 text-xs [&>li]:relative [&>li]:pl-2 [&>li]:before:absolute [&>li]:before:content-['-']">
            <li>이름 : 홍길동</li>
            <li>이메일 : example@gmail.com</li>
            <li>전화번호 : 00012345678</li>
            <li>회사명 : 홍길도동사무소</li>
          </ul>
        </AlertDescription>
      </Alert>

      <FlexBox grow>
        <Button className="w-full">로그인</Button>
        <Button variant="blue" className="w-full">
          사업자(법인) 회원 전환
        </Button>
      </FlexBox>
    </div>
  )
}

export default Complete
