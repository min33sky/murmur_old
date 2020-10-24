import React, { useState, useCallback } from 'react';
import { Card, Popover, Button, Avatar, List, Comment } from 'antd';
import PropTypes from 'prop-types';
import {
  RetweetOutlined,
  HeartOutlined,
  MessageOutlined,
  EllipsisOutlined,
  HeartTwoTone,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import PostImages from '../PostImages';
import CommentForm from '../CommentForm';
import PostCardContent from '../PostCardContent';
import {
  LIKE_POST_REQUEST,
  removePostRequestAction,
  UNLIKE_POST_REQUEST,
} from '../../reducers/post';
import FollowButton from '../FollowButton';

/**
 * 글 내용을 보여줄 카드
 * @param {Object} post 게시글 정보
 */
function PostCard({ post }) {
  const dispatch = useDispatch();

  const { me } = useSelector((state) => state.user);
  const id = me?.id;
  const { removePostLoading } = useSelector((state) => state.post);
  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const liked = post.Likers.find((user) => user.id === id);

  //-------------------------------------------------------------------
  //* Handler
  //-------------------------------------------------------------------

  const onLikePost = useCallback(() => {
    dispatch({
      type: LIKE_POST_REQUEST,
      payload: post.id,
    });
  }, []);

  const onUnlikePost = useCallback(() => {
    dispatch({
      type: UNLIKE_POST_REQUEST,
      payload: post.id,
    });
  }, []);

  const onToggleComment = useCallback(() => {
    setCommentFormOpened((prev) => !prev);
  }, []);

  const onRemovePost = useCallback(() => {
    dispatch(removePostRequestAction(post.id));
  }, []);

  const onRetweet = useCallback(() => {
    alert('준비 중..');
  }, []);

  return (
    <>
      <Card
        style={{ marginTop: '20px' }}
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <RetweetOutlined key='retweet' onClick={onRetweet} />,

          // 좋아요
          liked ? (
            <HeartTwoTone key='heart' twoToneColor='red' onClick={onUnlikePost} />
          ) : (
            <HeartOutlined key='heart' onClick={onLikePost} />
          ),

          // 댓글창 열기
          <MessageOutlined key='comment' onClick={onToggleComment} />,

          // 추가 기능
          <Popover
            key='more'
            content={
              <Button.Group>
                {id && id === post.User.id ? (
                  <>
                    <Button>수정</Button>
                    <Button type='danger' onClick={onRemovePost} loading={removePostLoading}>
                      삭제
                    </Button>
                  </>
                ) : (
                  <Button>신고</Button>
                )}
              </Button.Group>
            }
          >
            <EllipsisOutlined />
          </Popover>,
        ]}
        extra={me && <FollowButton post={post} />}
      >
        <Card.Meta
          avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
          title={post.User.nickname}
          description={<PostCardContent content={post.content} />}
        />
      </Card>

      {commentFormOpened && (
        <>
          {me && <CommentForm post={post} />}
          <List
            header={`${post.Comments.length}개의 댓글`}
            itemLayout='horizontal'
            dataSource={post.Comments}
            renderItem={(item) => (
              <li>
                <Comment
                  author={item.User.nickname}
                  avatar={<Avatar>{item.User.nickname[0]}</Avatar>}
                  content={item.content}
                />
              </li>
            )}
          />
        </>
      )}
    </>
  );
}

PostCard.propTypes = {
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

export default PostCard;
