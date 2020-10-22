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
  CHANGE_NICKNAME_FAILURE,
  CHANGE_NICKNAME_SUCCESS,
  CHANGE_NICKNAME_REQUEST,
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWINGS_REQUEST,
  LOAD_FOLLOWERS_SUCCESS,
  LOAD_FOLLOWERS_FAILURE,
  LOAD_FOLLOWINGS_SUCCESS,
  LOAD_FOLLOWINGS_FAILURE,
  REMOVE_FOLLOWER_REQUEST,
  REMOVE_FOLLOWER_FAILURE,
  REMOVE_FOLLOWER_SUCCESS,
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

function logOutApi() {
  return axios.post('/user/logout');
}

function* logout() {
  try {
    yield call(logOutApi);
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

function followApi(userId) {
  return axios.patch(`/user/${userId}/follow`);
}

/**
 * 팔로우
 * @param {Object} action 팔로우 액션
 */
function* follow(action) {
  try {
    const response = yield call(followApi, action.payload);
    yield put({
      type: FOLLOW_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({
      type: FOLLOW_FAILURE,
      payload: error.response.data,
    });
  }
}

function unfollowApi(userId) {
  return axios.delete(`/user/${userId}/follow`);
}

/**
 * 언팔로우
 * @param {Object}} action 언팔로우 액션
 */
function* unfollow(action) {
  try {
    const response = yield call(unfollowApi, action.payload);

    yield put({
      type: UNFOLLOW_SUCCESS,
      payload: response.data,
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

function changeNicknameApi(nickname) {
  return axios.patch('/user/nickname', { nickname });
}

/**
 * 닉네임 변경
 * @param {Object} action 닉네임 변경 액션
 */
function* changeNickname(action) {
  try {
    const response = yield call(changeNicknameApi, action.payload);

    yield put({
      type: CHANGE_NICKNAME_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: CHANGE_NICKNAME_FAILURE,
      payload: error.response.data,
    });
  }
}

function loadFollowersApi() {
  return axios.get('/user/followers');
}

/**
 * Follower 목록 가져오기
 */
function* loadFollowers() {
  try {
    const response = yield call(loadFollowersApi);

    yield put({
      type: LOAD_FOLLOWERS_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: LOAD_FOLLOWERS_FAILURE,
      payload: error.response.data,
    });
  }
}

function loadFollowingsApi() {
  return axios.get('/user/followings');
}

/**
 * Followings 목록 가져오기
 */
function* loadFollowings() {
  try {
    const response = yield call(loadFollowingsApi);

    yield put({
      type: LOAD_FOLLOWINGS_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: LOAD_FOLLOWINGS_FAILURE,
      payload: error.response.data,
    });
  }
}

function removeFollowerApi(userId) {
  return axios.delete(`/user/follower/${userId}`);
}

/**
 * 팔로워 삭제 (프로필 페이지)
 * @param {Object} action 팔로워 삭제 액션
 */
function* removeFollower(action) {
  try {
    const response = yield call(removeFollowerApi, action.payload);

    yield put({
      type: REMOVE_FOLLOWER_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: REMOVE_FOLLOWER_FAILURE,
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

function* watchChangeNickname() {
  yield takeLatest(CHANGE_NICKNAME_REQUEST, changeNickname);
}

function* watchLoadFollowers() {
  yield takeLatest(LOAD_FOLLOWERS_REQUEST, loadFollowers);
}

function* watchLoadFollowings() {
  yield takeLatest(LOAD_FOLLOWINGS_REQUEST, loadFollowings);
}

function* watchRemoveFollower() {
  yield takeLatest(REMOVE_FOLLOWER_REQUEST, removeFollower);
}

export default function* userSaga() {
  yield all([
    fork(watchLogin),
    fork(watchLogOut),
    fork(watchFollow),
    fork(watchUnfollow),
    fork(watchSignUp),
    fork(watchLoadMyInfo),
    fork(watchChangeNickname),
    fork(watchLoadFollowers),
    fork(watchLoadFollowings),
    fork(watchRemoveFollower),
  ]);
}
