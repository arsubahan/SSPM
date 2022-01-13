var express = require('express');
var router = express.Router();

var User = require('./../dbmodels/admindb');

router.get('/', function (req, res) {
    console.log("going hone");
    req.session.destroy(function (err) {
    });
    res.render('index')
});

// Get Dashoard (Maitain Database)
router.get('/users/dashboard', ensureAuthenticated, function (req, res) {
    //   console.log("login req.locals = " + req.locals.user);
    //  if (req.session && req.session.user) { // Check if session exists
    // }
    //   var psport = req.session.passport
    //    console.log(psport);
    //   req.session.destroy(function (err) {
    // }); 
    //  res.render('dashboard', psport);
    //  console.log("dashboard res.locals.user = " + res.locals.user);
    //    res.locals.user = req.user;
    res.render('dashboard');
});

function ensureAuthenticated(req, res, next) {
    if (req.session && req.session.user) { // Check if session exists
           console.log("login req.locals = " + req.locals.user);
        User.findById({ _id: req.session.passport.user }, function (err, user) {
            if (err) {
                req.session.destroy(function (err) {
                    console.log("doing reser for login..");
                    res.redirect('/users/login');
                });
                return next();
            }
        });
    } else {
        //req.flash('error_msg','You are not logged in');
        res.redirect('/users/login');
    }



    //if (req.session && req.session.user) { // Check if session exists
    //console.log("from  login ensureauth   =  " + req.locals + "     req.cookies.user_sid = " + req.session);
    //    if (req.locals.user == "custdashboard") {
    //        req.session.destroy(function (err) {
    //            console.log("doing reser for login..");
    //            res.redirect('/users/login');
    //        });
    //    }
    //}
    //if (req.session.passport) {
    //    console.log("adding to local.user");
    //     res.locals.user = "dashboard";
    //    return next();
    //} else {
    //    //req.flash('error_msg','You are not logged in');
    //    res.redirect('/users/login');
    //}
}

// Get Homepage
router.get('/custdashboard', custAuthenticated, function (req, res) {
    //    console.log("cust dashboard res.locals.user = " + res.locals.user);
    //    console.log("cust dashboard = " + req);
    // var psport = req.session.passport
    //  console.log(psport);
    // res.render('custdashboard', psport);
    //   res.locals.user = req.user;
    //  next();
    res.render('custdashboard');
});

function custAuthenticated(req, res, next) {
    console.log("from ensureauth   =" + req.session.user + "     req.sess = " + JSON.stringify(req.locals));
    if (req.session && req.session.user) { // Check if session exists
        if (req.session.user == "dashboard") {
            req.session.destroy(function (err) {
                console.log("doing reser for cust login..");
                res.redirect('/custlogin');
            });
        }
    }
    if (req.session.passport) {
        req.session.user = "custdashboard" || null;
        return next();
    } else {
        //req.flash('error_msg','You are not logged in');
        res.redirect('/custlogin');
    }
}


module.exports = router;