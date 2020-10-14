import React from 'react';
import { useSelector } from 'react-redux';
import AppLayout from '../components/AppLayout';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';

/**
 * 시작 페이지
 */
const Home = () => {
  const { loginDone } = useSelector((state) => state.user);
  const { mainPosts } = useSelector((state) => state.post);

  /*
   * 로그인 정보와 게시글들을 모두 가져와서 보여준다.
   */

  return (
    <AppLayout>
      {loginDone && <PostForm />}
      {mainPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </AppLayout>
  );
};

export default Home;
