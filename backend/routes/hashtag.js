const express = require('express');
const { Op } = require('sequelize');
const { Hashtag, Post, User, Image, Comment } = require('../models');

const router = express.Router();

/**
 * 해시태그로 게시물 목록 가져오기
 * GET /hashtag/:tag/posts?lastId
 */
router.get('/:tag/posts', async (req, res, next) => {
  try {
    const where = {};
    if (parseInt(req.query.lastId, 10)) {
      where.id = {
        [Op.lt]: parseInt(req.query.lastId, 10),
      };
    }

    const posts = await Post.findAll({
      where,
      limit: 10,
      include: [
        {
          model: Hashtag, // 해시태그 정보
          where: {
            name: decodeURIComponent(req.params.tag), // ? 인코딩된 해시태그를 디코딩해서 조건 검색
          },
        },
        {
          model: Image,
        },
        {
          model: User, // 작성자
          attributes: ['id', 'nickname'],
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
          model: User, // 좋아요 누른 사용자 정보
          through: 'Like',
          as: 'Likers',
          attributes: ['id', 'nickname'],
        },
        {
          model: Post, // 리트윗한 글 정보
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

    return res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
