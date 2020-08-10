import React from 'react';
import AppLayout from '../components/AppLayout';
import NicknameEditFrom from '../components/NicknameEditForm';
import FollowList from '../components/FollowList';
import { Typography } from 'antd';
const { Title, Paragraph } = Typography;

/**
 * 프로필 페이지
 * : 로그인한 사용자만 이용 가능
 */
const Profile = () => {
  // Dummy Data
  const followerList = [
    { nickname: 'messi' },
    { nickname: 'ronaldo' },
    { nickname: 'neymar' },
  ];
  const followingList = [
    { nickname: '이대호' },
    { nickname: '박병호' },
    { nickname: '김태균' },
  ];

  return (
    <>
      <AppLayout>
        <Typography>
          <Title>Profile</Title>
          <Paragraph>개인 정보를 수정하는 페이지</Paragraph>
        </Typography>
        <NicknameEditFrom />
        <FollowList header='팔로워 목록' data={followerList} />
        <FollowList header='팔로잉 목록' data={followingList} />
      </AppLayout>
    </>
  );
};

export default Profile;