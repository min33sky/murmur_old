import React, { useState, useCallback, useEffect } from 'react';
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
import Link from 'next/link';
import PostImages from '../PostImages';
import CommentForm from '../CommentForm';
import PostCardContent from '../PostCardContent';
import {
  LIKE_POST_REQUEST,
  removePostRequestAction,
  RETWEET_REQUEST,
  UNLIKE_POST_REQUEST,
} from '../../reducers/post';
import FollowButton from '../FollowButton';

/**
 * 글 내용을 보여줄 카드 컴포넌트
 * @param {Object} post 게시글 정보
 */
function PostCard({ post }) {
  const dispatch = useDispatch();

  const { me } = useSelector((state) => state.user);
  const id = me?.id;
  const { removePostLoading, retweetError } = useSelector((state) => state.post);
  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const liked = post.Likers.find((user) => user.id === id);

  useEffect(() => {
    //! 전체 포스트카드 컴포넌트가 아닌 특정 컴포넌트만 경고창이 뜨게한다.
    if (retweetError && retweetError.postId === post.id) {
      alert(retweetError.message);
    }
  }, [retweetError]);

  //-------------------------------------------------------------------
  //* Handler
  //-------------------------------------------------------------------

  const onLikePost = useCallback(() => {
    if (!id) {
      return alert('로그인 하세요');
    }
    dispatch({
      type: LIKE_POST_REQUEST,
      payload: post.id,
    });
  }, [id]);

  const onUnlikePost = useCallback(() => {
    if (!id) {
      return alert('로그인 하세요');
    }
    dispatch({
      type: UNLIKE_POST_REQUEST,
      payload: post.id,
    });
  }, [id]);

  const onToggleComment = useCallback(() => {
    setCommentFormOpened((prev) => !prev);
  }, []);

  const onRemovePost = useCallback(() => {
    dispatch(removePostRequestAction(post.id));
  }, []);

  const onEditPost = useCallback(() => {
    alert('준비중');
  }, []);

  const onRetweet = useCallback(() => {
    if (!id) {
      return alert('로그인 하세요');
    }
    dispatch({
      type: RETWEET_REQUEST,
      payload: post.id,
    });
  }, [id]);

  return (
    <>
      <Card
        style={{ marginTop: '20px' }}
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          // 리트윗
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
                    <Button onClick={onEditPost}>수정</Button>
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
        title={post.RetweetId ? `${post.User.nickname}님이 리트윗 하셨습니다.` : null}
        extra={me && <FollowButton post={post} />}
      >
        {
          // 게시물 내용
          post.RetweetId && post.Retweet ? (
            <Card cover={post.Retweet.Images[0] && <PostImages images={post.Retweet.Images} />}>
              <Card.Meta
                avatar={
                  <Link href={`/user/${post.User.id}`}>
                    <a>
                      <Avatar>{post.Retweet.User.nickname[0]}</Avatar>
                    </a>
                  </Link>
                }
                title={post.Retweet.User.nickname}
                description={<PostCardContent content={post.Retweet.content} />}
              />
            </Card>
          ) : (
            <Card.Meta
              avatar={
                <Link href={`/user/${post.User.id}`}>
                  <a>
                    <Avatar>{post.User.nickname[0]}</Avatar>
                  </a>
                </Link>
              }
              title={post.User.nickname}
              description={<PostCardContent content={post.content} />}
            />
          )
        }
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
                  avatar={
                    <Link href={`/user/${item.User.id}`}>
                      <a>
                        <Avatar>{item.User.nickname[0]}</Avatar>
                      </a>
                    </Link>
                  }
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
    RetweetId: PropTypes.number,
    Retweet: PropTypes.shape({
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
      RetweetId: PropTypes.number,
    }),
  }).isRequired,
};

export default PostCard;
