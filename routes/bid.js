var express = require('express');
var router = express.Router();
var path = require('path');
var Promise=require('promise');


/* GET final js file to be sent to the client */
router.get('/', function(req, res, next) {
    console.log(req.query);
  
  });

  module.exports = router;
  