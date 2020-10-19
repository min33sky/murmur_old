import { createWrapper } from 'next-redux-wrapper';
import { createStore, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import reducer from '../reducers';
import rootSaga from '../sagas';

/**
 * 스토어 설정 및 생성하는 함수
 */
const configureStore = (context) => {
  console.log(context);
  const sagaMiddleware = createSagaMiddleware(); // redux-saga
  const middlewares = [logger, sagaMiddleware];
  const enhancer =
    process.env.NODE_ENV === 'development'
      ? composeWithDevTools(applyMiddleware(...middlewares))
      : compose(applyMiddleware(...middlewares));

  const store = createStore(reducer, enhancer);
  // saga 실행
  store.sagaTask = sagaMiddleware.run(rootSaga);
  return store;
};

/*
 * Next에서 Redux 설정하기
 */
const wrapper = createWrapper(configureStore, {
  debug: process.env.NODE_ENV === 'development',
});

export default wrapper;
