import React, { useCallback, useRef, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { addPostRequestAction } from '../../reducers/post';
import useInput from '../../hooks/useInput';

const { TextArea } = Input;

/**
 * 게시물 등록 폼
 */
function PostForm() {
  const dispatch = useDispatch();
  const imageInput = useRef(); // ? 이미지 등록 버튼 클릭을 위한 ref
  const [text, onChangeText, setText] = useInput('');
  const { imagePaths, addPostDone } = useSelector((state) => state.post); // 등록 할 이미지의 주소

  useEffect(() => {
    if (addPostDone) setText('');
  }, [addPostDone]);

  const onSubmit = useCallback(() => {
    dispatch(addPostRequestAction(text));
  }, [dispatch, text]);

  /**
   * 이미지 등록 버튼 이벤트 리스너
   * ? ref를 클릭해서 이미지를 등록시킨다.
   */
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
