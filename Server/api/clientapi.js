﻿const path = require('path');
var express = require('express');

var clrouter = express.Router();
var clpassport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var clmodel = require('./../dbmodels/clientdb');

var filedb;

clrouter.get('/stocluser', function (req, res, next) {
 //   console.log('req.session.passport.user(client) =  ' + JSON.stringify(req.session.passport))
    if (req.session.passport != undefined) {
        var userid = req.session.passport.user;
        //    console.log("req.body stocluser  = " + JSON.stringify(userid))
        clmodel.findById(userid, function (err, existingbannersUser) {
            if (existingbannersUser != null) {
                //               console.log('existingbannersUser =  ' + JSON.stringify(existingbannersUser))
                return res.json(existingbannersUser);
            }
        });
    }
});

clrouter.post('/getclientcrit', function (req, res) {
  //  console.log("req body from getclientcrit = " + JSON.stringify(req.body.txtsrch));

    filedb = require(path.resolve("./dbmodels") + "/" + req.body.fltyp);
    var memuser = req.body;
    filedb.aggregate([
        {
            $match: req.body.txtsrch
        },
        {
            $lookup:
            {
                from: "flenquiremongos",
                  localField: "clcode",
                 foreignField: "enqclientcd",


                as: "enqdet"
            }
        },
        {
            $lookup:
            {
                from: "flschedulemongos",
                localField: "enqdet.projtrnsno",
                foreignField: "schprojno",
                as: "projdet"
            }
        },
        {
            $lookup:
            {
                from: "flstaffmongos",
                let: { stcode: { $split: ["projdet.schpersonnel", "*"] } },
                pipeline: [
                    {
                        $match:
                        {
                            // UsStaffcd : {$regex : "/$$stcode/", $options : "i"} // {$regex : "$projdet.schpersonnel"}

                        }
                    } //end of $match
                ], // end of pipeline

                as: "staffdet"
            }
        }

    ], function (err, result) {
        if (err) console.error;
        //    console.log("result = " + JSON.stringify(result));
        res.send(result);
    });
});


// adminpassport To Login  Administrator
clpassport.use('local-client', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with UsLoginid
    usernameField: 'clcode',
    passwordField: 'clpassword',
    passReqToCallback: true // allows us to pass back the entire request to the callback
},
    function (req, clcode, password, done) {
        //   console.log('clcode = ' + clcode + '     UsPassword = ' + password)
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function () {

            // find a user whose UsLoginid is the same as the forms UsLoginid
            // we are checking to see if the user trying to login already exists
            clcode = clcode.toUpperCase()
            clmodel.findOne({ clcode: { $regex: clcode, $options: 'i' } }, function (err, cluser) {
                // if there are any errors, return the error
                if (err) {
                    return done(err);
                }
                if (!cluser) {
                    return done(null, false, { message: 'Incorrect client Id.' });
                }
            //    console.log("cluser = " + JSON.stringify(cluser))
                if (!cluser.validPassword(password)) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                //    console.log("userfrom client  = " + JSON.stringify(cluser))

                return done(null, cluser);
            });
        });
    }));

clrouter.post('/clientlogin',
    clpassport.authenticate('local-client', {
        successRedirect: '/clienthome',
        failureRedirect: '/clientlogin',
        failureFlash: true

    },
        console.log("doing post home login"),
    )
);// end  of check for login suing passport


clrouter.get('/cllogout', function (req, res) {
    req.session.destroy(function (err) {
        req.logout();
        res.clearCookie('user_sid');
        res.clearCookie('clcode');
        res.clearCookie('user_id');
        res.redirect('/home');
    })
});

module.exports = clrouter;


