import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Row, Col } from 'antd';
import LoginForm from '../LoginForm';
import UserProfile from '../UserProfile';
import Header from './Header';

/**
 * 전반적인 레이아웃을 담당하는 컴포넌트
 * @param {React.ReactNode} children 레이아웃을 적용 할 컴포넌트
 */
const AppLayout = ({ children }) => {
  const { me } = useSelector((state) => state.user);

  return (
    <>
      <Header />

      <Row gutter={8}>
        <Col xs={24} md={6}>
          {me ? <UserProfile /> : <LoginForm />}
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
