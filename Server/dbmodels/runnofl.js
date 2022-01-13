var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema

var runnoflSchema = mongoose.Schema({

    runno: {
        type: Number,
        unique: true
    },
    //occupation no
    runoccno: {
        type: Number
    },
    //client no
    runclno: {
        type: Number
    },
    //staff no
    runstno: {
        type: Number
    },
    //enquiry no
    runenqno: {
        type: Number
    },
    rumtrno: {
        type: Number
    },
    //invoice no
    runinvno: {
        type: Number
    },
    //item no - noy use yet
    runitmno: {
        type: Number
    },
    // pest no
    runpestno: {
        type: Number
    },
    //solution no
    runsolno : {
        type : Number
    },

    //duration no
    rundurno : {
        type : Number
    },

    //template no
    runtemplno : {
        type:Number
    },

    //chemical no
    runchemno : {
        type: Number
    },

    //quotation no
    runquono : {
        type : Number
    },
    
    //project no
    runprojno : {
        type : Number
    },

    //schedule no
    runschno : {
        type : Number
    },
    
    //schedule report no
    runschrptno : {
        type : Number
    }
})

var runnofldb = mongoose.model('flrunnoflmongos', runnoflSchema);
module.exports = runnofldb;
