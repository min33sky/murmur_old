import React, { useCallback, useState, useRef } from 'react';
import { Form, Input, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { addPostAction } from '../../reducers/post';
const { TextArea } = Input;

/**
 * 글 등록 폼
 */
function PostForm() {
  const [text, setText] = useState('');
  // 등록 할 이미지 주소
  const { imagePaths } = useSelector((state) => state.post);
  // 이미지 등록 버튼을 위한 ref
  const imageInput = useRef();
  const dispatch = useDispatch();

  const onSubmit = useCallback(() => {
    dispatch(addPostAction());
  }, [dispatch]);

  const onChangeText = useCallback((e) => {
    setText(e.target.value);
  }, []);

  const onImageButtonClick = useCallback(() => {
    imageInput.current.click();
  }, []);

  return (
    <Form
      style={{ margin: '10px 0 20px' }}
      encType='multipart/form-data'
      onFinish={onSubmit}
    >
      <TextArea
        value={text}
        onChange={onChangeText}
        maxLength={140}
        placeholder='당신의 글을 입력하세요'
      />
      <div>
        <input type='file' multiple hidden ref={imageInput} />
        <Button onClick={onImageButtonClick}>이미지 업로드</Button>
        <Button type='primary' htmlType='submit' style={{ float: 'right' }}>
          등록
        </Button>
      </div>
      <div>
        {imagePaths.map((imagePath) => (
          <div key={imagePath} style={{ display: 'inline-block' }}>
            <img key={imagePath} style={{ width: '200px' }} alt={imagePath} />
            <div>
              <Button>제거</Button>
            </div>
          </div>
        ))}
      </div>
    </Form>
  );
}

export default PostForm;
