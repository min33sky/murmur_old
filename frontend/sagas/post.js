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
  yield takeLatest(ADD_POST_REQUEST, addPost);
}

export default function* postSaga() {
  yield all([fork(watchAddPost)]);
}
