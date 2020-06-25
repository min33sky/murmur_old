import { combineReducers } from 'redux';
import { HYDRATE } from 'next-redux-wrapper';
import userReducer from './user';
import postReducer from './post';

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
  user: userReducer,
  post: postReducer,
});

export default rootReducer;
