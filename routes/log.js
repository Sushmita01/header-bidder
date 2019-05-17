var express = require('express');
var router = express.Router();
var fs = require('fs');
var mysql = require('mysql');
var Promise=require('promise');


var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "media",
  password: "password"
});


con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});


//from db.js
function query(conn, sql) {
  return new Promise( ( resolve, reject ) => {
    conn.query( sql, ( err, rows ) =>{
        if ( err )
            return reject( err );
        resolve( rows );
    } );
} );
}

//generating unique providerRequestID
let timestamp=new Date().toISOString();
providerRequestID=timestamp+'||'+Math.round((Math.random() * (9999 - 1000) + 1000)).toString();


function sendProviderResponse(msg,cb) {
queryPromises=[];
for (let item of msg) {
    adcode="adcode"
    queryStr=`insert into provider_responses (providerID,slotID,ExternalPlacementID,CPM,AdCode,providerRequestID) values (${item.providerID},${item.slotID},${item.EPC},${item.CPM},${con.escape(item.code)},${con.escape(providerRequestID)})`
    res=query(con,queryStr);
    // console.log(queryStr)
    queryPromises.push(res);
  }

   Promise.all(queryPromises).then((values) => {
     console.log("logged provider response");
     cb()
   },
   (err)=> {
     console.log("some error in logging  provider response")
   });
 }


router.post('/providerResponses', function(req, res, next) {
    let message=req.body;
    sendProviderResponse(message,()=> {res.send("Successfully logged provider response");
  });
  });

function sendAuctionParticipants(msg,cb) {
  queryPromises=[];
  for (let item in msg) {
      for(let bid of msg[item]['bids']) {

        queryStr="insert into auction_participants (providerID,slotID,ExternalPlacementID,auctionID,providerRequestID) values ("+bid['provider']+","+msg[item]['slotID']+","+con.escape(bid['EPC'])+","+ con.escape(msg[item]['auctionID']) + ","+con.escape(providerRequestID)+")"
        res=query(con,queryStr);
        console.log(queryStr)
        queryPromises.push(res);
      }
      
    }
  
      Promise.all(queryPromises).then((values) => {
        console.log("logged auction participants");
        cb()
      },
      (err)=> {
        console.log(queryPromises)
        console.log("some error in logging auction participants")
      });
    }

  router.post('/auctionParticipants', function(req, res, next) {
    let message=req.body;
    
    sendAuctionParticipants(message,()=> {res.send("Successfully logged auction participants");});
})


function sendAuctionWinners(msg,cb) {
  queryPromises=[];
  for (let item in msg) {
      winner=msg[item]['winner'];
      queryStr="insert into auction_winners (winnerID,slotID,EPC,auctionID,providerRequestID) values ("+winner['provider']+","+msg[item]['slotID']+","+con.escape(winner['EPC'])+","+ con.escape(msg[item]['auctionID']) + ","+con.escape(providerRequestID)+")"
      res=query(con,queryStr);
      console.log(queryStr)
      queryPromises.push(res);
      
    }
  
      Promise.all(queryPromises).then((values) => {
        console.log("logged auction winners");
        cb()
      },
      (err)=> {
        console.log(queryPromises)
        console.log("some error in logging auction winners")
      });
    }

  router.post('/auctionWinners', function(req, res, next) {
    let message=req.body;
    
    sendAuctionWinners(message,()=> {res.send("Successfully logged auction winners");});   
  });



module.exports = router;
