import React, { useCallback, useEffect, useState } from 'react';
import { Typography } from 'antd';
import { useSelector } from 'react-redux';
import Router from 'next/router';
import axios from 'axios';
import { END } from 'redux-saga';
import useSWR from 'swr';
import AppLayout from '../components/AppLayout';
import NicknameEditFrom from '../components/NicknameEditForm';
import FollowList from '../components/FollowList';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';

const { Title, Paragraph } = Typography;

/**
 ** 프로필 페이지 (/profile)
 *? 로그인한 사용자만 이용 가능
 */
function Profile() {
  const { me } = useSelector((state) => state.user);

  const [followingsLimit, setFollowingsLimit] = useState(3);
  const [followersLimit, setFollowersLimit] = useState(3);

  const fetcher = (url) =>
    axios.get(url, { withCredentials: true }).then((response) => response.data);

  /**
   *? SWR
   *? data와 error 둘 다 없으면 loading이 true인 것이다
   */
  const { data: followingsData, error: followingsError } = useSWR(
    `http://localhost:3065/user/followings?limit=${followingsLimit}`,
    fetcher,
  );
  const { data: followersData, error: followersError } = useSWR(
    `http://localhost:er5/user/followers?limit=${followersLimit}`,
    fetcher,
  );

  useEffect(() => {
    if (!me?.id) {
      console.log('로그인이 필요한 페이지입니다. 홈으로 리다이렉트 됩니다.');
      Router.push('/');
    }
  }, [me && me.id]);

  // 팔로워, 팔로잉 더 보기
  const loadMoreFollowers = useCallback(() => {
    setFollowersLimit((prev) => prev + 3);
  }, []);

  const loadMoreFollowings = useCallback(() => {
    setFollowingsLimit((prev) => prev + 3);
  }, []);

  // 로그인 정보가 없을 경우
  if (!me) {
    return <div>로그인 정보 로딩중</div>;
  }

  // 팔로잉, 팔로워 에러 발생 시
  if (followingsError || followersError) {
    console.error(followingsError || followersError);
    return <div>팔로잉, 팔로워 로딩 에러</div>;
  }

  return (
    <>
      <AppLayout>
        <Typography>
          <Title>Profile</Title>
          <Paragraph>개인 정보를 수정하는 페이지</Paragraph>
        </Typography>
        <NicknameEditFrom />
        <FollowList
          header='팔로잉'
          data={followingsData}
          onClickMore={loadMoreFollowings}
          loading={!followingsData && !followingsError}
        />
        <FollowList
          header='팔로워'
          data={followersData}
          onClickMore={loadMoreFollowers}
          loading={!followersData && !followersError}
        />
      </AppLayout>
    </>
  );
}

//-----------------------------------------------------------------------------
//* Server-Side-Rendering
//-----------------------------------------------------------------------------

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }

  // 로그인 정보 불러오기
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });

  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default Profile;
