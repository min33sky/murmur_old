/****************************************************
 * Action Type
 ****************************************************/
export const LOG_IN_REQUEST = 'user/LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'user/LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'user/LOG_IN_FAILURE';
export const LOG_OUT_REQUEST = 'user/LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'user/LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'user/LOG_OUT_FAILURE';

/****************************************************
 * Action Function
 ****************************************************/

export const loginRequestAction = (data) => ({
  type: LOG_IN_REQUEST,
  payload: data,
});

export const logoutRequestAction = () => ({
  type: LOG_OUT_REQUEST,
});

// ! 더미 함수
const dummyUser = (data) => ({
  ...data,
  nickname: '닉네임이 들어갈 곳',
});

/****************************************************
 * State & Reducer Function
 ****************************************************/

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
      };

    case LOG_OUT_SUCCESS:
      return {
        ...state,
        logoutLoading: false,
        logoutDone: true,
        loginDone: false,
        me: null,
      };

    case LOG_OUT_FAILURE:
      return {
        ...state,
        logoutError: action.payload,
      };

    default:
      return state;
  }
};

export default reducer;
