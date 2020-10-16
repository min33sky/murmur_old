const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello! Murmur Server');
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

    if (exUser) {
      return res.status(403).send('이미 유저가 존재합니다.');
    }

    const hash = await bcrypt.hash(req.body.password, 12); // 10 ~ 13 추천

    await User.create({
      email: req.body.email,
      password: hash,
      nickname: req.body.nickname,
    });
    return res.status(201).send('회원 가입 성공');
  } catch (error) {
    console.error(error);
    next(error); // Status 500
  }
});

module.exports = router;
