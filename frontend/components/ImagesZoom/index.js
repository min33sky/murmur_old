import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  z-index: 5000;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const Header = styled.div`
  height: 44px;
  background-color: white;
  position: relative;
  padding: 0;
  text-align: center;

  & h1 {
    margin: 0;
    font-size: 1.5rem;
    color: #333;
    line-height: 44px;
  }

  & button {
    position: absolute;
    top: 0;
    right: 0;
    padding: 15px;
    line-height: 14px;
    cursor: pointer;
  }
`;

const SliderWrapper = styled.div`
  height: calc(100% - 44px);
  background-color: #090909;
`;

const ImgWrapper = styled.div`
  padding: 32px;
  text-align: center;

  & img {
    margin: 0 auto;
    max-height: 750px;
  }
`;

const Indicator = styled.div`
  text-align: center;

  & > div {
    width: 75px;
    height: 30px;
    line-height: 30px;
    border-radius: 15px;
    background-color: #313131;
    display: inline-block;
    text-align: center;
    color: white;
    font-size: 1.5rem;
  }
`;

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
      <Header>
        <h1>상세 이미지</h1>
        <button onClick={onClose}>X</button>
      </Header>

      <SliderWrapper>
        <div>
          <Slider
            initialSlide={0}
            afterChange={(slide) => setCurrentSlide(slide)}
            {...settings}
          >
            {images.map((v) => (
              <ImgWrapper key={v.src}>
                <img src={v.src} alt={v.src} />
              </ImgWrapper>
            ))}
          </Slider>
        </div>

        <div>{/* 임시 공간 */}</div>
      </SliderWrapper>
    </Overlay>
  );
}

ImagesZoom.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ImagesZoom;
