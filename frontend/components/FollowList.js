import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { List, Card, Button } from 'antd';
import styled from 'styled-components';
import { StopOutlined } from '@ant-design/icons';

const MoreButtonWrapper = styled.div`
  text-align: center;
  margin: 10px 0;
`;

const ListItemWrapper = styled(List.Item)`
  margin-top: 20px;
`;

/**
 * 팔로우 리스트 컴포넌트
 * @param {header} param0
 * @param {data} param0
 */
function FollowList({ header, data }) {
  // ? useMemo로 스타일 객체를 감싸서 리렌더링을 방지할 수 있다.
  const listStyle = useMemo(() => ({ marginBottom: 20 }), []);
  const grid = useMemo(() => ({ gutter: 4, xs: 2, md: 3 }), []);
  const cardMetaStyle = useMemo(() => ({ textAlign: 'center' }), []);

  return (
    <List
      style={listStyle}
      grid={grid}
      size='small'
      header={<div>{header}</div>}
      loadMore={
        <MoreButtonWrapper>
          <Button>더 보기</Button>
        </MoreButtonWrapper>
      }
      bordered
      dataSource={data}
      renderItem={(item) => (
        <ListItemWrapper>
          <Card actions={[<StopOutlined key='stop' />]}>
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
};

export default FollowList;
