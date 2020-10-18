const passport = require('passport');
const local = require('./local');
const { User } = require('../models');

module.exports = () => {
  // req.login() 호출시 직렬화 (시퀄라이저 객체를 세션에 저장하기 위해 변환)
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // 비직렬화 (세션에 저장된 값을 시퀄라이저 객체로 변환)
  // id는 세션 id를 파싱한 값
  passport.deserializeUser(async (id, done) => {
    try {
      console.log('=========================== 비 직 렬 화 ================================');

      // id값으로 DB에서 user 정보를 가져온다.
      const user = await User.findOne({
        where: {
          id,
        },
      });

      done(null, user); //* req.user에 user 정보가 저장된다.
    } catch (error) {
      console.error(error);
      done(error);
    }
  });

  local(); // 로컬 로그인 전략 함수를 호출
};
