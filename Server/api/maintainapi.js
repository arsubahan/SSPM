const path = require('path');

var express = require('express');
var fs = require("fs");
var maintrouter = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var anthu = require('./../routes/passport.js');

var modlus = require('./../routes/Modlus.js');

var filedb;
var reccount;
// console.log("reccount = " + reccount)
var newmemb;
var reccount;
var wsscol = [];
var obj = {};
var dCol;
var dRow;
var wssplit;


//get a list of memb from db
maintrouter.post('/getfile', function (req, res, next) {
    //res.send({ type: 'GET' });
    //   console.log("req.body..." + JSON.stringify(req.body.txtsrch));
    filedb = require(path.resolve("./dbmodels") + "/" + req.body.fltyp);
    if (req.body.txtsrch == undefined) {
        filedb.find(function (err, data) {
            if (err) console.error;
            res.json(data);

        });
    } else {
        for (var key in req.body.txtsrch) {
            req.body.txtsrch[key] = { $regex: "^" + req.body.txtsrch[key] + "$", $options: 'i' }
        }

        //     console.log('req.body.txtsrch[' + key + '] = ' + JSON.stringify( req.body.txtsrch))

        filedb.find(req.body.txtsrch, function (err, data) {
            //        console.log("datea after seraCH = " + JSON.stringify(data))
            if (err) console.error;
            res.json(data);

        });

    }
});

//get a count memb from db
maintrouter.post('/getfilecnt', function (req, res, next) {
    filedb = require(path.resolve("./dbmodels") + "/" + req.body.fltyp);
    filedb.estimatedDocumentCount(function (err, count) {
        if (!err && count === 0) {
            res.json(count);
        }
    })
});


//get lit with criteria
maintrouter.post('/getfilecrit', function (req, res, next) {

  //  console.log(' \ngetfilecrit req.body.txtsrch = ' + JSON.stringify(req.body.txtsrch))
    var wssothers = {}
    for (var key in req.body.txtsrch) {
        // if (crit == "" ){
     //   console.log("\nkey = " + key + "\n")
        if (key != "$or" && key != "$and") {
            req.body.txtsrch[key] = { $regex: req.body.txtsrch[key], $options: 'i' }
       //     console.log('req.body.txtsrch dcf[' + key + '] = ' + JSON.stringify(req.body.txtsrch[key]))
            // crit = key +  ":" + "/" + txtsrch[key] + "/i"                  
            // } else {
            //   crit = crit + "," + key +  ":" + "/" + txtsrch[key] + "/i"     
            // crit =  JSON.parse( crit)
        }
    }
 //   console.log("\nreq.body..." + JSON.stringify(req.body.txtsrch));
    filedb = require(path.resolve("./dbmodels") + "/" + req.body.fltyp);
    filedb.find(req.body.txtsrch, function (err, data) {
        if (err) console.error;
        // console.log("data = " + JSON.stringify(data))
        res.json(data);

    });
});

maintrouter.post('/getdistinct', function (req, res, next) {
    var txtfield = req.body.txtfield  // e.g {_id : $tmcode}
    var txtsrch = req.body.txtsrch   // e.g. { trcode : "tr1234"}
    //    console.log("req.body = " + JSON.stringify(req.body) + "     -  " + JSON.stringify(txtfield) + "     -  " + JSON.stringify(txtsrch))

    filedb = require(path.resolve("./dbmodels") + "/" + req.body.fltyp);
    //  filedb.distinct(req.body.txtsrch, function (err, data) {   
    filedb.aggregate([
        {
            $match:
                txtsrch
        },
        {
            $group:
                txtfield
        }
    ], function (err, result) {
        if (err) console.error;
        //console.log("result = " +result);
        res.send(result);
    });
});

//get 1 record
maintrouter.post('/getonerec', function (req, res, next) {
    filedb = require(path.resolve("./dbmodels") + "/" + req.body.fltyp);
    var memuser = req.body;
  //  console.log("req body from membomer = " + JSON.stringify(memuser));
    filedb.find(memuser.id, function (err, existingUser) {
        if (existingUser != null) {
            //  console.log("response from checkmemb    " + JSON.stringify( existingUser));
            res.send(existingUser);
            // return res.json(existingUser);
        }
    }).collation({ locale: 'en', strength: 2 })
});

maintrouter.post('/lookup', function (req, res, next) {
  //  console.log("req body from lookup = " + JSON.stringify(req.body));

    filedb = require(path.resolve("./dbmodels") + "/" + req.body.wssdata.fltyp);
    var memuser = req.body.wssdata;
    filedb.aggregate([
        {
            $match: memuser.crit
        },
        {
            $project: {
                test: memuser.selfld
                // } // memuser.selfld
            }
        }
    ], function (err, result) {
        if (err) console.error;
   //     console.log("result = " + JSON.stringify(result));
        res.send(result);
    });

});

// check for nric validity
maintrouter.post('/valplyer', function (req, res) {
    if (req.body.wssty == "R") {
        if (modlus.luhn_validate(req.body.txtNRIC) == true) {
            //   console.log("rec body at valplyer = " + JSON.stringify(req.body));
            return res.send("ok")
        } else {
            return res.send("invalid NRIC No")
        }
    }
})

maintrouter.post('/valnric', function (req, res, next) {
    //  console.log("doing valnric")
    //   console.log("rec body at valnric = " + JSON.stringify(req.body));
    /* if (req.body.wssty == "R") {
        if (modlus.luhn_validate(req.body.memberNRIC) == true) {
 
        } else {
            return res.send("invalid NRIC No")
        }
    } */
    filedb = require(path.resolve("./dbmodels") + "/" + req.body.fltyp);
    var strobj = JSON.stringify(req.body).substring(-1, JSON.stringify(req.body).indexOf(",")) + "}"
    var descobj;
    if (req.body.wssty == "R") {
        descobj = "NRIC No "
    }
    if (req.body.wssty == "N") {
        descobj = "Name "
    }
    if (req.body.wssty == "H") {
        descobj = "Mobile No. "
    }
    // console.log(" jsobj  = " + descobj);

    // var reqbody = JSON.stringify(rec.body).indexOf("wssty")
    // // console.log("JSON = " + JSON.parse(JSON.stringify(rec.body)))
    filedb.findOne(JSON.parse(strobj), function (err, memuser) {
        if (err) console.error;
        //   console.log("memuser = " + memuser);
        if (!memuser) {
            return res.send("ok")
        } else {
            return res.send(descobj + "  Already registered....")
        }
    })


})

maintrouter.post('/checkitem', function (req, res, next) {
  //    console.log("\n\ndoing check item...." + "    disp = " + JSON.stringify(req.body) + "\n\n");
    var chkdata;
  //     console.log("\n\nreq.body.wsscompare = " + req.body.wsscompare + "\n\n")
    if (req.body[4] != undefined && req.body[4] != null) {
 //       console.log("req body 0 = " + JSON.stringify(req.body[4]))
        chkdata = req.body[4].split("*")
    }
    var chkname = req.body[1].split(",")
    // var chkdesc = req.body[2]
    var chkdesc = req.body[2].split(",")
    //   console.log("chkname = " + JSON.stringify(chkname))

    if (req.body[3] != undefined) {
        var wsstypeind = req.body[3].split(",");
        //  console.log('wsstypeind = ' + wsstypeind);
        for (var i = 0; i < wsstypeind.length; i++) {
            switch (wsstypeind[i]) {
                case '1':
     //               console.log("chkname[" + i + "] = " + chkname[i])
                    req.checkBody(chkname[i], chkdesc[i]).notEmpty();
                    break;
                case '2':
                    // console.log(" chkdata[0]  = " + chkdata[0] + "     chkdata[1]  = " + chkdata[1])
                    req.checkBody(chkdata[0], chkdesc[i]).not().equals(chkdata[1]);                    //  } 
                    break;
                case '3':
     //                console.log(" chkdata[0]  = " + chkdata[0] + "     chkdata[1]  = " + chkdata[1])
                    req.checkBody(chkdata[0], chkdesc[i]).equals(chkdata[1]);                    //  } 
                    break;

                default:

            } // end of switch
        } // end of for i
    } /* else {
        for (var i = 0; i < chkname.length; i++) {
            req.checkBody(chkname[i], chkdesc[i]).notEmpty();
        } */

    //}
    var wssbody = req.body[0];
    req.body = {};
    req.body = wssbody;

    var errors = req.validationErrors();
 //   console.log("errors = " + JSON.stringify(errors))
    if (errors) {
        req.session.success = false;
        req.session.errors = errors
        res.locals.errors = errors
        res.send(["notok", req.session.errors])
        req.session.errors = null
        //     console.log("after check with errors req.session.errors =" + JSON.stringify(req.session.errors));
    } else {
        req.session.success = true;
        req.session.errors = false;
        //  console.log("success");
        res.send("ok")
    }
});

maintrouter.post('/addrecord', function (req, res, next) {
  //  console.log("starting the conversion program =  " + JSON.stringify(req.body.datarc));

    filedb = require(path.resolve("./dbmodels") + "/" + req.body.fltyp);
console.log("\nreq.body.datarc = " + JSON.stringify(req.body.datarc) + "\n")
    reccount = Object.keys(req.body.datarc).length;
    console.log("\nreccount = " + reccount  + "\n")
    wsscol = [];
    obj = {};
    //dCol;
    //dRow;
    //wssplit;

    newmemb = new filedb();

    for (var key in req.body.datarc) {

        dCol = req.body.datarc[key];
        dRow = key;
        //  console.log("dRow = " + typeof dCol)
        // // console.log("      ")
        //   console.log("search dol = " + dCol);
        if (dCol != null && typeof dCol == "number") {
            // wssplit = dCol.split("'");
            //    console.log('newmemb brfore[' + dRow + '] = ' + parseInt(dCol))
            dCol = parseInt(dCol)
            newmemb[dRow] = dCol
            //    console.log('newmemb[' + dRow + '] = ' + newmemb[dRow])


        } else if (dCol != null && dCol.includes("encryptPassword")) {
            //  console.log("dCol before split = " + dCol)
            wssplit = dCol.split("'");
            //  console.log("key = " + key + "     Object.keys(key) = " + JSON.stringify(wssplit[1]));
            newmemb[dRow] = newmemb.encryptPassword(wssplit[1]);
        } else {
            newmemb[dRow] = dCol
        }
        // console.log("dcol = " + dCol + "      rowm = " + [dRow])
        // console.log("key = " + key + "     newmwmb = " + JSON.stringify(newmemb));
    }
  //  console.log("newmemb = " + JSON.stringify(newmemb))

    filedb.create(newmemb, function (err, filedata) {
        // if (err) throw err;
        if (err) {
          //  console.log("err add = " + err)
            res.send(err)
        } else {
            // newmemb = new cnvdb();
            // console.log("convert data = " + filedata);
            res.send(req.session.success)
        }
    });
})

maintrouter.post('/addrecordall', function (req, res, next) {
    //   console.log("starting the conversion program =  " + JSON.stringify(req.body.datarc));

    filedb = require(path.resolve("./dbmodels") + "/" + req.body.fltyp);

    filedb.create(req.body.datarc, function (err, filedata) {
        // if (err) throw err;
        if (err) {
            //   console.log("err add = " + err)
            res.send(err)
        } else {
            // newmemb = new cnvdb();
            // console.log("convert data = " + filedata);
            res.send(req.session.success)
        }
    });

});

//modify existing record
maintrouter.put('/updrecord/:id', function (req, res) {
  //   console.log("req body before saving at updrec =" + JSON.stringify(req.body.datarc) + "   req.params.id  = " + req.params.id);
    filedb = require(path.resolve("./dbmodels") + "/" + req.body.fltyp);
    // filedb = require(path.resolve("./dbmodels") + "/" + req.body.fltyp);
    filedb.findOneAndUpdate({ _id: req.params.id },
        {
            $set: req.body.datarc
        },
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
                         // console.log("ok =        saveditems = " + JSON.stringify(saveditems) + "       success = " + JSON.stringify(success))
                res.send(req.session.success)

            }
        })

    // }

});

//modify existing record
maintrouter.post('/delrecord/:id', function (req, res) {
    //   console.log("req body before saving at updrec =" + JSON.stringify(req.body) + "   req.params.id  = " + req.params.id);
    filedb = require(path.resolve("./dbmodels") + "/" + req.body.fltyp);
    // filedb = require(path.resolve("./dbmodels") + "/" + req.body.fltyp);
    filedb.deleteOne({ _id: req.params.id },
        function (err, saveditems) {
            if (err) {
                req.seesion.success = false
            } else {
                req.check('saveditems', 'Record Deleted Successfully').notEmpty();
                req.flash('success_msg', 'Record Saved Successfully.....')
                res.send(req.flash('success_msg'));

            }
        })
})

maintrouter.post('/delmanyrec', function (req, res) {
 //   console.log("req.body.delsetrec  = " + JSON.stringify(req.body.delsetrec))
    filedb = require(path.resolve("./dbmodels") + "/" + req.body.fltyp);
    filedb.deleteMany(req.body.delsetrec,
        function (err, saveditems) {
            if (err) {
                req.seesion.success = false
            } else {
                req.check('saveditems', 'Record Deleted Successfully').notEmpty();
                req.flash('success_msg', 'Record Saved Successfully.....')
                res.send(req.flash('success_msg'));

            }

        })
});

module.exports = maintrouter;



