const express = require('express');
const db = require('./models');
const cors = require('cors');
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');

db.sequelize
  .sync()
  .then(() => {
    console.log('=== DB 연결 성공 ===');
  })
  .catch(console.error);

const app = express();

//----------------------------------------------------
//* Middleware
//----------------------------------------------------
app.use(
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
//* Server Start
//----------------------------------------------------
app.listen(3065, () => {
  console.log('=== Murmur Backend Server ON ===');
});
