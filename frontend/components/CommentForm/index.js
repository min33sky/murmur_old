import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import useInput from '../../hooks/useInput';
import { addCommentRequestAction } from '../../reducers/post';

/**
 * 댓글 등록 폼
 * @param {number} id 게시글 ID
 */
function CommentForm({ post }) {
  const id = useSelector((state) => state.user.me?.id);
  const { addCommentDone } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const [commentText, onChangeCommentText, setCommentText] = useInput('');

  useEffect(() => {
    if (addCommentDone) {
      setCommentText('');
    }
  }, [addCommentDone]);

  const onSubmitComment = useCallback(() => {
    console.log(id, commentText);
    dispatch(
      addCommentRequestAction({
        content: commentText,
        postId: post.id,
        userId: id,
      }),
    );
  }, [commentText, id]);

  return (
    <Form onFinish={onSubmitComment}>
      <Form.Item style={{ position: 'relative', margin: 0 }}>
        <Input.TextArea
          onChange={onChangeCommentText}
          value={commentText}
          rows={4}
        />
        <Button
          style={{
            position: 'absolute',
            right: 0,
            bottom: -40,
            zIndex: 1,
          }}
          htmlType='submit'
          type='primary'
        >
          등록
        </Button>
      </Form.Item>
    </Form>
  );
}

CommentForm.propTypes = {
  id: PropTypes.number,
};

export default CommentForm;
