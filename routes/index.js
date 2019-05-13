var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  
});

module.exports = router;
