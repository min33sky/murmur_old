const express = require('express');
const db = require('./models');
const cors = require('cors');
const passportConfig = require('./passport');
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');

// DB 연결
db.sequelize
  .sync()
  .then(() => {
    console.log('======== DB 연결 성공 ========');
  })
  .catch(console.error);

// Passport 설정
passportConfig();

const app = express();

//----------------------------------------------------
//* Middlewares
//----------------------------------------------------
app.use(
  //? cors:
  //! 브라우저와 서버의 도메인이 다르면 브라우져가 요청을 차단하므로
  //! 응답 요청에 헤더를 직접 추가하거나 미들웨어를 이용해 해결
  cors({
    origin: true,
  }),
);
app.use(express.json()); // JSON Parsing
app.use(express.urlencoded({ extended: true })); // Form Data Parsing

//----------------------------------------------------
//* Routes
//----------------------------------------------------
app.use('/user', userRouter);
app.use('/post', postRouter);

//----------------------------------------------------
//* Start Server
//----------------------------------------------------
app.listen(3065, () => {
  console.log('=== Murmur Backend Server ON ===');
});
