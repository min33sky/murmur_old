const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const passport = require('passport');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const db = require('./models');
const passportConfig = require('./passport');
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');

const SERVER_PORT = 3065;

// Dotenv 연결
dotenv.config();

// Passport 연결
passportConfig();

// DB 연결
db.sequelize
  .sync()
  .then(() => {
    console.log('======== DB 연결 성공 ========');
  })
  .catch(console.error);

const app = express();

//----------------------------------------------------
//* Middlewares
//----------------------------------------------------

app.use(morgan('dev')); // Logger

app.use(
  /**
   * ? cors:
   * ! Browser와 Server의 Domain이 다르면 Browser가 요청을 차단한다. (쿠키 역시 차단)
   * ! 응답 요청에 Access Control Allow Origin 헤더를 직접 추가하거나 미들웨어를 이용해 해결
   */
  cors({
    origin: true, // access-control-allow-origin
    credentials: true, //* 쿠키도 같이 전달한다. (access-control-allow-credentials)
  }),
);

app.use(cookieParser(process.env.SESSION_SECRET));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(passport.initialize());
app.use(passport.session());
// ? static 미들웨어로 서버쪽 폴더구조를 클라이언트에 노출하지 않으므로 보안이 강화된다.
app.use('/', express.static(path.join(__dirname, 'uploads'))); // Image url
app.use(express.json()); // JSON Parsing
app.use(express.urlencoded({ extended: true })); // Form Data Parsing

//----------------------------------------------------
//* Routes
//----------------------------------------------------

app.use('/posts', postsRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);

// ? 예외처리 미들웨어를 커스터마이징
// ? 에러 페이지로 라우팅등 활용 가능
// app.use((err, req, res, next) => {
// });

//----------------------------------------------------
//* Start Server
//----------------------------------------------------
app.listen(SERVER_PORT, () => {
  console.log('=== Murmur Backend Server ON ===');
});
