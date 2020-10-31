import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { END } from 'redux-saga';
import AppLayout from '../../components/AppLayout';
import { LOAD_HASHTAG_POSTS_REQUEST } from '../../reducers/post';
import PostCard from '../../components/PostCard';
import wrapper from '../../store/configureStore';
import { LOAD_MY_INFO_REQUEST } from '../../reducers/user';

function Hashtag() {
  const dispatch = useDispatch();
  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector((state) => state.post);
  const router = useRouter();
  const { tag } = router.query;

  useEffect(() => {
    const onScroll = () => {
      if (
        window.pageYOffset + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 300
      ) {
        if (hasMorePosts && !loadPostsLoading) {
          dispatch({
            type: LOAD_HASHTAG_POSTS_REQUEST,
            payload: {
              tag,
              lastId: mainPosts[mainPosts.length - 1] && mainPosts[mainPosts.length - 1].id,
            },
          });
        }
      }
    };

    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [tag, hasMorePosts, loadPostsLoading]);

  return (
    <AppLayout>
      {mainPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </AppLayout>
  );
}

//-----------------------------------------------------------------------------
//* Server-Side-Rendering
//-----------------------------------------------------------------------------

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = ''; // 쿠키 초기화
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }

  // 요청
  context.store.dispatch({
    type: LOAD_HASHTAG_POSTS_REQUEST,
    payload: {
      tag: context.params.tag,
    },
  });

  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });

  // 응답 대기
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
  console.log('getState', context.store.getState().post.mainPosts);
  return {
    props: {},
  };
});

export default Hashtag;
