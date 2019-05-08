var express = require('express');
var router = express.Router();
var path = require('path');
var Promise=require('promise');


/* GET final js file to be sent to the client */
router.post('/', function(req, res, next) {
    bidResult=[];
    for (let bidParam of req.body) {
        console.log(bidParam);
        let amount=Math.floor(Math.random() * (1000 - bidParam.floorPrice)) + bidParam.floorPrice; 
        let result = {'slotID':bidParam.slotID,'providerID':bidParam.providerID,'CPM':amount,'adCode':'fhgfhgfghfyh'};
        bidResult.push(result);
    }
    res.send(bidResult);
  
  });

  module.exports = router;
  