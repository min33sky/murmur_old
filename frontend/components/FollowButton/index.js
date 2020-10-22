import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import { followRequestAction, unfollowRequestAction } from '../../reducers/user';

/**
 * 팔로우 버튼 컴포넌트
 * @param {Object} post 게시물 데이터
 */
function FollowButton({ post }) {
  const dispatch = useDispatch();
  const { me, followLoading, unfollowLoading } = useSelector((state) => state.user);
  const isFollowing = me?.Followings.find((user) => user.id === post.User.id);

  //-------------------------------------------------------------------
  //* Handler
  //-------------------------------------------------------------------
  const onButtonClick = useCallback(() => {
    if (isFollowing) {
      dispatch(unfollowRequestAction(post.User.id));
    } else {
      dispatch(followRequestAction(post.User.id));
    }
  }, [isFollowing]);

  //* 자신의 글은 팔로우 버튼을 보여주지 않는다.
  if (post.User.id === me.id) {
    return null;
  }

  return (
    <Button loading={followLoading || unfollowLoading} onClick={onButtonClick}>
      {isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  );
}

FollowButton.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.shape({
      nickname: PropTypes.string,
      id: PropTypes.number,
    }),
    content: PropTypes.string,
    createdAt: PropTypes.string,
    Comments: PropTypes.arrayOf(PropTypes.object),
    Images: PropTypes.arrayOf(PropTypes.object),
    Likers: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default FollowButton;
