var express = require('express');
var passrouter = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../dbmodels/Staffdb');
var clmodel = require('../dbmodels/clientdb');

// serialize
passport.serializeUser(function (user, done) {
 //   console.log("doing serialisatin......" + user.id)
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        if (err) done(err);
        if (user) {
            done(null, user);
        } else {
            clmodel.findById(id, function (err, user) {
                if (err) done(err);
                done(null, user);
            })
        }
    });
});

module.exports.ensureAuthenticated = function (req, res, next) {
   // console.log("this.ensureAuthenticated .....admin>")
    if (req.session.passport) {
         //  console.log("req.session.use = " + JSON.stringify(req.session.passport.user));// + "    (req.session = " + req.session.passport.user);
        if (req.session.passport.user) {
            User.findById({ _id: req.session.passport.user }, function (err, user) {
                if (!user) {
                    // console.log("user error = " + user)
                    res.render('login');
                    //  })
                } else {
                    //  console.log("admin user = " + user)
                    res.locals.user = user;
                    return next();
                }
            })
        } else {
            res.render('login');

        }
    } else {
         res.render('login');
    }
}

module.exports.wvensureAuthenticated = function (req, res, next) {
 //   console.log("this.ensureAuthenticated .....webview>")
    if (req.session.passport) {
         //  console.log("req.session.use = " + JSON.stringify(req.session.passport.user));// + "    (req.session = " + req.session.passport.user);
        if (req.session.passport.user) {
            User.findById({ _id: req.session.passport.user }, function (err, user) {
                if (!user) {
                    // console.log("user error = " + user)
                    res.render('wvlogin');
                    //  })
                } else {
                    //  console.log("admin user = " + user)
                    res.locals.user = user;
                    return next();
                }
            })
        } else {
            res.render('wvlogin');

        }
    } else {
         res.render('wvlogin');
    }
}

module.exports.clensureAuthenticated = function (req, res, next) {
  //  console.log("this.ensureAuthenticated .....client>")
    if (req.session.passport) {
      //   console.log("req.session.client  = " + JSON.stringify(req.session.passport.user));// + "    (req.session = " + req.session.passport.user);
        if (req.session.passport.user) {
            clmodel.findById({ _id: req.session.passport.user }, function (err, user) {
                if (!user) {
                     res.render('clientlogin');
                 } else {
                    // console.log("membomer user = " + user)
                    res.locals.user = user;
                    return next();
                }
            })
        } else {
            res.render('clientlogin');

        }
    } else {
        res.render('clientlogin');
    }
}
