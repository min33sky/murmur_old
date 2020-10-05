import React from 'react';
import { Typography } from 'antd';
import { useSelector } from 'react-redux';
import AppLayout from '../components/AppLayout';
import NicknameEditFrom from '../components/NicknameEditForm';
import FollowList from '../components/FollowList';

const { Title, Paragraph } = Typography;

/**
 * 프로필 페이지
 * : 로그인한 사용자만 이용 가능
 */
const Profile = () => {
  const { me } = useSelector((state) => state.user);

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
