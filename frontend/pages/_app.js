import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import 'antd/dist/antd.css';

/**
 * * pages의 공통 부분
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

export default Murmur;
