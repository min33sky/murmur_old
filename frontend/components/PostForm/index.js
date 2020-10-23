import React, { useCallback, useRef, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { ADD_POST_REQUEST, CANCEL_UPLOAD_IMAGE, UPLOAD_IMAGES_REQUEST } from '../../reducers/post';
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
    if (addPostDone) setText(''); // 게시물 등록 후 인풋 초기화
  }, [addPostDone]);

  //-------------------------------------------------------------------
  //* Handler
  //-------------------------------------------------------------------
  const onSubmit = useCallback(() => {
    if (!text || !text.trim()) {
      alert('글을 입력하세요. 제발');
      return;
    }
    //! 이미지가 없을 땐 FormData를 사용 할 필요는 없다.
    //* 아래는 이미지 주소와 텍스트를 보내기 때문에 Formdata가 필요없지만
    //* multer.none()을 사용해보기 위한 코드이다
    const formData = new FormData();
    imagePaths.forEach((path) => formData.append('image', path)); // req.body.image
    formData.append('content', text); // req.body.content
    dispatch({
      type: ADD_POST_REQUEST,
      payload: formData,
    });
  }, [text, imagePaths]);

  /**
   ** 이미지 업로드 취소
   *? 동기 액션으로 처리 (서버로 갈 필요가 없이 스토어에서 처리)
   */
  const onRemoveImage = useCallback(
    (index) => () => {
      dispatch({
        type: CANCEL_UPLOAD_IMAGE,
        payload: index,
      });
    },
    [],
  );

  // 업로드 할 이미지 등록
  const onChangeImages = useCallback((e) => {
    console.log('images', e.target.files);
    const imageFormData = new FormData();
    [].forEach.call(e.target.files, (file) => {
      imageFormData.append('image', file);
    });
    // 이미지 업로드
    dispatch({
      type: UPLOAD_IMAGES_REQUEST,
      payload: imageFormData,
    });
  }, []);

  /**
   * 이미지 등록 버튼 이벤트 리스너
   * ? ref를 클릭해서 이미지를 등록시킨다.
   */
  const onImageButtonClick = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  return (
    <Form style={{ margin: '10px 0 20px' }} encType='multipart/form-data' onFinish={onSubmit}>
      <TextArea
        value={text}
        onChange={onChangeText}
        maxLength={140}
        placeholder='당신의 글을 입력하세요'
      />

      <div>
        <input
          type='file'
          name='image'
          key={imagePaths.join()} // ? 같은 이미지를 다시 등록할 때 액션을 디스패치하지 않는 것을 해결
          multiple
          hidden
          ref={imageInput}
          onChange={onChangeImages}
        />
        <Button onClick={onImageButtonClick}>이미지 업로드</Button>
        <Button type='primary' htmlType='submit' style={{ float: 'right' }}>
          등록
        </Button>
      </div>

      <div>
        {imagePaths.map((imagePath, index) => (
          <div key={imagePath} style={{ display: 'inline-block' }}>
            <img
              key={imagePath}
              style={{ width: '200px' }}
              alt={imagePath}
              src={`http://localhost:3065/${imagePath}`}
            />
            <div>
              <Button onClick={onRemoveImage(index)}>제거</Button>
            </div>
          </div>
        ))}
      </div>
    </Form>
  );
}

export default PostForm;
