import React, { useCallback } from 'react';
import { Form, Input, Button } from 'antd';
import styled from 'styled-components';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import useInput from '../../hooks/useInput';
import { loginRequestAction } from '../../reducers/user';

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
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');
  const { loginLoading } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  /*
    ? onFinish()에는 e.defaultPrevent()가 자동 호출된다.
  */
  const onSubmitForm = useCallback(() => {
    dispatch(loginRequestAction({ email, password }));
  }, [email, password]);

  return (
    <FormWrapper onFinish={onSubmitForm}>
      <div>
        <label htmlFor='user-email'>이메일</label>
        <br />
        <Input
          type='text'
          id='user-email'
          value={email}
          onChange={onChangeEmail}
        />
      </div>
      <div>
        <label htmlFor='password'>패스워드</label>
        <br />
        <Input
          type='password'
          id='password'
          value={password}
          onChange={onChangePassword}
        />
      </div>

      <ButtonWrapper>
        <Button type='primary' htmlType='submit' loading={loginLoading}>
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
