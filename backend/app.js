const express = require('express');
const db = require('./models');
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
app.use(express.json()); // JSON Parsing
app.use(express.urlencoded({ extended: true })); // Form Data Parsing

//----------------------------------------------------
//* Routes
//----------------------------------------------------
app.use('/user', userRouter);
app.use('/post', postRouter);

app.listen(3065, () => {
  console.log('=== Murmur Backend Server ON ===');
});
