const express = require('express');
const { Post, Image, Comment, User } = require('../models');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      // where: {
      //   id: req.body.lastId,
      // },
      limit: 10,
      //! offset: 0, 게시물 추가&삭제 시, 문제가 생기므로 offset 대신 lastId 방식을 사용한다
      order: [
        ['createdAt', 'DESC'], // 최신 글부터
        [Comment, 'createdAt', 'DESC'], // 댓글도 최신 댓글부터
      ],
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
          model: User, // 좋아요 누른 사람
          as: 'Likers',
          attributes: ['id'],
        },
        {
          model: Post, // 리트윗한 글
          as: 'Retweet',
          include: [
            {
              model: User, // 리트윗한 글의 작성자
              attributes: ['id', 'nickname'],
            },
            {
              model: Image,
            },
          ],
        },
      ],
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
