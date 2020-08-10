/****************************************************
 * Action Type
 ****************************************************/
const LOG_IN = 'user/LOG_IN';
const LOG_OUT = 'user/LOG_OUT';

/****************************************************
 * Action Function
 ****************************************************/

export const loginAction = () => ({
  type: LOG_IN,
  payload: {
    nickname: 'messi',
    team: 'FC Barcelona',
  },
});

export const logoutAction = () => ({
  type: LOG_OUT,
});

/****************************************************
 * State & Reducer Function
 ****************************************************/

const initialState = {
  isLoggedIn: false, // 로그인 여부
  me: null, // 로그인 한 사용자 정보
  signedUpData: {}, // 가입 요청 데이터
  loginData: [], // 로그인 요청 데이터
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOG_IN:
      return {
        ...state,
        isLoggedIn: true,
        me: action.payload,
      };

    case LOG_OUT:
      return {
        ...state,
        isLoggedIn: false,
        me: null,
      };

    default:
      return state;
  }
};

export default reducer;
