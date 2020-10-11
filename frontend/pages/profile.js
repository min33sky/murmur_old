import React, { useEffect } from 'react';
import { Typography } from 'antd';
import { useSelector } from 'react-redux';
import Router from 'next/router';
import AppLayout from '../components/AppLayout';
import NicknameEditFrom from '../components/NicknameEditForm';
import FollowList from '../components/FollowList';

const { Title, Paragraph } = Typography;

/**
 * 프로필 페이지 (/profile)
 * : 로그인한 사용자만 이용 가능
 */
const Profile = () => {
  const { me } = useSelector((state) => state.user);

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
        <FollowList header='팔로잉 목록' data={me.Followings} />
        <FollowList header='팔로워 목록' data={me.Followers} />
      </AppLayout>
    </>
  );
};

export default Profile;
