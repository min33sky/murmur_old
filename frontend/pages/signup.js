import React, { useState, useCallback } from 'react';
import AppLayout from '../components/AppLayout';
import { Form, Input, Button, Checkbox } from 'antd';
import useInput from '../hooks/useInput';
import styled from 'styled-components';
import { Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { signupRequestAction } from '../reducers/user';
const { Title, Paragraph } = Typography;

const ErrorMessage = styled.div`
  color: red;
`;

/**
 * 회원 가입 페이지
 */
const Signup = () => {
  const { signUpLoading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  const [password, onChangePassword] = useInput('');

  const [passwordCheck, setPasswordCheck] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setPasswordError(password !== e.target.value);
    },
    [password],
  );

  const [term, setTerm] = useState(false);
  const [termError, setTermError] = useState(false);

  const onChangeTerm = useCallback((e) => {
    setTerm(e.target.checked);
    setTermError(false);
  }, []);

  const onSumbit = useCallback(() => {
    // ! 한번 더 입력에 대한 체크를 해준다.
    if (password !== passwordCheck) return setPasswordError(true);
    if (!term) return setTermError(true);
    console.log(email, password, nickname);
    dispatch(signupRequestAction({ email, password, nickname }));
  }, [password, passwordCheck, term, email]);

  return (
    <AppLayout>
      <Typography>
        <Title>회원 가입</Title>
        <Paragraph>빨리 가입 고고!!</Paragraph>
      </Typography>

      <Form onFinish={onSumbit}>
        <div>
          <label htmlFor='user-email'>이메일</label>
          <br />
          <Input
            type='email'
            id='user-email'
            value={email}
            onChange={onChangeEmail}
            required
          />
        </div>

        <div>
          <label htmlFor='nickname'>닉네임</label>
          <br />
          <Input
            type='text'
            id='nickname'
            value={nickname}
            onChange={onChangeNickname}
            required
          />
        </div>

        <div>
          <label htmlFor='password'>패스워드</label>
          <br />
          <Input
            type='text'
            id='password'
            value={password}
            onChange={onChangePassword}
            required
          />
        </div>

        <div>
          <label htmlFor='passwordCheck'>패스워드 확인</label>
          <br />
          <Input
            type='text'
            id='passwordCheck'
            value={passwordCheck}
            onChange={onChangePasswordCheck}
            required
          />
          {passwordError && (
            <ErrorMessage>패스워드가 일치하지 않습니다.</ErrorMessage>
          )}
        </div>

        <div style={{ marginTop: '20px' }}>
          <Checkbox name='user-term' checked={term} onChange={onChangeTerm}>
            가입 할래?
          </Checkbox>
          {termError && <ErrorMessage>약관에 동의하셔야 됩니다.</ErrorMessage>}
        </div>

        <div style={{ marginTop: '20px' }}>
          <Button
            type='primary'
            htmlType='submit'
            style={{ width: '100%' }}
            loading={signUpLoading}
          >
            가입
          </Button>
        </div>
      </Form>
    </AppLayout>
  );
};

export default Signup;
