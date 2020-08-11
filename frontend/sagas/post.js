import { all, fork } from 'redux-saga/effects';

function* watchAddPost() {
  // Todo
}

export default function* postSaga() {
  yield all([fork(watchAddPost)]);
}
