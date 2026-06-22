import { FlexBox, Button, Switch } from '@repo/ui'
import React from 'react'

const SearchFooter = () => {
  return (
    <FlexBox>
      <FlexBox>
        <Button>불러오기</Button>
        <Button>저장</Button>
      </FlexBox>
      <FlexBox>
        <FlexBox>
          <Switch />
        </FlexBox>
        <FlexBox>
          <Button>초기화</Button>
          <Button>검색</Button>
        </FlexBox>
      </FlexBox>
    </FlexBox>
  )
}

export default SearchFooter
