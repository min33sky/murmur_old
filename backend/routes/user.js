const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { User } = require('../models');

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
      return res.status(401).send(loginFailureInfo.reason);
    }

    //? 서비스 로그인뿐만 아니라 Passport 자체 로그인까지 성공해야 로그인이 완료
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      return res.status(200).json(user);
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

module.exports = router;
