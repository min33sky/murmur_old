import React, { useState, useCallback, useEffect } from 'react';
import { Form, Input, Button, Checkbox, Typography } from 'antd';
import styled from 'styled-components';
import Router from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { END } from 'redux-saga';
import useInput from '../hooks/useInput';
import AppLayout from '../components/AppLayout';
import { LOAD_MY_INFO_REQUEST, signupRequestAction } from '../reducers/user';
import wrapper from '../store/configureStore';

const { Title, Paragraph } = Typography;

const ErrorMessage = styled.div`
  color: red;
`;

/**
 * 회원 가입 페이지
 * /signup
 */
const Signup = () => {
  const dispatch = useDispatch();
  const { signUpLoading, signUpDone, signUpError, me } = useSelector((state) => state.user);

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

  useEffect(() => {
    // ? push와 달리 replace는 뒤로 가기가 되지 않는다.
    if (me && me.id) Router.replace('/');
  }, [me && me.id]);

  useEffect(() => {
    if (signUpDone) Router.replace('/');
  }, [signUpDone]);

  useEffect(() => {
    if (signUpError) alert(signUpError);
  }, [signUpError]);

  const onSumbit = useCallback(() => {
    //! 한번 더 입력에 대한 체크를 해준다.
    if (password !== passwordCheck) return setPasswordError(true);
    if (!term) return setTermError(true);
    dispatch(signupRequestAction({ email, password, nickname }));
  }, [password, passwordCheck, term, email]);

  /**
   * TODO
   * * 옆의 로그인 화면에 id값과 동일해서 경고가 발생하므로 처리할 것!
   */
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
          <Input type='email' id='user-email' value={email} onChange={onChangeEmail} required />
        </div>

        <div>
          <label htmlFor='nickname'>닉네임</label>
          <br />
          <Input type='text' id='nickname' value={nickname} onChange={onChangeNickname} required />
        </div>

        <div>
          <label htmlFor='password'>패스워드</label>
          <br />
          <Input
            type='password'
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
            type='password'
            id='passwordCheck'
            value={passwordCheck}
            onChange={onChangePasswordCheck}
            required
          />
          {passwordError && <ErrorMessage>패스워드가 일치하지 않습니다.</ErrorMessage>}
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

//-----------------------------------------------------------------------------
//* Server-Side-Rendering
//-----------------------------------------------------------------------------

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }

  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });

  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default Signup;
