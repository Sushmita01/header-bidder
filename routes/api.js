var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var mysql = require('mysql');
var Promise=require('promise');
var publisherID=null;


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
    conn.query( sql, ( err, rows ) => {
        if ( err )
            return reject( err );
        resolve( rows );
    } );
} );
}

function getData(cb) {

  getPublisherDetails=query(con,"SELECT * FROM PUBLISHER WHERE ID=" + publisherID + ";");

  exports.getPublisherDetails = getPublisherDetails;


  getAdSlots=query(con,"SELECT publisher_id,slot_id,CONCAT(width, 'x', height) AS dimension,slot_name FROM adslot AS a JOIN slot_size AS s ON a.size_id=s.id WHERE publisher_id=" + publisherID + ";");

  exports.getAdSlots = getAdSlots;


  getProviders=query(con,"SELECT * FROM provider WHERE id IN (SELECT providerid FROM adslot_provider WHERE ExternalPublisherID=" + publisherID + ")");

  exports.getProviders = getProviders;


  getProvidersMap=query(con,"SELECT * FROM adslot_provider WHERE ExternalPublisherID=" + publisherID);

  exports.getProvidersMap = getProvidersMap;

  Promise.all([getPublisherDetails, getAdSlots, getProviders,getProvidersMap]).then(function(values) {
    // console.log(values);
    exports.publisherDetails = "[";
    values[0].forEach(function (element) {
        exports.publisherDetails += JSON.stringify(element);
    });
    exports.publisherDetails += "]";

    exports.adslots = "[";
    values[1].forEach(function (element, index) {
        if (index != 0)
            exports.adslots += "," + JSON.stringify(element);
        else
            exports.adslots += JSON.stringify(element);
    });
    exports.adslots += "]";

    exports.providers = "[";
    values[2].forEach(function (element, index) {
        if (index != 0)
            exports.providers += "," + JSON.stringify(element);
        else
            exports.providers += JSON.stringify(element);
    });
    exports.providers += "]";

    exports.adProvidermap = "[";
    values[3].forEach(function (element, index) {
        if (index != 0)
            exports.adProvidermap += "," + JSON.stringify(element);
        else
            exports.adProvidermap += JSON.stringify(element);
    });
    exports.adProvidermap += "]";

    
  

    fs.writeFile('public/javascripts/final.js', "var config={publisherDetails:"+exports.publisherDetails+",adslots: "+exports.adslots+",providers: "+exports.providers+",AdslotProvidersMap:"+ exports.adProvidermap+"};", function (err) {
      if (err) {
        return console.error(err);
      }
     
        fs.readFile('./adapterManager.js', function (err,adapterData) {
          if (err) throw err; 
          
          fs.appendFile('public/javascripts/final.js', adapterData , function (err) {
            if (err) {
              return console.error(err);
            }
            fs.readFile('./auctionManager.js', function (err,auctionData) {
              if (err) throw err;   
              
              fs.appendFile('public/javascripts/final.js', auctionData , function (err) {
                if (err) {
                  return console.error(err);
                }
                fs.readFile('./logger.js', function (err,loggerData) {
                  if (err) throw err;
                  
                  fs.appendFile('public/javascripts/final.js', loggerData , function (err) {
                    if (err) {
                      return console.error(err);
                    }
                    fs.readFile('./headerBidder.js', function(err,coreData) {
                      if (err) {
                        return console.error(err);
                      }
                      fs.appendFile('public/javascripts/final.js', coreData , function (err) {
                        if (err) {
                          return console.error(err);
                        }
                        cb();
                  })
                });
            });
            });
        });
        });
    });
    })

  });

  });

}



/* GET final js file to be sent to the client */
router.get('/', function(req, res, next) {
  publisherID=parseInt(req.query.publisher);
  getData(()=> { res.sendFile(path.join(__dirname, '../public/javascripts', 'final.js'));});

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
