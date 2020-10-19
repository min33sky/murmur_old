const express = require('express');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();
const { Post, Comment, Image, User } = require('../models');

/**
 * 게시물 등록
 * POST /post
 */
router.post('/', isLoggedIn, async (req, res, next) => {
  try {
    // DB에 저장
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });

    const fullPost = await Post.findOne({
      where: {
        id: post.id,
      },
      include: [
        {
          model: Image,
        },
        {
          model: Comment,
        },
        {
          model: User,
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
      PostId: req.params.postId,
    });

    return res.status(200).json(comment);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
