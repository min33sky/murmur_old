import React, { useEffect } from 'react';
import { Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import AppLayout from '../components/AppLayout';
import NicknameEditFrom from '../components/NicknameEditForm';
import FollowList from '../components/FollowList';
import { LOAD_FOLLOWERS_REQUEST, LOAD_FOLLOWINGS_REQUEST } from '../reducers/user';

const { Title, Paragraph } = Typography;

/**
 * 프로필 페이지 (/profile)
 * : 로그인한 사용자만 이용 가능
 */
const Profile = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch({
      type: LOAD_FOLLOWERS_REQUEST,
    });
    dispatch({
      type: LOAD_FOLLOWINGS_REQUEST,
    });
  }, []);

  useEffect(() => {
    if (!me?.id) {
      console.log('로그인 안한 사람은 프로필 메뉴에 못간다.');
      Router.push('/');
    }
  }, [me && me.id]);

  if (!me) {
    return null;
  }

  return (
    <>
      <AppLayout>
        <Typography>
          <Title>Profile</Title>
          <Paragraph>개인 정보를 수정하는 페이지</Paragraph>
        </Typography>
        <NicknameEditFrom />
        <FollowList header='팔로잉' data={me.Followings} />
        <FollowList header='팔로워' data={me.Followers} />
      </AppLayout>
    </>
  );
};

export default Profile;
