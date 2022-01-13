var express = require('express');
var forgotrouter = express.Router();

async = require('async'),
    crypto = require('crypto');

// Get Homepage
forgotrouter.get('/forgot', function (req, res) {
   // console.log("doing get forgot" + JSON.stringify(req.body));
    res.render('forgot', {
        user: req.user
    });
});

forgotrouter.post('/forgot', function (req, res, next) {
 //   console.log("doing post forgot admin" + JSON.stringify(req.body) + "      req.body[1] = " + req.body[1]);
    if (req.body[1] == "Admin") {
        //     console.log("req.body[0] admin = " + JSON.stringify(req.body[0]) + "     user =  " + JSON.stringify(User));
        var User = require('../dbmodels/Staffdb');
    } else {
        //   console.log("req.body[0] cust = " + JSON.stringify(req.body[0]) + "     user =  " + JSON.stringify(User));
        var User = require('./../dbmodels/clientdb');
    }
//console.log("req.body[0] = " + JSON.stringify(req.body[0]))
    User.findOne(req.body[0], function (err, user) {
      //  console.log("response from checkcust    " + user);
        // res.send(data);
        if (!user) {
            //   console.log("user not fuund" + "  err = " + err);
            req.session.errors = [{ "param": "email", "msg": "No account with that email address exists.", "value": "" }]
            //  req.flash('errors', 'No account with that email address exists.');
            //return 
            //res.send(err, user);
            return res.send("nok");
        } else {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
            //    console.log("token = " + token);
                // res.send(token);

              //  console.log("date = " + Date.now());
                user.resetPasswordToken = token;

                var dt = new Date();
                dt.setDate(dt.getDate() + 10);
              //  console.log("date plus one day is : " + dt);
              user.resetPasswordExpires = dt; // Date.now() + 3600000; // 1 hour
                
                user.save(function (err) {
               //     console.log("user fuund  token = " + token + "     user = " + user)
                    res.send({ token: token, user: user });
                });
            }); // ecnd of crypto
        }  //if ! user
    });
});

// forgot password
forgotrouter.get('/forgot', function (req, res) {
    res.render('forgot', {
        user: req.user
    });
});

module.exports = forgotrouter;