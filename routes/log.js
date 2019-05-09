var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
    let message=req.body;
    // fs.writeFile('public/system_log.txt',message, function (err) {
    //     if (err) {
    //       return console.error(err);
    //     }
       
        
    // });
    res.send("Successfully logged to public/system_log.txt");
  });


module.exports = router;
