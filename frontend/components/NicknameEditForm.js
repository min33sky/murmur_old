import React, { useMemo } from 'react';
import { Form, Input } from 'antd';

/**
 * 닉네임 수정 폼
 */
function NicknameForm() {
  // ? styled-components 대신 useMemo를 사용하여 리랜더링을 막기
  const style = useMemo(() => ({
    marginBottom: '20px',
    border: '1px solid #d9d9d9',
    padding: '20px',
  }));

  return (
    <Form style={style}>
      <Input.Search addonBefore='Nickname' enterButton='수정' />
    </Form>
  );
}

export default NicknameForm;
