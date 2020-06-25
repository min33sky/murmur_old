import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import 'antd/dist/antd.css';
import wrapper from '../store/configureStore';

/**
 * NEXT의 시작 컴포넌트
 * @param {React.ReactNode} Component pages 폴더안의 컴포넌트
 */
const Murmur = ({ Component }) => {
  return (
    <>
      <Head>
        <meta charSet='utf-8' />
        <title>Can U Hear Me?</title>
      </Head>
      <Component />
    </>
  );
};

Murmur.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

/*
 * Next에 Redux 적용하기
 */
export default wrapper.withRedux(Murmur);
