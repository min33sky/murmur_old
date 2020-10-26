import { combineReducers } from 'redux';
import { HYDRATE } from 'next-redux-wrapper';

import user from './user';
import post from './post';

const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE: // ? 서버 사이드 랜더링때 호출. 클라이언트 상태값을 덮어 씌운다
      // console.log('HYDRATE', action);
      return action.payload;

    default: {
      const combineReducer = combineReducers({
        user,
        post,
      });
      return combineReducer(state, action); // 리듀서를 합친 상태값을 리턴
    }
  }
};

export default rootReducer;
