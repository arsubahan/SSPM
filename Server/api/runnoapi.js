var express = require('express');
var runnorouter = express.Router();

var runmodel = require('./../dbmodels/runnofl');

//console.log("stating runno api.....");
// Wrap all the methods in an object
runnorouter.get('/runno', function (req, res, next) {
    //  res.send({ type: 'GET' });
  //  console.log("doing get for runno.....");
    runmodel.find(function (err, data) {
        if (err) console.error;
        res.json(data);
    });

});



//Delete  a list of news from db
runnorouter.delete('/delrunno/:id', function (req, res) {
    res.send({ type: 'DELETE' });
});

module.exports = runnorouter;