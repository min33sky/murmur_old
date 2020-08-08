import React from 'react';
import PropTypes, { object } from 'prop-types';
import Slider from 'react-slick';

/**
 * Image Carousel 컴포넌트
 * @param {Array} images 이미지 주소
 * @param {Function} onClose carousel 종료 함수
 */
function ImagesZoom({ images, onClose }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Slider {...settings}>
      <div>
        <h3>1</h3>
      </div>
      <div>
        <h3>2</h3>
      </div>
      <div>
        <h3>3</h3>
      </div>
      <div>
        <h3>4</h3>
      </div>
      <div>
        <h3>5</h3>
      </div>
      <div>
        <h3>6</h3>
      </div>
    </Slider>
  );
}

ImagesZoom.propTypes = {
  images: PropTypes.arrayOf(object).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ImagesZoom;
