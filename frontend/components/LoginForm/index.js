import React, { useCallback } from 'react';
import { Form, Input, Button } from 'antd';
import styled from 'styled-components';
import Link from 'next/link';
import PropTypes from 'prop-types';
import useInput from '../../hooks/useInput';

const ButtonWrapper = styled.div`
  margin-top: 20px;
`;

const FormWrapper = styled(Form)`
  padding: 10px;
`;

/**
 * 로그인 컴포넌트
 */
const LoginForm = ({ setIsLoggedIn }) => {
  const [id, onChangeId] = useInput('');
  const [password, onChangePassword] = useInput('');

  /*
    ! onFinish()에는 e.defaultPrevent()가 자동 호출된다.
  */
  const onSubmitForm = useCallback(() => {
    console.log(id, password);
    setIsLoggedIn(true);
  }, [id, password]);

  return (
    <FormWrapper onFinish={onSubmitForm}>
      <div>
        <label htmlFor='user-id'>아이디</label>
        <br></br>
        <Input
          type='text'
          name='user-id'
          value={id}
          onChange={onChangeId}
        ></Input>
      </div>
      <div>
        <label htmlFor='user-password'>패스워드</label>
        <br></br>
        <Input
          type='password'
          name='user-id'
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

LoginForm.propTypes = {
  setIsLoggedIn: PropTypes.func.isRequired,
};

export default LoginForm;
