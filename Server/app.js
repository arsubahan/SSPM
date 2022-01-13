// <reference path="api/convjsonapi.js" />
// Initialize the express framework
console.log("starting apps.....")

var
    express = require('express'),
    session = require('express-session'),
    app = express(),
    path = require('path'),
    // animate = require('angular-animate'),

    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),

    expressValidator = require('express-validator'),

    fs = require('fs'),

    multer = require('multer'),

    passport = require('passport'),
    //LocalStrategy = require('passport-local').Strategy,

    flash = require('connect-flash'),

    //MongoStore = require('connect-mongo')(session),
    mongoose = require('mongoose'),
    databaseName = 'earthresmongo',

    handlebartemp = require('handlebars'),
    exphbs = require('express-handlebars'),
    moment = require('moment'),
    MomentHandler = require("handlebars.moment");
MomentHandler.registerHelpers(handlebartemp);


//date forhandlebar
handlebartemp.registerHelper('dateformat', function (date, wssformat) {
    //  console.log("wssdate =" + wssformat);
    var mmnt = moment(date).format(wssformat);   //moment(date).format(wssformat);
    //   console.log(mmnt);
    return mmnt;
});


//Express Session
app.use(session({
    key: 'user_sid',
    secret: 'romjul1436946140mearthrecource',
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 60 * 60 * 1000 },
}));

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('romjul1436946140maricanmed'));

// Connect Flash
app.use(flash());

// Passport init
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.initialize({ userProperty: 'memUser' }));

app.use(function (err, req, res, next) {
    // console.log(err);
    res.status(422).send({ error: err.message })
});




// Global Vars
/* app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    //res.//app.use('/', appemail);locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});
 */
app.use(function (req, res, next) {
    // console.log("app.usr local");
    res.locals.user = req.session.user;
    res.locals.post = req.session.post;
    var error = req.flash('error');
    res.locals.error = error.length ? error : null;

    var success = req.flash('success');
    res.locals.success = success.length ? success : null;
    next();
});

app.use(express.static(path.join(__dirname, "../Client")))


//date forhandlebar
handlebartemp.registerHelper('dateformat', function (date, wssformat) {
    console.log("wssdate =" + wssformat);
    var mmnt = moment(date).format(wssformat);   //moment(date).format(wssformat);
    //   console.log(mmnt);
    return mmnt;
});

app.set('views', path.join(__dirname, "/../Client", '/views'));

//console.log("view = " + path.join(__dirname, "/../Client", 'views'))

app.engine('handlebars', exphbs({ defaultLayout: 'index', extname: '.handlebars' }));
app.set('view engine', 'handlebars');

handlebartemp.registerHelper('times', function (n, block) {
    var accum = '';
    for (var i = 0; i < n; ++i)
        accum += block.fn(i);
    console.log("accum = " + block)
    return accum;
});

handlebartemp.registerPartial("toolbar", "{{toolname}}");


//console.log("__dirname = " + __dirname)

// nodemailer - for sending email
var core = require('./api/emailapi.js');

// route for modemail
app.route('/contact-form').post(core.sendMail);

// Express Validator
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        console.log("param = " + JSON.stringify(param))
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;
        console.log("namespace = " + namespace + "       root = " + root + "             formParam = " + formParam)

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
            console.log("formParam = " + formParam)
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    },
    customValidators: {
        isPsd1EqPsd2: function (psd1, psd2) {
            console.log(psd1 === psd2);
            return psd1 === psd2;
        }
    }
}));

//  Routes set up
var
    //router = express.Router(),
    appopenfrm = require('./api/openformsapi'),
    applogin = require('./api/loginapi'),
    apprunno = require('./api/runnoapi'),
   // routes = require('./routes/index'),
    appmaint = require('./api/maintainapi'),
    forgotapp = require('./api/forgotapi'),
    resetpwrdapp = require('./api/resetpwrdapi'),
    pestsolapp = require('./api/pestsolapi');  
    clientapp = require('./api/clientapi');
    scheduleapp = require('./api/scheduleapi');
// appconv = require('./api/convjsonapi'),; 

/*
   apptour = require('./api/tournamentapi'),
   appmemb = require('./api/memberapi'),
   appbanners = require('./api/bannersapi'),
   apprefbadge = require('./api/refbadgeapi'),
   appnews = require('./api/newsapi'),
  //  photovidapp = require('./api/photovideoapi');
 
  */

// Register the routing
app.use('/', appopenfrm);
app.use('/', applogin);
app.use('/', apprunno);
//app.use('/', routes);
app.use('/', appmaint);
app.use('/', forgotapp);
app.use('/', resetpwrdapp);
app.use('/', pestsolapp);
app.use('/', clientapp);
app.use('/', scheduleapp);
/* app.use('/', appconv); */

/* 
app.use('/', apptour);
app.use('/', appmemb);

app.use('/', appbanners);
app.use('/', apprefbadge);

app.use('/', appnews);


 */
//app.use('/',photovidapp);



//open website with iisnode
app.get('/', function (req, res) {
    res.render('home/home');
});

app.listen(process.env.PORT);
console.log("server is running at port : " + process.env.PORT);

// connect to mongodb
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/" + databaseName, {
    useUnifiedTopology: true,
    promiseLibrary: global.Promise,
    useNewUrlParser: true,
    useCreateIndex: true
});

var db = mongoose.connection;

// mongodb error
db.on('error', console.error.bind(console, 'connection error:'));
// mongodb connection open
db.once('open', startServer);

// Start up the server
function startServer() {
    var server = app.listen(3050, function () {
        var port = server.address().port;
        console.log('Listening on port : ' + server.address().port);
    })
}
