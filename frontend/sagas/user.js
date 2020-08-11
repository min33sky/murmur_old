import { all, fork, takeLatest, call, put, delay } from 'redux-saga/effects';
import axios from 'axios';
import {
  LOG_IN_REQUEST,
  LOG_OUT_REQUEST,
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,
  LOG_OUT_SUCCESS,
  LOG_OUT_FAILURE,
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
      payload: action.payload,
    });
  } catch (error) {
    yield put({
      type: LOG_IN_FAILURE,
      payload: error.response.data,
    });
  }
}

function* logout(action) {
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

function* watchLogin() {
  yield takeLatest(LOG_IN_REQUEST, login);
}

function* watchLogOut() {
  yield takeLatest(LOG_OUT_REQUEST, logout);
}

export default function* userSaga() {
  yield all([fork(watchLogin), fork(watchLogOut)]);
}
