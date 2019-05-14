var express = require('express');
var router = express.Router();

var height;
var providerName;
/* GET final js file to be sent to the client */

class BidResponse {

    constructor(slotID,providerID,floorPrice,size) {
        this.slotID=slotID;
        this.providerID=providerID;
    }
}

router.post('/', function(req, res, next) {
    bidResult=[];
    for (let bidParam of req.body) {
        let amount=Math.floor(Math.random() * (10 - bidParam.floorPrice)) + bidParam.floorPrice; 
        let response=new BidResponse(bidParam.slotID,bidParam.providerID);
        response.CPM=amount;
        if( amount!=0) bidParam.noBid=false;
        providerName=response.providerID;
        height=bidParam.size.split('x')[1],
        customAdCode='<!DOCTYPE html><html><head></head><body><style type="text/css">body { text-size-adjust:none; -webkit-text-size-adjust: none; }*{margin:0;padding:0}a{text-decoration:none;outline:none}a:hover{cursor:pointer; text-indent: 0}img{border:none}ul li{list-style:none}.clearfix:after{visibility: hidden;display:block;font-size: 0;content: " ";clear: both;height:0}* html .clearfix{zoom:1} *:first-child+html .clearfix{zoom:1} h1, h2, h3, h4, h5, h6 {font-weight: normal}body{background:#f4f4f4}h3{ font-family: arial; color: #000; font-size: 35px; text-align: center; height: '+height+'px; line-height: '+height+'px;}</style><h3>'+providerName+'</h3></body></html>';
        response.code=customAdCode;
        bidResult.push(response);
    }
    res.send(bidResult);
  
  });

  module.exports = router;
