import React, { useCallback } from 'react';
import { Card, Avatar, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { LOG_OUT_REQUEST } from '../reducers/user';

/**
 * 프로필 컴포넌트
  : 로그인 시 보여주는 컴포넌트
 */
function UserProfile() {
  const { me, logoutLoading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const onLogout = useCallback(() => {
    dispatch({
      type: LOG_OUT_REQUEST,
    });
  }, []);

  return (
    <Card
      actions={[
        <div key='twit'>
          <Link href={`/user/${me.id}`}>
            <a>
              게시글
              <br />
              {me.Posts.length}
            </a>
          </Link>
        </div>,
        <div key='followings'>
          <Link href='/profile'>
            <a>
              팔로잉
              <br />
              {me.Followings.length}
            </a>
          </Link>
        </div>,
        <div key='followers'>
          <Link href="/profile">
            <a>
              팔로워
              <br />
              {me.Followers.length}
            </a>
          </Link>
        </div>,
      ]}
    >
      <Card.Meta title={me.nickname} avatar={<Avatar>{me.nickname[0]}</Avatar>} />
      <Button onClick={onLogout} loading={logoutLoading}>
        로그아웃
      </Button>
    </Card>
  );
}

export default UserProfile;
