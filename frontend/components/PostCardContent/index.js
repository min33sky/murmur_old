import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

/**
 * 게시물 내용 컴포넌트
 * - 해쉬태그는 링크로 처리한다
 * @param {string} content
 */
function PostCardContent({ content }) {
  return (
    <>
      {
        // ? split(/(asdf)/) 에서 ()를 넣어주면 ()안에 있는 것도 배열에 포함된다.
        content.split(/(#[^\s#]+)/g).map((value, idx) => {
          // 해쉬 태그는 링크
          if (value.match(/(#[^\s#]+)/g)) {
            return (
              <Link href={`/hashtag/${value.slice(1)}`} key={idx}>
                <a>{value}</a>
              </Link>
            );
          }
          return value;
        })
      }
    </>
  );
}

PostCardContent.propTypes = {
  content: PropTypes.string.isRequired,
};

export default PostCardContent;
