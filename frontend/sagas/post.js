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
  LIKE_POST_REQUEST,
  UNLIKE_POST_REQUEST,
  LIKE_POST_FAILURE,
  UNLIKE_POST_SUCCESS,
  UNLIKE_POST_FAILURE,
  LIKE_POST_SUCCESS,
  UPLOAD_IMAGES_REQUEST,
  UPLOAD_IMAGES_SUCCESS,
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

function removePostApi(postId) {
  return axios.delete(`/post/${postId}`);
}

/**
 * 게시물 삭제
 * @param {Object} action 게시물 삭제 액션
 */
function* removePost(action) {
  try {
    const response = yield call(removePostApi, action.payload);

    yield put({
      type: REMOVE_POST_SUCCESS,
      payload: response.data,
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

function likePostApi(postId) {
  return axios.patch(`/post/${postId}/like`);
}

/**
 * 게시물 좋아요 기능
 * @param {Object} action 좋아요 액션
 */
function* likePost(action) {
  try {
    const response = yield call(likePostApi, action.payload);

    yield put({
      type: LIKE_POST_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    console.error(error);
    put({
      type: LIKE_POST_FAILURE,
      payload: error.response.data,
    });
  }
}

function unlikePostApi(postId) {
  return axios.delete(`/post/${postId}/like`);
}

/**
 * 게시물 좋아요 취소 기능
 * @param {Object} action 좋아요 취소 액션
 */
function* unlikePost(action) {
  try {
    const response = yield call(unlikePostApi, action.payload);

    yield put({
      type: UNLIKE_POST_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    console.error(error);
    put({
      type: UNLIKE_POST_FAILURE,
      payload: error.response.data,
    });
  }
}

function uploadImageApi(images) {
  return axios.post('/post/images', images); // multer에서 처리하므로 JSON 형식으로 보내지 않는다. {key : value}
}

/**
 * 이미지 업로드
 * @param {Object} action 이미지 업로드 액션
 */
function* uploadImage(action) {
  try {
    const response = yield call(uploadImageApi, action.payload);

    yield put({
      type: UPLOAD_IMAGES_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: UPLOAD_IMAGES_SUCCESS,
    });
  }
}

//----------------------------------------------------------------------------
//* Watch
//----------------------------------------------------------------------------

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

function* watchLikePost() {
  yield takeLatest(LIKE_POST_REQUEST, likePost);
}

function* watchUnlikePost() {
  yield takeLatest(UNLIKE_POST_REQUEST, unlikePost);
}

function* watchUploadImage() {
  yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImage);
}

export default function* postSaga() {
  yield all([
    fork(watchAddPost),
    fork(watchAddComment),
    fork(watchRemovePost),
    fork(watchLoadPosts),
    fork(watchLikePost),
    fork(watchUnlikePost),
    fork(watchUploadImage),
  ]);
}
