import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { List, Card, Button } from 'antd';
import styled from 'styled-components';
import { StopOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { REMOVE_FOLLOWER_REQUEST, UNFOLLOW_REQUEST } from '../reducers/user';

const MoreButtonWrapper = styled.div`
  text-align: center;
  margin: 10px 0;
`;

const ListItemWrapper = styled(List.Item)`
  margin-top: 20px;
`;

/**
 * 팔로우 리스트 컴포넌트
 * @param {string} header 이름
 * @param {array} data 팔로우 목록
 */
function FollowList({ header, data, onClickMore, loading }) {
  const dispatch = useDispatch();
  /**
   *? styled-Complnents 대신 useMemo를 사용해서
   *? 리렌더링을 방지할 수 있다.
   */
  const listStyle = useMemo(() => ({ marginBottom: 20 }), []);
  const grid = useMemo(() => ({ gutter: 4, xs: 2, md: 3 }), []);
  const cardMetaStyle = useMemo(() => ({ textAlign: 'center' }), []);

  const onButtonClick = useCallback(
    (id) => () => {
      if (header === '팔로잉') {
        dispatch({
          type: UNFOLLOW_REQUEST,
          payload: id,
        });
      } else {
        // 팔로워 제거
        dispatch({
          type: REMOVE_FOLLOWER_REQUEST,
          payload: id,
        });
      }
    },
    [],
  );

  return (
    <List
      style={listStyle}
      grid={grid}
      size='small'
      header={<div>{header}</div>}
      loadMore={
        <MoreButtonWrapper>
          <Button onClick={onClickMore} loading={loading}>
            더 보기
          </Button>
        </MoreButtonWrapper>
      }
      bordered
      dataSource={data}
      renderItem={(item) => (
        <ListItemWrapper>
          <Card actions={[<StopOutlined key='stop' onClick={onButtonClick(item.id)} />]}>
            <Card.Meta style={cardMetaStyle} description={item.nickname} />
          </Card>
        </ListItemWrapper>
      )}
    />
  );
}

FollowList.propTypes = {
  header: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  onClickMore: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default FollowList;
