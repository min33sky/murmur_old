import { all, fork, takeLatest, call, put } from 'redux-saga/effects';
import {
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
  ADD_POST_FAILURE,
} from '../reducers/post';
import axios from 'axios';

function addPostApi(data) {
  return axios.post('/api/post', data);
}

function* addPost(action) {
  try {
    // let response = yield call(addPostApi, action.payload);
    yield put({
      type: ADD_POST_SUCCESS,
      // payload: response.data
      payload: action.payload,
    });
  } catch (error) {
    yield put({
      type: ADD_POST_FAILURE,
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

export default function* postSaga() {
  yield all([fork(watchAddPost)]);
}
