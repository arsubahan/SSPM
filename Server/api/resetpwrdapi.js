var express = require('express');
var rstpwdrouter = express.Router();
var bcrypt = require('bcryptjs')


//var custmodel = require('./../dbmodels/clientdb');

var User = "";  //require('./../dbmodels/Administrator');

rstpwdrouter.post('/resetpword/:token', function (req, res) {
    //    console.log("req.params.token = " + req.params.token + "    -   req.bosy = " + JSON.stringify(req.body) + "   expie = " + JSON.stringify({ resetPasswordExpires: { $gt: Date.now() } }));
    if (req.body.wsstype == "client") {
        //   console.log("doing client")
        var User = require('./../dbmodels/clientdb');
    } else {
        var User = require('../dbmodels/Staffdb');

    }// end of set database cust or admin
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gte: Date.now() } },
        function (err, user) {
            //      console.log("user after check = " + JSON.stringify(user) + "     database = " + JSON.stringify(User) )
            if (!user) {
                //          console.log("error = " + JSON.stringify(user));
                req.session.success = false;
                req.session.errors = [
                    {
                        "param": "resetPasswordToken",
                        "msg": "Password reset token is invalid or has expired.",
                        "value": ""
                    }]
                //   console.log(" req.session.errors = " + JSON.stringify(req.session.errors));
                return res.send("nok");
            } else {
                res.send(user);
            }
        }) // end of find one

});  // end of resetcust


//update password
rstpwdrouter.put('/updresetpword/:id', function (req, res) {
    //  console.log("req body before saving =  "  + JSON.stringify(req.body) + "   req.params.id  = " + req.params.id);
    var saveitm = {};
    var wsspword = req.body[0]
    //  console.log("wsspword = " + JSON.stringify( wsspword));
    if (req.body[1] == "Admin") {
        //   console.log("doing Admin update...")
        User = require('../dbmodels/Staffdb');
        wsspword = bcrypt.hashSync(wsspword, bcrypt.genSaltSync(10), null); //User.encryptPassword(wsspword)

        saveitem =
        {
            $set: {
                //password = req.body.password;
                resetPasswordToken: null,
                resetPasswordExpires: null,
                UsPassword: wsspword
            }
        }
    } else {
        //    console.log("doing client update...")

        User = require('./../dbmodels/clientdb');
        wsspword = bcrypt.hashSync(wsspword, bcrypt.genSaltSync(10), null); //User.encryptPassword(wsspword)
        saveitem =
        {
            $set: {
                //password = req.body.password;
                resetPasswordToken: null,
                resetPasswordExpires: null,
                clpassword: wsspword
            }
        }// end of set database cust or admin
    }
    // wsspword = User.encryptPassword(wsspword);
    //  console.log("savetiem = " + JSON.stringify(saveitem) +   "       USER = " + User);
    User.findOneAndUpdate({ _id: req.params.id },
        saveitem,
        {
            new: true, useFindAndModify: false
        },
        function (err, saveditems) {
            if (err) {
                //  console.log("error = " + req.session.error + "       saveditems = " + JSON.stringify(saveditems))
                res.send(req.session.error)

            } else {
                req.check('saveditems', 'Record Saved Successfully').notEmpty();
                var success = req.validationErrors();
                //  console.log("ok =        saveditems = " + JSON.stringify(saveditems) + "       success = " + JSON.stringify(success))
                res.send(req.session.success)

            }
        })

});

//open reset password form
rstpwdrouter.get('/respassword', function (req, res) {
    //  console.log("doing respassword req =" + JSON.stringify(req.body));
    res.render('respassword', {
        success: req.session.success,
        errors: req.session.errors //,
        //data: req.body
    });
    req.session.errors = null;
    req.session.success = null;
});

module.exports = rstpwdrouter;