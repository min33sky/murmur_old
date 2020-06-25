import { HYDRATE } from 'next-redux-wrapper';

const LOG_IN = 'user/LOG_IN';
const LOG_OUT = 'user/LOG_OUT';

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

const initialState = {
  isLoggedIn: false,
  me: null,
  signedUpData: {},
  loginData: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case HYDRATE:
      console.log('HYDRATE', action);
      return {
        ...state,
        ...action.payload,
      };

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
