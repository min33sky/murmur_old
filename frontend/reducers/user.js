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

/****************************************************
 * State & Reducer Function
 ****************************************************/

const initialState = {
  isLoggingIn: false, // 로그인 요청 여부
  isLoggedIn: false, // 로그인 여부
  isLoggingOut: false, // 로그아웃 요청 여부
  me: null, // 로그인 한 사용자 정보
  signedUpData: {}, // 가입 요청 데이터
  loginData: [], // 로그인 요청 데이터
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOG_IN_REQUEST:
      return {
        ...state,
        isLoggingIn: true,
        isLoggedIn: false,
      };

    case LOG_IN_SUCCESS:
      return {
        ...state,
        isLoggingIn: false,
        isLoggedIn: true,
        me: {
          ...action.payload,
          nickname: '하하호호',
        },
      };

    case LOG_IN_FAILURE:
      return {
        ...state,
        isLoggingIn: false,
        isLoggedIn: false,
        me: null,
      };

    case LOG_OUT_REQUEST:
      return {
        ...state,
        isLoggingOut: true,
      };

    case LOG_OUT_SUCCESS:
      return {
        ...state,
        isLoggingOut: false,
        isLoggedIn: false,
        me: null,
      };

    case LOG_OUT_FAILURE:
      return {
        ...state,
      };

    default:
      return state;
  }
};

export default reducer;
