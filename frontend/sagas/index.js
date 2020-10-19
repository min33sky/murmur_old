import { all, fork } from 'redux-saga/effects';
import axios from 'axios';

import user from './user';
import post from './post';

//* axios 공통 요청 설정
axios.defaults.baseURL = 'http://localhost:3065';
axios.defaults.withCredentials = true; // 요청에 쿠키도 같이 보낸다.

export default function* rootSaga() {
  yield all([fork(user), fork(post)]);
}
