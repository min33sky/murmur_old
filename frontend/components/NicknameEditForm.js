import React, { useCallback, useMemo, useState } from 'react';
import { Form, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { CHANGE_NICKNAME_REQUEST } from '../reducers/user';
import useInput from '../hooks/useInput';

/**
 * 닉네임 수정 폼
 */
function NicknameForm() {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const [nickname, onChangeNickname] = useInput(me?.nickname || '');

  // ? styled-components 대신 useMemo를 사용하여 리랜더링을 막기
  const style = useMemo(() => ({
    marginBottom: '20px',
    border: '1px solid #d9d9d9',
    padding: '20px',
  }));

  const onSubmit = useCallback(() => {
    dispatch({
      type: CHANGE_NICKNAME_REQUEST,
      payload: nickname,
    });
  }, [nickname]);

  return (
    <Form style={style}>
      <Input.Search
        value={nickname}
        onChange={onChangeNickname}
        addonBefore='Nickname'
        enterButton='수정'
        onSearch={onSubmit}
      />
    </Form>
  );
}

export default NicknameForm;
