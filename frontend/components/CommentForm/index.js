import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import useInput from '../../hooks/useInput';
import { Form, Input, Button } from 'antd';

/**
 * 댓글 등록 폼
 * @param {number} id 게시글 ID
 */
function CommentForm({ id }) {
  const [commentText, onChangeCommentText] = useInput('');

  const onSubmitComment = useCallback(() => {
    console.log(id, commentText);
  }, [commentText]);

  return (
    <Form onFinish={onSubmitComment}>
      <Form.Item style={{ position: 'relative', margin: 0 }}>
        <Input.TextArea
          onChange={onChangeCommentText}
          value={commentText}
          rows={4}
        />
        <Button
          style={{ position: 'absolute', right: 0, bottom: -40 }}
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
