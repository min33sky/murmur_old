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
import { removePostRequestAction } from '../../reducers/post';
import FollowButton from '../FollowButton';

/**
 * 글 내용을 보여줄 카드
 * @param {Object} post 게시글 정보
 */
function PostCard({ post }) {
  const dispatch = useDispatch();

  const { me } = useSelector((state) => state.user);
  const id = me && me.id;
  const { removePostLoading } = useSelector((state) => state.post);
  const [liked, setLiked] = useState(false);
  const [commentFormOpened, setCommentFormOpened] = useState(false);

  //-------------------------------------------------------------------
  //* Handler
  //-------------------------------------------------------------------
  const onToggleLikes = useCallback(() => {
    setLiked((prev) => !prev);
  }, []);

  const onToggleComment = useCallback(() => {
    setCommentFormOpened((prev) => !prev);
  }, []);

  const onRemovePost = useCallback(() => {
    dispatch(removePostRequestAction(post.id));
  }, []);

  return (
    <>
      <Card
        style={{ marginTop: '20px' }}
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <RetweetOutlined key='retweet' />,

          liked ? (
            <HeartTwoTone key='heart' twoToneColor='red' onClick={onToggleLikes} />
          ) : (
            <HeartOutlined key='heart' onClick={onToggleLikes} />
          ),
          <MessageOutlined key='comment' onClick={onToggleComment} />,
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
    createdAt: PropTypes.object,
    Comments: PropTypes.arrayOf(PropTypes.object),
    Images: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default PostCard;
