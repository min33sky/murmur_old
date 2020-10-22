const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();
const { Post, Comment, Image, User } = require('../models');

// 업로드 폴더 생성
try {
  fs.accessSync('uploads');
} catch (error) {
  console.log('uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

/**
 * 게시물 등록
 * POST /post
 */
router.post('/', isLoggedIn, async (req, res, next) => {
  try {
    // 1. DB에 저장
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });

    // 2. 게시물과 관련된 정보들을 묶어서 응답한다.
    const fullPost = await Post.findOne({
      where: {
        id: post.id,
      },
      include: [
        {
          model: Image, // 게시물에 포함된 이미지
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
          model: User, // 좋아요 누른 사람
          as: 'Likers',
          attributes: ['id'],
        },
      ],
    });

    return res.status(200).json(fullPost);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

/**
 * 게시물 삭제
 * DELETE /:postId
 */
router.delete('/:postId', isLoggedIn, async (req, res, next) => {
  try {
    await Post.destroy({
      where: {
        id: parseInt(req.params.postId, 10), // 게시물 번호
        UserId: req.user.id, // 작성자
      },
    });

    return res.status(200).json({
      postId: parseInt(req.params.postId, 10),
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

/**
 * 댓글 등록
 * POST /:postId/comment
 */
router.post('/:postId/comment', isLoggedIn, async (req, res, next) => {
  try {
    //! 게시물이 존재하는지 확인
    const post = await Post.findOne({
      where: {
        id: req.params.postId,
      },
    });

    if (!post) {
      return res.status(403).send('게시물이 존재하지 않습니다.');
    }

    // 댓글 등록
    const comment = await Comment.create({
      content: req.body.content,
      UserId: req.user.id,
      PostId: parseInt(req.params.postId, 10), // id는 숫자 값이어야 한다.
    });

    const fullComment = await Comment.findOne({
      where: {
        id: comment.id,
      },
      include: [
        {
          model: User, // 댓글 작성자
          attributes: ['id', 'nickname'],
        },
      ],
    });

    return res.status(200).json(fullComment);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

/**
 * 게시물 좋아요
 * PATCH /:postId/like
 */
router.patch('/:postId/like', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: {
        id: req.params.postId,
      },
    });

    if (!post) {
      return res.status(403).send('해당 게시물이 없습니다.');
    }

    // 좋아요 관계 설정
    await post.addLikers(req.user.id);

    return res.status(200).json({
      UserId: req.user.id,
      PostId: post.id,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

/**
 * 게시물 좋아요 취소
 * DELETE /:postId/like
 */
router.delete('/:postId/like', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: {
        id: req.params.postId,
      },
    });

    if (!post) {
      return res.status(403).send('해당 게시물이 없습니다.');
    }

    await post.removeLikers(req.user.id);

    return res.status(200).json({
      UserId: req.user.id,
      PostId: post.id,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads'); // uploads 폴더
    },
    filename(req, file, done) {
      // messi.png
      const ext = path.extname(file.originalname); // .png (확장자 추출)
      const basename = path.basename(file.originalname, ext); // messi
      done(null, basename + new Date().getTime() + ext); // messi1245112414.png
    },
  }),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
  },
});

/**
 * 이미지 업로드
 * POST /images
 */
router.post('/images', isLoggedIn, upload.array('image'), (req, res) => {
  console.log(req.files);
  return res.status(200).json(req.files.map((v) => v.filename));
});

module.exports = router;
