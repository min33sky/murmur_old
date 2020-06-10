import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import LoginForm from '../LoginForm';
import UserProfile from '../UserProfile';
import Header from './Header';

/**
 * * 전반적인 레이아웃을 담당하는 컴포넌트
 */
const AppLayout = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <Header />

      <Row gutter={8}>
        <Col xs={24} md={6}>
          {isLoggedIn ? (
            <UserProfile setIsLoggedIn={setIsLoggedIn} />
          ) : (
            <LoginForm setIsLoggedIn={setIsLoggedIn} />
          )}
        </Col>
        <Col xs={24} md={12} style={{ padding: '10px 10px' }}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          <a
            href='https://github.com/min33sky'
            target='_blank'
            rel='noreferrer noopener'
          >
            By MingtypE
          </a>
        </Col>
      </Row>
    </>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
