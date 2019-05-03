var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var mysql = require('mysql');


var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "media",
  password: "password"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  getPublisherDetails(con,345);
  getAdSlots(con,345);
  getProviders(con,345);
  getProvidersMap(con,345); 
});


//from db.js
function getPublisherDetails(conn, publisherID) {
  conn.query("SELECT * FROM PUBLISHER WHERE ID=" + publisherID + ";", function (err, result) {
      if (err)
          throw err;
      exports.publisherDetails = "[";
      result.forEach(function (element) {
          exports.publisherDetails += JSON.stringify(element);
      });
      exports.publisherDetails += "]";
  });
}


exports.getPublisherDetails = getPublisherDetails;
function getAdSlots(conn, publisherID) {
  conn.query("SELECT publisher_id,slot_id,CONCAT(width, ',', height) AS dimension,slot_name FROM adslot AS a JOIN slot_size AS s ON a.size_id=s.id WHERE publisher_id=" + publisherID + ";", function (err, result) {
      if (err)
          throw err;
      exports.adslots = "[";
      result.forEach(function (element, index) {
          if (index != 0)
              exports.adslots += "," + JSON.stringify(element);
          else
              exports.adslots += JSON.stringify(element);
      });
      exports.adslots += "]";
  });
}

exports.getAdSlots = getAdSlots;
function getProviders(conn, publisherID) {
  conn.query("SELECT * FROM provider WHERE id IN (SELECT providerid FROM adslot_provider WHERE ExternalPublisherID=" + publisherID + ")", function (err, result) {
      if (err)
          throw err;
      exports.providers = "[";
      result.forEach(function (element, index) {
          if (index != 0)
              exports.providers += "," + JSON.stringify(element);
          else
              exports.providers += JSON.stringify(element);
      });
      exports.providers += "]";
  });
}


exports.getProviders = getProviders;
function getProvidersMap(conn, publisherID) {
  conn.query("SELECT * FROM adslot_provider WHERE ExternalPublisherID=" + publisherID, function (err, result) {
      if (err)
          throw err;
      exports.adProvidermap = "[";
      result.forEach(function (element, index) {
          if (index != 0)
              exports.adProvidermap += "," + JSON.stringify(element);
          else
              exports.adProvidermap += JSON.stringify(element);
      });
      exports.adProvidermap += "]";
  });
}

exports.getProvidersMap = getProvidersMap;


// // Create a readable stream
// var readerStream = fs.createReadStream('./hb.js');

// // Create a writable stream
// var writerStream = fs.createWriteStream('public/javascripts/final.js');
// readerStream.pipe(writerStream);

// fs.appendFile('public/javascripts/final.js', exports.publisherDetails, function (err) {
//   if (err) throw err;
//   console.log('Saved!');
  
// });


fs.readFile('./headerBidder.js', function(err,data) {
  if (err) {
     return console.error(err);
  }

  console.log("Let's write newly read data");
  
  fs.writeFile('public/javascripts/final.js', data, function (err) {
     if (err) {
        return console.error(err);
     }
     fs.appendFile('public/javascripts/final.js', "var config={publisherDetails:"+exports.publisherDetails+",adslots: "+exports.adslots+",providers: "+exports.providers+",AdslotProvidersMap:"+ exports.adProvidermap+"}", function (err) {
        if (err) throw err;
        console.log('Saved!');
        
      });
  });
});




/* GET final js file to be sent to the client */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/javascripts', 'final.js'));
});



router.get('/config', function(req, res, next) {
  exports.config={
    publisher: JSON.parse(exports.publisherDetails),
    adslots: JSON.parse(exports.adslots),
    providers: JSON.parse(exports.providers),
    providersMap: JSON.parse(exports.adProvidermap)
  };

  console.log("config :"+exports.config);
  res.send(exports.config);
});
module.exports = router;
