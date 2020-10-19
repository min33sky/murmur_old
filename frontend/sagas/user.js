import { all, fork, takeLatest, put, delay, call, actionChannel } from 'redux-saga/effects';
import axios from 'axios';
import {
  LOG_IN_REQUEST,
  LOG_OUT_REQUEST,
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,
  LOG_OUT_SUCCESS,
  LOG_OUT_FAILURE,
  FOLLOW_REQUEST,
  FOLLOW_SUCCESS,
  FOLLOW_FAILURE,
  UNFOLLOW_REQUEST,
  UNFOLLOW_SUCCESS,
  UNFOLLOW_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILURE,
  LOAD_MY_INFO_REQUEST,
  LOAD_MY_INFO_FAILURE,
  LOAD_MY_INFO_SUCCESS,
} from '../reducers/user';

function loginApi(data) {
  return axios.post('/user/login', data);
}

/**
 * 로그인
 * @param {Object} action 로그인 데이터
 */
function* login(action) {
  try {
    const result = yield call(loginApi, action.payload);

    yield put({
      type: LOG_IN_SUCCESS,
      payload: result.data,
    });
  } catch (error) {
    yield put({
      type: LOG_IN_FAILURE,
      payload: error.response.data,
    });
  }
}

// function logOutApi(data) {
//   return axios.post('/logout', data);
// }

function* logout() {
  try {
    // yield call(logOutApi, action.payload);
    yield put({
      type: LOG_OUT_SUCCESS,
    });
  } catch (error) {
    yield put({
      type: LOG_OUT_FAILURE,
      payload: error.response.data,
    });
  }
}

function signUpApi(data) {
  return axios.post('http://localhost:3065/user', data);
}

/**
 * 회원 가입
 * @param {Object} action 회원 가입 액션
 */
function* signUp(action) {
  try {
    const result = yield call(signUpApi, action.payload);

    yield put({
      type: SIGN_UP_SUCCESS,
      payload: result, //! 아직 쓸모 없음........................
    });
  } catch (error) {
    yield put({
      type: SIGN_UP_FAILURE,
      payload: error.response.data,
    });
  }
}

function* follow(action) {
  try {
    yield delay(1000);
    yield put({
      type: FOLLOW_SUCCESS,
      payload: action.payload,
    });
  } catch (error) {
    yield put({
      type: FOLLOW_FAILURE,
      payload: error.response.data,
    });
  }
}

function* unfollow(action) {
  try {
    yield delay(1000);
    yield put({
      type: UNFOLLOW_SUCCESS,
      payload: action.payload,
    });
  } catch (error) {
    yield put({
      type: UNFOLLOW_FAILURE,
      payload: error.response.data,
    });
  }
}

function loadMyInfoApi() {
  return axios.get('/user');
}

/**
 * 로그인 유지 확인
 */
function* loadMyInfo() {
  try {
    const response = yield call(loadMyInfoApi);

    yield put({
      type: LOAD_MY_INFO_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({
      type: LOAD_MY_INFO_FAILURE,
      payload: error.response.data,
    });
  }
}

function* watchLogin() {
  yield takeLatest(LOG_IN_REQUEST, login);
}

function* watchLogOut() {
  yield takeLatest(LOG_OUT_REQUEST, logout);
}

function* watchFollow() {
  yield takeLatest(FOLLOW_REQUEST, follow);
}

function* watchUnfollow() {
  yield takeLatest(UNFOLLOW_REQUEST, unfollow);
}

function* watchSignUp() {
  yield takeLatest(SIGN_UP_REQUEST, signUp);
}

function* watchLoadMyInfo() {
  yield takeLatest(LOAD_MY_INFO_REQUEST, loadMyInfo);
}

export default function* userSaga() {
  yield all([
    fork(watchLogin),
    fork(watchLogOut),
    fork(watchFollow),
    fork(watchUnfollow),
    fork(watchSignUp),
    fork(watchLoadMyInfo),
  ]);
}
