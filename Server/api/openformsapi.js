var express = require('express');
//var fs = require("fs");
var openrouter = express.Router();
var anthu = require('./../routes/passport.js');
var fs = require('fs');
var multer = require('multer');
var path = require('path');

/*===============================================
  ======    upload file                     =====
  ===============================================
  */
 let storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        console.log("req = " + JSON.stringify(req.body ))
      cb(null, file.originalname.replace(path.extname(file.originalname), "") + '-' + Date.now() + path.extname(file.originalname))
      console.log("from uploadnewa  before = " + JSON.stringify( file.originalname));
    }
  })
  //console.log(filename)
  
  let upload = multer({ storage: storage })

  openrouter.post('/savedata', upload.any(), function (req, res) {
     console.log("from uploadnewa = " + JSON.stringify( req.files));
     // + "    req.files = " + req );
    // console.log(req.files);
    res.json({ success: true, message: "uploadnews" });

    // .post('/savedata', upload.single('file'), function(req,res,next){
    //     console.log('File Uploaded Successfully! ', req.file.filename);
    //     res.send({"statusCode":200,"statusMessage":"file uploaded successfully!"});
    // });
  
 
})
 

/*================================================
  ==== menu from index                          ==
  ================================================
  */
// home
openrouter.get('/home', function (req, res) {
    res.render('home/home',
        {
            layout: 'index.handlebars'
        })
});

// contact details 
openrouter.get('/contact', function (req, res) {
    res.render('contact/contact',
        {
            layout: 'index.handlebars'
        })
});

/*

// convert sql to mongodb
openrouter.get('/convjson', function (req, res) {
    res.render('convjson',
        {
            layout: 'index.handlebars'
        })
});

// list fixtures from home
openrouter.get('/listfixh', function (req, res) {
    res.render('customer/listfix', {
        layout: 'index.handlebars'
    })
});

// Add new client  
openrouter.get('/addmember', function (req, res) {
    res.render('maintenance/addmember', 
    { 
        layout: 'index.handlebars' 
    });

}); */

/*================================================
  ==== menu from CLIENT                    ==
  ================================================
  */

//login for client
  openrouter.get('/clientlogin', function (req, res) {
     res.render('clientlogin',  
     {
         layout: 'index.handlebars'
     })
 });    

 // client profile details 
openrouter.get('/clienthome',anthu.clensureAuthenticated, function (req, res) {
    res.render('customer/clienthome',
        {
            layout: 'clientmain.handlebars'
        })
});

// client service request details 
openrouter.get('/clcontact',anthu.clensureAuthenticated, function (req, res) {
    res.render('contact/contact',
        {
            layout: 'clientmain.handlebars'
        })
});


// client profile details 
openrouter.get('/clientprofile', anthu.clensureAuthenticated, function (req, res) {
    res.render('customer/clientprofile',
        {
            layout: 'clientmain.handlebars',
            success: req.session.success,
            errors: req.session.errors
        });
    req.session.errors = null;
    //   console.log("from api get addnrews = " + JSON.stringify(req.body));
});

// client profile details 
openrouter.get('/schiframe', anthu.clensureAuthenticated, function (req, res) {
    res.render('customer/schiframe',
        {
            layout: 'blank.handlebars'

        });
     //   console.log("from api get addnrews = " + JSON.stringify(req.body));
});

// client pActivity - past activity
openrouter.get('/clientactivity', anthu.clensureAuthenticated, function (req, res) {
    res.render('customer/clientactivity',
        {
            layout: 'clientmain.handlebars'

        });
     //   console.log("from api get addnrews = " + JSON.stringify(req.body));
});

// client change pasword
openrouter.get('/clientrespassword', anthu.clensureAuthenticated, function (req, res) {
    res.render('respassword',
        {
            layout: 'clientmain.handlebars'

        });
     //   console.log("from api get addnrews = " + JSON.stringify(req.body));
});


/*================================================
  ==== menu from Maintenance                    ==
  ================================================
  */
// dashboard for maintenance details
openrouter.get('/dashboard', anthu.ensureAuthenticated, function (req, res) {
    res.render('dashboard',
        {
            layout: 'main.handlebars'
        })
});

/// Register 
openrouter.get('/register', function (req, res) {
    res.render('maintenance/register', {
        layout: 'index.handlebars',
        success: req.session.success,
        errors: req.session.errors
    });
    req.session.errors = null;
    //  console.log("from api get register = " + JSON.stringify(req.body));
});

// display staff
openrouter.get('/dispstaff', anthu.ensureAuthenticated, function (req, res) {
    res.render('maintenance/dispstaff',
        {
            layout: 'main.handlebars',
            success: req.session.success,
            errors: req.session.errors
        });
    req.session.errors = null;
    //   console.log("from api get disop news= " + JSON.stringify(req.body));
});

// Add pest code
openrouter.get('/addpestcode', anthu.ensureAuthenticated, function (req, res) {
    res.render('maintenance/addpestcode',
        {
            layout: 'main.handlebars',
            success: req.session.success,
            errors: req.session.errors
        });
    req.session.errors = null;
    //   console.log("from api get addnrews = " + JSON.stringify(req.body));
});

// display News
openrouter.get('/disppestcode', anthu.ensureAuthenticated, function (req, res) {
    res.render('maintenance/disppestcode',
        {
            layout: 'main.handlebars',
            success: req.session.success,
            errors: req.session.errors
        });
    req.session.errors = null;
    //   console.log("from api get disop news= " + JSON.stringify(req.body));
});

// add fair type
openrouter.get('/addsolution', anthu.ensureAuthenticated, function (req, res) {
    res.render('maintenance/addsolution', {
        layout: 'main.handlebars',
        success: req.session.success,
        errors: req.session.errors
    });
    req.session.errors = null;
    //   console.log("from api get addnrews = " + JSON.stringify(req.body));
});

// display Fair Play
openrouter.get('/dispsolution', anthu.ensureAuthenticated, function (req, res) {
    res.render('maintenance/dispsolution', {
        layout: 'main.handlebars',
        success: req.session.success,
        errors: req.session.errors
    });
    req.session.errors = null;
    //   console.log("from api get disop news= " + JSON.stringify(req.body));
});

// Add occupation Code
openrouter.get('/addoccupation', anthu.ensureAuthenticated, function (req, res) {
    res.render('maintenance/addoccupation', {
        layout: 'main.handlebars',
        success: req.session.success,
        errors: req.session.errors
    });
    req.session.errors = null;
    //   console.log("from api get addnrews = " + JSON.stringify(req.body));
});

// display occupation Code
openrouter.get('/dispoccupation', anthu.ensureAuthenticated, function (req, res) {
    res.render('maintenance/dispoccupation', {
        layout: 'main.handlebars',
        success: req.session.success,
        errors: req.session.errors
    });
    req.session.errors = null;
    //   console.log("from api get disop news= " + JSON.stringify(req.body));
});

// Add template Code
openrouter.get('/addtemplate', anthu.ensureAuthenticated, function (req, res) {
    res.render('maintenance/addtemplate', {
        layout: 'main.handlebars',
        success: req.session.success,
        errors: req.session.errors
    });
    req.session.errors = null;
    //   console.log("from api get addnrews = " + JSON.stringify(req.body));
});

// display template Code
openrouter.get('/disptemplate', anthu.ensureAuthenticated, function (req, res) {
    res.render('maintenance/disptemplate', {
        layout: 'main.handlebars',
        success: req.session.success,
        errors: req.session.errors
    });
    req.session.errors = null;
    //   console.log("from api get disop news= " + JSON.stringify(req.body));
});

// add duration
openrouter.get('/adduration', anthu.ensureAuthenticated, function (req, res) {
    res.render('maintenance/adduration', {
        layout: 'main.handlebars',
        success: req.session.success,
        errors: req.session.errors
    });
    req.session.errors = null;
    //   console.log("from api get addnrews = " + JSON.stringify(req.body));
});

// display duration
openrouter.get('/dispduration', anthu.ensureAuthenticated, function (req, res) {
    res.render('maintenance/dispduration', {
        layout: 'main.handlebars',
        success: req.session.success,
        errors: req.session.errors
    });
    req.session.errors = null;
    //   console.log("from api get disop news= " + JSON.stringify(req.body));
});

// add chemical product
openrouter.get('/addchemp', anthu.ensureAuthenticated, function (req, res) {
    res.render('maintenance/addchemp', {
        layout: 'main.handlebars',
        success: req.session.success,
        errors: req.session.errors
    });
    req.session.errors = null;
    //   console.log("from api get addnrews = " + JSON.stringify(req.body));
});

// display chemical product
openrouter.get('/dispchemp', anthu.ensureAuthenticated, function (req, res) {
    res.render('maintenance/dispchemp', {
        layout: 'main.handlebars',
        success: req.session.success,
        errors: req.session.errors
    });
    req.session.errors = null;
    //   console.log("from api get disop news= " + JSON.stringify(req.body));
});

// display enquiry to proposal
openrouter.get('/dispenquire', anthu.ensureAuthenticated, function (req, res) {
    res.render('maintenance/dispenquire', {
        layout: 'main.handlebars',
        success: req.session.success,
        errors: req.session.errors
    });
    req.session.errors = null;
    //   console.log("from api get disop news= " + JSON.stringify(req.body));
});

//update enquiry to proposal
openrouter.get('/proposal', anthu.ensureAuthenticated, function (req, res) {
    res.render('maintenance/proposal', {
        layout: 'main.handlebars',
        success: req.session.success,
        errors: req.session.errors
    });
    req.session.errors = null;
    //   console.log("from api get addnrews = " + JSON.stringify(req.body));
});

// generate and print proposal
openrouter.get('/genproposal', anthu.ensureAuthenticated, function (req, res) {
    res.render('genproposal', {
        layout: 'printer.handlebars',
        success: req.session.success,
        errors: req.session.errors
    });
    req.session.errors = null;
    //   console.log("from api get disop news= " + JSON.stringify(req.body));
});

// generate Q@uotation
openrouter.get('/addquotation', anthu.ensureAuthenticated, function (req, res) {
    res.render('maintenance/addquotation', {
        layout: 'main.handlebars',
        success: req.session.success,
        errors: req.session.errors
    });
    req.session.errors = null;
    //   console.log("from api get disop news= " + JSON.stringify(req.body));
});
-
// add Schedule
openrouter.get('/addschedule', anthu.ensureAuthenticated, function (req, res) {
    res.render('maintenance/addschedule', {
        layout: 'main.handlebars',
        success: req.session.success,
        errors: req.session.errors
    });
    req.session.errors = null;
    //   console.log("from api get addnrews = " + JSON.stringify(req.body));
});

// display Schedule
openrouter.get('/dispschedule', anthu.ensureAuthenticated, function (req, res) {
    res.render('maintenance/dispschedule', {
        layout: 'main.handlebars',
        success: req.session.success,
        errors: req.session.errors
    });
    req.session.errors = null;
    //   console.log("from api get disop news= " + JSON.stringify(req.body));
});

// update job Schedule
openrouter.get('/updschedule', anthu.ensureAuthenticated, function (req, res) {
    res.render('maintenance/updschedule', {
        layout: 'main.handlebars',
        success: req.session.success,
        errors: req.session.errors
    });
    req.session.errors = null;
    //   console.log("from api get addnrews = " + JSON.stringify(req.body));
});

// download app
openrouter.get('/downloadapp', function (req, res) {
    res.render('maintenance/downloadapp', {
        layout: 'main.handlebars',
    });
    req.session.errors = null;
    //   console.log("from api get addnrews = " + JSON.stringify(req.body));
});

/*=====================================================
  ==== menu from printung - Staffdb and member ==
  =====================================================
  * /

// printplayers details 
openrouter.get('/prteam', anthu.ensureAuthenticated, function (req, res) {
    res.render('report/prteam', {
        layout: 'printer.handlebars',
        success: req.session.success,
        errors: req.session.errors
    });
    req.session.errors = null;
    //   console.log("from api get disop news= " + JSON.stringify(req.body));
});

// print indemnity form 
openrouter.get('/prindem', anthu.ensureAuthenticated, function (req, res) {
    res.render('report/prindem', {
        layout: 'printer.handlebars',
        success: req.session.success,
        errors: req.session.errors
    });
    req.session.errors = null;
    //   console.log("from api get disop news= " + JSON.stringify(req.body));
});

// print consolodation form 
openrouter.get('/consoteam', anthu.ensureAuthenticated, function (req, res) {
    res.render('report/consoteam', {
        layout: 'printer.handlebars',
        success: req.session.success,
        errors: req.session.errors
    });
    req.session.errors = null;
    //   console.log("from api get disop news= " + JSON.stringify(req.body));
});

/*==================================================
  ==== menu from LOGIN - Staffdb and member ==
  ==================================================
  */


// check for login using passport
// Login
openrouter.get('/login', function (req, res) {
    //  console.log("doing login ....")
    var filedb = require(path.resolve("./dbmodels/Staffdb"));
    filedb.estimatedDocumentCount(function (err, count) {
        if (!err && count === 0) {
          //  console.log("database is empty....");
            res.render('register')

        } else {
            res.render('login');
        }
    });
});

// Get forgot 
openrouter.get('/forgot', function (req, res) {
  //  console.log("doing get forgot" + JSON.stringify(req.body));
    res.render('forgot', {
      //  user: req.user,
        layout: 'index.handlebars',
        success: req.session.success,
        errors: req.session.errors
   
    });
});

 
/*====================================================
  ==== menu from webview LOGIN - Staffdb            ==
  ====================================================
  */

// check for login using passport
// Login
openrouter.get('/wvlogin', function (req, res) {
    //  console.log("doing login ....")
    var filedb = require(path.resolve("./dbmodels/Staffdb"));
    filedb.estimatedDocumentCount(function (err, count) {
        if (!err && count != 0) {
            res.render('wvlogin');
        }
    });
});

// dashboard for maintenance details
openrouter.get('/wvdashboard', anthu.wvensureAuthenticated, function (req, res) {
    res.render('webview/wvdashboard',
        {
            layout: 'webviewmain.handlebars'
        })
});

// dashboard for display all shedule for staff
openrouter.get('/wvdispschedule', anthu.wvensureAuthenticated, function (req, res) {
    res.render('webview/wvdispschedule',
        {
           layout: 'webviewmain.handlebars'
        })
});

// update job Schedule from webview
openrouter.get('/wvupdschedule', anthu.ensureAuthenticated, function (req, res) {
    res.render('maintenance/updschedule', {
        layout: 'webviewmain.handlebars',
        success: req.session.success,
        errors: req.session.errors
    });
    req.session.errors = null;
    //   console.log("from api get addnrews = " + JSON.stringify(req.body));
});






module.exports = openrouter;
