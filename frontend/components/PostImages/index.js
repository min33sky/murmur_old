import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';
import ImagesZoom from '../ImagesZoom';

/**
 * 이미지를 보여주는 컴포넌트
 * @param {Array} images 이미지 파일들
 */
function PostImages({ images }) {
  const [showImageZoom, setShowImageZoom] = useState(false);

  //-------------------------------------------------------------------
  //* Handler
  //-------------------------------------------------------------------
  const onZoom = useCallback(() => {
    setShowImageZoom((v) => !v);
  }, []);

  const onClose = useCallback(() => {
    setShowImageZoom((v) => !v);
  }, []);

  if (images.length === 1) {
    return (
      <>
        <img
          role='presentation' // ? 스크린리더 사용 시 굳이 클릭할 필요 없다는 걸 알려준다
          src={`http://localhost:3065/${images[0].src}`}
          alt={images[0].src}
          onClick={onZoom}
        />
        {showImageZoom && <ImagesZoom images={images} onClose={onClose} />}
      </>
    );
  }
  if (images.length === 2) {
    return (
      <>
        <img
          role='presentation'
          style={{
            display: 'inline-block',
            width: '50%',
          }}
          src={`http://localhost:3065/${images[0].src}`}
          alt={images[0].src}
          onClick={onZoom}
        />
        <img
          role='presentation'
          style={{
            display: 'inline-block',
            width: '50%',
          }}
          src={`http://localhost:3065/${images[1].src}`}
          alt={images[1].src}
          onClick={onZoom}
        />
        {showImageZoom && <ImagesZoom images={images} onClose={onClose} />}
      </>
    );
  }

  return (
    <>
      <div>
        <img
          role='presentation'
          style={{ width: '50%' }}
          src={`http://localhost:3065/${images[0].src}`}
          alt={images[0].src}
          onClick={onZoom}
        />
        <div
          role='presentation'
          style={{
            display: 'inline-block',
            width: '50%',
            textAlign: 'center',
            verticalAlign: 'middle',
          }}
        >
          <PlusOutlined />
          <br />
          {images.length - 1}
          개의 사진 더보기
        </div>
      </div>
      {showImageZoom && <ImagesZoom images={images} onClose={onClose} />}
    </>
  );
}

PostImages.propTypes = {
  images: PropTypes.array.isRequired,
};

export default PostImages;
