import React, { useCallback } from 'react';
import { Form, Input, Button } from 'antd';
import styled from 'styled-components';
import Link from 'next/link';
import useInput from '../../hooks/useInput';
import { useDispatch } from 'react-redux';
import { loginAction } from '../../reducers/user';

const ButtonWrapper = styled.div`
  margin-top: 20px;
`;

const FormWrapper = styled(Form)`
  padding: 10px;
`;

/**
 * 로그인 컴포넌트
 */
const LoginForm = () => {
  const [id, onChangeId] = useInput('');
  const [password, onChangePassword] = useInput('');
  const dispatch = useDispatch();

  /*
    ? onFinish()에는 e.defaultPrevent()가 자동 호출된다.
  */
  const onSubmitForm = useCallback(() => {
    console.log(id, password);
    dispatch(loginAction());
  }, [id, password]);

  return (
    <FormWrapper onFinish={onSubmitForm}>
      <div>
        <label htmlFor='user-id'>아이디</label>
        <br />
        <Input
          type='text'
          id='user-id'
          value={id}
          onChange={onChangeId}
        ></Input>
      </div>
      <div>
        <label htmlFor='password'>패스워드</label>
        <br />
        <Input
          type='password'
          id='password'
          value={password}
          onChange={onChangePassword}
        ></Input>
      </div>

      <ButtonWrapper>
        <Button type='primary' htmlType='submit' loading={false}>
          로그인
        </Button>
        <Link href='/signup'>
          <a>회원 가입</a>
        </Link>
      </ButtonWrapper>
    </FormWrapper>
  );
};

export default LoginForm;