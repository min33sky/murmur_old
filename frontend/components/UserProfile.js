import React, { useCallback } from 'react';
import { Card, Avatar, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { logoutAction } from '../reducers/user';

function UserProfile() {
  const dispatch = useDispatch();

  const onLogout = useCallback(() => {
    dispatch(logoutAction());
  }, []);

  return (
    <Card
      actions={[
        <div key='twit'>
          게시글
          <br />0
        </div>,
        <div key='followings'>
          팔로잉
          <br />0
        </div>,
        <div key='followers'>
          팔로워
          <br />0
        </div>,
      ]}
    >
      <Card.Meta title='min33sky' avatar={<Avatar>MIN</Avatar>}></Card.Meta>
      <Button onClick={onLogout}>로그아웃</Button>
    </Card>
  );
}

export default UserProfile;
