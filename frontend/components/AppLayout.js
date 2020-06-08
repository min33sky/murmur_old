import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Menu, Row, Col, Input } from 'antd';
import styled from 'styled-components';
import LoginForm from './LoginForm';
import UserProfile from './UserProfile';

/*
  ? Inline CSS는 객체이므로 리랜더링이 발생한다.
  - styledComponents 또는 React Memo를 사용하여 해결
*/
const InputSearch = styled(Input.Search)`
  vertical-align: middle;
`;

const AppLayout = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <div>
        <Menu mode='horizontal'>
          <Menu.Item>
            <Link href='/'>
              <a>MurmuR</a>
            </Link>
          </Menu.Item>
          <Menu.Item>
            <Link href='/profile'>
              <a>프로필</a>
            </Link>
          </Menu.Item>
          <Menu.Item>
            <InputSearch enterButton />
          </Menu.Item>
          <Menu.Item>
            <Link href='/signup'>
              <a>회원가입</a>
            </Link>
          </Menu.Item>
        </Menu>
      </div>

      <Row gutter={8}>
        <Col xs={24} md={6}>
          {isLoggedIn ? (
            <UserProfile setIsLoggedIn={setIsLoggedIn} />
          ) : (
            <LoginForm setIsLoggedIn={setIsLoggedIn} />
          )}
        </Col>
        <Col xs={24} md={12}>
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
