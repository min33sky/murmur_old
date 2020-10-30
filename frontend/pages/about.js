import React from 'react';
import Head from 'next/head';
import { useSelector } from 'react-redux';
import { Avatar, Card } from 'antd';
import { END } from 'redux-saga';
import AppLayout from '../components/AppLayout';
import wrapper from '../store/configureStore';
import { LOAD_USER_REQUEST } from '../reducers/user';

/**
 * 사용자 정보 페이지
 * /about
 */
function About() {
  const { userInfo } = useSelector((state) => state.user);

  return (
    <AppLayout>
      <Head>
        <title>Murmur</title>
      </Head>
      {userInfo ? (
        <Card
          actions={[
            <div key='twit'>
              트윗
              <br />
              {userInfo.Posts}
            </div>,
            <div key='following'>
              팔로잉
              <br />
              {userInfo.Followings}
            </div>,
            <div key='follower'>
              팔로워
              <br />
              {userInfo.Followers}
            </div>,
          ]}
        >
          <Card.Meta
            avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
            title={userInfo.nickname}
            description='닉네임'
          />
        </Card>
      ) : null}
    </AppLayout>
  );
}

//-----------------------------------------------------------------------------
//* Server-Side-Rendering
// ? getStaticProps:
// ? 빌드할 때 html파일로 만들어줘서 자원을 아낄 수 있다.
// ? 그러나 동적인 페이지를 만들 땐 사용이 불가능하다.
// ? 활용 예시) 이벤트 페이지 등
//-----------------------------------------------------------------------------

export const getStaticProps = wrapper.getStaticProps(async (context) => {
  console.log('getStaticProps');
  context.store.dispatch({
    type: LOAD_USER_REQUEST,
    payload: 1, // 임시값
  });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default About;
