import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { END } from 'redux-saga';
import axios from 'axios';
import AppLayout from '../components/AppLayout';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { LOAD_POSTS_REQUEST } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';

/**
 * 시작 페이지
 */
const Home = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector((state) => state.post);

  //* Infinity Scrolling
  useEffect(() => {
    function onScroll() {
      if (
        window.scrollY + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 300
      ) {
        const lastId = mainPosts[mainPosts.length - 1]?.id; // 마지막 글의 id값

        if (hasMorePosts && !loadPostsLoading) {
          dispatch({
            type: LOAD_POSTS_REQUEST,
            payload: lastId,
          });
        }
      }
    }

    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll); //! 메모리 관리를 위해 추가한 이벤트를 제거
    };
  }, [hasMorePosts, loadPostsLoading]);

  return (
    <AppLayout>
      {me && <PostForm />}
      {mainPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </AppLayout>
  );
};

//-----------------------------------------------------------------------------
//* Server-Side-Rendering
// ? Next에서 제공하는 서버사이드랜더링 메서드는 Redux와 문제가 있어서 wrapper가 제공하는 메서드 사용
// ? Home보다 먼저 호출된다.
// ? 이 부분은 브라우저가 아니라 오직 프론트 서버에서만 호출되는 부분이다.
// ? 그래서 쿠키를 자동으로 넣어주는 브라우저와 달리 직접 쿠키를 넣어줘야된다.
//-----------------------------------------------------------------------------

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  console.log('getServerSideProps start');
  console.log('----------------------------------------');
  console.log('* 쿠키 확인용 :', context.req.headers);
  console.log('----------------------------------------');

  // ! 브라우저가 아닌 프론트 서버에서만 실행되기 때문에 다른사람과 쿠키가 공유가 될 수 있다.
  // ! 그래서 아래와 같이 처리를 해준다.
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = ''; // 쿠키 공유를 막기위해 쿠키를 지운다.
  if (context.req && cookie) {
    // 서버 요청에 쿠키가 있을 경우 axios에 쿠키를 넣어준다
    axios.defaults.headers.Cookie = cookie;
  }

  // 사용자 정보 불러오기
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  // 게시글 불러오기
  context.store.dispatch({
    type: LOAD_POSTS_REQUEST,
  });

  context.store.dispatch(END); // 사가를 중단
  console.log('getServerSideProps end');
  await context.store.sagaTask.toPromise(); // 서버 응답이 올때까지 대기
});

export default Home;
