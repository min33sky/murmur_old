import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';

import { CloseBtn, Header, Global, SliderWrapper, ImgWrapper, Indicator, Overlay } from './styles';

/**
 * Image Carousel 컴포넌트
 * @param {Array} images 이미지 주소 배열
 * @param {Function} onClose Image Carousel 종료 함수
 */
function ImagesZoom({ images, onClose }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // 슬라이더 설정
  const settings = {
    // dots: true,
    infinite: true,
    // speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Overlay>
      <Global />

      <Header>
        <h1>상세 이미지</h1>
        <CloseBtn onClick={onClose}>X</CloseBtn>
      </Header>

      <SliderWrapper>
        <Slider
          initialSlide={1}
          // 슬라이드가 이동하기 전에 싱행되는 함수
          beforeChange={(slide) => setCurrentSlide(slide)}
          {...settings}
        >
          {images.map((v) => (
            <ImgWrapper key={v.src}>
              <img src={v.src} alt={v.src} />
            </ImgWrapper>
          ))}
        </Slider>

        <Indicator>
          <div>
            {currentSlide + 1} / {images.length}
          </div>
        </Indicator>
      </SliderWrapper>
    </Overlay>
  );
}

ImagesZoom.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ImagesZoom;
