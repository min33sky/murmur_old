import shortid from 'shortid';
import produce from 'immer';
import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from './post';

/** **************************************************
 *
 * Action Type
 *
 *************************************************** */
export const LOG_IN_REQUEST = 'user/LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'user/LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'user/LOG_IN_FAILURE';
export const LOG_OUT_REQUEST = 'user/LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'user/LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'user/LOG_OUT_FAILURE';

export const SIGN_UP_REQUEST = 'user/SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'user/SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'user/SIGN_UP_FAILURE';

/** **************************************************
 *
 * Action Function
 *
 *************************************************** */

export const loginRequestAction = (data) => ({
  type: LOG_IN_REQUEST,
  payload: data,
});

export const logoutRequestAction = () => ({
  type: LOG_OUT_REQUEST,
});

export const signupRequestAction = (data) => ({
  type: SIGN_UP_REQUEST,
  payload: data,
});

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!! 더미 함수
const dummyUser = (data) => ({
  ...data,
  Posts: [],
  Followers: [
    { id: shortid.generate(), nickname: '침착맨' },
    { id: shortid.generate(), nickname: '따효니' },
  ],
  Followings: [{ id: shortid.generate(), nickname: '동수칸' }],
  nickname: '불건전한 닉네임',
});

/** **************************************************
 *
 * State & Reducer Function
 *
 *************************************************** */

const initialState = {
  loginLoading: false, // 로그인 요청 여부
  loginDone: false, // 로그인 여부
  loginError: null,
  logoutLoading: false, // 로그아웃 요청 여부
  logoutDone: false,
  logoutError: null,
  me: null, // 로그인 한 사용자 정보
  signedUpData: {}, // 가입 요청 데이터
  loginData: [], // 로그인 요청 데이터
};

// TODO: 닉네임 수정도 만들자

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case LOG_IN_REQUEST:
        draft.loginLoading = true;
        draft.loginDone = false;
        draft.loginError = null;
        break;

      case LOG_IN_SUCCESS:
        draft.loginLoading = false;
        draft.loginDone = true;
        draft.me = dummyUser(action.payload);
        break;

      case LOG_IN_FAILURE:
        draft.loginLoading = false;
        draft.loginDone = false;
        draft.loginError = action.payload;
        break;

      case LOG_OUT_REQUEST:
        draft.logoutLoading = true;
        draft.logoutDone = false;
        draft.logoutError = null;
        break;

      case LOG_OUT_SUCCESS:
        draft.logoutLoading = false;
        draft.logoutDone = true;
        draft.me = null;
        break;

      case LOG_OUT_FAILURE:
        draft.logoutLoading = false;
        draft.logoutError = action.payload;
        break;

      case SIGN_UP_REQUEST:
        return state;
      case SIGN_UP_SUCCESS:
        return state;
      case SIGN_UP_FAILURE:
        return state;

      // POST 리듀서에서 나오는 액션 처리

      case ADD_POST_TO_ME:
        draft.me.Posts.unshift({ id: action.payload });
        break;

      case REMOVE_POST_OF_ME:
        draft.me.Posts = draft.me.Posts.filter(
          (post) => post.id !== action.payload,
        );
        break;

      default:
        break;
    }
  });

export default reducer;
