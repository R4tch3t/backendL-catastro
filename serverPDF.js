const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'renderPDF')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'renderPDF', 'index.html'));
});

app.listen(80);
app.listen(443);