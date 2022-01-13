var express = require('express');
var adminrouter = express.Router();
var adminpassport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var anthu = require('./../routes/passport.js');

var User = require('./../dbmodels/Staffdb');

adminrouter.get('/stouser', function (req, res, next) {
    // console.log('req.session.passport.user(admin) =  ' + JSON.stringify( req.session))
    if (req.session.passport != undefined) {
        var userid = req.session.passport.user;
        //   console.log("req.body = " + JSON.stringify(req.body))
        User.findById(userid, function (err, existingbannersUser) {
            if (existingbannersUser != null) {
                return res.json(existingbannersUser);
            }
        });
    }
});

// adminpassport To Login  Staffdb
adminpassport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with UsStaffcd
    usernameField : 'UsStaffcd',
    passwordField : 'UsPassword' ,
    passReqToCallback : true // allows us to pass back the entire request to the callback
},
function(req, username, password, done) {
//console.log('UsStaffcd = ' + username +  '     UsPassword = ' + password)
    // asynchronous
    // User.findOne wont fire unless data is sent back
    process.nextTick(function() {

    // find a user whose UsStaffcd is the same as the forms UsStaffcd
    // we are checking to see if the user trying to login already exists
    User.findOne({ 'UsStaffcd' : { $regex:  username, $options: 'i' }} , function(err, user) {
        // if there are any errors, return the error
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
    //    console.log("Password = " + user.validPassword(password) )
        if (!user.validPassword(password)) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    });
    });
 

}));


adminrouter.post('/login',
    adminpassport.authenticate('local-login', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true

    },
 //       console.log("doing post login"),
    )
);// end  of check for login suing passport

adminrouter.post('/wvlogin',
    adminpassport.authenticate('local-login', {
        successRedirect: '/wvdispschedule#?wssmode=wv',
        failureRedirect: '/wvlogin',
        failureFlash: true

    },
 //       console.log("doing post webview login"),
    )
);// end  of check for wvlogin suing passport


adminrouter.get('/logout', function (req, res) {
    req.session.destroy(function(err){
        req.logout();
        res.clearCookie('user_sid');
        res.clearCookie('UsStaffcd');
        res.clearCookie('user_id');
        res.redirect('/');
      })
  });



    /* req.session.destroy(function (err) {
        res.clearCookie('connect.sid');
        // req.flash('success', "you have successfully logout...")
        //,{flash: {notice: req.flash('success')}}); //Inside a callback\85 bulletproof!
        res.redirect('/')
    });
}); */

module.exports = adminrouter;