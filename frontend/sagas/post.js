import shortId from 'shortid';
import { all, fork, takeLatest, put, delay } from 'redux-saga/effects';
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
} from '../reducers/post';
// import axios from 'axios';

function addPostApi(data) {
  return axios.post('/api/post', data);
}

function addCommentApi(data) {
  return null;
}

function* addPost(action) {
  try {
    // let response = yield call(addPostApi, action.payload);

    const randomId = shortId.generate();

    yield put({
      type: ADD_POST_SUCCESS,
      // payload: response.data
      payload: {
        id: randomId,
        content: action.payload,
      },
    });

    // User Reducer도 업데이트
    yield put({
      type: ADD_POST_TO_ME,
      payload: randomId,
    });
  } catch (error) {
    yield put({
      type: ADD_POST_FAILURE,
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

function* addComment(action) {
  try {
    yield put({
      type: ADD_COMMENT_SUCCESS,
      // 임시 payload
      payload: action.payload,
    });
  } catch (error) {
    yield put({
      type: ADD_COMMENT_FAILURE,
      payload: error.response.data,
    });
  }
}

function* watchAddPost() {
  /*
   ? takeLatest:
   ! 요청이 취소되는 것이 아니라 응답이 취소되는 것이다.
   ! 그래서 같은 요청인지 체크를 서버에서 해줘야 한다.
   */
  yield takeLatest(ADD_POST_REQUEST, addPost);
}

function* watchRemovePost() {
  yield takeLatest(REMOVE_POST_REQUEST, removePost);
}

function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

export default function* postSaga() {
  yield all([fork(watchAddPost), fork(watchAddComment), fork(watchRemovePost)]);
}
