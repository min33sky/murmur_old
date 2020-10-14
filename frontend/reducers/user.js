import shortid from 'shortid';
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

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOG_IN_REQUEST:
      return {
        ...state,
        loginLoading: true,
        loginDone: false,
      };

    case LOG_IN_SUCCESS:
      return {
        ...state,
        loginLoading: false,
        loginDone: true,
        me: dummyUser(action.payload),
      };

    case LOG_IN_FAILURE:
      return {
        ...state,
        loginLoading: false,
        loginDone: false,
        loginError: action.payload,
      };

    case LOG_OUT_REQUEST:
      return {
        ...state,
        logoutLoading: true,
        logoutDone: false,
      };

    case LOG_OUT_SUCCESS:
      return {
        ...state,
        logoutLoading: false,
        logoutDone: true,
        me: null,
      };

    case LOG_OUT_FAILURE:
      return {
        ...state,
        logoutLoading: false,
        logoutDone: false,
        logoutError: action.payload,
      };

    case SIGN_UP_REQUEST:
      return state;
    case SIGN_UP_SUCCESS:
      return state;
    case SIGN_UP_FAILURE:
      return state;

    case ADD_POST_TO_ME: {
      const posts = [action.payload, ...state.me.Posts];
      return {
        ...state,
        me: {
          ...state.me,
          Posts: posts,
        },
      };
    }

    case REMOVE_POST_OF_ME: {
      console.log('페이로드', action.payload);
      const posts = state.me.Posts.filter((post) => post.id !== action.payload);

      return {
        ...state,
        me: {
          ...state.me,
          Posts: posts,
        },
      };
    }

    default:
      return state;
  }
};

export default reducer;
