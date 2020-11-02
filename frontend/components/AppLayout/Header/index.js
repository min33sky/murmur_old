import React, { useCallback } from 'react';
import { Menu, Input } from 'antd';
import Link from 'next/link';
import styled from 'styled-components';
import Router from 'next/router';
import useInput from '../../../hooks/useInput';

/*
  ? Inline CSS는 객체이므로 리랜더링이 발생한다.
  ? styledComponents 또는 React Memo를 사용하여 해결
*/
const InputSearch = styled(Input.Search)`
  vertical-align: middle;
`;

/**
 * AppLayout의 Header 컴포넌트
 */
function Header() {
  const [keyword, onChangeKeyword] = useInput('');

  const onSearchPost = useCallback(() => {
    Router.push(`/hashtag/${keyword}`);
  }, [keyword]);

  return (
    <>
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
          <InputSearch
            value={keyword}
            onChange={onChangeKeyword}
            onSearch={onSearchPost}
            enterButton
          />
        </Menu.Item>
        <Menu.Item>
          <Link href='/signup'>
            <a>회원가입</a>
          </Link>
        </Menu.Item>
      </Menu>
    </>
  );
}

export default Header;
