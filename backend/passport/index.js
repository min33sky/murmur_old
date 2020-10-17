const passport = require('passport');
const local = require('./local');

module.exports = () => {
  passport.serializeUser(() => {});

  passport.deserializeUser(() => {});

  local(); // local 로그인 전략 함수를 호출
};
