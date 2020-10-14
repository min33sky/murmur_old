import { all, fork, takeLatest, put, delay } from 'redux-saga/effects';
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
} from '../reducers/user';

function loginApi(data) {
  // return axios.post('/api', data);
}

function logOutApi(data) {
  // return axios.post('/api', data);
}

function* login(action) {
  try {
    // let response = yield call(loginApi, action.payload);
    yield delay(1000);

    yield put({
      type: LOG_IN_SUCCESS,
      // payload: response.data,
      payload: {
        ...action.payload,
        id: 1,
      },
    });
  } catch (error) {
    yield put({
      type: LOG_IN_FAILURE,
      payload: error.response.data,
    });
  }
}

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

export default function* userSaga() {
  yield all([fork(watchLogin), fork(watchLogOut), fork(watchFollow), fork(watchUnfollow)]);
}
