const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello! Murmur Server');
});

app.post('/', (req, res) => {
  res.send({
    name: 'Murmur Backend',
    content: 'Ok',
  });
});

app.listen(3065, () => {
  console.log('Murmur Backend Server ON');
});
