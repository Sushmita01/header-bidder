var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.send("hettt")
  // res.sendFile('index.html');
});

module.exports = router;
