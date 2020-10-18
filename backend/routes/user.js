const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { User, Post } = require('../models');

const router = express.Router();

// 라우터 테스트용
router.get('/', (req, res) => {
  res.send('Hello! Murmur Server');
});

/**
 * 로그인 요청
 * ? 패스포트와 미들웨어 확장을 이용한다.
 * POST /login
 */
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, loginFailureInfo) => {
    // 서버 에러
    if (err) {
      console.error(err);
      next(err);
    }

    // 로그인 실패 이유를 응답
    if (loginFailureInfo) {
      return res.status(401).send(loginFailureInfo.message);
    }

    //? 서비스 로그인뿐만 아니라 Passport 자체 로그인까지 성공해야 로그인이 완료
    //* passport.serializeUser()가 호출된다.
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }

      //* 게시물 정보와 유저 정보를 조인
      //? Post는 hasMany 관계이므로 Posts 프로퍼티가 생성
      const fullUserWithoutPassword = await User.findOne({
        where: {
          id: user.id,
        },
        attributes: {
          exclude: ['password'], // 비밀번호만 제외하고 가져온다
        },
        include: [
          {
            model: Post,
          },
          {
            model: User,
            as: 'Followers',
          },
          {
            model: User,
            as: 'Followings',
          },
        ],
      });

      // res.setHeader()로 세션 쿠키가 설정된다.
      return res.status(200).json(fullUserWithoutPassword);
    });
  })(req, res, next); //? express에서 미들웨어 확장의 예
});

/**
 * 회원 가입
 * POST /
 */
router.post('/', async (req, res, next) => {
  try {
    // 1. 기존 회원 있는지 확인
    // 2. 있으면 에러 응답. 없으면 비밀번호 해쉬화
    // 3. DB에 저장 후 성공 응답
    const exUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    //! 회원가입 실패: 기존 유저가 존재
    if (exUser) {
      return res.status(403).send('이미 유저가 존재합니다.');
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(req.body.password, 12); // 10 ~ 13 추천

    // DB에 사용자 정보 저장
    await User.create({
      email: req.body.email,
      password: hashedPassword,
      nickname: req.body.nickname,
    });

    return res.status(201).send('회원 가입 성공');
  } catch (error) {
    console.error(error);
    next(error); // Status 500
  }
});

/**
 * 로그아웃
 * POST /logout
 */
router.post('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.status(200).send('Logout Complete');
});

/**
 * 닉네임 변경
 */
router.patch('/nickname', (req, res) => {});

module.exports = router;
