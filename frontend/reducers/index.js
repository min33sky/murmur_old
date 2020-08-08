import { combineReducers } from 'redux';
import { HYDRATE } from 'next-redux-wrapper';
import user from './user';
import post from './post';

/*
 * combineReducers : 리듀서들을 하나로 합쳐주는 함수
 */
const rootReducer = combineReducers({
  index: (state = {}, action) => {
    switch (action.type) {
      /*
        ? HYDRATE?
        ? NEXT에서 서버사이드 랜더링을 위한 리듀서
       */
      case HYDRATE:
        console.log('HYDRATE', action);
        return {
          ...state,
          ...action.payload,
        };
      default:
        return state;
    }
  },
  user,
  post,
});

export default rootReducer;
