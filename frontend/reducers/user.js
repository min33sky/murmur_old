import shortid from 'shortid';
import produce from 'immer';
import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from './post';

//----------------------------------------------------------------------------
//* Action Type
//----------------------------------------------------------------------------

export const LOG_IN_REQUEST = 'user/LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'user/LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'user/LOG_IN_FAILURE';

export const LOG_OUT_REQUEST = 'user/LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'user/LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'user/LOG_OUT_FAILURE';

export const SIGN_UP_REQUEST = 'user/SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'user/SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'user/SIGN_UP_FAILURE';

export const CHANGE_NICKNAME_REQUEST = 'user/CHANGE_NICKNAME_REQUEST';
export const CHANGE_NICKNAME_SUCCESS = 'user/CHANGE_NICKNAME_SUCCESS';
export const CHANGE_NICKNAME_FAILURE = 'user/CHANGE_NICKNAME_FAILURE';

export const FOLLOW_REQUEST = 'user/FOLLOW_REQUEST';
export const FOLLOW_SUCCESS = 'user/FOLLOW_SUCCESS';
export const FOLLOW_FAILURE = 'user/FOLLOW_FAILURE';

export const UNFOLLOW_REQUEST = 'user/UNFOLLOW_REQUEST';
export const UNFOLLOW_SUCCESS = 'user/UNFOLLOW_SUCCESS';
export const UNFOLLOW_FAILURE = 'user/UNFOLLOW_FAILURE';

//----------------------------------------------------------------------------
//* Action Function
//----------------------------------------------------------------------------

export const loginRequestAction = (loginData) => ({
  type: LOG_IN_REQUEST,
  payload: loginData,
});

export const logoutRequestAction = () => ({
  type: LOG_OUT_REQUEST,
});

export const signupRequestAction = (signUpData) => ({
  type: SIGN_UP_REQUEST,
  payload: signUpData,
});

export const changeNicknameAction = (nicknameData) => ({
  type: CHANGE_NICKNAME_REQUEST,
  payload: nicknameData,
});

export const followRequestAction = (userId) => ({
  type: FOLLOW_REQUEST,
  payload: userId,
});

export const unfollowRequestAction = (userId) => ({
  type: UNFOLLOW_REQUEST,
  payload: userId,
});

//! --------------------------------- 더미 함수 -------------------------------
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

//----------------------------------------------------------------------------
//* State & Reducer Function
//----------------------------------------------------------------------------

const initialState = {
  loginLoading: false, // 로그인 요청 여부
  loginDone: false, // 로그인 여부
  loginError: null,
  logoutLoading: false, // 로그아웃 요청 여부
  logoutDone: false,
  logoutError: null,
  signUpLoading: false, // 회원 가입 요청 여부
  signUpDone: false,
  signUpError: null,
  changeNicknameLoading: false,
  changeNicknameDone: false,
  changeNicknameError: null,
  followLoding: false,
  unfollowLoding: false,
  me: null, // 로그인 한 사용자 정보
  // signedUpData: {}, // 가입 요청 데이터
  // loginData: [], // 로그인 요청 데이터
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
        draft.signUpLoading = true;
        draft.signUpDone = false;
        draft.signUpError = null;
        break;

      case SIGN_UP_SUCCESS:
        draft.signUpLoading = false;
        draft.signUpDone = true;
        break;

      case SIGN_UP_FAILURE:
        draft.signUpLoading = false;
        draft.signUpError = action.payload;
        break;

      // TODO: 미완성
      case CHANGE_NICKNAME_REQUEST:
        break;

      case CHANGE_NICKNAME_SUCCESS:
        break;

      case CHANGE_NICKNAME_FAILURE:
        break;

      // Follow 관련
      case FOLLOW_REQUEST:
        draft.followLoading = true;
        draft.followDone = false;
        draft.followError = null;
        break;

      case FOLLOW_SUCCESS:
        draft.followLoading = false;
        draft.followDone = true;
        draft.me.Followings.push({ id: action.payload });
        break;

      case FOLLOW_FAILURE:
        draft.followLoading = false;
        draft.followDone = false;
        draft.loginError = action.payload;
        break;

      case UNFOLLOW_REQUEST:
        draft.unfollowLoading = true;
        draft.unfollowDone = false;
        draft.unfollowError = null;
        break;

      case UNFOLLOW_SUCCESS:
        draft.unfollowLoading = false;
        draft.unfollowDone = true;
        draft.me.Followings = draft.me.Followings.filter((user) => user.id !== action.payload);
        break;

      case UNFOLLOW_FAILURE:
        draft.unfollowLoading = false;
        draft.unfollowDone = false;
        draft.loginError = action.payload;
        break;

      // POST 리듀서에서 나오는 액션 처리

      case ADD_POST_TO_ME:
        draft.me.Posts.unshift({ id: action.payload });
        break;

      case REMOVE_POST_OF_ME:
        draft.me.Posts = draft.me.Posts.filter((post) => post.id !== action.payload);
        break;

      default:
        break;
    }
  });

export default reducer;
