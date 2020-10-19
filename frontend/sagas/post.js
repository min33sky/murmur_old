import { all, fork, takeLatest, put, delay, throttle, call } from 'redux-saga/effects';
import axios from 'axios';
import {
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
  ADD_POST_FAILURE,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  ADD_COMMENT_FAILURE,
  ADD_POST_TO_ME,
  REMOVE_POST_REQUEST,
  REMOVE_POST_SUCCESS,
  REMOVE_POST_FAILURE,
  REMOVE_POST_OF_ME,
  LOAD_POSTS_REQUEST,
  LOAD_POSTS_SUCCESS,
  LOAD_POSTS_FAILURE,
} from '../reducers/post';

function addPostApi(text) {
  return axios.post('/post', { content: text });
}

function* addPost(action) {
  try {
    const response = yield call(addPostApi, action.payload);

    yield put({
      type: ADD_POST_SUCCESS,
      payload: response.data,
    });

    // User Reducer도 업데이트
    yield put({
      type: ADD_POST_TO_ME,
      payload: response.data.id,
    });
  } catch (error) {
    yield put({
      type: ADD_POST_FAILURE,
      payload: error.response.data,
    });
  }
}

function loadPostsApi() {
  return axios.get('/posts');
}

function* loadPosts() {
  try {
    const response = yield call(loadPostsApi);

    yield put({
      type: LOAD_POSTS_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: LOAD_POSTS_FAILURE,
      payload: error.response.data,
    });
  }
}

function* removePost(action) {
  try {
    yield delay(1000);
    yield put({
      type: REMOVE_POST_SUCCESS,
      payload: action.payload,
    });

    yield put({
      type: REMOVE_POST_OF_ME,
      payload: action.payload,
    });
  } catch (error) {
    yield put({
      type: REMOVE_POST_FAILURE,
      payload: error.response.data,
    });
  }
}

function addCommentApi(commentData) {
  return axios.post(`/post/${commentData.postId}/comment`, commentData);
}

function* addComment(action) {
  try {
    const response = yield call(addCommentApi, action.payload);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: ADD_COMMENT_FAILURE,
      payload: error.response.data,
    });
  }
}

function* watchAddPost() {
  /**
   *? takeLatest:
   *! 요청이 취소되는 것이 아니라 응답이 취소되는 것이다.
   *! 그래서 같은 요청인지 체크를 서버에서 해줘야 한다.
   */
  yield takeLatest(ADD_POST_REQUEST, addPost);
}

function* watchLoadPosts() {
  // ? 지속적인 요청을 막기위해 throttle을 적용 (단, 이것만으로는 완전 해결 불가능)
  yield throttle(5000, LOAD_POSTS_REQUEST, loadPosts);
}

function* watchRemovePost() {
  yield takeLatest(REMOVE_POST_REQUEST, removePost);
}

function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

export default function* postSaga() {
  yield all([
    fork(watchAddPost),
    fork(watchAddComment),
    fork(watchRemovePost),
    fork(watchLoadPosts),
  ]);
}
