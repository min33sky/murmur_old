import { all, fork } from 'redux-saga/effects';
import axios from 'axios';

import user from './user';
import post from './post';

//* 서보로 호출할 때 전역에서 사용하기 위한 baseURL 설정
axios.defaults.baseURL = 'http://localhost:3065';

export default function* rootSaga() {
  yield all([fork(user), fork(post)]);
}
