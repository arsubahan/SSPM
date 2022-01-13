var express = require('express');
var router = express.Router();

var anthu = require('./passport.js');

var User = require('../dbmodels/Staffdb');


// Get Homepage
router.get('/home',  function (req, res) {
   // console.log("req from indexjs = " +  JSON.stringify(res.locals.user));
    //res.render('dashboard', res.locals.user);
    //res.render('dashboard', req.user);
    res.render('home');
});

/* // for customer login
router.get('/membdashboard', anthu.ensureAuthenticated, function (req, res) {
    //console.log("req = " + req.param + "      res = " + res.locals.user);
    res.render('membdashboard', res.locals.user);
}); */


module.exports = router;