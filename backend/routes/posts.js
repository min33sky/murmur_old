const express = require('express');
const { Op } = require('sequelize');
const { Post, Image, Comment, User } = require('../models');

const router = express.Router();

/**
 ** 게시물들 불러오기
 *? 처음 요청 이후엔 lastId 값 이전의 게시물들을 불러온다.
 * GET /
 */
router.get('/', async (req, res, next) => {
  try {
    const where = {};

    //* lastId 이전 게시물들을 불러오기 위한 조건 설정
    if (parseInt(req.query.lastId, 10)) {
      where.id = {
        [Op.lt]: parseInt(req.query.lastId, 10),
      };
    }

    const posts = await Post.findAll({
      where,
      limit: 10,
      //! offset: 0, 게시물 추가&삭제 시, 문제가 생기므로 offset 대신 lastId 방식을 사용한다
      order: [
        ['createdAt', 'DESC'], // 최신 글부터
        [Comment, 'createdAt', 'DESC'], // 댓글도 최신 댓글부터
      ],
      include: [
        {
          model: Image, // 이미지
        },
        {
          model: Comment, // 댓글 정보
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
