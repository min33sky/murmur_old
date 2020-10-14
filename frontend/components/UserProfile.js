import React, { useCallback } from 'react';
import { Card, Avatar, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { logoutRequestAction } from '../reducers/user';

/**
 * 프로필 컴포넌트
 */
function UserProfile() {
  const { me, logoutLoading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const onLogout = useCallback(() => {
    dispatch(logoutRequestAction());
  }, []);

  return (
    <Card
      actions={[
        <div key='twit'>
          게시글
          <br />
          {me.Posts.length}
        </div>,
        <div key='followings'>
          팔로잉
          <br />
          {me.Followings.length}
        </div>,
        <div key='followers'>
          팔로워
          <br />
          {me.Followers.length}
        </div>,
      ]}
    >
      <Card.Meta title={me.nickname} avatar={<Avatar>MIN</Avatar>}></Card.Meta>
      <Button onClick={onLogout} loading={logoutLoading}>
        로그아웃
      </Button>
    </Card>
  );
}

export default UserProfile;
