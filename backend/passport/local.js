const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { User } = require('../models');
const bcrypt = require('bcrypt');

// 로컬 로그인 전략
module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      //? done: Login router의 passport.authenticate()의 콜백 매개변수에 전달
      async (email, password, done) => {
        try {
          // DB에서 user 정보 가져오기
          const user = await User.findOne({
            where: {
              email,
            },
          });

          //! 로그인 실패1: 가입한 유저가 아님
          if (!user) return done(null, false, { message: '유저가 존재하지 않습니다' });

          // 입력한 비밀번호와 DB에 해쉬화된 비밀번호를 비교
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user); // 로그인 한 유저 정보를 보내준다.
          }
          //! 로그인 실패2: 패스워드 불일치
          return done(null, false, { message: '비밀번호가 틀렸습니다.' });
        } catch (error) {
          console.error(error);
          return done(error);
        }
      },
    ),
  );
};
