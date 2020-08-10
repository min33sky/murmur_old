import styled, { createGlobalStyle } from 'styled-components';
import { CloseOutlined } from '@ant-design/icons';

export const Overlay = styled.div`
  position: fixed;
  z-index: 5000;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

export const Header = styled.div`
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
`;

export const CloseBtn = styled(CloseOutlined)`
  position: absolute;
  top: 0;
  right: 0;
  padding: 15px;
  line-height: 14px;
  cursor: pointer;
`;

export const SliderWrapper = styled.div`
  height: calc(100% - 44px);
  background-color: #090909;
`;

export const ImgWrapper = styled.div`
  padding: 32px;
  text-align: center;

  & img {
    margin: 0 auto;
    max-height: 750px;
  }
`;

export const Indicator = styled.div`
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

/*
? createGlobalStyle
? : Global CSS를 덮어 씌울 수 있는 함수
- react-slick에서 제공하는 css class를 styled-Components의 hash화 된 css class로 변경
*/
export const Global = createGlobalStyle`
.slick-slide {
  display: inline-block
}
`;
