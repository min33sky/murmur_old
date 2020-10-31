const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { Op } = require('sequelize');
const { User, Post, Image, Comment } = require('../models');
const { isNotLoggedIn, isLoggedIn } = require('./middlewares');

const router = express.Router();

/**
 * 로그인 상태 체크
 * GET /user
 */
router.get('/', async (req, res, next) => {
  try {
    console.log('************');
    console.log(req.headers); // 쿠키 확인용
    console.log('************');

    // 로그인 한 유저인지 체크 (비직렬화를 거쳐서 req.user에 유저 정보가 들어있음)
    if (req.user) {
      const fullUser = await User.findOne({
        where: {
          id: req.user.id,
        },
        attributes: {
          exclude: ['password'],
        },
        include: [
          {
            model: Post, // 작성한 게시물
            attributes: ['id'], // 자원을 줄이기 위해 필요한 값만 보낸다.
          },
          {
            model: User, // 팔로워 정보
            as: 'Followers',
            attributes: ['id'],
          },
          {
            model: User, // 팔로잉 정보
            as: 'Followings',
            attributes: ['id'],
          },
        ],
      });
      res.status(201).json(fullUser);
    } else {
      res.status(201).json(null);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

/**
 * 특정 사용자 정보 가져오기
 * GET /user/:id
 */
router.get('/:id', async (req, res, next) => {
  try {
    const fullUserWithoutPassword = await User.findOne({
      where: {
        id: req.params.id,
      },
      attributes: {
        exclude: ['password'],
      },
      include: [
        {
          model: Post,
          attributes: ['id'],
        },
        {
          model: User,
          as: 'Followings',
          attributes: ['id'],
        },
        {
          model: User,
          as: 'Followers',
          attributes: ['id'],
        },
      ],
    });

    if (fullUserWithoutPassword) {
      const data = fullUserWithoutPassword.toJSON(); // 시퀄라이즈 객체를 JSON으로 변경
      data.Posts = data.Posts.length;
      data.Followings = data.Followings.length;
      data.Followers = data.Followers.length;
      return res.status(200).json(data);
    }

    return res.status(404).json('존재하지 않는 사용자입니다.');
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

/**
 * 특정 유저의 게시물 목록 가져오기
 * GET /user/:id/posts?lastId
 */
router.get('/:id/posts', async (req, res, next) => {
  try {
    // 해당 유저가 존재하는 지 확인
    const user = await User.findOne({ where: { id: req.params.id } });

    if (!user) {
      return res.status(404).send('해당 유저가 존재하지 않습니다.');
    }

    // 유저의 글 가져오기
    const where = {};
    if (parseInt(req.query.lastId, 10)) {
      where.id = {
        [Op.lt]: parseInt(req.query.lastId, 10),
      };
    }

    // ? 특정 사용자의 게시물들을 관계 메서드로 불러온다
    const posts = await user.getPosts({
      where,
      limit: 10,
      include: [
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User, // 댓글 작성자
              attributes: ['id', 'nickname'],
            },
          ],
        },
        {
          model: User, // 게시물 작성자
          attributes: ['id', 'nickname'],
        },
        {
          model: User, // 좋아요 누른 사람 정보
          through: 'Like',
          as: 'Likers',
          attributes: ['id'],
        },
        {
          model: Post, // 리트윗
          as: 'Retweet',
          include: [
            {
              model: User,
              attributes: ['id', 'nickname'],
            },
            {
              model: Image,
            },
          ],
        },
      ],
    });

    console.log(posts);
    return res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

/**
 * 로그인 요청
 * ? 패스포트와 미들웨어 확장을 이용한다.
 * POST /login
 */
router.post('/login', isNotLoggedIn, (req, res, next) => {
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

    /**
     * ? 서비스 로그인뿐만 아니라 Passport 자체 로그인까지 성공해야 로그인이 완료
     * * passport.serializeUser()가 호출된다.
     */
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }

      /**
       * * 게시물 정보와 유저 정보를 조인
       * ? Post는 hasMany 관계이므로 Posts 프로퍼티가 생성
       */
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
            attributes: ['id'],
          },
          {
            model: User,
            as: 'Followers',
            attributes: ['id'],
          },
          {
            model: User,
            as: 'Followings',
            attributes: ['id'],
          },
        ],
      });

      // res.setHeader()로 세션 쿠키가 설정된다.
      return res.status(200).json(fullUserWithoutPassword);
    });
  })(req, res, next); // ? express에서 미들웨어 확장의 예
});

/**
 * 회원 가입
 * POST /
 */
router.post('/', isNotLoggedIn, async (req, res, next) => {
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

    // TODO: 회원 가입 후 바로 로그인 하기

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
router.post('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.send('ok');
});

/**
 * 닉네임 변경
 * PATCH /nickname
 */
router.patch('/nickname', isLoggedIn, async (req, res, next) => {
  try {
    await User.update(
      {
        nickname: req.body.nickname,
      },
      {
        where: {
          id: req.user.id,
        },
      },
    );

    return res.status(200).json({
      nickname: req.body.nickname,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

/**
 * 팔로우
 * PATCH /:userId/follow
 */
router.patch('/:userId/follow', isLoggedIn, async (req, res, next) => {
  try {
    // 팔로우 할 유저 정보를 가져온다.
    const user = await User.findOne({
      where: {
        id: req.params.userId,
      },
    });

    if (!user) {
      return res.status(403).send('해당 유저가 존재하지 않습니다.');
    }

    // 그 사람의 팔로워에 나를 추가한다.
    await user.addFollowers(req.user.id);

    return res.status(200).json({
      id: parseInt(req.params.userId, 10),
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

/**
 * 언팔로우
 * DELETE /:userId/follow
 */
router.delete('/:userId/follow', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.userId,
      },
    });

    if (!user) {
      return res.status(403).send('해당 유저가 존재하지 않습니다.');
    }

    await user.removeFollowers(req.user.id);

    return res.status(200).json({
      id: parseInt(req.params.userId, 10),
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

/**
 * 팔로잉 목록 가져오기
 * GET /followings
 */
router.get('/followings', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.user.id,
      },
    });

    if (!user) {
      return res.status(403).send('없는 사람입니다.');
    }

    const followings = await user.getFollowings();

    console.log('###### :', followings);

    return res.status(200).json(followings);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

/**
 * 팔로워 목록 가져오기
 * GET /followers
 */
router.get('/followers', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.user.id,
      },
    });

    if (!user) {
      return res.status(403).send('없는 사람입니다.');
    }

    const followers = await user.getFollowers();

    console.log('###### :', followers);
    return res.status(200).json(followers);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

/**
 * 팔로워 삭제
 * DELETE /follower/:userId
 */
router.delete('/follower/:userId', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.userId,
      },
    });

    if (!user) {
      return res.status(403).send('해당 유저가 존재하지 않습니다.');
    }

    await user.removeFollowings(req.user.id);

    return res.status(200).json({
      id: parseInt(req.params.userId, 10),
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
