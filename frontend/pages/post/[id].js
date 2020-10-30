import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { END } from 'redux-saga';
import AppLayout from '../../components/AppLayout/index';
import PostCard from '../../components/PostCard';
import wrapper from '../../store/configureStore';
import { LOAD_MY_INFO_REQUEST } from '../../reducers/user';
import { LOAD_POST_REQUEST } from '../../reducers/post';

/**
 * 게시물 동적 페이지
 * /post/:id
 */
function Post() {
  const router = useRouter();
  const { id } = router.query;
  const { singlePost } = useSelector((state) => state.post);

  /**
   * TODO: 게시물이 없을 때 처리가 필요하다 (404 ERROR)
   */

  return (
    <AppLayout>
      <Head>
        <title>{singlePost.User.nickname}의 글</title>
        <meta name='description' content={singlePost.content} />
        <meta property='og:title' content={`${singlePost.User.nickname}님의 게시글`} />
        <meta property='og:description' content={singlePost.content} />
        <meta
          property='og:image'
          content={
            singlePost.Images[0] ? singlePost.Images[0].src : 'https://murmur.com/favicon.ico'
          }
        />
        <meta property='og:url' content={`https://murmur.com/post/${id}`} />
      </Head>
      <PostCard post={singlePost} />
    </AppLayout>
  );
}

//-----------------------------------------------------------------------------
//* Server-Side-Rendering
//-----------------------------------------------------------------------------

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  console.log(context);
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });

  context.store.dispatch({
    type: LOAD_POST_REQUEST,
    payload: context.params.id,
  });

  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
  return { props: {} };
});

export default Post;
