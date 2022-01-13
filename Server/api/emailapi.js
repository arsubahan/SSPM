'use strict';

var nodemailer = require('nodemailer');

/* var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'Gmail', // sets automatically host, port and connection security settings
    auth: {
       // user: 'marican.mediation@gmail.com',
       // pass: "Katijah19"
        user: 'arsubahan@gmail.com',
        pass: "Sad##raz19"
    }
}); */


 var transporter = nodemailer.createTransport({
   // service: 'Yahoo', // sets automatically host, port and connection security settings
    host:  "smtp.gmail.com", // 'smtp.mail.yahoo.com',
    port: 587, //465,
    service:'gmail',
    secure: true,
    auth: {
        user: "arsubahan@gmail.com", //'Mosasu25@yahoo.com',
        pass: "Sad##raz19"
     // pass: "lzqefuyjggbtlweh"
    },
    debug: false,
    logger: true
}); 


//var transporter = nodemailer.createTransport();

/**
 * Send an email when the contact from is submitted
 */
exports.sendMail = function (req, res) {

    var data = req.body;
 //   console.log("data from core =" +  JSON.stringify(req.body));
    transporter.sendMail({
        from:  "Staff of Earth Resources Managment Services",
        to: data.contactEmail,
        subject: 'Message from Earth Resources Managment Services' ,
        html: data.contactMsg
    });

    res.json(data);
};
