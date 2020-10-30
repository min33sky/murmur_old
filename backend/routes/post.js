const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();
const { Post, Comment, Image, User, Hashtag } = require('../models');

// 업로드 폴더 생성
try {
  fs.accessSync('uploads');
} catch (error) {
  console.log('uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

/**
 ** 이미지는 서버에서 지울 필요없다. (머신러닝 등으로 활용 가능)
 ** 최종적으로는 이미지 파일은 S3같은 클라우드에 저장되고 DB에는 이미지 파일 주소만 저장된다.
 */
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads'); // uploads 폴더
    },
    filename(req, file, done) {
      // ex) messi.png
      const ext = path.extname(file.originalname); // .png (확장자 추출)
      const basename = path.basename(file.originalname, ext); // messi
      done(null, `${basename}_${new Date().getTime()}${ext}`); // messi_1245112414.png
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

/**
 * 게시물 등록
 *? 파일을 업로드하는게 아니라 FormData로 요청되는
 *? 이미지 주소, 글 내용 둘 다 텍스트이므로 none() 사용
 * POST /post
 */
router.post('/', isLoggedIn, upload.none(), async (req, res, next) => {
  try {
    // 1. DB에 저장
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });

    // 글에서 해시태그 가져오기
    const hashtag = req.body.content.match(/#[^\s#]+/g);

    if (hashtag) {
      const result = await Promise.all(
        hashtag.map((tag) =>
          //* 중복 해시 태그는 DB에 저장하지 않는다.
          Hashtag.findOrCreate({
            where: {
              name: tag.slice(1).toLowerCase(), // ? 해시태그에는 대소문자 구별을 하지 말자
            },
          }),
        ),
      );
      // ? findOrCreate일 때는 2차원 배열로 리턴된다.
      // ? result 예시 : [[태그이름1. true], [태그이름2, false].....]
      await post.addHashtags(result.map((item) => item[0]));
    }

    if (req.body.image) {
      // 이미지 개수에 따라 처리
      if (Array.isArray(req.body.image)) {
        const images = await Promise.all(
          req.body.image.map((image) => Image.create({ src: image })),
        );
        // 관계 설정
        await post.addImages(images);
      } else {
        const image = await Image.create({ src: req.body.image });
        await post.addImages(image);
      }
    }

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
 * 게시물 불러오기
 * GET /:postId
 */
router.get('/:postId', async (req, res, next) => {
  try {
    // 게시물이 있는지 확인
    const post = await Post.findOne({
      where: {
        id: req.params.postId,
      },
      include: [
        {
          model: User, // 글 작성자
          attributes: ['id', 'nickname'],
        },
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
          model: User, // 좋아요 정보
          as: 'Likers',
          attributes: ['id'],
        },
      ],
    });

    if (!post) {
      return res.status(404).send('해당 게시물이 존재하지 않습니다.');
    }

    return res.status(200).json(post);
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

/**
 * 리트윗
 * POST /:postId/retweet
 */
router.post('/:postId/retweet', isLoggedIn, async (req, res, next) => {
  try {
    /**
     * 1. 내가 쓴 글 & 내가 쓴 글을 리트윗한 글은 리트윗 금지
     * 2. 이미 리트윗 한 글은 리트윗 금지
     */
    const post = await Post.findOne({
      where: {
        id: req.params.postId,
      },
      include: [
        {
          model: Post, // 리트윗할 글 정보
          as: 'Retweet',
        },
      ],
    });

    if (!post) {
      return res.status(403).json({
        message: '해당 게시물이 없습니다.',
        postId: parseInt(req.params.postId, 10),
      });
    }

    if (post.UserId === req.user.id || (post.Retweet && post.Retweet.UserId === req.user.id)) {
      return res.status(403).json({
        message: '자신의 글은 리트윗할 수 없어요.',
        postId: parseInt(req.params.postId, 10),
      });
    }

    const retweetTargetId = post.RetweetId || post.id; // 리트윗한 게시물 || 원본 게시물

    const exPost = await Post.findOne({
      where: {
        UserId: req.user.id,
        RetweetId: retweetTargetId,
      },
    });

    if (exPost) {
      return res.status(403).json({
        message: '이미 리트윗 한 글입니다.',
        postId: parseInt(req.params.postId, 10),
      });
    }

    const retweet = await Post.create({
      UserId: req.user.id,
      RetweetId: retweetTargetId,
      content: 'retweet', // ? allowNull이 true이므로 아무 값 작성
    });

    const retweetWithPrevPost = await Post.findOne({
      where: {
        id: retweet.id,
      },
      include: [
        {
          model: Post,
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
          model: Image,
        },
        {
          model: User, // 좋아요 누른 사람
          as: 'Likers',
          attributes: ['id'],
        },
      ],
    });

    return res.status(200).json(retweetWithPrevPost);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
