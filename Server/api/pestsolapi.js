const path = require('path');

var express = require('express');
var pestsolrouter = express.Router();

var pestsolmodel = require('./../dbmodels/pestsoldb');
var filedb;

pestsolrouter.post("/getpestsol", function (req, res, next) {
    pestsolmodel.aggregate([
        {
            $lookup:
            {
                from: "flpestcdmongos",
                localField: "solpestcd",
                foreignField: "pestcd",
                as: "pestdet"
            }


        }], function (err, result) {
            if (err) console.error;
            //  console.log("result = " + JSON.stringify(result));
            res.send(result);
        })
})

pestsolrouter.post('/getsolfilecrit', function (req, res, next) {
  
    var wssothers = {}
 
    //  console.log("req.body..." + JSON.stringify(req.body) );
    filedb = require(path.resolve("./dbmodels") + "/" + req.body.fltyp);
    filedb.aggregate([
        {
            $match : 
                req.body.txtsrch
        },
        {
            $lookup:
            {
                from: "flpestcdmongos",
                localField: "solpestcd",
                foreignField: "pestcd",
                as: "pestdet"
            }


        }], function (err, result) {
            if (err) console.error;
 //             console.log("result = " + JSON.stringify(result));
            res.send(result);
        })
  
  
  
  
    /* filedb.find(req.body.txtsrch, function (err, data) {
        if (err) console.error;
        // console.log("data = " + JSON.stringify(data))
        res.json(data); 

    });*/
});

module.exports = pestsolrouter;