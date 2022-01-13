const path = require('path');

var express = require('express');
var fs = require("fs");
var schrouter = express.Router();


schrouter.post('/getschdispcrit', function (req, res) {
  //  console.log("req body getschdispcrit = " + JSON.stringify(req.body.txtsrch));

    filedb = require(path.resolve("./dbmodels") + "/" + req.body.fltyp);
    var memuser = req.body.txtsrch;
    filedb.aggregate([
        {
            $match: memuser
        },
        {
            $lookup:
            {
                from: "flenquiremongos",
                localField: "schprojno",
                foreignField: "projtrnsno",
                as: "enqdet"
            }
        },
        {
            $sort: { "schprojno": 1 }
        },
        {
            $project:
            {
                "schdatest": 1,
                "schcompldate": 1,
                "schdesc": 1,
                "schpersonnel": 1,
                "schtrnsno": 1,
                "schprojno": 1,
                "enqdet": 1
            }
        }
    ], function (err, result) {
        if (err) console.error;
      // console.log("result = " + JSON.stringify(result));
        res.send(result);
    });
});


schrouter.post('/getschfilecrit', function (req, res) {
  //  console.log("req body from lookup = " + JSON.stringify(req.body));

    filedb = require(path.resolve("./dbmodels") + "/" + req.body.wssdata.fltyp);
    var memuser = req.body.wssdata;
    filedb.aggregate([
        {
            $match: memuser.crit
        },
        {
            $lookup:
            {
                from: "flstaffmongos",
                localField: "_id.trcode",
                foreignField: "trcode",
                as: "tourdet"
            }
        },
        {
            $project: {
                test: memuser.selfld
                // } // memuser.selfld
            }
        }
    ], function (err, result) {
        if (err) console.error;
     //   console.log("result = " + JSON.stringify(result));
        res.send(result);
    });
});

module.exports = schrouter;

